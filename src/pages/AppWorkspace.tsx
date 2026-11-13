/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkspaceProvider } from "../components/workspace/WorkspaceContext";
import { WorkspaceShell } from "../components/workspace/WorkspaceShell";
import type { UserProfile } from "../types";

export interface AppWorkspaceProps {
  initialSchoolId?: string | null;
  currentUser?: UserProfile | null;
  onNavigateToLanding: () => void;
  onSignOut?: () => void;
}

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  initialSchoolId,
  currentUser,
  onNavigateToLanding,
  onSignOut,
}) => {
  return (
    <WorkspaceProvider
      initialSchoolId={initialSchoolId}
      currentUser={currentUser}
      onNavigateToLanding={onNavigateToLanding}
      onSignOut={onSignOut}
    >
      <WorkspaceShell />
    </WorkspaceProvider>
  );
};

export default AppWorkspace;
