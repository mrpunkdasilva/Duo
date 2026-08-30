import { colors } from "./colors";
import { typography } from "./typography";
import { spacing, layout } from "./spacing";
import { radii, shadows } from "./radii";

export const designSystem = {
  colors,
  typography,
  spacing,
  layout,
  radii,
  shadows,
} as const;

export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./radii";
