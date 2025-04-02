'use client';

import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
    }
  }, []);
  return <>{children}</>;
}
