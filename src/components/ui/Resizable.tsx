'use client'

import * as React from "react"
import { GripVertical } from "lucide-react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  >
    {children}
  </PanelGroup>
)

const ResizablePanel = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Panel>) => (
  <Panel
    className={cn(
      "flex min-h-0 w-full flex-col",
      className
    )}
    {...props}
  >
    {children}
  </Panel>
)

const ResizableHandle = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle>) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border",
      className
    )}
    {...props}
  >
    <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
      <GripVertical className="h-2.5 w-2.5" />
    </div>
  </PanelResizeHandle>
)

export { ResizablePanel, ResizablePanelGroup, ResizableHandle }
