'use client';

import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Não foi possível entrar. Tente novamente.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="surface-card animate-fade-up p-6 sm:p-8">
        <p className="page-kicker text-blue-600">
          Bem-vindo de volta
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          Entre na sua conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Acesse seus cursos, inscrições e certificados.
        </p>

        {error && (
          <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@universidade.edu.br"
                className="form-input pl-11"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800">
              Senha
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                className="form-input px-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="primary-button w-full">
            <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
            {!isSubmitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Ainda não possui uma conta?{' '}
          <Link href="/register" className="font-bold text-blue-700 hover:text-blue-800 hover:underline">
            Cadastre-se
          </Link>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link href="/validate" className="font-semibold text-slate-500 hover:text-blue-700 hover:underline">
            Validar um certificado
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
