'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { IconDownload, IconDeviceMobile } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cek apakah aplikasi sudah berjalan dalam mode standalone (sudah diinstall)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Deteksi iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Tangkap event 'beforeinstallprompt' (Hanya Chrome/Android/Desktop)
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // Instruksi manual untuk iOS
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Cara Install di iOS:</span>
          <span className="text-sm">
            1. Ketuk tombol <strong>Share</strong> <span className="text-blue-500">⎋</span> di browser bawah.
          </span>
          <span className="text-sm">
            2. Pilih <strong>Add to Home Screen</strong> <span className="text-gray-500">➕</span>.
          </span>
        </div>
      ), { duration: 6000, icon: '📱' });
    } else if (deferredPrompt) {
      // Prompt otomatis untuk Android/Desktop
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      toast('Aplikasi mungkin sudah terinstall atau browser tidak mendukung fitur ini.', { icon: 'ℹ️' });
    }
  };

  // Jangan render apa pun di server (hydration fix) atau jika sudah diinstall
  if (!isMounted || isStandalone) {
    return null;
  }

  // Tampilkan tombol hanya jika prompt tersedia (Android/PC) atau jika user menggunakan iOS
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="w-full">
        <Button 
            onClick={handleInstallClick} 
            variant="outline" 
            className="w-full flex gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
            <IconDownload size={20} />
            Install Aplikasi ke Home Screen
        </Button>
    </div>
  );
}