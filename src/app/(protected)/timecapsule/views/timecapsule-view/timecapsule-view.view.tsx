"use client";

import { Lock, Unlock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { TimeCapsuleItem } from "../../components/timecapsule-item/timecapsule-item.component";
import { TimeCapsuleMonthGroup } from "../../components/timecapsule-month/timecapsule-month.component";
import { TimeCapsuleEmpty } from "../../components/timecapsule-empty/timecapsule-empty.component";
import { TimeCapsuleForm } from "../../components/timecapsule-form/timecapsule-form.component";
import type { TimeCapsule } from "../../types/timecapsule.types";

interface TimeCapsuleViewProps {
  sealedByMonth: Array<{
    month: string;
    label: string;
    items: TimeCapsule[];
  }>;
  openedByMonth: Array<{
    month: string;
    label: string;
    items: TimeCapsule[];
  }>;
  readyCapsules: TimeCapsule[];
  onOpen: (id: string) => Promise<{ success: boolean; error?: string }>;
  onCreate: (data: {
    title: string;
    message: string;
    openAt: string;
    recipientId: string;
    recipientName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function TimeCapsuleView({
  sealedByMonth,
  openedByMonth,
  readyCapsules,
  onOpen,
  onCreate,
}: TimeCapsuleViewProps) {
  return (
    <PageContainer>
      <PageHeader title="Cápsulas do Tempo" />

      <div className="px-4 pb-6 space-y-4">
        <TimeCapsuleForm onSubmit={onCreate} />

        {readyCapsules.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-duo-rose flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Prontas para abrir ({readyCapsules.length})
            </h2>
            <div className="space-y-3">
              {readyCapsules.map((capsule) => (
                <TimeCapsuleItem
                  key={capsule.id}
                  capsule={capsule}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="sealed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sealed" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Seladas
            </TabsTrigger>
            <TabsTrigger value="opened" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              Abertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sealed" className="mt-4">
            {sealedByMonth.length === 0 ? (
              <TimeCapsuleEmpty />
            ) : (
              <div className="space-y-6">
                {sealedByMonth.map((month) => (
                  <TimeCapsuleMonthGroup
                    key={month.month}
                    month={month}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="opened" className="mt-4">
            {openedByMonth.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Unlock className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma cápsula aberta ainda
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {openedByMonth.map((month) => (
                  <TimeCapsuleMonthGroup
                    key={month.month}
                    month={month}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
