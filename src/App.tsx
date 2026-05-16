import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { useAuth } from './lib/auth-context';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Calculator from './pages/Calculator';
import Ingredients from './pages/Ingredients';
import Analytics from './pages/Analytics';
import PriceIntel from './pages/PriceIntel';
import { WastePage, LoginPage, UpgradePage } from './pages/Other';
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
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/"            element={<Protected><Dashboard /></Protected>} />
          <Route path="/price-intel" element={<Protected><PriceIntel /></Protected>} />
          <Route path="/recipes"     element={<Protected><Recipes /></Protected>} />
          <Route path="/recipes/:id" element={<Protected><RecipeDetail /></Protected>} />
          <Route path="/calculator"  element={<Protected><Calculator /></Protected>} />
          <Route path="/ingredients" element={<Protected><Ingredients /></Protected>} />
          <Route path="/analytics"   element={<Protected><Analytics /></Protected>} />
          <Route path="/waste"       element={<Protected><WastePage /></Protected>} />
          <Route path="/upgrade"     element={<Protected><UpgradePage /></Protected>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
