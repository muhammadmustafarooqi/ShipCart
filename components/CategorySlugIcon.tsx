"use client";

import type { LucideIcon } from "lucide-react";
import {
  Baby,
  ChefHat,
  Dumbbell,
  Home,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";

const SLUG_ICONS: Record<string, LucideIcon> = {
  "kitchen-cooking": ChefHat,
  "personal-care-beauty": Sparkles,
  "home-cleaning": Home,
  "fitness-health": Dumbbell,
  "electronics-gadgets": Zap,
  "baby-kids": Baby,
};

export function CategorySlugIcon({
  slug,
  size = 28,
  className,
  color = "currentColor",
  strokeWidth = 2,
}: {
  slug: string;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}) {
  const Icon = SLUG_ICONS[slug] ?? Package;
  return (
    <Icon
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden
    />
  );
}
