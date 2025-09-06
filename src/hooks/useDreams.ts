// fetch /api/dreams api

import { Dream } from "@/types/dream";
import { useState, useEffect } from "react";

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchDreams() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/dreams");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setDreams(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dreams'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDreams();
  }, []);

  return {
    dreams,
    isLoading,
    error,
    fetchDreams,
  };
}
