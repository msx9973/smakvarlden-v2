import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { useAuth } from './lib/auth-context';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Calculator from './pages/Calculator';
import Ingredients from './pages/Ingredients';
import PriceIntel from './pages/PriceIntel';
import Analytics from './pages/Analytics';
import InvestorPresentation from './pages/InvestorPresentation';
import Landing from './pages/Landing';
import { LoginPage, TrustPage, UpgradePage, WastePage } from './pages/Other';
import './index.css';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes key={user?.id ?? 'guest'}>
          {/* Public routes */}
          <Route path="/"             element={<Landing />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/landing"      element={<Landing />} />
          <Route path="/presentation" element={<InvestorPresentation />} />
          <Route path="/investor"     element={<InvestorPresentation />} />
          <Route path="/trust"        element={<TrustPage />} />
          <Route path="/privacy"      element={<TrustPage />} />
          <Route path="/terms"        element={<TrustPage />} />
          <Route path="/contact"      element={<TrustPage />} />

          {/* Protected app routes */}
          <Route path="/dashboard"   element={<Protected><Dashboard /></Protected>} />
          <Route path="/price-intel" element={<Protected><PriceIntel /></Protected>} />
          <Route path="/recipes"     element={<Protected><Recipes /></Protected>} />
          <Route path="/recipes/:id" element={<Protected><RecipeDetail /></Protected>} />
          <Route path="/calculator"  element={<Protected><Calculator /></Protected>} />
          <Route path="/ingredients" element={<Protected><Ingredients /></Protected>} />
          <Route path="/analytics"   element={<Protected><Analytics /></Protected>} />
          <Route path="/waste"       element={<Protected><WastePage /></Protected>} />
          <Route path="/upgrade"     element={<Protected><UpgradePage /></Protected>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}