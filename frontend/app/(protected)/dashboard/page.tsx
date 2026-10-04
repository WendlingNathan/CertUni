import {
  BadgeCheck,
  CircleUserRound,
  LockKeyhole,
  Settings,
  Sparkles,
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
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-800 px-6 py-8 text-white shadow-xl shadow-blue-200/50 sm:px-10 sm:py-10">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute -right-16 -top-20 size-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker flex items-center gap-2 text-blue-100"><Sparkles className="size-4" />Painel principal</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Olá, {firstName}!</h1>
            <p className="mt-3 max-w-2xl leading-7 text-blue-50">Sua jornada acadêmica, cursos e conquistas reunidos em um só lugar.</p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15"><BadgeCheck className="size-5" /></span>
            <div><p className="text-xs font-semibold text-blue-100">Sua conta</p><p className="text-sm font-bold">{roleLabels[user.role]}</p></div>
          </div>
        </div>
      </section>

      {user.role === 'STUDENT' ? (
        <StudentCoursePanel />
      ) : (
        <section className="surface-card mt-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-sm font-semibold text-blue-700">Perfil administrador</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Gerencie cursos e presenças</h2><p className="mt-2 text-sm text-slate-600">Acesse as ferramentas administrativas da plataforma.</p></div>
          <Link href="/admin" className="primary-button shrink-0"><Settings className="size-4" />Abrir administração</Link>
        </section>
      )}

      <section aria-labelledby="profile-title" className="surface-card mt-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-100 to-blue-50 text-blue-700">
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
