'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Cursos</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <p className="text-gray-500">Nenhum curso encontrado.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="border p-5 rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                <p className="mt-2 text-gray-600">{course.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}