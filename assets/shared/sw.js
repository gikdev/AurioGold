const handleInstall = () => self.skipWaiting()
const handleActivation = () => self.clients.claim()

self.addEventListener("install", handleInstall)
self.addEventListener("activate", handleActivation)
