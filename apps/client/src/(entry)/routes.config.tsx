import { Route } from "react-router"
import Transactions from "#/pages/Transactions"
import About from "../pages/About"
import Balance from "../pages/Balance"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import NotFound from "../pages/NotFound"
import Orders from "../pages/Orders"
import Products from "../pages/Products"
import Profile from "../pages/Profile"
import Rules from "../pages/Rules"
import routes from "../pages/routes"
import Settings from "../pages/Settings"
import Test from "../pages/Test"
import Trade from "../pages/Trade"

// Protected routes that require authentication
export const protectedRoutes = [
  <Route key="home" index element={<Products />} />,
  <Route key="trade" path={routes.tradeById(":id")} element={<Trade />} />,
  <Route key="profile" path={routes.profile} element={<Profile />} />,
  <Route key="balance" path={routes.balance} element={<Balance />} />,
  <Route key="orders" path={routes.orders} element={<Orders />} />,
  <Route key="transactions" path={routes.transactions} element={<Transactions />} />,
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
