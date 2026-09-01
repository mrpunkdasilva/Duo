"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { colorFromGradient } from "../../utils/color-utils/color-utils.utils";
import { BANNER_PRESETS } from "../../data/banner-presets/banner-presets.data";
import { Palette } from "lucide-react";

interface BannerPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  resetText: string;
}

export function BannerPicker({
  value,
  onChange,
  label,
  resetText,
}: BannerPickerProps) {
  return (
    <Stack gap={2}>
      <Label className="text-sm font-medium flex items-center gap-1.5">
        <Palette className="h-3.5 w-3.5" />
        {label}
      </Label>

      <Flex gap={2} wrap>
        {BANNER_PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(preset)}
            className={`rounded-lg transition-all ${
              value === preset
                ? "ring-2 ring-offset-2 ring-duo-rose scale-110"
                : "hover:scale-105"
            }`}
            style={{ background: preset }}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60"
        >
          <Input
            type="color"
            value={value ? colorFromGradient(value) : "#f43f5e"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Text variant="small" className="text-[10px]">+</Text>
        </Button>
      </Flex>

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => onChange("")}
        >
          {resetText}
        </Button>
      )}
      
      <Box
        className="h-16 rounded-xl overflow-hidden"
        style={{
          background: value || "linear-gradient(to right, var(--color-duo-rose), var(--color-duo-teal))",
        }}
      />
    </Stack>
  );
}
