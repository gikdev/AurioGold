export const registerServiceWorker = () => {
  if (typeof window === "undefined") return
  if (!navigator || !("serviceWorker" in navigator)) return

  window.addEventListener("DOMContentLoaded", () => {
    navigator.serviceWorker
      .register("/shared/sw.js")
      .then(registration => {
        console.log("SW registered: ", registration)
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
