import { AppHeader } from '@/components/AppHeader';
import { requireUser } from '@/lib/server/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={user} />
      {children}
    </div>
  );
}
