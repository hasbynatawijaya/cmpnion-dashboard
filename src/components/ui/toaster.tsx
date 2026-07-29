import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/providers/ThemeProvider';

export function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)',
        },
      }}
    />
  );
}
