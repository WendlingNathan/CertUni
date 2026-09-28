'use client'; 
// Dize ao Next.js que esta página tem interatividade (botões, digitação, etc.)

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });

  // 2. Estado para saber se estamos a aguardar a resposta da rede
  const [loading, setLoading] = useState(false);
  
  // 3. Estado para mostrar mensagens de sucesso ou erro na tela
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função disparada ao clicar no botão "Cadastrar"
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Garanta que os nomes das chaves correspondem exatamente ao CreateUserDto
      body: JSON.stringify({
        name: formData.name,       // ou formData.fullName conforme o DTO
        email: formData.email,
        password: formData.password,
        role: formData.role,       // se o DTO aceitar o campo role
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Exibe os erros de validação retornados pelo ValidationPipe
      const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      throw new Error(errorMsg || 'Falha ao realizar cadastro.');
    }

    setMessage({ type: 'success', text: 'Conta criada com sucesso! Redirecionando...' });
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  } catch (err: any) {
    setMessage({ type: 'error', text: err.message || 'Erro ao conectar com o servidor.' });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">Criar uma Conta</h2>
        <p className="mb-6 text-center text-sm text-gray-500">Junte-se à plataforma CertUni</p>

        {/* Exibe mensagem de feedback se houver alguma */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm text-center ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perfil</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="STUDENT">Aluno</option>
              <option value="TEACHER">Professor / Emissor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui uma conta?{' '}
          <Link href="/" className="font-semibold text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}