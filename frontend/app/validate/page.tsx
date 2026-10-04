'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  LoaderCircle,
  Search,
  UserRound,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { getApiErrorMessage } from '@/lib/auth-types';

interface ValidationResult {
  isValid: true;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
}

export default function ValidateCertificatePage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/certificates/validate/${encodeURIComponent(code.trim())}`);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Certificado inválido.'));
      }
      setResult(data as ValidationResult);
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : 'Não foi possível validar o certificado.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="size-4" />Voltar para o acesso
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-6 py-8 text-white sm:px-10">
            <span className="grid size-12 place-items-center rounded-xl bg-white/15"><BadgeCheck className="size-7" /></span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight">Validar certificado</h1>
            <p className="mt-2 max-w-xl text-blue-100">Informe o código impresso no documento para confirmar sua autenticidade.</p>
          </div>

          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit}>
              <label htmlFor="certificate-code" className="mb-2 block text-sm font-bold text-slate-800">Código de validação</label>
              <input id="certificate-code" required value={code} onChange={(event) => setCode(event.target.value)} className="form-input" placeholder="Ex.: 550e8400-e29b-41d4-a716-446655440000" />
              <button type="submit" disabled={isLoading} className="primary-button mt-4 w-full">
                {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4" />}{isLoading ? 'Validando...' : 'Validar certificado'}
              </button>
            </form>

            {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            {result && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="flex items-center gap-2 font-bold text-emerald-800"><BadgeCheck className="size-5" />Certificado válido</p>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div><dt className="flex items-center gap-1.5 font-semibold text-emerald-700"><UserRound className="size-4" />Aluno</dt><dd className="mt-1 font-bold text-slate-900">{result.studentName}</dd></div>
                  <div><dt className="flex items-center gap-1.5 font-semibold text-emerald-700"><GraduationCap className="size-4" />Curso</dt><dd className="mt-1 font-bold text-slate-900">{result.courseTitle}</dd></div>
                  <div><dt className="flex items-center gap-1.5 font-semibold text-emerald-700"><CalendarDays className="size-4" />Emissão</dt><dd className="mt-1 font-bold text-slate-900">{new Intl.DateTimeFormat('pt-BR').format(new Date(result.issuedAt))}</dd></div>
                </dl>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
