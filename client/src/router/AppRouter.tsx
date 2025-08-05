import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider';
import LoginPage from '@/Pages/Login/Login';
import RegisterPage from '@/Pages/Register/Register';
import ConfirmationPage from '@/Pages/Confirmation/Confirmation';
import ConfirmationAccountPage from '@/Pages/Confirmation/Account';
import ProfilePage from '@/Pages/Profile/Profile';
import Layout from '@/layout/Main';
import PrivacyPolicy from '@/Pages/PrivacyPolicy/PrivacyPolicy'
import SearchPage from '@/Pages/Search/SearchPage';
import HomePage from '@/Pages/Home/HomePage';
import BookDetailPage from '@/Pages/BookDetail/BookDetailPage';

const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <Outlet/>
            </AuthProvider>
        ),
        children: [
            { path: '/register', element: <RegisterPage/> },
            { path: '/login', element: <LoginPage/> },
            { path: "/confirmation",element: <ConfirmationPage/>},
            { path: "/confirm-account",element: <ConfirmationAccountPage/>},
            { path: "/privacy-policy", element: <PrivacyPolicy/> },
            {
                element: <Layout/>,
                children: [
                    { index: true, element: <HomePage/> },
                    { path: "/profile", element: <ProfilePage/> },
                    { path: "/search", element: <SearchPage/> },
                    { path: "/books/:id", element: <BookDetailPage/> },
                    //{ path: "/books", element: <BooksPage/> },
                ]
            }
        ]
    }
]);

const AppRouter = () => <RouterProvider router={router}/>

export default AppRouter;