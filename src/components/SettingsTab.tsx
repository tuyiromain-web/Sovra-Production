/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Settings, Bell, Map, Eye, Volume2, ShieldCheck, 
  Trash2, Database, KeyRound, Sparkles, CheckCircle,
  User, Sliders
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import ProfileTab from "./ProfileTab";

export interface SettingsTabProps {
  currentUser?: UserProfile;
  profiles?: Record<UserRole, UserProfile>;
  onChangeProfile?: (updatedProfile: UserProfile) => void;
  onRoleChange?: (newRole: UserRole) => void;
  activeSubTab?: "profile" | "preferences";
  onSubTabChange?: (tab: "profile" | "preferences") => void;
}

export default function SettingsTab({
  currentUser,
  profiles,
  onChangeProfile,
  onRoleChange,
  activeSubTab = "profile",
  onSubTabChange
}: SettingsTabProps) {
  const [subTab, setSubTab] = useState<"profile" | "preferences">(activeSubTab);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [geofencingRadius, setGeofencingRadius] = useState("100");
  const [autoSaves, setAutoSaves] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (activeSubTab) {
      setSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleSubTabChange = (newSubTab: "profile" | "preferences") => {
    setSubTab(newSubTab);
    onSubTabChange?.(newSubTab);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("Settings updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  const handleResetCache = () => {
    if (confirm("Are you sure you want to reset Sovra local cache data? This will restore standard demonstration workspaces.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="settings-tab-section" className="space-y-6 max-w-4xl mx-auto text-left animate-fade-in text-[#F8FAFC]">
      
      {/* Settings Sub-Tab Navigation Switcher */}
      <div className="flex items-center gap-2.5 border-b border-white/8 pb-3.5">
        <button
          type="button"
          onClick={() => handleSubTabChange("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === "profile"
              ? "bg-[#0284C7] text-white shadow-md glow-blue-sm"
              : "bg-glass text-[#94A3B8] hover:text-[#F8FAFC] border border-white/8 hover:border-white/15"
          }`}
        >
          <User className="w-4 h-4" />
          <span>User Profile</span>
        </button>

        <button
          type="button"
          onClick={() => handleSubTabChange("preferences")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === "preferences"
              ? "bg-[#0284C7] text-white shadow-md glow-blue-sm"
              : "bg-glass text-[#94A3B8] hover:text-[#F8FAFC] border border-white/8 hover:border-white/15"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>System & Preferences</span>
        </button>
      </div>

      {/* Sub-Tab 1: User Profile */}
      {subTab === "profile" && (
        currentUser && profiles && onChangeProfile && onRoleChange ? (
          <ProfileTab
            currentUser={currentUser}
            profiles={profiles}
            onChangeProfile={onChangeProfile}
            onRoleChange={onRoleChange}
          />
        ) : (
          <div className="p-8 text-center text-[#94A3B8] bg-glass rounded-2xl border border-white/8">
            Profile details unavailable.
          </div>
        )
      )}

      {/* Sub-Tab 2: System & Preferences */}
      {subTab === "preferences" && (
        <div className="space-y-6 max-w-3xl">
          {/* Success Notification */}
          {successMessage && (
            <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
              <span className="text-xs font-mono font-semibold">{successMessage}</span>
            </div>
          )}

          <div className="bg-glass rounded-2xl border border-white/8 p-6 shadow-md">
            <h3 className="font-bold text-[#F8FAFC] text-base mb-5 flex items-center gap-2 border-b border-white/8 pb-4">
              <Settings className="w-5 h-5 text-[#38BDF8]" />
              <span>System Configurations & Preferences</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Notifications config */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Bell className="w-4 h-4 text-[#38BDF8]" />
                    <span>Real-Time Notifications Alerts</span>
                  </label>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Receive instant visual notifications when lecturers release module grades, open attendance check-ins, or post new past exam sheets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 p-1 rounded-full transition-colors duration-200 ease-in-out cursor-pointer relative border ${
                    notificationsEnabled ? "bg-[#0284C7] border-[#0284C7]" : "bg-[#0E1626] border-white/10"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notificationsEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <hr className="border-white/8" />

              {/* Geofencing config */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Map className="w-4 h-4 text-[#38BDF8]" />
                    <span>GPS Geofence Verification Proximity</span>
                  </label>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Defines the allowable radius around INES-Ruhengeri Campus building coordinates within which student automated check-ins are authorized.
                  </p>
                </div>
                <select
                  value={geofencingRadius}
                  onChange={(e) => setGeofencingRadius(e.target.value)}
                  className="bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] cursor-pointer"
                >
                  <option value="50">Tight Security (50 meters of block)</option>
                  <option value="100">Standard Campus (100 meters of geofence)</option>
                  <option value="500">Broad Proximity (500 meters of block)</option>
                </select>
              </div>

              <hr className="border-white/8" />

              {/* Storage saving */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Database className="w-4 h-4 text-[#38BDF8]" />
                    <span>Auto-Save Session Storage</span>
                  </label>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Automatically caches modified resources, submitted lab files, upvotes, and forum posts in browser LocalStorage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSaves(!autoSaves)}
                  className={`w-12 h-6 p-1 rounded-full transition-colors duration-200 ease-in-out cursor-pointer relative border ${
                    autoSaves ? "bg-[#0284C7] border-[#0284C7]" : "bg-[#0E1626] border-white/10"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      autoSaves ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <hr className="border-white/8" />

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetCache}
                  className="px-4 py-2 bg-[#EC407A]/15 hover:bg-[#EC407A]/25 border border-[#EC407A]/30 text-[#EC407A] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Local Cache</span>
                </button>

                <button
                  type="submit"
                  className="blue-gradient-btn text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-md glow-blue-sm transition-all"
                >
                  Apply Configurations
                </button>
              </div>

            </form>
          </div>

          {/* Security Info Panel */}
          <div className="bg-glass border border-white/8 rounded-2xl p-5 flex gap-3 shadow-md">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-[#F8FAFC]">Zero-Trust Academic Encryption</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                All submitted files, student checking logs, and profile records are hashed locally in your browser. This shifting of manual documentation protects student privacy and ensures maximum compliance with academic guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
