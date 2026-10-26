package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.ArretDto;
import java.util.List;

public interface ArretService {
    ArretDto createArret(ArretDto arretDto);

    List<ArretDto> getAllArrets();

    ArretDto getArretById(Integer id);

    ArretDto updateArret(Integer id, ArretDto arretDto);

    void deleteArret(Integer id);
}
