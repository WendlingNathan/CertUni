'use client';

import {
  Award,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  Download,
  LoaderCircle,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-types';

interface Course {
  id: string;
  title: string;
  description: string;
  speaker: string;
  workload: number;
  eventDate: string;
}

interface Enrollment {
  id: string;
  completed: boolean;
  createdAt: string;
  course: Course;
}

type Tab = 'enrollments' | 'catalog' | 'certificates';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function StudentCoursePanel() {
  const [tab, setTab] = useState<Tab>('enrollments');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async (activeTab: Tab) => {
    setIsLoading(true);
    try {
      if (activeTab === 'catalog') {
        const [courseData, enrollmentData] = await Promise.all([
          apiRequest<Course[]>('/courses'),
          apiRequest<Enrollment[]>('/enrollments/my-enrollments'),
        ]);
        setCourses(courseData);
        setEnrollments(enrollmentData);
      } else {
        setEnrollments(await apiRequest<Enrollment[]>('/enrollments/my-enrollments'));
      }
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível carregar os dados.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadData(tab), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadData, tab]);

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((enrollment) => enrollment.course.id)),
    [enrollments],
  );
  const completedEnrollments = useMemo(
    () => enrollments.filter((enrollment) => enrollment.completed),
    [enrollments],
  );

  function selectTab(nextTab: Tab) {
    setFeedback(null);
    setTab(nextTab);
  }

  async function enroll(course: Course) {
    setPendingId(course.id);
    setFeedback(null);
    try {
      await apiRequest('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId: course.id }),
      });
      setFeedback({ type: 'success', text: `Inscrição em “${course.title}” realizada com sucesso.` });
      setTab('enrollments');
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível realizar a inscrição.' });
    } finally {
      setPendingId(null);
    }
  }

  async function cancelEnrollment(enrollment: Enrollment) {
    if (!window.confirm(`Cancelar sua inscrição em “${enrollment.course.title}”?`)) return;

    setPendingId(enrollment.id);
    setFeedback(null);
    try {
      await apiRequest(`/enrollments/${enrollment.id}`, { method: 'DELETE' });
      setEnrollments((current) => current.filter((item) => item.id !== enrollment.id));
      setFeedback({ type: 'success', text: 'Inscrição cancelada com sucesso.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível cancelar a inscrição.' });
    } finally {
      setPendingId(null);
    }
  }

  async function downloadCertificate(enrollment: Enrollment) {
    setPendingId(enrollment.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/backend/certificates/generate/${enrollment.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(getApiErrorMessage(data, 'Não foi possível gerar o certificado.'));
      }

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `certificado-${enrollment.course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível baixar o certificado.' });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section aria-labelledby="student-area-title" className="mt-9">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="page-kicker text-blue-700">Área do aluno</p>
          <h2 id="student-area-title" className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950">Cursos e certificados</h2>
        </div>
        <p className="text-sm text-slate-500">Acompanhe sua trajetória acadêmica</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-sm backdrop-blur">
        <div className="flex min-w-max gap-1" role="tablist" aria-label="Conteúdo acadêmico">
          <TabButton active={tab === 'enrollments'} onClick={() => selectTab('enrollments')} icon={BookOpenCheck}>Meus cursos</TabButton>
          <TabButton active={tab === 'catalog'} onClick={() => selectTab('catalog')} icon={CalendarDays}>Catálogo</TabButton>
          <TabButton active={tab === 'certificates'} onClick={() => selectTab('certificates')} icon={Award}>Certificados</TabButton>
        </div>
      </div>

      {feedback && (
        <div role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {feedback.text}
        </div>
      )}

      {isLoading ? (
        <div className="surface-card mt-5 grid min-h-56 place-items-center"><LoaderCircle className="size-7 animate-spin text-blue-600" /></div>
      ) : tab === 'catalog' ? (
        courses.length ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course}>
                <button type="button" onClick={() => void enroll(course)} disabled={enrolledCourseIds.has(course.id) || pendingId === course.id} className="primary-button mt-5 w-full">
                  {pendingId === course.id ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                  {enrolledCourseIds.has(course.id) ? 'Já inscrito' : pendingId === course.id ? 'Inscrevendo...' : 'Inscrever-se'}
                </button>
              </CourseCard>
            ))}
          </div>
        ) : <EmptyState text="Nenhum curso disponível no momento." />
      ) : tab === 'certificates' ? (
        completedEnrollments.length ? (
          <div className="mt-5 space-y-4">
            {completedEnrollments.map((enrollment) => (
              <article key={enrollment.id} className="surface-card flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-bold text-slate-950">{enrollment.course.title}</h3><p className="mt-1 text-sm text-emerald-700">Presença confirmada · {enrollment.course.workload}h</p></div>
                <button type="button" onClick={() => void downloadCertificate(enrollment)} disabled={pendingId === enrollment.id} className="primary-button shrink-0">
                  {pendingId === enrollment.id ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}{pendingId === enrollment.id ? 'Gerando...' : 'Baixar certificado'}
                </button>
              </article>
            ))}
          </div>
        ) : <EmptyState text="Seus certificados aparecerão após a confirmação de presença." />
      ) : enrollments.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <CourseCard key={enrollment.id} course={enrollment.course} status={enrollment.completed ? 'Concluído' : 'Inscrito'}>
              <button type="button" onClick={() => void cancelEnrollment(enrollment)} disabled={pendingId === enrollment.id || enrollment.completed} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400">
                {pendingId === enrollment.id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}{enrollment.completed ? 'Curso concluído' : pendingId === enrollment.id ? 'Cancelando...' : 'Cancelar inscrição'}
              </button>
            </CourseCard>
          ))}
        </div>
      ) : (
        <EmptyState text="Você ainda não está inscrito em nenhum curso." action={() => selectTab('catalog')} />
      )}
    </section>
  );
}

function TabButton({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof Award; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}><Icon className="size-4" />{children}</button>;
}

function CourseCard({ course, status, children }: { course: Course; status?: string; children: React.ReactNode }) {
  return <article className="surface-card group flex flex-col overflow-hidden p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="mb-5 h-1.5 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all group-hover:w-20" /><div className="flex-1">{status && <span className="mb-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{status}</span>}<h3 className="text-lg font-extrabold tracking-tight text-slate-950">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{course.description}</p><div className="mt-5 space-y-2.5 rounded-xl bg-slate-50/80 p-3 text-xs font-medium text-slate-500"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-blue-600" />{dateFormatter.format(new Date(course.eventDate))}</p><p className="flex items-center gap-2"><Clock3 className="size-4 text-blue-600" />{course.workload}h · {course.speaker}</p></div></div>{children}</article>;
}

function EmptyState({ text, action }: { text: string; action?: () => void }) {
  return <div className="surface-card mt-5 border-dashed px-6 py-14 text-center"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><BookOpenCheck className="size-6" /></span><p className="text-sm font-medium text-slate-500">{text}</p>{action && <button type="button" onClick={action} className="mt-3 text-sm font-bold text-blue-700 hover:underline">Explorar catálogo →</button>}</div>;
}
