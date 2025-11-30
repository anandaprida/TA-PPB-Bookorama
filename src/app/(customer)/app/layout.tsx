'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import {
  IconShoppingCart,
  IconTrash,
  IconHome,
  IconList,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Books } from '@prisma/client';
import { useCart } from '@/store/cart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const selectedNav = (item: string) => pathname === item;
  const { cart, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleOrder = async () => {
    setIsLoading(true);
    const body = {
      cart: cart,
      userId: Number(data?.user?.id),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await axios.post('/api/order', body);
      toast.success('Berhasil membuat pesanan');
      router.push('/app/orders');
      handleOpen();
      clearCart();
      setIsLoading(false);
    } catch (error) {
      toast.error('Gagal membuat pesanan');
    }
  };

  return (
    <div className='container max-w-2xl mx-auto min-h-screen flex flex-col bg-background relative shadow-xl'>
      
      {/* --- Global Cart Dialog (Hidden, controlled by state) --- */}
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className='max-w-xs sm:max-w-lg rounded-xl'>
          <DialogHeader>
            <DialogTitle>Keranjang Belanja</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-4 mt-2'>
            {cart.length > 0 ? (
              <>
                <ScrollArea className='flex flex-col h-[50vh] pr-4'>
                  {cart.map((book: Books, index) => (
                    <div key={`${book.isbn}-${index}`}>
                      <div className='flex w-full items-start gap-3 py-3'>
                        <div className='flex flex-1 flex-col gap-1'>
                          <span className='font-semibold text-sm line-clamp-2'>
                            {book.title}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {book.author}
                          </span>
                          <span className='font-bold text-sm text-primary mt-1'>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              maximumFractionDigits: 0,
                            }).format(book.price)}
                          </span>
                        </div>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
                          onClick={() => removeFromCart(book)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </div>
                      {index !== cart.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
                <div className='space-y-4 pt-4 border-t'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium'>Total Bayar</span>
                    <span className='font-bold text-lg'>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(
                        cart.reduce((total, book) => total + book.price, 0)
                      )}
                    </span>
                  </div>
                  <Button
                    className='w-full'
                    onClick={handleOrder}
                    loading={isLoading}
                  >
                    Checkout ({cart.length})
                  </Button>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center h-48 text-muted-foreground gap-2'>
                <IconShoppingCart size={48} className='opacity-20' />
                <span className='font-medium text-sm'>
                  Keranjang masih kosong
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Top Header (Desktop & Mobile) --- */}
      <div className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md'>
        <div className='flex h-16 items-center justify-between px-4'>
          <span className='font-bold text-lg'>Bookorama</span>

          {/* DESKTOP NAVIGATION (Visible on md+) */}
          <div className='hidden md:flex items-center gap-6'>
            <Button
              variant='ghost'
              className={cn(
                'text-sm font-medium hover:bg-transparent',
                selectedNav('/app') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              onClick={() => router.push('/app')}
            >
              Beranda
            </Button>
            <Button
              variant='ghost'
              className={cn(
                'text-sm font-medium hover:bg-transparent',
                selectedNav('/app/orders') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              onClick={() => router.push('/app/orders')}
            >
              Pesanan
            </Button>
            <Button
              variant='ghost'
              className={cn(
                'text-sm font-medium hover:bg-transparent',
                selectedNav('/app/profile') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              onClick={() => router.push('/app/profile')}
            >
              Profil
            </Button>
            
            {/* Desktop Cart Trigger */}
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'relative hover:bg-transparent',
                open ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              onClick={handleOpen}
            >
              <IconShoppingCart size={20} stroke={2} />
              {cart.length > 0 && (
                <Badge
                  className='absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px]'
                  variant='destructive'
                >
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>

          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-medium hidden sm:inline-block'>
                {data?.user?.name}
              </span>
              <Avatar className='h-8 w-8'>
                <AvatarFallback className='text-xs'>
                  {data?.user?.name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 text-muted-foreground'
              onClick={() => signOut()}
            >
              <IconLogout size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content (Responsive Padding) */}
      <div className='flex-1 w-full p-4 pb-24 md:pb-8'>{children}</div>

      {/* --- Bottom Navigation Bar (Mobile Only: md:hidden) --- */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container max-w-2xl mx-auto flex h-16 items-center justify-around px-2'>
          {/* Menu Beranda */}
          <Button
            variant='ghost'
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-none hover:bg-transparent',
              selectedNav('/app')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => router.push('/app')}
          >
            <IconHome size={22} stroke={selectedNav('/app') ? 2.5 : 2} />
            <span className='text-[10px] font-medium'>Beranda</span>
          </Button>

          {/* Menu Pesanan */}
          <Button
            variant='ghost'
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-none hover:bg-transparent',
              selectedNav('/app/orders')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => router.push('/app/orders')}
          >
            <IconList size={22} stroke={selectedNav('/app/orders') ? 2.5 : 2} />
            <span className='text-[10px] font-medium'>Pesanan</span>
          </Button>

          {/* Menu Keranjang (Mobile Trigger) */}
          <Button
            variant='ghost'
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-none hover:bg-transparent relative',
              open
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={handleOpen}
          >
            <div className='relative'>
              <IconShoppingCart size={22} stroke={open ? 2.5 : 2} />
              {cart.length > 0 && (
                <Badge
                  className='absolute -top-2 -right-3 h-4 w-4 p-0 flex items-center justify-center text-[9px]'
                  variant='destructive'
                >
                  {cart.length}
                </Badge>
              )}
            </div>
            <span className='text-[10px] font-medium'>Keranjang</span>
          </Button>

          {/* Menu Profil */}
          <Button
            variant='ghost'
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-none hover:bg-transparent',
              selectedNav('/app/profile')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => router.push('/app/profile')}
          >
            <IconUser size={22} stroke={selectedNav('/app/profile') ? 2.5 : 2} />
            <span className='text-[10px] font-medium'>Profil</span>
          </Button>
        </div>
      </div>
    </div>
  );
}