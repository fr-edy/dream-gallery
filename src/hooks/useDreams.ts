// fetch /api/dreams api

import { Dream } from "@/types/dream";
import { useState } from "react";

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  async function fetchDreams() {
    const res = await fetch("/api/dreams");
    const data = await res.json();
    setDreams(data);
  }

  return {
    dreams,
    fetchDreams,
  }
}
