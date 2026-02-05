package com.gonzalez.examen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "docentes")
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombres del docente.
     */
    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    /**
     * Apellidos del docente.
     */
    @NotBlank(message = "El apellido es obligatorio")
    private String apellidos;

    /**
     * Correo electrónico único del docente.
     */
    @Email(message = "El correo debe ser válido")
    @NotBlank(message = "El correo es obligatorio")
    @Column(unique = true)
    private String correo;

    /**
     * Especialidad académica del docente.
     */
    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;

    /**
     * Años de experiencia profesional.
     */
    @Min(value = 0, message = "Los años de experiencia no pueden ser negativos")
    private int anosExperiencia;

    // Constructor vacío requerido por JPA
    public Docente() {
    }

    // Constructor completo
    public Docente(Long id, String nombres, String apellidos, String correo, String especialidad, int anosExperiencia) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.especialidad = especialidad;
        this.anosExperiencia = anosExperiencia;
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public int getAnosExperiencia() {
        return anosExperiencia;
    }

    public void setAnosExperiencia(int anosExperiencia) {
        this.anosExperiencia = anosExperiencia;
    }
}
