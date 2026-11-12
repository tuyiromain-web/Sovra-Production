/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkspaceProvider } from "../components/workspace/WorkspaceContext";
import { WorkspaceShell } from "../components/workspace/WorkspaceShell";

export interface AppWorkspaceProps {
  initialTenantId?: string;
  onNavigateToLanding: () => void;
}

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  initialTenantId = "tenant-stjude",
  onNavigateToLanding
}) => {
  return (
    <WorkspaceProvider
      initialTenantId={initialTenantId}
      onNavigateToLanding={onNavigateToLanding}
    >
      <WorkspaceShell />
    </WorkspaceProvider>
  );
};

export default AppWorkspace;
