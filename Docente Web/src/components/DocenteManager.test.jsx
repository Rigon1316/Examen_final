import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocenteManager from '../components/DocenteManager';
import React from 'react';

// Mock global fetch
global.fetch = vi.fn();

describe('DocenteManager Component', () => {

    it('renderiza correctamente el título', () => {
        render(<DocenteManager />);
        expect(screen.getByText('Gestión de Docentes')).toBeInTheDocument();
    });

    it('muestra el formulario de nuevo docente', () => {
        render(<DocenteManager />);
        expect(screen.getByText('Nuevo Docente')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar docente por especialidad...')).toBeInTheDocument();
    });
});
