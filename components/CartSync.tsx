'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cart-store';

export default function CartSync() {
  const { data: session, status } = useSession();
  const { setUserId } = useCartStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Set user ID - cart will auto-clear if a DIFFERENT user logs in
      setUserId(session.user.id);
    } else if (status === 'unauthenticated') {
      // Keep cart in localStorage for when same user logs back in
      // Cart will be cleared by authentication guards if they try to use it
      setUserId(null);
    }
  }, [status, session, setUserId]);

  return null; // This component doesn't render anything
}

