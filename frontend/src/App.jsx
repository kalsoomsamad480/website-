import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
