package com.gonzalez.examen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gonzalez.examen.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {

    List<Docente> findByEspecialidad(String especialidad);

    boolean existsByCorreo(String correo);
}
