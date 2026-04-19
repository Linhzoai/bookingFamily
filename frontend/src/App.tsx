import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './routes/route';
import ProtectedRoute from './components/ProtectedRouter/ProtectedRoute';
import Layout from './components/Layout/Layout';
import AuthRoute from '@components/ProtectedRouter/AuthRoute.tsx';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FormCommon from './components/FormCommon/FormCommon';
import { useSideBarStore } from './stores/useSidebarStore';

const queryClient = new QueryClient();
function App() {
    const {isOpen} = useSideBarStore();
    return (
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Suspense fallback={<div>Đang tải...</div>}>
            {isOpen && <FormCommon/>}
                <Routes>
                    <Route element={<AuthRoute />}>
                        {routes.publicRoutes.map((route, index) => (
                            <Route key={index} path={route.path} element={<route.component />} />
                        ))}
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />}>
                            {routes.privateRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={<route.component />} />
                            ))}
                        </Route>
                    </Route>
                </Routes>
                <ToastContainer position='top-right' autoClose={2000} />
            </Suspense>
        </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
