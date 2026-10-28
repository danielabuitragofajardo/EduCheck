package com.EduCheck.security;

import com.EduCheck.model.UserProfile;
import com.EduCheck.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EduUserDetailsService implements UserDetailsService {

    @Autowired
    private UserProfileRepository repository;

    @Override
    public UserDetails loadUserByUsername(String numeroDocumento) throws UsernameNotFoundException {
        UserProfile user = repository.findByNumeroDocumento(numeroDocumento)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + numeroDocumento));
        if (user.getEstado() != null && user.getEstado().equalsIgnoreCase("INACTIVO")) {
            throw new UsernameNotFoundException("Usuario inactivo: " + numeroDocumento);
        }
        return new EduUserDetails(user);
    }
}
