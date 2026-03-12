import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/shared/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-cerve-bg" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
