// src/serviceWorkerRegistration.js
export function register() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("✅ Service Worker 註冊成功", reg);
          })
          .catch((err) => {
            console.log("❌ Service Worker 註冊失敗", err);
          });
      });
    }
  }
  