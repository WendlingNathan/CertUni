import type { Metadata } from 'next';
import { AdminPanel } from '@/components/AdminPanel';

export const metadata: Metadata = {
  title: 'Administração',
};

export default function AdminPage() {
  return <AdminPanel />;
}
