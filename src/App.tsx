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
import InvestorPresentation from './pages/InvestorPresentation';
import { LoginPage, TrustPage, UpgradePage } from './pages/Other';
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
        <Routes>
          <Route path="/investor"    element={<InvestorPresentation />} />
          <Route path="/presentation" element={<InvestorPresentation />} />
          <Route path="/"            element={<InvestorPresentation />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/dashboard"   element={<Protected><Dashboard /></Protected>} />
          <Route path="/price-intel" element={<Protected><PriceIntel /></Protected>} />
          <Route path="/recipes"     element={<Protected><Recipes /></Protected>} />
          <Route path="/recipes/:id" element={<Protected><RecipeDetail /></Protected>} />
          <Route path="/calculator"  element={<Protected><Calculator /></Protected>} />
          <Route path="/ingredients" element={<Protected><Ingredients /></Protected>} />
          <Route path="/upgrade"     element={<Protected><UpgradePage /></Protected>} />
          <Route path="/trust"       element={<TrustPage />} />
          <Route path="/privacy"     element={<TrustPage />} />
          <Route path="/terms"       element={<TrustPage />} />
          <Route path="/contact"     element={<TrustPage />} />
          <Route path="/analytics"   element={<Navigate to="/dashboard" replace />} />
          <Route path="/waste"       element={<Navigate to="/dashboard" replace />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
