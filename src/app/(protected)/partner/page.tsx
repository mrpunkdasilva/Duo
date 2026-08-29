"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Copy, Check, Heart, LinkIcon, UserPlus } from "lucide-react";

export default function PartnerPage() {
  const t = useTranslations("partner");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerImage, setPartnerImage] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCoupleInfo() {
      try {
        const res = await fetch("/api/couple");
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setInviteCode(data.data.inviteCode);
            if (data.data.partner) {
              setPartnerName(data.data.partner.name);
              setPartnerImage(data.data.partner.image);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar casal:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCoupleInfo();
  }, []);

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkPartner = async () => {
    if (!inputCode.trim() || inputCode.trim().length !== 6) {
      setError(t("invalidCode"));
      return;
    }

    setError("");
    setIsLinking(true);

    try {
      const res = await fetch("/api/couple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inputCode.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("linkError"));
        return;
      }

      setPartnerName(data.data.partnerName);
      setSuccess(t("linkedSuccess"));
      setInputCode("");
    } catch {
      setError(t("linkError"));
    } finally {
      setIsLinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 pt-4 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-duo-rose" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Already connected */}
      {partnerName && (
        <Card className="border-0 bg-duo-teal/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-duo-teal/30">
                <AvatarImage src={partnerImage || ""} alt={partnerName} />
                <AvatarFallback className="bg-duo-teal/10 text-duo-teal text-xl font-bold">
                  {partnerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-duo-teal flex items-center justify-center">
                <Heart className="h-3 w-3 text-white fill-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-duo-teal font-medium">{t("connected")}</p>
              <p className="font-semibold text-lg">{partnerName}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate invite code */}
      {!partnerName && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-duo-rose/10 flex items-center justify-center">
                <LinkIcon className="h-5 w-5 text-duo-rose" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("shareCode")}</h3>
                <p className="text-xs text-muted-foreground">{t("shareCodeDescription")}</p>
              </div>
            </div>

            {inviteCode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-xl px-4 py-3 text-center">
                  <span className="text-2xl font-bold tracking-[0.3em] text-gradient">
                    {inviteCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl flex-shrink-0"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-duo-teal" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={async () => {
                  const res = await fetch("/api/couple", { method: "PUT" });
                  if (res.ok) {
                    const data = await res.json();
                    setInviteCode(data.data.inviteCode);
                  }
                }}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
              >
                {t("generateCode")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enter invite code */}
      {!partnerName && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-duo-teal/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-duo-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("enterCode")}</h3>
                <p className="text-xs text-muted-foreground">{t("enterCodeDescription")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="ABCDEF"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="h-12 rounded-xl text-center text-lg tracking-[0.2em] font-bold uppercase"
              />
              <Button
                onClick={handleLinkPartner}
                disabled={isLinking || inputCode.length !== 6}
                className="h-12 px-6 rounded-xl bg-duo-teal hover:bg-duo-teal-dark"
              >
                {isLinking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("link")
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-duo-teal text-center">{success}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <div className="space-y-3 pt-2">
        <h3 className="font-semibold text-sm text-muted-foreground">{t("howItWorks")}</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Badge className="bg-duo-rose/10 text-duo-rose border-0 mt-0.5">1</Badge>
            <p className="text-sm text-muted-foreground">{t("step1")}</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-duo-teal/10 text-duo-teal border-0 mt-0.5">2</Badge>
            <p className="text-sm text-muted-foreground">{t("step2")}</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-muted text-foreground border-0 mt-0.5">3</Badge>
            <p className="text-sm text-muted-foreground">{t("step3")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
