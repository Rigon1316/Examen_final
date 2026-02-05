import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserPlus, Calculator, Save, X } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/docentes';

export default function DocenteManager() {
    const [docentes, setDocentes] = useState([]);
    const [promedio, setPromedio] = useState(0);
    const [busqueda, setBusqueda] = useState('');
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        especialidad: '',
        anosExperiencia: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDocentes();
        fetchPromedio();
    }, []);

    // Efecto debounce para la búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDocentes(busqueda);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    const fetchDocentes = async (especialidad = '') => {
        try {
            const url = especialidad
                ? `${API_URL}?especialidad=${encodeURIComponent(especialidad)}`
                : API_URL;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar docentes');
            const data = await response.json();
            setDocentes(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchPromedio = async () => {
        try {
            const response = await fetch(`${API_URL}/promedio-experiencia`);
            if (response.ok) {
                const data = await response.json();
                setPromedio(data.promedioExperiencia);
            }
        } catch (err) {
            console.error("Error al obtener promedio", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_URL}/${editingId}` : API_URL;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar docente');
            }

            await fetchDocentes(busqueda);
            await fetchPromedio(); // Actualizar promedio al cambiar datos
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (docente) => {
        setFormData({
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            correo: docente.correo,
            especialidad: docente.especialidad,
            anosExperiencia: docente.anosExperiencia
        });
        setIsEditing(true);
        setEditingId(docente.id);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este docente?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');
            await fetchDocentes(busqueda);
            await fetchPromedio(); // Actualizar promedio tras eliminar
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({ nombres: '', apellidos: '', correo: '', especialidad: '', anosExperiencia: 0 });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-sage-light pb-6">
                <h1 className="text-3xl font-bold text-sage-dark flex items-center gap-2">
                    <UserPlus className="h-8 w-8 text-sage" />
                    Gestión de Docentes
                </h1>

                {/* Tarjeta de Promedio */}
                <div className="bg-sage text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-3 transform transition hover:scale-105">
                    <Calculator className="h-8 w-8 opacity-80" />
                    <div>
                        <p className="text-xs uppercase font-bold tracking-wider opacity-90">Promedio Experiencia</p>
                        <p className="text-2xl font-bold">{promedio.toFixed(1)} <span className="text-sm font-normal">años</span></p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="bg-white p-6 rounded-lg shadow-lg h-fit border-t-4 border-sage">
                    <h2 className="text-xl font-semibold mb-6 text-sage-dark flex items-center gap-2">
                        {isEditing ? <Edit className="h-5 w-5 text-sage" /> : <UserPlus className="h-5 w-5 text-sage" />}
                        {isEditing ? 'Editar Docente' : 'Nuevo Docente'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 mb-4 rounded border border-red-200 text-sm flex items-start gap-2 animate-pulse">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-sage-dark mb-1 uppercase">Nombres</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    className="w-full border border-sage-light p-2 rounded focus:ring-2 focus:ring-sage outline-none transition bg-sage-bg/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-sage-dark mb-1 uppercase">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="w-full border border-sage-light p-2 rounded focus:ring-2 focus:ring-sage outline-none transition bg-sage-bg/20"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-sage-dark mb-1 uppercase">Correo Electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className="w-full border border-sage-light p-2 rounded focus:ring-2 focus:ring-sage outline-none transition bg-sage-bg/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-sage-dark mb-1 uppercase">Especialidad</label>
                                <input
                                    type="text"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleChange}
                                    className="w-full border border-sage-light p-2 rounded focus:ring-2 focus:ring-sage outline-none transition bg-sage-bg/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-sage-dark mb-1 uppercase">Exp. (Años)</label>
                                <input
                                    type="number"
                                    name="anosExperiencia"
                                    value={formData.anosExperiencia}
                                    onChange={handleChange}
                                    className="w-full border border-sage-light p-2 rounded focus:ring-2 focus:ring-sage outline-none transition bg-sage-bg/20"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-sage text-white py-2.5 rounded hover:bg-sage-dark transition font-medium flex justify-center items-center gap-2 shadow-sm"
                            >
                                <Save className="h-4 w-4" />
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition border border-gray-200 flex justify-center items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Lista y Búsqueda */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Barra de Búsqueda */}
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 border border-sage-light focus-within:ring-2 focus-within:ring-sage transition">
                        <Search className="h-5 w-5 text-sage-slate" />
                        <input
                            type="text"
                            placeholder="Buscar docente por especialidad..."
                            className="flex-1 outline-none text-sage-dark placeholder-sage-light/70"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        {busqueda && (
                            <button onClick={() => setBusqueda('')} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-sage-light">
                        <table className="w-full text-left">
                            <thead className="bg-sage-dark text-white">
                                <tr>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Docente</th>
                                    <th className="p-4 font-semibold hidden md:table-cell text-sm uppercase tracking-wider">Contacto</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Especialidad</th>
                                    <th className="p-4 font-semibold text-center text-sm uppercase tracking-wider">Exp.</th>
                                    <th className="p-4 font-semibold text-right text-sm uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sage-light">
                                {docentes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                                            <Search className="h-10 w-10 text-gray-300" />
                                            <p className="text-lg font-medium">No se encontraron docentes.</p>
                                            {busqueda && <p className="text-sm">Intenta con otra especialidad.</p>}
                                        </td>
                                    </tr>
                                ) : (
                                    docentes.map((docente) => (
                                        <tr key={docente.id} className="hover:bg-sage-bg/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-bold text-sage-dark">{docente.nombres} {docente.apellidos}</div>
                                                <div className="md:hidden text-xs text-gray-500 mt-1">{docente.correo}</div>
                                            </td>
                                            <td className="p-4 text-gray-600 hidden md:table-cell text-sm">{docente.correo}</td>
                                            <td className="p-4">
                                                <span className="bg-sage-light/20 text-sage-dark border border-sage-light/50 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    {docente.especialidad}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-medium text-sage-slate">{docente.anosExperiencia}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(docente)}
                                                        className="p-2 text-sage-slate hover:text-white hover:bg-sage rounded-md transition shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(docente.id)}
                                                        className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-md transition shadow-sm"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="bg-sage-bg/50 p-3 text-right text-xs text-sage-slate border-t border-sage-light font-medium">
                            Total: {docentes.length} {docentes.length === 1 ? 'docente' : 'docentes'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
