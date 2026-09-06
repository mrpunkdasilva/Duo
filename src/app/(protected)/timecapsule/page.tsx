"use client";

import { useTimeCapsule } from "./hooks/use-timecapsule/use-timecapsule.hook";
import { TimeCapsuleView } from "./views/timecapsule-view/timecapsule-view.view";

export default function TimeCapsulePage() {
  const {
    sealedByMonth,
    openedByMonth,
    readyCapsules,
    isLoading,
    error,
    openCapsule,
  } = useTimeCapsule();

  const handleCreate = async (data: {
    title: string;
    message: string;
    openAt: string;
    recipientId: string;
    recipientName: string;
  }) => {
    try {
      const res = await fetch("/api/timecapsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        return { success: false, error: result.error };
      }

      window.location.reload();
      return { success: true };
    } catch {
      return { success: false, error: "Erro ao criar cápsula" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-duo-rose border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <TimeCapsuleView
      sealedByMonth={sealedByMonth}
      openedByMonth={openedByMonth}
      readyCapsules={readyCapsules}
      onOpen={openCapsule}
      onCreate={handleCreate}
    />
  );
}
