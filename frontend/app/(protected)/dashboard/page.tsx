import {
  CircleUserRound,
  LockKeyhole,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { StudentCoursePanel } from '@/components/StudentCoursePanel';
import { requireUser } from '@/lib/server/auth';

const roleLabels = {
  STUDENT: 'Aluno',
  ADMIN: 'Administrador',
} as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(' ')[0] || user.email.split('@')[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-700 px-6 py-8 text-white shadow-lg shadow-blue-200/50 sm:px-10 sm:py-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
          Painel principal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Olá, {firstName}!
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-blue-50">
          Sua área CertUni está pronta. A partir daqui você acompanhará cursos,
          inscrições e certificados com uma única conta.
        </p>
      </section>

      {user.role === 'STUDENT' ? (
        <StudentCoursePanel />
      ) : (
        <section className="mt-10 flex flex-col gap-5 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-sm font-semibold text-blue-700">Perfil administrador</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Gerencie cursos e presenças</h2><p className="mt-2 text-sm text-slate-600">Acesse as ferramentas administrativas da plataforma.</p></div>
          <Link href="/admin" className="primary-button shrink-0"><Settings className="size-4" />Abrir administração</Link>
        </section>
      )}

      <section aria-labelledby="profile-title" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <CircleUserRound className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 id="profile-title" className="font-bold text-slate-950">Dados da sessão</h2>
              <p className="mt-1 text-sm text-slate-500">Informações fornecidas pelo módulo de autenticação.</p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Acesso protegido
          </span>
        </div>

        <dl className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">E-mail</dt>
            <dd className="mt-1 break-all font-semibold text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Perfil</dt>
            <dd className="mt-1 font-semibold text-slate-900">{roleLabels[user.role]}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
