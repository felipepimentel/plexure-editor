import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="absolute inset-0 overflow-auto py-10 px-4">
        <div className="flex min-h-full items-center justify-center">
          <div
            className={cn(
              "relative max-w-lg w-full animate-in fade-in zoom-in-95 duration-200",
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}; 