
'use client';

import { useState, useEffect } from 'react';

const TENANT_STORAGE_KEY = 'marinasuite-tenantId';

export function useTenant() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTenantId = sessionStorage.getItem(TENANT_STORAGE_KEY);
      if (storedTenantId) {
        setTenantId(storedTenantId);
      }
    } catch (error) {
      console.error("Could not access session storage:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSetTenant = (id: string) => {
    try {
        sessionStorage.setItem(TENANT_STORAGE_KEY, id);
        setTenantId(id);
    } catch (error) {
         console.error("Could not set tenant in session storage:", error);
    }
  };

  return { tenantId, setTenantId: handleSetTenant, isLoading };
}
