import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from './components/ui/toaster';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
