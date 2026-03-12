import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/shared/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-claw-bg" role="status" aria-label="Loading page" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
