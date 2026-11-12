/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface WorkspaceEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const WorkspaceEmptyState: React.FC<WorkspaceEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-4">
      <div className="font-display text-2xl text-[var(--ink)] tracking-tight">
        {title}
      </div>
      <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
