import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './routes/DashboardPage';
import { OrdersPage } from './features/orders/OrdersPage';

export const router = createBrowserRouter([
  {
    element: (
      <AppShell>
        <Outlet />
      </AppShell>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
