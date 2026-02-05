package com.gonzalez.examen.service;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.gonzalez.examen.model.Docente;
import com.gonzalez.examen.repository.DocenteRepository;

class DocenteServiceTest {

    @Mock
    private DocenteRepository docenteRepository;

    @InjectMocks
    private DocenteService docenteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerTodos_deberiaRetornarLista() {
        Docente d1 = new Docente();
        d1.setId(1L);
        d1.setNombres("Juan");
        d1.setApellidos("Perez");
        d1.setCorreo("juan@test.com");
        d1.setEspecialidad("Mate");
        d1.setAnosExperiencia(5);

        when(docenteRepository.findAll()).thenReturn(Arrays.asList(d1));

        List<Docente> resultado = docenteService.obtenerTodos(null);
        assertEquals(1, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombres());
    }

    @Test
    void calcularPromedio_deberiaRetornarPromedioCorrecto() {
        Docente d1 = new Docente();
        d1.setId(1L);
        d1.setAnosExperiencia(10);

        Docente d2 = new Docente();
        d2.setId(2L);
        d2.setAnosExperiencia(20);

        when(docenteRepository.findAll()).thenReturn(Arrays.asList(d1, d2));

        double promedio = docenteService.calcularPromedioExperiencia();
        assertEquals(15.0, promedio);
    }
}
