'use client';

import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { useAuth } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/lib/auth-types';

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const passwordConfirmation = String(form.get('passwordConfirmation') ?? '');

    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(data, 'Não foi possível concluir seu cadastro.'),
        );
      }

      router.replace('/login');
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : 'Não foi possível concluir seu cadastro.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
          Comece agora
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Crie sua conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          O cadastro público cria um perfil de aluno na plataforma.
        </p>

        {error && (
          <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <FormField id="name" label="Nome completo" type="text" autoComplete="name" placeholder="Seu nome" icon={UserRound} />
          <FormField id="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@universidade.edu.br" icon={Mail} />
          <FormField id="password" label="Senha" type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" minLength={6} icon={LockKeyhole} />
          <FormField id="passwordConfirmation" label="Confirme a senha" type="password" autoComplete="new-password" placeholder="Digite a senha novamente" minLength={6} icon={LockKeyhole} />

          <button type="submit" disabled={isSubmitting} className="primary-button mt-2 w-full">
            <span>{isSubmitting ? 'Criando conta...' : 'Criar conta'}</span>
            {!isSubmitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Já possui uma conta?{' '}
          <Link href="/login" className="font-bold text-blue-700 hover:text-blue-800 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  minLength?: number;
  icon: typeof UserRound;
}

function FormField({ id, label, icon: Icon, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input id={id} name={id} required className="form-input pl-11" {...inputProps} />
      </div>
    </div>
  );
}
