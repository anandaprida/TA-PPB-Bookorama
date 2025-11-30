// Ganti impor authOptions
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// Hapus definisi authOptions yang lama di sini

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };