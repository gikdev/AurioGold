import { lazy } from "react"
import { Route } from "react-router"
import routes from "../pages/routes"

// const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("../pages/About"))
const Balance = lazy(() => import("../pages/Balance"))
const Login = lazy(() => import("../pages/Login"))
const Logout = lazy(() => import("../pages/Logout"))
const NotFound = lazy(() => import("../pages/NotFound"))
const Orders = lazy(() => import("../pages/Orders"))
const Products = lazy(() => import("../pages/Products"))
const Profile = lazy(() => import("../pages/Profile"))
const Rules = lazy(() => import("../pages/Rules"))
const Settings = lazy(() => import("../pages/Settings"))
const Test = lazy(() => import("../pages/Test"))
const Trade = lazy(() => import("../pages/Trade"))

// Protected routes that require authentication
export const protectedRoutes = [
  <Route key="home" index element={<Products />} />,
  <Route key="trade" path={routes.trade} element={<Trade />} />,
  <Route key="profile" path={routes.profile} element={<Profile />} />,
  <Route key="balance" path={routes.balance} element={<Balance />} />,
  <Route key="orders" path={routes.orders} element={<Orders />} />,
  <Route key="about" path={routes.about} element={<About />} />,
  <Route key="rules" path={routes.rules} element={<Rules />} />,
  <Route key="settings" path={routes.settings} element={<Settings />} />,
  <Route key="test" path={routes.test} element={<Test />} />,
]

// Public routes
export const publicRoutes = [
  <Route key="login" path={routes.login} element={<Login />} />,
  <Route key="logout" path={routes.logout} element={<Logout />} />,
  <Route key="notFound" path="*" element={<NotFound />} />,
]
