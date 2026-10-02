'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  workload: number;
}

interface Enrollment {
  id: string;
  course: Course;
  completedAt: string | null;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-courses' | 'courses' | 'certificates'>('my-courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

 const fetchData = async () => {
  setLoading(true);
  try {
    if (activeTab === 'courses') {
      const res = await api.get('/courses');
      setCourses(res.data);
    } else if (activeTab === 'my-courses' || activeTab === 'certificates') {
      // ATUALIZADO: trocado para 'my-enrollments'
      const res = await api.get('/enrollments/my-enrollments');
      setEnrollments(res.data);
    }
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    setLoading(false);
  }
};
  const handleEnroll = async (courseId: string) => {
    setActionLoading(courseId);
    try {
      await api.post('/enrollments', { courseId });
      alert('Matrícula realizada com sucesso!');
      setActiveTab('my-courses');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao realizar matrícula.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Topbar / Navbar */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CertUni — Painel do Aluno</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition font-medium"
        >
          Sair
        </button>
      </header>

      {/* Navegação por Abas */}
      <div className="bg-white border-b px-6 pt-4 flex gap-6">
        <button
          onClick={() => setActiveTab('my-courses')}
          className={`pb-3 font-medium border-b-2 text-sm transition ${
            activeTab === 'my-courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Meus Cursos
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 font-medium border-b-2 text-sm transition ${
            activeTab === 'courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Catálogo de Cursos
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-3 font-medium border-b-2 text-sm transition ${
            activeTab === 'certificates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Meus Certificados
        </button>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">A carregar informações...</div>
        ) : (
          <>
            {/* Aba 1: Meus Cursos */}
            {activeTab === 'my-courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.length === 0 ? (
                  <div className="col-span-3 text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">Ainda não estás matriculado em nenhum curso.</p>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Explorar catálogo de cursos &rarr;
                    </button>
                  </div>
                ) : (
                  enrollments.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-lg text-gray-800">{item.course.title}</h2>
                        <p className="text-sm text-gray-600 mt-2">{item.course.description}</p>
                      </div>
                      <button className="mt-4 w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium transition">
                        Acessar Aulas
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Aba 2: Catálogo de Cursos */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                  <p className="text-gray-500 col-span-3 text-center py-12">Nenhum curso disponível no momento.</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-lg text-gray-800">{course.title}</h2>
                        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                        <span className="inline-block mt-3 text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Carga Horária: {course.workload}h
                        </span>
                      </div>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={actionLoading === course.id}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition disabled:bg-blue-300"
                      >
                        {actionLoading === course.id ? 'A matricular...' : 'Matricular-se'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Aba 3: Certificados */}
            {activeTab === 'certificates' && (
              <div className="space-y-4">
                {enrollments.filter((e) => e.completedAt).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">Ainda não concluiu nenhum curso para gerar certificado.</p>
                  </div>
                ) : (
                  enrollments
                    .filter((e) => e.completedAt)
                    .map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-lg border shadow-sm flex justify-between items-center">
                        <div>
                          <h2 className="font-bold text-lg text-gray-800">{item.course.title}</h2>
                          <p className="text-xs text-gray-500 mt-1">
                            Concluído em: {new Date(item.completedAt!).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition">
                          Emitir PDF
                        </button>
                      </div>
                    ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
