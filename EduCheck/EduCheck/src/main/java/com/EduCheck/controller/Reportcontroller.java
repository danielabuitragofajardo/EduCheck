package com.EduCheck.controller;

import com.EduCheck.model.AccessMovement;
import com.EduCheck.model.EquipmentMovement;
import com.EduCheck.model.UserProfile;
import com.EduCheck.model.Visitors;
import com.EduCheck.service.AccessMovementService;
import com.EduCheck.service.EquipmentMovementService;
import com.EduCheck.service.UserProfileservice;
import com.EduCheck.service.Visitorservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class Reportcontroller {

    @Autowired
    private UserProfileservice userService;

    @Autowired
    private Visitorservice visitorService;

    @Autowired
    private EquipmentMovementService movementService;

    @Autowired
    private AccessMovementService accessMovementService;

    @GetMapping("/users")
    public List<UserProfile> users() { return userService.findAll(); }

    @GetMapping("/visits")
    public List<Visitors> visits() { return visitorService.findAll(); }

    @GetMapping("/movements")
    public List<EquipmentMovement> movements() { return movementService.findAll(); }

    @GetMapping("/access")
    public List<AccessMovement> access() { return accessMovementService.findAll(); }
}
