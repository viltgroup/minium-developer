package minium.developer.fs.domain;

public class FileDTO {

	public String oldName;
	public String newName;
	
	
	public FileDTO(String oldName, String newName) {
		super();
		this.oldName = oldName;
		this.newName = newName;
	}

	public FileDTO() {
		super();
	}
	
	public String getOldName() {
		return oldName;
	}
	public void setOldName(String oldName) {
		this.oldName = oldName;
	}
	public String getNewName() {
		return newName;
	}
	public void setNewName(String newName) {
		this.newName = newName;
	}
	
	
	
}
