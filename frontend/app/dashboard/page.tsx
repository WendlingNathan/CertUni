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
  attended?: boolean;
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

  const handleCancelEnrollment = async (enrollmentId: string) => {
    if (!confirm('Tem a certeza de que deseja cancelar esta inscrição?')) return;

    try {
      await api.delete(`/enrollments/${enrollmentId}`);
      alert('Inscrição cancelada com sucesso!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar inscrição.');
    }
  };

  const handleDownloadCertificate = async (enrollmentId: string) => {
    try {
      const response = await api.post(`/certificates/generate/${enrollmentId}`, {}, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-${enrollmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert('Erro ao transferir certificado.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CertUni — Painel do Aluno</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition font-medium"
        >
          Sair
        </button>
      </header>

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

      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">A carregar informações...</div>
        ) : (
          <>
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
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium transition">
                          Acessar Aulas
                        </button>
                        <button
                          onClick={() => handleCancelEnrollment(item.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-sm font-medium transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

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

            {activeTab === 'certificates' && (
              <div className="space-y-4">
                {enrollments.filter((e) => e.attended || e.completedAt).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">
                      Ainda não concluiu nem confirmou presença em nenhum curso para gerar certificado.
                    </p>
                  </div>
                ) : (
                  enrollments
                    .filter((e) => e.attended || e.completedAt)
                    .map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-lg border shadow-sm flex justify-between items-center">
                        <div>
                          <h2 className="font-bold text-lg text-gray-800">{item.course.title}</h2>
                          <p className="text-xs text-gray-500 mt-1">Status: Presença Confirmada</p>
                        </div>
                        <button
                          onClick={() => handleDownloadCertificate(item.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition"
                        >
                          Baixar Certificado
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