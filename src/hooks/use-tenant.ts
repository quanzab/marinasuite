
'use client';

import { useState, useEffect } from 'react';

const TENANT_STORAGE_KEY = 'marinasuite-tenantId';
const DEFAULT_TENANT_ID = 'Global Maritime';

export function useTenant() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Use the default tenant ID since we are bypassing login/selection
      const storedTenantId = sessionStorage.getItem(TENANT_STORAGE_KEY);
      if (storedTenantId) {
        setTenantId(storedTenantId);
      } else {
        setTenantId(DEFAULT_TENANT_ID);
        sessionStorage.setItem(TENANT_STORAGE_KEY, DEFAULT_TENANT_ID);
      }
    } catch (error) {
      console.error("Could not access session storage:", error);
       // Fallback for environments where sessionStorage is not available
      setTenantId(DEFAULT_TENANT_ID);
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
