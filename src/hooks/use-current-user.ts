
'use client';

import { useState, useEffect } from 'react';
import type { CurrentUser } from '@/lib/types';

// Mock user for local development without login
const mockAdminUser: CurrentUser = {
    uid: 'mock-admin-uid',
    id: 'mock-admin-id',
    email: 'admin@marinasuite.com',
    name: 'Default Admin',
    role: 'Admin',
    tenant: 'Global Maritime',
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediately set the mock user and stop loading.
    setUser(mockAdminUser);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
}
