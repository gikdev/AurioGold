Yes, you **can use page animations in React Router** by combining it with **Framer Motion**'s `AnimatePresence`. Here's a **simple setup** that works with `react-router-dom@6+`.

---

### ✅ 1. Wrap your routes with `<AnimatePresence>`

```tsx
// App.tsx or Routes.tsx
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { motionPresets } from "./motionPresets"
import Home from "./pages/Home"
import About from "./pages/About"

export default function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route
          path="/"
          element={
            <motion.div {...motionPresets.pageFade}>
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div {...motionPresets.slideLeft}>
              <About />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}
```

---

### ✅ 2. Place `<AnimatedRoutes />` in your main layout

```tsx
// index.tsx or AppShell.tsx
import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "./AnimatedRoutes"

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
```

---

### 🧠 Tips

* `key={location.pathname}` is **required** to trigger exit animations when route changes.
* `AnimatePresence` must wrap the **`Routes`** component (or something keyed inside it).
* Works best if your motion wrapper (`motion.div`) is around the **entire page content**.

---

Would you like a version that includes layout transitions (like a sliding drawer or header/footer staying fixed)?
