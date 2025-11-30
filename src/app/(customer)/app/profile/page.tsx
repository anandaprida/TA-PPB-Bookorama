'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IconEdit, IconUser, IconMail, IconShield } from '@tabler/icons-react';
// Import komponen InstallPrompt yang baru dibuat
import { InstallPrompt } from '@/components/InstallPrompt';

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data profil terbaru dari database
  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get('/api/profile');
      return res.data;
    },
  });

  // Set default name saat dialog dibuka
  useEffect(() => {
    if (profileData?.data?.name) {
      setNewName(profileData.data.name);
    } else if (session?.user?.name) {
      setNewName(session.user.name);
    }
  }, [profileData, session, isOpen]);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      await axios.put('/api/profile', { name: newName });
      
      // Update session di sisi client agar UI header/layout langsung berubah
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: newName,
        },
      });
      
      refetch(); // Refresh data dari API
      toast.success('Nama berhasil diperbarui');
      setIsOpen(false);
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className='flex flex-col gap-6 pb-10'>
      <h1 className='text-2xl font-bold'>Profil Saya</h1>

      {/* --- Tombol Install PWA --- */}
      <InstallPrompt />
      {/* ------------------------- */}

      <Card className='w-full overflow-hidden border-none shadow-sm'>
        <div className='bg-primary/10 h-32 w-full absolute top-0 z-0'></div>
        <CardHeader className='relative z-10 flex flex-col items-center pt-12 pb-2'>
          <Avatar className='h-24 w-24 border-4 border-background shadow-md'>
            <AvatarFallback className='text-3xl bg-primary text-primary-foreground'>
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className='text-center mt-3'>
            {isLoading ? (
              <Skeleton className='h-8 w-48 mb-2 mx-auto' />
            ) : (
              <CardTitle className='text-xl'>{profileData?.data?.name}</CardTitle>
            )}
            <p className='text-sm text-muted-foreground'>{session?.user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className='relative z-10 pt-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4 p-3 rounded-lg bg-secondary/30'>
              <div className='bg-background p-2 rounded-full shadow-sm'>
                <IconUser size={20} className='text-primary' />
              </div>
              <div className='flex-1'>
                <p className='text-xs text-muted-foreground'>Nama Lengkap</p>
                <p className='font-medium'>{profileData?.data?.name}</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <IconEdit size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ubah Nama Profil</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Nama Lengkap</Label>
                      <Input
                        id='name'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder='Masukkan nama baru'
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateProfile} 
                      className='w-full'
                      loading={isSaving}
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className='flex items-center gap-4 p-3 rounded-lg bg-secondary/30'>
              <div className='bg-background p-2 rounded-full shadow-sm'>
                <IconMail size={20} className='text-primary' />
              </div>
              <div className='flex-1'>
                <p className='text-xs text-muted-foreground'>Email</p>
                <p className='font-medium'>{session?.user?.email}</p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-3 rounded-lg bg-secondary/30'>
              <div className='bg-background p-2 rounded-full shadow-sm'>
                <IconShield size={20} className='text-primary' />
              </div>
              <div className='flex-1'>
                <p className='text-xs text-muted-foreground'>Role</p>
                <p className='font-medium capitalize'>
                  {isLoading ? '...' : (profileData?.data?.role || 'Customer').toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          <Separator className='my-6' />

          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>
              Versi Aplikasi 1.0.0 (PWA Enabled)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}