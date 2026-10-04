'use client';

import { useState } from 'react';

export default function ValidatePage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/certificates/validate/${code}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Certificado inválido');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar o certificado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Validação de Certificados
        </h1>

        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de Validação
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Cole o código do certificado aqui"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'A validar...' : 'Validar Certificado'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-sm">
            <p className="text-green-800 font-semibold mb-2">✅ Certificado Válido!</p>
            <p><strong>Aluno:</strong> {result.user?.name}</p>
            <p><strong>Curso:</strong> {result.course?.title}</p>
            <p><strong>Carga Horária:</strong> {result.course?.workload}h</p>
            <p><strong>Emitido em:</strong> {new Date(result.issuedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}