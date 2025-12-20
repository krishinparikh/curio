import { use } from 'react';
import { SessionHeader } from "./components/SessionHeader";

interface SessionLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    sessionId: string;
  }>;
}

export default function SessionLayout({ children, params }: SessionLayoutProps) {
  const { sessionId } = use(params);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <SessionHeader sessionId={sessionId} />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}