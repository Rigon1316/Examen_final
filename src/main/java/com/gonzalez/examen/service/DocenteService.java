package com.gonzalez.examen.service;

import com.gonzalez.examen.exception.BusinessRuleException;
import com.gonzalez.examen.exception.ResourceNotFoundException;
import com.gonzalez.examen.model.Docente;
import com.gonzalez.examen.repository.DocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    /**
     * Obtiene todos los docentes, opcionalmente filtrados por especialidad.
     * 
     * @param especialidad (Opcional) Especialidad para filtrar.
     * @return Lista de docentes.
     */
    @Transactional(readOnly = true)
    public List<Docente> obtenerTodos(String especialidad) {
        if (especialidad != null && !especialidad.isEmpty()) {
            return docenteRepository.findByEspecialidad(especialidad);
        }
        return docenteRepository.findAll();
    }

    /**
     * Busca un docente por su ID.
     * 
     * @param id ID del docente.
     * @return Optional con el docente si existe.
     */
    @Transactional(readOnly = true)
    public Optional<Docente> obtenerPorId(Long id) {
        return docenteRepository.findById(id);
    }

    /**
     * Guarda un nuevo docente en la base de datos.
     * Valida que el correo no esté duplicado.
     * 
     * @param docente Objeto docente a guardar.
     * @return Docente guardado.
     */
    @Transactional
    public Docente guardarDocente(Docente docente) {
        if (docenteRepository.existsByCorreo(docente.getCorreo())) {
            throw new BusinessRuleException("El correo electrónico ya está registrado: " + docente.getCorreo());
        }
        return docenteRepository.save(docente);
    }

    /**
     * Actualiza un docente existente.
     * 
     * @param id              ID del docente a actualizar.
     * @param docenteDetalles Nuevos datos del docente.
     * @return Docente actualizado.
     * @throws ResourceNotFoundException Si el docente no existe.
     */
    @Transactional
    public Docente actualizarDocente(Long id, Docente docenteDetalles) {
        return docenteRepository.findById(id).map(docente -> {
            // Si el correo cambia, verificar que no exista otro con ese correo
            if (!docente.getCorreo().equals(docenteDetalles.getCorreo()) &&
                    docenteRepository.existsByCorreo(docenteDetalles.getCorreo())) {
                throw new BusinessRuleException(
                        "El correo electrónico ya está registrado: " + docenteDetalles.getCorreo());
            }

            docente.setNombres(docenteDetalles.getNombres());
            docente.setApellidos(docenteDetalles.getApellidos());
            docente.setCorreo(docenteDetalles.getCorreo());
            docente.setEspecialidad(docenteDetalles.getEspecialidad());
            docente.setAnosExperiencia(docenteDetalles.getAnosExperiencia());
            return docenteRepository.save(docente);
        }).orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id " + id));
    }

    /**
     * Elimina un docente por su ID.
     * 
     * @param id ID del docente a eliminar.
     * @throws ResourceNotFoundException Si el docente no existe.
     */
    @Transactional
    public void eliminarDocente(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar. Docente no encontrado con id " + id);
        }
        docenteRepository.deleteById(id);
    }

    /**
     * Calcula el promedio de años de experiencia de todos los docentes.
     * 
     * @return Promedio de años de experiencia.
     */
    @Transactional(readOnly = true)
    public double calcularPromedioExperiencia() {
        List<Docente> docentes = docenteRepository.findAll();
        if (docentes.isEmpty()) {
            return 0.0;
        }
        return docentes.stream()
                .mapToInt(Docente::getAnosExperiencia)
                .average()
                .orElse(0.0);
    }
}
