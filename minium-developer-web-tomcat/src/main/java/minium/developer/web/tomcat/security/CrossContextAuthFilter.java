package minium.developer.web.tomcat.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CrossContextAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            ServletContext root = request.getServletContext().getContext("/");
            root.getRequestDispatcher("/sso/auth").include(request, response);
            Boolean authenticated = (Boolean) request.getAttribute("minium.manager.security.authenticated");
            String username = (String) request.getAttribute("minium.manager.security.username");
            Set<String> authorityNames = (Set<String>) request.getAttribute("minium.manager.security.authorities");

            if (authenticated != null && authenticated && authorityNames != null) {
                List<SimpleGrantedAuthority> authorities = authorityNames.stream()
                        .map(an -> new SimpleGrantedAuthority(an))
                        .collect(Collectors.toList());
                authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
