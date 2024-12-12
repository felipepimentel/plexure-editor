declare module 'react-hot-toast' {
  export const Toaster: React.FC<{
    position?: 
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right';
    reverseOrder?: boolean;
    gutter?: number;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
    toastOptions?: any;
  }>;

  export function toast(message: string, options?: any): string;
  export function toast.success(message: string, options?: any): string;
  export function toast.error(message: string, options?: any): string;
  export function toast.loading(message: string, options?: any): string;
  export function toast.dismiss(toastId?: string): void;
} 