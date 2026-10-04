'use client';

import Link from 'next/link';
import { BadgeCheck, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { AuthUser } from '@/lib/auth-types';

const roleLabels: Record<AuthUser['role'], string> = {
  STUDENT: 'Aluno',
  ADMIN: 'Administrador',
};

export function AppHeader({ user }: { user: AuthUser }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isLeaving, setIsLeaving] = useState(false);
  const displayName = user.name || user.email.split('@')[0];

  async function handleLogout() {
    setIsLeaving(true);
    await logout();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-[0_1px_18px_rgb(15_23_42/0.04)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="CertUni">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/70">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none text-slate-950">CertUni</span>
            <span className="mt-1 block text-xs text-slate-500">Cursos e certificados</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label="Navegação principal" className="flex items-center gap-1">
            <Link
              href="/validate"
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${pathname === '/validate' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
            >
              <BadgeCheck aria-hidden="true" className="size-4" />
              <span className="hidden lg:inline">Validar certificado</span>
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${pathname === '/admin' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                <Settings aria-hidden="true" className="size-4" />
                <span className="hidden lg:inline">Administração</span>
              </Link>
            )}
          </nav>
          <div className="hidden text-right sm:block">
            <p className="max-w-56 truncate text-sm font-semibold text-slate-900">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLeaving}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut aria-hidden="true" className="size-4" />
            <span>{isLeaving ? 'Saindo...' : 'Sair'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
