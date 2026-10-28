package com.EduCheck.security;

import com.EduCheck.model.UserProfile;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class EduUserDetails implements UserDetails {

    private final UserProfile userProfile;

    public EduUserDetails(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String rol = userProfile.getRol() == null ? "USUARIO" : userProfile.getRol();
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    @Override
    public String getPassword() {
        return userProfile.getPassword();
    }

    @Override
    public String getUsername() {
        return userProfile.getNumeroDocumento();
    }

    @Override
    public boolean isAccountNonExpired() {
        return userProfile.getEstado() == null || userProfile.getEstado().equalsIgnoreCase("ACTIVO");
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return userProfile.getEstado() == null || userProfile.getEstado().equalsIgnoreCase("ACTIVO");
    }
}
