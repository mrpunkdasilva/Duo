"use client";

import { useState, useEffect, useMemo } from "react";
import type { TimeCapsule, TimeCapsuleMonth } from "../../types/timecapsule.types";

export function useTimeCapsule() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCapsules() {
      try {
        const res = await fetch("/api/timecapsule");
        if (!res.ok) {
          throw new Error("Erro ao buscar cápsulas");
        }
        const data = await res.json();
        setCapsules(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCapsules();
  }, []);

  const sealedCapsules = useMemo(
    () => capsules.filter((c) => !c.isOpened),
    [capsules]
  );

  const openedCapsules = useMemo(
    () => capsules.filter((c) => c.isOpened),
    [capsules]
  );

  const readyCapsules = useMemo(
    () =>
      sealedCapsules.filter((c) => {
        const now = new Date();
        const openAt = new Date(c.openAt);
        return now >= openAt;
      }),
    [sealedCapsules]
  );

  const sealedByMonth = useMemo(() => {
    const groups: Record<string, TimeCapsule[]> = {};

    sealedCapsules.forEach((capsule) => {
      const date = new Date(capsule.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(capsule);
    });

    const months: TimeCapsuleMonth[] = Object.entries(groups)
      .map(([month, items]) => ({
        month,
        label: new Date(month + "-01").toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        items,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return months;
  }, [sealedCapsules]);

  const openedByMonth = useMemo(() => {
    const groups: Record<string, TimeCapsule[]> = {};

    openedCapsules.forEach((capsule) => {
      const date = new Date(capsule.openedAt || capsule.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(capsule);
    });

    const months: TimeCapsuleMonth[] = Object.entries(groups)
      .map(([month, items]) => ({
        month,
        label: new Date(month + "-01").toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        items,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return months;
  }, [openedCapsules]);

  const openCapsule = async (id: string) => {
    try {
      const res = await fetch("/api/timecapsule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao abrir cápsula");
      }

      setCapsules((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isOpened: true, openedAt: new Date().toISOString() }
            : c
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    capsules,
    sealedCapsules,
    openedCapsules,
    readyCapsules,
    sealedByMonth,
    openedByMonth,
    isLoading,
    error,
    openCapsule,
  };
}
