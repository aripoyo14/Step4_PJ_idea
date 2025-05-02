'use client';

import { useRouter } from 'next/navigation';

export default function ClientIdeasLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();
  return <>{children}</>;
}