import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { isAdmin } from '../services/auth';

export const useAdmin = (user: User | null) => {
  const [adminStatus, setAdminStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        setLoading(true);
        const isUserAdmin = await isAdmin(user);
        setAdminStatus(isUserAdmin);
        setLoading(false);
      } else {
        setAdminStatus(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin: adminStatus, loading };
};
