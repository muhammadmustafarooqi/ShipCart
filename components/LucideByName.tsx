"use client";

import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Frown,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const MAP = {
  zap: Zap,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  search: Search,
  package: Package,
  frown: Frown,
  star: Star,
  banknote: Banknote,
} as const;

export type LucideByNameKey = keyof typeof MAP;

export function LucideByName({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className,
}: {
  name: LucideByNameKey;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = MAP[name] as LucideIcon;
  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    />
  );
}
