'use client';

import { useEffect } from 'react';
interface TelegramProviderProps {
  children: React.ReactNode;
}
export default function TelegramProvider({ children }: TelegramProviderProps) {
  useEffect(() => {
    import('@twa-dev/sdk').then((module) => {
      const WebApp = module.default;
      WebApp.ready();
      WebApp.expand();
    });
  }, []);

  return <>{children}</>;
}
