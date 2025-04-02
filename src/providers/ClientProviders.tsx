'use client';

import { useEffect } from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import('@twa-dev/sdk').then((module) => {
      const WebApp = module.default; 
      WebApp.ready();
      WebApp.expand();
    });
  }, []);

  return <>{children}</>;
}
