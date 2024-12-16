'use client'

import * as React from "react"
import { GripVertical } from "lucide-react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  children,
  direction = "horizontal",
  ...props
}: React.ComponentProps<typeof PanelGroup> & {
  direction?: "horizontal" | "vertical"
}) => (
  <PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    direction={direction}
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
  withHandle = true,
  className,
  id,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean
  id?: string
}) => (
  <PanelResizeHandle
    id={id}
    className={cn(
      "relative flex w-px items-center justify-center bg-border",
      withHandle ? "hover:bg-ring" : "cursor-col-resize",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </PanelResizeHandle>
)

export { ResizablePanel, ResizablePanelGroup, ResizableHandle }
