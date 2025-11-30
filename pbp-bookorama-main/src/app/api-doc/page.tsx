'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { swaggerSpec } from '@/lib/swagger';

// Menggunakan dynamic import untuk SwaggerUI karena library ini client-side heavy
// dan menghindari error hydration
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <div className="p-10 text-center">Memuat Dokumentasi API...</div>,
});

export default function ApiDocPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-10">
        <SwaggerUI spec={swaggerSpec} />
      </div>
    </div>
  );
}