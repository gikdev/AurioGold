import { Route } from "react-router"
import Balance from "../pages/Balance"
import Customers from "../pages/Customers"
import GroupsGram from "../pages/GroupsGram"
import GroupsNumeric from "../pages/GroupsNumeric"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import NotFound from "../pages/NotFound"
import OnlineUsers from "../pages/OnlineUsers"
import Orders from "../pages/Orders"
import PriceSources from "../pages/PriceSources"
import Products from "../pages/Products"
import Profile from "../pages/Profile"
import routes from "../pages/routes"
import SendSms from "../pages/SendSms"
import Settings from "../pages/Settings"
import Test from "../pages/Test"

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
