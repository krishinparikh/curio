'use client';

import { IconButton } from '@/components/IconButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModuleFooterProps {
  isPaneOpen: boolean;
}

export function ModuleFooter({ isPaneOpen }: ModuleFooterProps) {
  const containerClasses = isPaneOpen
    ? "px-4 w-full max-w-6xl pb-4"
    : "px-4 w-full max-w-6xl mx-auto pb-4";

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center">
        <IconButton
          icon={<ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          iconOnLeft={true}
          variant="outline"
          hideTextOnMobile
        >
          Previous Module
        </IconButton>

        <IconButton
          icon={<ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          iconOnLeft={false}
          variant="default"
          hideTextOnMobile
        >
          Next Module
        </IconButton>
      </div>
    </div>
  );
}
