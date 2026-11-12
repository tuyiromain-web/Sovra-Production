/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const WorkspaceSkeletons: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-[var(--surface)] border border-[var(--border)]" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[var(--surface)] border border-[var(--border)] p-4 space-y-2">
            <div className="h-3 w-16 bg-[var(--border)]" />
            <div className="h-6 w-24 bg-[var(--border)]" />
          </div>
        ))}
      </div>
      <div className="h-72 bg-[var(--surface)] border border-[var(--border)]" />
    </div>
  );
};
