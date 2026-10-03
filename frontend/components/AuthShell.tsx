import Link from 'next/link';
import { BadgeCheck, GraduationCap, ShieldCheck } from 'lucide-react';

const benefits = [
  { icon: GraduationCap, text: 'Cursos e eventos em um só lugar' },
  { icon: BadgeCheck, text: 'Certificados fáceis de consultar' },
  { icon: ShieldCheck, text: 'Sessão protegida e acesso seguro' },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)]">
      <section className="relative hidden overflow-hidden bg-blue-700 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -right-28 -top-20 size-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 text-xl font-bold">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          CertUni
        </Link>
        <div className="relative max-w-xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
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
        <p className="relative text-sm text-blue-100">CertUni · Plataforma acadêmica</p>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
