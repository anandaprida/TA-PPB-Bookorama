import { Button } from '@/components/ui/button';

// Tambahkan baris ini agar halaman tidak di-generate secara statis
export const dynamic = 'force-dynamic'; 

export default function Overview() {
  return (
    <div className='w-full flex flex-col p-0'>
      <div className='flex justify-between items-center'>
        <h3 className='font-bold text-lg'>Ikhtisar</h3>
      </div>
    </div>
  );
}