'use client';

import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  Plus,
  UsersRound,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface Course {
  id: string;
  title: string;
}

interface Enrollment {
  id: string;
  completed: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const initialForm = {
  title: '',
  description: '',
  speaker: '',
  workload: '',
  eventDate: '',
};

export function AdminPanel() {
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [pendingCheckIn, setPendingCheckIn] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setCourses(await apiRequest<Course[]>('/courses'));
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível carregar os cursos.' });
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  const loadEnrollments = useCallback(async (courseId: string) => {
    setIsLoadingEnrollments(true);
    try {
      setEnrollments(await apiRequest<Enrollment[]>(`/enrollments/course/${courseId}`));
    } catch (error) {
      setEnrollments([]);
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível carregar os inscritos.' });
    } finally {
      setIsLoadingEnrollments(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadCourses(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadCourses]);

  function handleCourseSelection(courseId: string) {
    setSelectedCourseId(courseId);
    if (courseId) void loadEnrollments(courseId);
    else setEnrollments([]);
  }

  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await apiRequest('/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          speaker: form.speaker.trim(),
          workload: Number(form.workload),
          eventDate: new Date(form.eventDate).toISOString(),
        }),
      });
      setForm(initialForm);
      setFeedback({ type: 'success', text: 'Curso cadastrado com sucesso.' });
      await loadCourses();
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível cadastrar o curso.' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCheckIn(enrollment: Enrollment) {
    setPendingCheckIn(enrollment.id);
    setFeedback(null);
    try {
      await apiRequest(`/enrollments/${enrollment.id}/check-in`, { method: 'PATCH' });
      setEnrollments((current) => current.map((item) => (
        item.id === enrollment.id ? { ...item, completed: true } : item
      )));
      setFeedback({ type: 'success', text: `Presença de ${enrollment.user.name} confirmada.` });
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível confirmar a presença.' });
    } finally {
      setPendingCheckIn(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-900 px-6 py-8 text-white shadow-lg sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">Área restrita</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Painel administrativo</h1>
        <p className="mt-3 max-w-2xl text-slate-200">Cadastre cursos e confirme a presença dos participantes.</p>
      </section>

      {feedback && (
        <div role="status" className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {feedback.text}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><GraduationCap className="size-5" /></span>
            <div><p className="text-sm font-semibold text-blue-700">Novo evento</p><h2 className="text-xl font-bold text-slate-950">Cadastrar curso</h2></div>
          </div>

          <form onSubmit={handleCreateCourse} className="mt-6 space-y-4">
            <Field label="Título"><input className="form-input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Nome do curso" /></Field>
            <Field label="Descrição"><textarea className="form-input min-h-28 resize-y" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descrição do conteúdo" /></Field>
            <Field label="Palestrante"><input className="form-input" required value={form.speaker} onChange={(event) => setForm({ ...form, speaker: event.target.value })} placeholder="Nome do palestrante" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Carga horária"><input className="form-input" type="number" min="1" step="1" required value={form.workload} onChange={(event) => setForm({ ...form, workload: event.target.value })} placeholder="Horas" /></Field>
              <Field label="Data do evento"><input className="form-input" type="datetime-local" required value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} /></Field>
            </div>
            <button className="primary-button w-full" type="submit" disabled={isSaving}>
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {isSaving ? 'Cadastrando...' : 'Cadastrar curso'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><UsersRound className="size-5" /></span>
            <div><p className="text-sm font-semibold text-emerald-700">Participantes</p><h2 className="text-xl font-bold text-slate-950">Gestão de presenças</h2></div>
          </div>

          <label className="mt-6 block"><span className="mb-2 block text-sm font-bold text-slate-800">Curso</span>
            <select className="form-input" value={selectedCourseId} onChange={(event) => handleCourseSelection(event.target.value)} disabled={isLoadingCourses}>
              <option value="">{isLoadingCourses ? 'Carregando cursos...' : 'Selecione um curso'}</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
          </label>

          <div className="mt-5">
            {!selectedCourseId ? (
              <EmptyState icon={CalendarDays} text="Selecione um curso para visualizar os inscritos." />
            ) : isLoadingEnrollments ? (
              <div className="grid min-h-36 place-items-center"><LoaderCircle className="size-6 animate-spin text-blue-600" /></div>
            ) : enrollments.length === 0 ? (
              <EmptyState icon={UsersRound} text="Nenhum aluno inscrito neste curso." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {enrollments.map((enrollment) => (
                  <li key={enrollment.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-semibold text-slate-900">{enrollment.user.name}</p><p className="text-xs text-slate-500">{enrollment.user.email}</p></div>
                    {enrollment.completed ? (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2 className="size-3.5" />Presença confirmada</span>
                    ) : (
                      <button type="button" onClick={() => void handleCheckIn(enrollment)} disabled={pendingCheckIn === enrollment.id} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                        {pendingCheckIn === enrollment.id && <LoaderCircle className="size-3.5 animate-spin" />}Confirmar presença
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>{children}</label>;
}

function EmptyState({ icon: Icon, text }: { icon: typeof UsersRound; text: string }) {
  return <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500"><div><Icon className="mx-auto mb-2 size-6 text-slate-400" />{text}</div></div>;
}
