// Bible Speed Reading Gamification: Achievements, Fireworks, and Honor Badges

const ACHIEVEMENTS = [
  {
    id: "subscribe_plan",
    title: "開啟新旅程",
    description: "成功加入一個讀經計畫",
    triggerText: "加入任一讀經計畫後解鎖",
    iconKey: "calendarPlus"
  },
  {
    id: "streak_30",
    title: "持之以恆",
    description: "連續打卡 30 天",
    triggerText: "連續打卡 30 天後解鎖",
    iconKey: "calendarCheck"
  },
  {
    id: "complete_plan",
    title: "榮譽桂冠",
    description: "100% 完成任意一個讀經計畫",
    triggerText: "100% 完成任一讀經計畫後解鎖",
    iconKey: "award"
  },
  {
    id: "share_verse",
    title: "傳遞愛光芒",
    description: "分享一次今日經文",
    triggerText: "分享一次今日經文後解鎖",
    iconKey: "share"
  },
  {
    id: "read_all_bible",
    title: "展開厚聖經",
    description: "讀完全本聖經所有卷書與章節",
    triggerText: "讀完全本聖經 1189 章後解鎖",
    iconKey: "bookOpen"
  },
  {
    id: "badge_cat1",
    title: "摩西五經勳章",
    description: "完成「摩西五經」一個月的讀經挑戰",
    triggerText: "完成摩西五經計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat1"
  },
  {
    id: "badge_cat2",
    title: "歷史書勳章",
    description: "完成「歷史書」一個月的讀經挑戰",
    triggerText: "完成歷史書計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat2"
  },
  {
    id: "badge_cat3",
    title: "詩歌智慧書勳章",
    description: "完成「詩歌智慧書」一個月的讀經挑戰",
    triggerText: "完成詩歌智慧書計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat3"
  },
  {
    id: "badge_cat4",
    title: "大先知書勳章",
    description: "完成「大先知書」一個月的讀經挑戰",
    triggerText: "完成大先知書計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat4"
  },
  {
    id: "badge_cat5",
    title: "小先知書勳章",
    description: "完成「小先知書」一個月的讀經挑戰",
    triggerText: "完成小先知書計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat5"
  },
  {
    id: "badge_cat6",
    title: "福音書+徒勳章",
    description: "完成「福音書+徒」一個月的讀經挑戰",
    triggerText: "完成福音書+徒計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat6"
  },
  {
    id: "badge_cat7",
    title: "保羅書信一勳章",
    description: "完成「保羅書信一」一個月的讀經挑戰",
    triggerText: "完成保羅書信一計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat7"
  },
  {
    id: "badge_cat8",
    title: "保羅書信二勳章",
    description: "完成「保羅書信二」一個月的讀經挑戰",
    triggerText: "完成保羅書信二計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat8"
  },
  {
    id: "badge_cat9",
    title: "普通書信+啟勳章",
    description: "完成「普通書信+啟」一個月的讀經挑戰",
    triggerText: "完成普通書信+啟計畫後解鎖",
    iconKey: "award",
    categoryKey: "cat9"
  }
];

const BADGE_UNLOCK_LEVELS = {
  subscribe_plan: 1,
  streak_30: 30,
  complete_plan: 1,
  share_verse: 1,
  read_all_bible: 1189
};

function formatBadgeUnlockDate(date) {
  const d = date || new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function recordBadgeUnlockDate(badgeId) {
  const level = BADGE_UNLOCK_LEVELS[badgeId];
  if (!level) return;
  const key = `date_unlocked_${badgeId}_lvl_${level}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, formatBadgeUnlockDate());
  }
}

function refreshBadgeSurfaces() {
  if (typeof renderBadgeWall === "function") {
    renderBadgeWall("badges-grid");
  }
  if (typeof renderBadgeStrip === "function") {
    renderBadgeStrip("dashboard-badge-strip", { linkToProfile: true });
    renderBadgeStrip("plan-badge-strip");
  }
}

// Check achievements and trigger popup if newly unlocked
async function checkAchievements() {
  if (typeof window.syncRoundBadges === "function") {
    window.syncRoundBadges();
  }
  const unlocked = JSON.parse(localStorage.getItem("unlocked_badges") || "[]");
  const newlyUnlocked = [];

  if (state.activePlan && !unlocked.includes("subscribe_plan")) {
    newlyUnlocked.push("subscribe_plan");
  }

  const currentStreak = (state.currentUser && state.currentUser.streak) || 0;
  if (currentStreak >= 30 && !unlocked.includes("streak_30")) {
    newlyUnlocked.push("streak_30");
  }

  if (state.activePlan && state.activePlan.days) {
    const allDone = state.activePlan.days.every(d => d.chapters.every(ch => ch.isRead));
    if (allDone && !unlocked.includes("complete_plan")) {
      newlyUnlocked.push("complete_plan");
    }
  }

  const isShared = localStorage.getItem("has_shared_verse") === "true" ||
    localStorage.getItem("badge_share_verse_unlocked") === "true";
  if (isShared && !unlocked.includes("share_verse")) {
    newlyUnlocked.push("share_verse");
  }

  if (state.readingLogs) {
    const uniqueChapters = new Set();
    state.readingLogs.forEach(l => {
      uniqueChapters.add(`${l.book}_${l.chapter}`);
    });
    if (uniqueChapters.size >= 1189 && !unlocked.includes("read_all_bible")) {
      newlyUnlocked.push("read_all_bible");
    }
  }

  // Check category achievements
  if (typeof window.getCategoryCompletedRounds === "function") {
    for (let i = 1; i <= 9; i++) {
      const catKey = `cat${i}`;
      const badgeId = `badge_cat${i}`;
      const rounds = window.getCategoryCompletedRounds(catKey);
      if (rounds > 0 && !unlocked.includes(badgeId)) {
        newlyUnlocked.push(badgeId);
      }
    }
  }

  if (newlyUnlocked.length === 0) return;

  const updatedUnlocked = [...unlocked, ...newlyUnlocked];
  localStorage.setItem("unlocked_badges", JSON.stringify(updatedUnlocked));

  newlyUnlocked.forEach(function (badgeId, index) {
    recordBadgeUnlockDate(badgeId);
    if (index === 0 && typeof window.triggerBadgeUnlockNotification === "function") {
      const badge = ACHIEVEMENTS.find(a => a.id === badgeId);
      if (badge) {
        window.triggerBadgeUnlockNotification(badgeId, badge.title);
      }
    } else {
      localStorage.setItem(`notified_${badgeId}`, "true");
    }
  });

  refreshBadgeSurfaces();
}

// Particle system Canvas Fireworks
function launchFireworks() {
  const canvas = document.createElement("canvas");
  canvas.id = "fireworks-canvas";
  canvas.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 99999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeHandler);

  const particles = [];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 6 + 2;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.gravity = 0.06;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.random() * 2 + 2, 0, Math.PI * 2);
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function createExplosion(x, y) {
    const colors = ["#ff5252", "#ffeb3b", "#00e676", "#2979ff", "#e040fb", "#ff9100", "#18ffff"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  let frameCount = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (frameCount % 25 === 0) {
      createExplosion(
        Math.random() * width * 0.8 + width * 0.1,
        Math.random() * height * 0.5 + height * 0.15
      );
    }
    frameCount++;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    if (frameCount < 160) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.transition = "opacity 0.8s ease";
      canvas.style.opacity = "0";
      setTimeout(() => {
        canvas.remove();
        window.removeEventListener("resize", resizeHandler);
      }, 800);
    }
  }

  animate();
}

function renderUnlockedBadgesWall() {
  if (typeof renderBadgeStrip === "function") {
    renderBadgeStrip("plan-badge-strip");
  }
}

window.triggerBadgeUnlockNotification = function(badgeId, badgeName) {
  const hasNotified = localStorage.getItem(`notified_${badgeId}`) === "true" ||
    localStorage.getItem("notified_badge-share") === "true";
  if (hasNotified) return;

  const isDark = state.theme === "dark" || document.body.classList.contains("dark-theme");

  const unlocked = JSON.parse(localStorage.getItem("unlocked_badges") || "[]");
  if (!unlocked.includes(badgeId)) {
    unlocked.push(badgeId);
    localStorage.setItem("unlocked_badges", JSON.stringify(unlocked));
  }

  recordBadgeUnlockDate(badgeId);

  const badge = ACHIEVEMENTS.find(a => a.id === badgeId) || {
    id: badgeId,
    title: badgeName,
    description: `恭喜解鎖：${badgeName}`,
    triggerText: `完成條件後解鎖「${badgeName}」`,
    iconKey: "share"
  };

  const page = document.getElementById("badge-detail-page");
  if (page) {
    page.classList.remove("hidden");
  }
  if (typeof window.openBadgeDetailPage === "function") {
    window.openBadgeDetailPage(badge, true, isDark);
  }

  if (typeof launchFireworks === "function") {
    launchFireworks();
  }

  localStorage.setItem(`notified_${badgeId}`, "true");
  if (badgeId === "share_verse" || badgeId === "badge-share") {
    localStorage.setItem("notified_badge-share", "true");
  }
  localStorage.setItem(`${badgeId}_unlocked`, "true");

  refreshBadgeSurfaces();
};

window.getCategoryCompletedRounds = function(catKey) {
  let maxCompleted = 0;
  
  const backupVal = parseInt(localStorage.getItem(`cat_completed_rounds_${catKey}`) || "0");
  maxCompleted = Math.max(maxCompleted, backupVal);

  if (state.activePlans) {
    state.activePlans.forEach(plan => {
      const pk = plan.presetKey || "";
      if (pk.endsWith(`_${catKey}`) || pk === catKey) {
        const completedOfThisPlan = (plan.progress >= 100) ? (plan.currentRound || 1) : ((plan.currentRound || 1) - 1);
        if (completedOfThisPlan > maxCompleted) {
          maxCompleted = completedOfThisPlan;
        }
      }
    });
  }
  return maxCompleted;
};

window.syncRoundBadges = function() {
  // Deprecated round-based badges in favor of category-based badges with stars.
};

window.refreshBadgeSurfaces = refreshBadgeSurfaces;
window.launchFireworks = launchFireworks;
window.renderUnlockedBadgesWall = renderUnlockedBadgesWall;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.BADGE_UNLOCK_LEVELS = BADGE_UNLOCK_LEVELS;
window.checkAchievements = checkAchievements;
window.recordBadgeUnlockDate = recordBadgeUnlockDate;

