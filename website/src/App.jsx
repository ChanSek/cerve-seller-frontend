import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cerve-bg" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
