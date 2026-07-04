import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/styles/global.css';
import App from '@/App';

// Activate the font stylesheet loaded as media="print" in index.html (non-blocking first paint,
// done here because an inline onload handler would violate the CSP).
document.getElementById('font-css')?.setAttribute('media', 'all');

const OsPage = lazy(() => import('@/fallback/OsPage'));

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/os',
    element: (
      <Suspense fallback={<div className="terminal-text p-8 text-dim">loading…</div>}>
        <OsPage />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
