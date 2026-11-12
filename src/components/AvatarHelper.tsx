/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Pill, Stethoscope, Microscope, Dna, Activity, Sparkles, Shield, User } from "lucide-react";
import { UserProfile } from "../types";

export function getAvatarTheme(iconName: string) {
  switch (iconName) {
    case "Pill":
      return {
        bg: "bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40",
        lightBg: "bg-[#0284C7]/10 text-[#38BDF8] border-[#0284C7]/30",
        color: "text-[#0284C7]",
        label: "Clinical Pharmacology"
      };
    case "Stethoscope":
      return {
        bg: "bg-[#EC407A]/20 text-[#EC407A] border border-[#EC407A]/40",
        lightBg: "bg-[#EC407A]/10 text-[#EC407A] border-[#EC407A]/30",
        color: "text-[#EC407A]",
        label: "Clinical Pharmacy Practice"
      };
    case "Microscope":
      return {
        bg: "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40",
        lightBg: "bg-[#8B5CF6]/10 text-[#A78BFA] border-[#8B5CF6]/30",
        color: "text-[#8B5CF6]",
        label: "Pharmaceutical Chemistry"
      };
    case "Dna":
      return {
        bg: "bg-purple-900/40 text-purple-300 border border-purple-500/40",
        lightBg: "bg-purple-950/50 text-purple-300 border-purple-800/40",
        color: "text-purple-400",
        label: "Biotechnology & Genetics"
      };
    case "Activity":
      return {
        bg: "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40",
        lightBg: "bg-emerald-950/40 text-emerald-300 border-emerald-800/40",
        color: "text-emerald-400",
        label: "Diagnostics & Therapeutics"
      };
    case "Sparkles":
      return {
        bg: "bg-amber-950/60 text-amber-400 border border-amber-500/40",
        lightBg: "bg-amber-950/40 text-amber-300 border-amber-800/40",
        color: "text-amber-400",
        label: "Sovra AI Intelligence"
      };
    default:
      return {
        bg: "bg-[#1E232B] text-slate-300 border border-white/10",
        lightBg: "bg-[#0E1626] text-slate-300 border-white/10",
        color: "text-slate-400",
        label: "General Apothecary"
      };
  }
}

export function renderAvatarIcon(iconName: string, className = "w-4 h-4") {
  switch (iconName) {
    case "Pill": return <Pill className={className} />;
    case "Stethoscope": return <Stethoscope className={className} />;
    case "Microscope": return <Microscope className={className} />;
    case "Dna": return <Dna className={className} />;
    case "Activity": return <Activity className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Shield": return <Shield className={className} />;
    default: return <User className={className} />;
  }
}

interface RenderAvatarProps {
  avatarUrl?: string;
  name: string;
  sizeClass?: string;
  textClass?: string;
  iconClass?: string;
}

export function RenderAvatar({
  avatarUrl,
  name,
  sizeClass = "w-9 h-9",
  textClass = "text-sm",
  iconClass = "w-4 h-4"
}: RenderAvatarProps) {
  if (avatarUrl) {
    if (avatarUrl.startsWith("lucide:")) {
      const iconName = avatarUrl.replace("lucide:", "");
      const theme = getAvatarTheme(iconName);
      return (
        <div className={`${sizeClass} rounded-xl flex-shrink-0 flex items-center justify-center ${theme.bg}`}>
          {renderAvatarIcon(iconName, iconClass)}
        </div>
      );
    }
    return (
      <div className={`${sizeClass} rounded-xl flex-shrink-0 border border-white/10 overflow-hidden bg-[#0E1626] flex items-center justify-center shadow-xs`}>
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-xl bg-gradient-to-br from-[#1E232B] to-[#15191E] border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-[#F8FAFC] ${textClass}`}>
      {(name || "U").charAt(0).toUpperCase()}
    </div>
  );
}
