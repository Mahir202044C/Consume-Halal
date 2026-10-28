// ConsumeHalal — ~2KB. Theme + OS-detect hero buttons.
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  // theme init
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    root.setAttribute("data-theme", "dark");

  if (toggle)
    toggle.addEventListener("click", () => {
      const dark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", dark ? "light" : "dark");
      localStorage.setItem("theme", dark ? "light" : "dark");
    });

  // OS-detect hero buttons
  const ua = navigator.userAgent.toLowerCase();
  const btnDesk = document.getElementById("btn-desktop");
  const btnMob = document.getElementById("btn-mobile");

  function setLabel(el, os, pkg) {
    if (!el) return;
    el.innerHTML = `Download for ${os} <span class="pkg">${pkg}</span>`;
  }

  if (ua.includes("win")) {
    setLabel(btnDesk, "Windows", ".exe / .msi");
    setLabel(btnMob, "Windows", ".exe / .msi");
  } else if (ua.includes("mac")) {
    setLabel(btnDesk, "macOS", ".dmg");
    setLabel(btnMob, "macOS", ".dmg");
  } else if (ua.includes("android")) {
    setLabel(btnDesk, "Android", ".apk");
    setLabel(btnMob, "Android", ".apk");
  } else if (/iphone|ipad|ipod/.test(ua)) {
    setLabel(btnDesk, "iOS", "TestFlight");
    setLabel(btnMob, "iOS", "TestFlight");
  } else if (ua.includes("linux")) {
    setLabel(btnDesk, "Linux", ".deb / .AppImage");
    setLabel(btnMob, "Linux", ".deb / .AppImage");
  }
})();
