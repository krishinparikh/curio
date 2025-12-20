"use client";

import { ModuleHeader } from "./components/ModuleHeader";
import { AIPane } from "./components/ai_pane/AIPane";
import { Content } from "./components/Content";
import { ModuleFooter } from "./components/ModuleFooter";
import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface ModulePageProps {
  params: Promise<{
    sessionId: string;
    moduleId: string;
  }>;
}

export default function ModulePage({ params }: ModulePageProps) {
  const { sessionId, moduleId } = use(params);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  // Determine initial state based on screen size
  const [isPaneOpen, setIsPaneOpen] = useState(true);

  useEffect(() => {
    // Set initial state based on screen size (closed on mobile, open on desktop)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsPaneOpen(!isMobile);
  }, []);

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      {/* ModuleHeader: visible on desktop always, visible on mobile only when AI pane is closed */}
      <div className={`md:block ${isPaneOpen ? 'hidden' : 'block'}`}>
        <ModuleHeader sessionId={sessionId} moduleId={moduleId} isPaneOpen={isPaneOpen} onTogglePane={() => setIsPaneOpen(!isPaneOpen)} />
      </div>

      {/* Main Content Area - Resizable Panels */}
      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* Left: Module Content */}
        <Panel defaultSize={60} minSize={30}>
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-hide">
              <Content moduleId={moduleId} isPaneOpen={isPaneOpen} />
              <ModuleFooter isPaneOpen={isPaneOpen} sessionId={sessionId} moduleId={moduleId} />
            </div>
          </div>
        </Panel>

        {/* Resize Handle - only visible when pane is open on desktop */}
        {isPaneOpen && (
          <PanelResizeHandle className="hidden md:block w-1 bg-border cursor-col-resize" />
        )}

        {/* Right: AI Chat Pane - handles its own Panel wrapper */}
        <AIPane moduleId={moduleId} userId={userId} open={isPaneOpen} onOpenChange={setIsPaneOpen} />
      </PanelGroup>
    </div>
  );
}
