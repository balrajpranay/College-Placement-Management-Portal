/**
 * Campus Connect — Core UI & Interaction System
 * Production-ready, accessible, professional product scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebar();
  initModals();
  initToastSystem();
  initFlashMessages();
  initNotifPolling();
  initConfirmForms();
  initDemoCredentials();
  initFormLoaders();
});

/* --------------------------------------------------------------------------
   Toast Notification System
   -------------------------------------------------------------------------- */
const CampusToast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.querySelector(".toast-container");
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.className = "toast-container";
        this.container.setAttribute("role", "status");
        this.container.setAttribute("aria-live", "polite");
        document.body.appendChild(this.container);
      }
    }
  },

  show(options = {}) {
    this.init();
    const {
      title = "",
      message = "",
      type = "info", // success, danger, warning, info
      duration = 4500
    } = typeof options === "string" ? { message: options } : options;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      danger: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0096FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${escapeHtml(title)}</div>` : ""}
        <div class="toast-body">${escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    const dismiss = () => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 220);
    };

    closeBtn.addEventListener("click", dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    this.container.appendChild(toast);
    return toast;
  }
};

window.toast = (msg, type = "info") => CampusToast.show({ message: msg, type });

/* --------------------------------------------------------------------------
   Flash Messages to Toasts Bridge
   -------------------------------------------------------------------------- */
function initFlashMessages() {
  document.querySelectorAll(".flash-msg-data").forEach((el) => {
    const category = el.dataset.category || "info";
    const message = el.dataset.message || el.textContent.trim();
    if (message) {
      const typeMap = {
        success: "success",
        error: "danger",
        danger: "danger",
        warning: "warning",
        info: "info"
      };
      CampusToast.show({
        message,
        type: typeMap[category] || "info",
        duration: 5000
      });
    }
    el.remove();
  });
}

function initToastSystem() {
  CampusToast.init();
}

/* --------------------------------------------------------------------------
   Sidebar & Mobile Navigation
   -------------------------------------------------------------------------- */
function initSidebar() {
  const hamburger = document.querySelector(".hamburger, #sidebar-toggle-btn, .topbar-menu-toggle");
  const sidebar = document.querySelector(".sidebar, .app-sidebar, #app-sidebar");
  let overlay = document.querySelector(".sidebar-overlay, .sidebar-backdrop, #sidebar-backdrop");

  if (!overlay && sidebar) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay sidebar-backdrop";
    document.body.appendChild(overlay);
  }

  function closeSidebar() {
    sidebar && sidebar.classList.remove("open");
    overlay && overlay.classList.remove("open");
  }

  function openSidebar() {
    sidebar && sidebar.classList.add("open");
    overlay && overlay.classList.add("open");
  }

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });
}

/* --------------------------------------------------------------------------
   Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggles = document.querySelectorAll(".theme-toggle-btn, #global-theme-toggle, #dashboard-theme-toggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("campus_theme", theme);
  }

  // Read initial theme
  const currentTheme = localStorage.getItem("campus_theme") || document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(currentTheme);

  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = active === "dark" ? "light" : "dark";
      applyTheme(nextTheme);

      // Asynchronously update server session
      fetch("/api/theme/toggle", { method: "POST" }).catch(() => {});
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const sun = document.querySelector("#icon-sun");
  const moon = document.querySelector("#icon-moon");

  if (sun && moon) {
    if (theme === "dark") {
      sun.style.display = "none";
      moon.style.display = "block";
    } else {
      sun.style.display = "block";
      moon.style.display = "none";
    }
  }
}

/* --------------------------------------------------------------------------
   Accessible Modals
   -------------------------------------------------------------------------- */
function initModals() {
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-open-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("open");
        const firstInput = modal.querySelector("input, select, textarea, button:not([data-close-modal])");
        if (firstInput) firstInput.focus();
      }
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const backdrop = btn.closest(".modal-backdrop");
      if (backdrop) backdrop.classList.remove("open");
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
    }
  });
}

/* --------------------------------------------------------------------------
   Confirmation Handlers
   -------------------------------------------------------------------------- */
function initConfirmForms() {
  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const message = form.getAttribute("data-confirm") || "Are you sure you want to proceed?";
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Form Loaders (Double-submit protection)
   -------------------------------------------------------------------------- */
function initFormLoaders() {
  document.querySelectorAll("form").forEach((form) => {
    if (form.getAttribute("data-no-loader") !== null) return;
    form.addEventListener("submit", () => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !submitBtn.disabled) {
        setTimeout(() => {
          submitBtn.style.opacity = "0.7";
          submitBtn.style.pointerEvents = "none";
        }, 50);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Demo Credentials Quick-Filler
   -------------------------------------------------------------------------- */
function initDemoCredentials() {
  window.fillCredentials = (role, email, password) => {
    const roleInput = document.querySelector('input[name="role"]');
    const emailInput = document.querySelector('input[name="email"]');
    const passInput = document.querySelector('input[name="password"]');

    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = password;

    if (role) {
      const roleLink = document.querySelector(`.role-toggle a[href*="role=${role}"]`);
      if (roleLink && !roleLink.classList.contains("active")) {
        window.location.href = roleLink.href;
      }
    }

    CampusToast.show({
      title: "Demo Credentials Filled",
      message: `Loaded credentials for ${role || 'user'}`,
      type: "info",
      duration: 2500
    });
  };
}

/* --------------------------------------------------------------------------
   Notification Polling
   -------------------------------------------------------------------------- */
function initNotifPolling() {
  const badge = document.querySelector("#notif-badge");
  if (!badge) return;

  async function poll() {
    try {
      const res = await fetch("/api/notifications/poll");
      if (!res.ok) return;
      const data = await res.json();
      if (badge) {
        badge.style.display = data.count > 0 ? "block" : "none";
      }
    } catch (e) {
      // Background poll fail is non-critical
    }
  }

  // Initial poll and recurring every 30s
  poll();
  setInterval(poll, 30000);
}

/* --------------------------------------------------------------------------
   Fast Client-side Table & Card Filtering
   -------------------------------------------------------------------------- */
window.liveFilterTable = function(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();
    table.querySelectorAll("tbody tr").forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? "" : "none";
    });
  });
};

window.liveFilterCards = function(inputId, containerId, cardSelector) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();
    container.querySelectorAll(cardSelector).forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? "" : "none";
    });
  });
};

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
