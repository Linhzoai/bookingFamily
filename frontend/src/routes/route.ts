import Auth from "../pages/Auth/Auth";
import Dashboard from "../pages/Dashboard/Dashboard";

interface Route{
    path: string,
    component: React.ComponentType
}

const privateRoutes: Route[] = [
    {path: '/', component: Dashboard}
]

const publicRoutes: Route[] = [
    {path: '/auth', component: Auth},
]

export default {privateRoutes, publicRoutes}