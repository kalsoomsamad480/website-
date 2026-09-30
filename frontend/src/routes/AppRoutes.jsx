import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Loader from '../components/common/Loader/Loader';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const Home = lazy(() => import('../pages/Home/Home'));
const Menu = lazy(() => import('../pages/Menu/Menu'));
const StudySpace = lazy(() => import('../pages/StudySpace/StudySpace'));
const About = lazy(() => import('../pages/About/About'));
const Gallery = lazy(() => import('../pages/Gallery/Gallery'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const Reservation = lazy(() => import('../pages/Reservation/Reservation'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

// The admin panel is a separate bundle that customers never download
const AdminLayout = lazy(() => import('../layouts/AdminLayout/AdminLayout'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard/Dashboard'));
const ManageOrders = lazy(() => import('../pages/admin/ManageOrders/ManageOrders'));
const ManageReservations = lazy(
  () => import('../pages/admin/ManageReservations/ManageReservations'),
);
const ManageMenu = lazy(() => import('../pages/admin/ManageMenu/ManageMenu'));
const ManageOffers = lazy(() => import('../pages/admin/ManageOffers/ManageOffers'));
const ManageTestimonials = lazy(
  () => import('../pages/admin/ManageTestimonials/ManageTestimonials'),
);
const Messages = lazy(() => import('../pages/admin/Messages/Messages'));

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="admin"
        element={
          <AdminRoute>
            <Suspense fallback={<Loader fullPage />}>
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="reservations" element={<ManageReservations />} />
        <Route path="menu" element={<ManageMenu />} />
        <Route path="offers" element={<ManageOffers />} />
        <Route path="testimonials" element={<ManageTestimonials />} />
        <Route path="messages" element={<Messages />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="study-space" element={<StudySpace />} />
        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="reserve" element={<Reservation />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
