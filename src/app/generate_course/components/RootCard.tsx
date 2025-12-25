'use client'

import { ReactNode } from "react";

interface RootCardProps {
  children: ReactNode;
}

export function RootCard({ children }: RootCardProps) {
  return (
    <div className="max-w-3xl mx-auto p-20 bg-card rounded shadow space-y-14">
      {children}
    </div>
  );
}
