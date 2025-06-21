import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider';
import LoginPage from '../Pages/Login/Login';
import RegisterPage from '../Pages/Register/Register';
import ConfirmationPage from '../Pages/Confirmation/Confirmation';
import ConfirmationAccountPage from '../Pages/Confirmation/Account';
import App from '../App';
import Layout from '../layout/Main';


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
            { path: '/layout', element: <Layout/> },
            {
                element: <Layout/>,
                children: [
                    { index: true, element: <App/> },

                ]
            }
        ]
    }
]);

const AppRouter = () => <RouterProvider router={router}/>

export default AppRouter