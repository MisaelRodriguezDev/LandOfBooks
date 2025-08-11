import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import LoginPage from '@/Pages/Login/Login';
import RegisterPage from '@/Pages/Register/Register';
import ConfirmationPage from '@/Pages/Confirmation/Confirmation';
import ConfirmationAccountPage from '@/Pages/Confirmation/Account';
import ProfilePage from '@/Pages/Profile/Profile';
import Layout from '@/layout/Main';
import PrivacyPolicy from '@/Pages/PrivacyPolicy/PrivacyPolicy';
import SearchPage from '@/Pages/Search/SearchPage';
import HomePage from '@/Pages/Home/HomePage';
import BookDetailPage from '@/Pages/BookDetail/BookDetailPage';
import LoadingScreen from '@/components/ui/LoadingScreen/LoadingScreen';
import ProtectedRoute from './ProtectedRoute';
import UsersManagment from '@/Pages/Administration/Admin/Users/User';
import GenresManagment from '@/Pages/Administration/Librarian/Genres/Genres';
import PublishersManagment from '@/Pages/Administration/Librarian/Publishers/Publishers';
import AuthorsManagment from '@/Pages/Administration/Librarian/Authors/Authors';
import BooksManagement from '@/Pages/Administration/Librarian/Books/Books';
import BookCopiesManagement from '@/Pages/Administration/Librarian/Copies/Copies';

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/confirmation', element: <ConfirmationPage /> },
      { path: '/confirm-account', element: <ConfirmationAccountPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'books/:id', element: <BookDetailPage /> },
          { path: 'loading', element: <LoadingScreen /> },

          // Rutas protegidas solo para usuarios autenticados (sin restricción de rol)
          {
            element: <ProtectedRoute />,
            children: [
              { path: 'profile', element: <ProfilePage /> },
            ],
          },

          // Rutas protegidas para bibliotecarios y admins
          {
            path: 'dashboard',
            element: <ProtectedRoute allowedRoles={['librarian', 'admin']} />,
            children: [
              // Aquí dentro, path '' (index) o rutas específicas de dashboard si las tienes
              { path: 'genres', element: <GenresManagment /> },
              { path: 'publishers', element: <PublishersManagment /> },
              { path: 'authors', element: <AuthorsManagment /> },
              { path: 'books', element: <BooksManagement /> },
              { path: 'copies', element: <BookCopiesManagement/> },
              
              // Rutas protegidas solo para admins
              {
                element: <ProtectedRoute allowedRoles={['admin']} />,
                children: [
                  { path: 'users', element: <UsersManagment /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
