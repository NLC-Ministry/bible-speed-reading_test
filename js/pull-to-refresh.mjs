const REFRESH_THRESHOLD = 110;
const MAX_PULL_DISTANCE = 140;
const RESET_DELAY_MS = 450;

export function installPullToRefresh({
  window,
  document,
  fallbackRefresh = () => window.location.reload()
} = {}) {
  if (!window || !document || window.__nlcPullToRefreshInstalled) {
    return () => {};
  }

  window.__nlcPullToRefreshInstalled = true;

  let refreshHandler = null;
  let startPoint = null;
  let pullDistance = 0;
  let status = "idle";
  let hasVibratedThisPull = false;

  const indicator = document.createElement("div");
  indicator.className = "pull-to-refresh-status";
  indicator.setAttribute("aria-live", "polite");
  indicator.setAttribute("aria-atomic", "true");
  
  // Set up inner structure with SVG and text
  indicator.innerHTML = `
    <div class="pull-to-refresh-icon">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <!-- Arrow Icon (Pulling / Ready) -->
        <g class="ptr-icon-arrow">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </g>
        <!-- Spinner Icon (Refreshing) -->
        <g class="ptr-icon-spinner">
          <path d="M21 12a9 9 0 0 1-9 9m-9-9a9 9 0 0 1 9-9"></path>
        </g>
        <!-- Checkmark Icon (Done) -->
        <g class="ptr-icon-check">
          <polyline points="20 6 9 17 4 12"></polyline>
        </g>
      </svg>
    </div>
    <span class="pull-to-refresh-text">下拉更新</span>
  `;
  
  document.body.appendChild(indicator);
  const textSpan = indicator.querySelector(".pull-to-refresh-text");

  function isPullToRefreshAllowed(target) {
    if (window.appRouter && window.appRouter.currentTab && window.appRouter.currentTab !== "dashboard-view" && window.appRouter.currentTab !== "plan-view") {
      return false;
    }
    const openModals = document.querySelectorAll(
      '.bottom-sheet-backdrop:not(.hidden), .modal:not(.hidden), .dialog:not(.hidden), [role="dialog"]:not(.hidden), .overlay:not(.hidden)'
    );
    if (openModals.length > 0) return false;
    if (target && typeof target.closest === "function") {
      if (
        target.closest('.bottom-sheet') ||
        target.closest('.modal') ||
        target.closest('.dialog') ||
        target.closest('.overlay') ||
        target.closest('.scrollable-container') ||
        target.closest('#reader-view') ||
        target.closest('#admin-view')
      ) {
        return false;
      }
    }
    return true;
  }

  function render(nextStatus = status) {
    status = nextStatus;
    indicator.dataset.status = status;
    indicator.style.setProperty("--pull-distance", `${Math.max(0, pullDistance - 48)}px`);
    
    const textContent = status === "ready"
      ? "放開更新"
      : status === "refreshing"
        ? "更新中"
        : status === "done"
          ? "已更新"
          : "下拉更新";

    if (textSpan) {
      textSpan.textContent = textContent;
    } else {
      indicator.textContent = textContent;
    }
  }

  window.registerPullToRefresh = handler => {
    const previousHandler = refreshHandler;
    refreshHandler = handler;

    return () => {
      if (refreshHandler === handler) {
        refreshHandler = previousHandler;
      }
    };
  };

  async function refresh() {
    if (status === "refreshing") return;

    pullDistance = REFRESH_THRESHOLD;
    render("refreshing");

    try {
      await (refreshHandler || fallbackRefresh)();
      render("done");
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([10, 45, 10]);
        } catch (e) {
          // Ignore
        }
      }
    } catch (error) {
      console.error("[PullToRefresh] Refresh failed:", error);
      render("idle");
    } finally {
      window.setTimeout(() => {
        pullDistance = 0;
        render("idle");
      }, RESET_DELAY_MS);
    }
  }

  function onTouchStart(event) {
    if (window.scrollY > 0 || status === "refreshing" || !isPullToRefreshAllowed(event.target)) {
      startPoint = null;
      return;
    }

    const touch = event.touches && event.touches[0];
    startPoint = touch ? { x: touch.clientX, y: touch.clientY } : null;
    hasVibratedThisPull = false;
  }

  function onTouchMove(event) {
    const touch = event.touches && event.touches[0];
    if (!startPoint || !touch || window.scrollY > 0) return;

    const deltaY = touch.clientY - startPoint.y;
    const deltaX = Math.abs(touch.clientX - startPoint.x);
    if (deltaY <= 0 || deltaX > deltaY) return;

    event.preventDefault();
    
    // Apply logarithmic damping for smooth resistance
    const rawPull = deltaY;
    const startDamping = 90;
    let computedDistance = 0;
    if (rawPull <= startDamping) {
      computedDistance = rawPull;
    } else {
      const excess = rawPull - startDamping;
      const dampingFactor = 100;
      computedDistance = startDamping + dampingFactor * Math.log1p(excess / dampingFactor);
    }
    
    pullDistance = Math.min(computedDistance, MAX_PULL_DISTANCE);
    
    const nextStatus = pullDistance >= REFRESH_THRESHOLD ? "ready" : "pulling";
    
    // Vibrate once on crossing threshold
    if (nextStatus === "ready") {
      if (!hasVibratedThisPull) {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          try {
            navigator.vibrate(12);
          } catch (e) {
            // Ignore
          }
        }
        hasVibratedThisPull = true;
      }
    } else {
      hasVibratedThisPull = false;
    }
    
    render(nextStatus);
  }

  function onTouchEnd() {
    if (!startPoint) return;
    startPoint = null;

    if (pullDistance >= REFRESH_THRESHOLD) {
      refresh();
    } else {
      pullDistance = 0;
      render("idle");
    }
  }

  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);
  window.addEventListener("touchcancel", onTouchEnd);

  return () => {
    window.__nlcPullToRefreshInstalled = false;
    delete window.registerPullToRefresh;
    indicator.remove();
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  };
}
