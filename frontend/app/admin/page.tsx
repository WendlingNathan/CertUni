'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
}

interface Enrollment {
  id: string;
  attended: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const { logout } = useAuth();

  // Estados do formulário de criação de curso
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workload, setWorkload] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState('');

  // Estados para a lista de cursos e check-in de alunos
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseEnrollments(selectedCourseId);
    } else {
      setEnrollments([]);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
    }
  };

  const fetchCourseEnrollments = async (courseId: string) => {
    setLoadingEnrollments(true);
    try {
      const res = await api.get(`/enrollments/course/${courseId}`);
      setEnrollments(res.data);
    } catch (err) {
      console.error('Erro ao carregar inscritos:', err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        title,
        description,
        workload: Number(workload),
        speaker,
        eventDate: new Date(date).toISOString(), // Propriedade correta exigida pelo DTO
      });

      alert('Curso cadastrado com sucesso!');
      setTitle('');
      setDescription('');
      setWorkload('');
      setSpeaker('');
      setDate('');
      fetchCourses();
    } catch (err: any) {
      const message = err.response?.data?.message;
      alert(Array.isArray(message) ? message.join(', ') : message || 'Erro ao cadastrar curso.');
    }
  };

  const handleCheckIn = async (enrollmentId: string) => {
    try {
      await api.patch(`/enrollments/${enrollmentId}/check-in`);
      alert('Presença confirmada com sucesso!');
      fetchCourseEnrollments(selectedCourseId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao realizar check-in.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CertUni — Painel Administrativo</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition font-medium"
        >
          Sair
        </button>
      </header>

      <main className="flex-1 p-6 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário para Cadastrar Novo Curso */}
        <section className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cadastrar Novo Curso</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título do Curso</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: NestJS & Next.js do Zero"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descrição detalhada do curso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Palestrante</label>
              <input
                type="text"
                required
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do palestrante"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Carga Horária (horas)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={workload}
                  onChange={(e) => setWorkload(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Data do Evento</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Cadastrar Curso
            </button>
          </form>
        </section>

        {/* Gestão de Presenças (Check-in) */}
        <section className="bg-white p-6 rounded-lg border shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Gestão de Presenças (Check-in)</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Curso</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Selecione um curso --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedCourseId ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Escolha um curso acima para listar os alunos inscritos.
              </p>
            ) : loadingEnrollments ? (
              <p className="text-gray-500 text-sm text-center py-8">A carregar inscrições...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Nenhum aluno matriculado neste curso ainda.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs text-gray-500 uppercase">
                    <th className="py-2">Aluno</th>
                    <th className="py-2">Presença</th>
                    <th className="py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {enrollments.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <div className="font-medium text-gray-800">{item.user.name}</div>
                        <div className="text-xs text-gray-500">{item.user.email}</div>
                      </td>
                      <td className="py-3">
                        {item.attended ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-semibold rounded">
                            Presente
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 font-semibold rounded">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {!item.attended && (
                          <button
                            onClick={() => handleCheckIn(item.id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition"
                          >
                            Confirmar Presença
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}