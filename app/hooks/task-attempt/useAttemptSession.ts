import { useEffect, useState } from "react";
import { getSession, setSession, removeSession } from "@/app/utils/storage";

export const useAttemptSession = (storageKey: string) => {
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [lastAccessedAt, setLastAccessedAt] = useState<Date | null>(null);

  useEffect(() => {
    const stored = getSession(storageKey);
    const now = new Date();

    if (stored) {
      const parsed = new Date(stored);
      setStartedAt(parsed);
      setLastAccessedAt(new Date());
    } else {
      setSession(storageKey, now.toISOString());
      setStartedAt(now);
      setLastAccessedAt(now);
    }
  }, [storageKey]);

  const clearSession = () => {
    removeSession(storageKey);
  };

  return {
    startedAt,
    lastAccessedAt,
    clearSession, 
  };
};
