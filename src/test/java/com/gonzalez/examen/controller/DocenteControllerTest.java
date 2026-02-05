package com.gonzalez.examen.controller;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalez.examen.model.Docente;
import com.gonzalez.examen.service.DocenteService;

@SpringBootTest
@AutoConfigureMockMvc
class DocenteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocenteService docenteService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", password = "admin")
    void listarDocentes_deberiaRetornar200() throws Exception {
        Docente d1 = new Docente();
        d1.setId(1L);
        d1.setNombres("Test");
        d1.setApellidos("User");
        d1.setCorreo("test@user.com");
        d1.setEspecialidad("Dev");
        d1.setAnosExperiencia(2);

        given(docenteService.obtenerTodos(null)).willReturn(Arrays.asList(d1));

        mockMvc.perform(get("/api/docentes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombres").value("Test"));
    }

    @Test
    @WithMockUser(username = "admin", password = "admin")
    void crearDocente_deberiaRetornar200() throws Exception {
        Docente d1 = new Docente();
        d1.setId(1L);
        d1.setNombres("Test");
        d1.setApellidos("User");
        d1.setCorreo("test@user.com");
        d1.setEspecialidad("Dev");
        d1.setAnosExperiencia(2);

        given(docenteService.guardarDocente(any(Docente.class))).willReturn(d1);

        mockMvc.perform(post("/api/docentes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(d1))
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors
                        .csrf()))
                .andExpect(status().isOk());
    }
}
