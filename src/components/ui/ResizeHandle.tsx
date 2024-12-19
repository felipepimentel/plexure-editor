import * as React from "react";
import { PanelResizeHandle } from "react-resizable-panels";
import { cn } from "../../lib/utils";

interface ResizeHandleProps {
  className?: string;
  id?: string;
}

export function ResizeHandle({ className, id }: ResizeHandleProps) {
  return (
    <PanelResizeHandle
      id={id}
      className={cn(
        "group relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className
      )}
    >
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border opacity-0 transition-opacity group-hover:opacity-100">
        <svg
          width="8"
          height="24"
          viewBox="0 0 8 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-2 text-muted-foreground"
        >
          <path
            d="M4 4V20M1.33325 4V20M6.66675 4V20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
} 