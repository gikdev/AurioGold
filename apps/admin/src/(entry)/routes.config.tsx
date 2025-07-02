import { lazy } from "react"
import { Route } from "react-router"
import routes from "../pages/routes"

// Lazy load components for better code splitting
const Home = lazy(() => import("../pages/Home"))
const Profile = lazy(() => import("../pages/Profile"))
const SendSms = lazy(() => import("../pages/SendSms"))
const Customers = lazy(() => import("../pages/Customers"))
const GroupsGram = lazy(() => import("../pages/GroupsGram"))
const GroupsNumeric = lazy(() => import("../pages/GroupsNumeric"))
const OnlineUsers = lazy(() => import("../pages/OnlineUsers"))
const PriceSources = lazy(() => import("../pages/PriceSources"))
const Balance = lazy(() => import("../pages/Balance"))
const Orders = lazy(() => import("../pages/Orders"))
const Products = lazy(() => import("../pages/Products"))
const Settings = lazy(() => import("../pages/Settings"))
const Test = lazy(() => import("../pages/Test"))
const Login = lazy(() => import("../pages/Login"))
const Logout = lazy(() => import("../pages/Logout"))
const NotFound = lazy(() => import("../pages/NotFound"))

// Protected routes that require authentication
export const protectedRoutes = [
  <Route key="home" index element={<Home />} />,
  <Route key="profile" path={routes.profile} element={<Profile />} />,
  <Route key="sendSms" path={routes.sendSms} element={<SendSms />} />,
  <Route key="customers" path={routes.customers} element={<Customers />} />,
  <Route key="groupsGram" path={routes.groupsGram} element={<GroupsGram />} />,
  <Route key="groupsNumeric" path={routes.groupsNumeric} element={<GroupsNumeric />} />,
  <Route key="onlineUsers" path={routes.onlineUsers} element={<OnlineUsers />} />,
  <Route key="priceSources" path={routes.priceSources} element={<PriceSources />} />,
  <Route key="balance" path={routes.balance} element={<Balance />} />,
  <Route key="orders" path={routes.orders} element={<Orders />} />,
  <Route key="products" path={routes.products} element={<Products />} />,
  <Route key="settings" path={routes.settings} element={<Settings />} />,
  <Route key="test" path={routes.test} element={<Test />} />,
]

// Public routes
export const publicRoutes = [
  <Route key="login" path={routes.login} element={<Login />} />,
  <Route key="logout" path={routes.logout} element={<Logout />} />,
  <Route key="notFound" path="*" element={<NotFound />} />,
]
