package minium.pupino.domain.util;

import java.io.IOException;
import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Properties;

import javax.persistence.Lob;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.internal.util.ReflectHelper;
import org.hibernate.usertype.DynamicParameterizedType;
import org.hibernate.usertype.UserType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Objects;

// copied from https://gist.github.com/fabriziofortino/d33e6cf0e06545fcba18
/**
 * Hibernate {@link UserType} implementation to handle JSON objects
 *
 * @see https://docs.jboss.org/hibernate/orm/4.1/javadocs/org/hibernate/usertype/UserType.html
 */	
public class JsonUserType implements UserType, DynamicParameterizedType, Serializable {

	public static final String TYPE_NAME = "minium.pupino.domain.util.JsonUserType";
	
	private static final long serialVersionUID = -8846764641850782878L;

	private static final ObjectMapper MAPPER = new ObjectMapper();

	private Class<?> classType;
	private int sqlType = Types.LONGVARCHAR; // before any guessing

	@Override
	public void setParameterValues(Properties params) {
		String classTypeName = params.getProperty(DynamicParameterizedType.RETURNED_CLASS);
		try {
			this.classType = ReflectHelper.classForName(classTypeName, this.getClass());
		} catch (ClassNotFoundException cnfe) {
			throw new HibernateException("classType not found", cnfe);
		}
		ParameterType type = (ParameterType) params.get(DynamicParameterizedType.PARAMETER_TYPE);
		if (type != null) {
			this.sqlType = isLob(type) ? Types.CLOB : Types.LONGVARCHAR;
		}
	}

	@Override
	public Object assemble(Serializable cached, Object owner) throws HibernateException {
		return this.deepCopy(cached);
	}

	@Override
	public Object deepCopy(Object value) throws HibernateException {
		Object copy = null;
		if (value != null) {
			try {
				return MAPPER.readValue(MAPPER.writeValueAsString(value), this.classType);
			} catch (IOException e) {
				throw new HibernateException("unable to deep copy object", e);
			}
		}
		return copy;
	}

	@Override
	public Serializable disassemble(Object value) throws HibernateException {
		try {
			return MAPPER.writeValueAsString(value);
		} catch (JsonProcessingException e) {
			throw new HibernateException("unable to disassemble object", e);
		}
	}

	@Override
	public boolean equals(Object x, Object y) throws HibernateException {
		return Objects.equal(x, y);
	}

	@Override
	public int hashCode(Object x) throws HibernateException {
		return Objects.hashCode(x);
	}

	@Override
	public boolean isMutable() {
		return true;
	}

	@Override
	public Object nullSafeGet(ResultSet rs, String[] names, SessionImplementor session, Object owner) throws HibernateException, SQLException {
		Object obj = null;
		if (!rs.wasNull()) {
			try {
				obj = MAPPER.readValue(rs.getString(names[0]), this.classType);
			} catch (IOException e) {
				throw new HibernateException("unable to read object from result set", e);
			}
		}
		return obj;
	}

	@Override
	public void nullSafeSet(PreparedStatement st, Object value, int index, SessionImplementor session) throws HibernateException, SQLException {
		if (value == null) {
			st.setNull(index, this.sqlType);
		} else {
			try {
				st.setString(index, MAPPER.writeValueAsString(value));
			} catch (JsonProcessingException e) {
				throw new HibernateException("unable to set object to result set", e);
			}
		}
	}

	@Override
	public Object replace(Object original, Object target, Object owner) throws HibernateException {
		return this.deepCopy(original);
	}

	@Override
	public Class<?> returnedClass() {
		return this.classType;
	}

	@Override
	public int[] sqlTypes() {
		return new int[] { sqlType };
	}

	protected boolean isLob(ParameterType type) {
		Annotation[] annotations = type.getAnnotationsMethod();
		if (annotations == null) return false;
		for (Annotation annotation : annotations) {
			if (annotation instanceof Lob) return true;
		}
		return false;
	}
}