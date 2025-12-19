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
    <>
      <SessionHeader sessionId={sessionId} />
      <div className="px-14 bg-secondary">
        {children}
      </div>
    </>
  );
}