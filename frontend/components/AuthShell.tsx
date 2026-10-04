import Link from 'next/link';
import { BadgeCheck, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

const benefits = [
  { icon: GraduationCap, text: 'Cursos e eventos em um só lugar' },
  { icon: BadgeCheck, text: 'Certificados fáceis de consultar' },
  { icon: ShieldCheck, text: 'Sessão protegida e acesso seguro' },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-800 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-28 -top-20 size-96 rounded-full bg-indigo-300/25 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 text-xl font-bold">
          <span className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/12 shadow-lg shadow-blue-950/10">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          CertUni
        </Link>
        <div className="relative max-w-xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-50 backdrop-blur">
            <Sparkles className="size-3.5" /> Sua jornada acadêmica
          </span>
          <p className="sr-only">
            Sua jornada acadêmica
          </p>
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Aprenda, participe e leve suas conquistas com você.
          </h1>
          <div className="mt-10 space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-blue-50">
                <span className="grid size-9 place-items-center rounded-lg bg-white/10">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-between text-sm text-blue-100">
          <span>CertUni · Plataforma acadêmica</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">Seguro e verificável</span>
        </div>
      </section>
      <section className="relative flex items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:py-10">
        <div className="absolute right-0 top-0 size-72 rounded-full bg-blue-100/55 blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-6 flex items-center gap-2.5 font-bold text-slate-950 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"><ShieldCheck className="size-5" /></span>
            CertUni
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
