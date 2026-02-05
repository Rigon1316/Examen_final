package com.gonzalez.examen.controller;

import com.gonzalez.examen.model.Docente;
import com.gonzalez.examen.service.DocenteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/docentes")
public class DocenteController {

    @Autowired
    private DocenteService docenteService;

    /**
     * Endpoint para listar todos los docentes.
     * 
     * @param especialidad Filtro opcional por especialidad.
     * @return Lista de docentes.
     */
    @GetMapping
    public List<Docente> listarDocentes(@RequestParam(required = false) String especialidad) {
        return docenteService.obtenerTodos(especialidad);
    }

    /**
     * Endpoint para obtener un docente por su ID.
     * 
     * @param id ID del docente.
     * @return Docente encontrado o 404 si no existe.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Docente> obtenerDocente(@PathVariable Long id) {
        return docenteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para registrar un nuevo docente.
     * 
     * @param docente Datos del docente a crear.
     * @return Docente creado.
     */
    @PostMapping
    public Docente crearDocente(@Valid @RequestBody Docente docente) {
        return docenteService.guardarDocente(docente);
    }

    /**
     * Endpoint para actualizar un docente existente.
     * 
     * @param id      ID del docente.
     * @param docente Datos actualizados.
     * @return Docente actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Docente> actualizarDocente(@PathVariable Long id, @Valid @RequestBody Docente docente) {
        // Delegamos las excepciones Controladas al GlobalExceptionHandler
        return ResponseEntity.ok(docenteService.actualizarDocente(id, docente));
    }

    /**
     * Endpoint para eliminar un docente.
     * 
     * @param id ID del docente.
     * @return 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDocente(@PathVariable Long id) {
        docenteService.eliminarDocente(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para calcular el promedio de años de experiencia.
     * 
     * @return Mapa con el valor del promedio.
     */
    @GetMapping("/promedio-experiencia")
    public ResponseEntity<Map<String, Double>> obtenerPromedioExperiencia() {
        double promedio = docenteService.calcularPromedioExperiencia();
        return ResponseEntity.ok(Map.of("promedioExperiencia", promedio));
    }
}
