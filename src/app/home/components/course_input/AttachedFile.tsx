import { X } from "lucide-react";
import { AttachedFileType } from "./AttachedFileType";

interface AttachedFileProps {
  fileName: string;
  fileType: string;
}

export function AttachedFile({ fileName, fileType }: AttachedFileProps) {
  return (
    <div className="relative w-24 h-24 bg-white border border-border rounded-md flex items-start justify-start p-2 group hover:border-muted-foreground/40 transition-colors cursor-default">
      <span className="text-xs text-muted-foreground font-normal">{fileName}</span>
      <div className="absolute bottom-2 left-2">
        <AttachedFileType fileType={fileType} />
      </div>
      <button
        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          // Handle remove
        }}
      >
        <X className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  );
}
