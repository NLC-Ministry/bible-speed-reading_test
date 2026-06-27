// Dashboard tab view controller

const DAILY_VERSES = [
  { text: "「神的話是我腳前的燈，是我路上的光。」", source: "詩篇 119:105" },
  { text: "「但那等候耶和華的，必重新得力。他們必如鷹展翅上騰，他們奔跑卻不困倦，行走卻不疲乏。」", source: "以賽亞書 40:31" },
  { text: "「你要專心仰賴耶和華，不可倚靠自己的聰明，在你一切所行的事上都要認定他，他必指引你的路。」", source: "箴言 3:5-6" },
  { text: "「我將這些事告訴你們，是要叫你們在我裡面有平安。在世上你們有苦難，但你們可以放心，我已經勝了世界。」", source: "約約翰福音 16:33" },
  { text: "「耶和華是我的牧者，我必不致缺乏。」", source: "詩篇 23:1" },
  { text: "「應當一無掛慮，只要凡事藉著禱告、祈求和感謝，將你們所要的告訴神。神所賜出人意外的平安，必在基督耶穌裡保守你們的心懷意念。」", source: "腓立比書 4:6-7" },
  { text: "「我們曉得萬事都互相效力，叫愛神的人得益處，就是按他旨意被召的人。」", source: "羅馬書 8:28" },
  { text: "「所以，不要為明天憂慮，因為明天自有明天的憂慮；一天的難處一天當就夠了。」", source: "馬太福音 6:34" },
  { text: "「我靠著那加給我力量的，凡事都能做。」", source: "腓立比書 4:13" },
  { text: "「大山可以挪開，小山可以遷移，但我的慈愛必不離開你，我平安的盟約也不遷移。這是憐恤你的耶和華說的。」", source: "以賽亞書 54:10" },
  { text: "「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的不致滅亡，反得永生。」", source: "約翰福音 3:16" },
  { text: "「你們要先求他的國和他的義，這些東西都要加給你們了。」", source: "馬太福音 6:33" },
  { text: "「你不要害怕，因為我與你同在；不要驚惶，因為我是你的神。我必堅固你，我必幫助你，我必用我公義的右手扶持你。」", source: "以賽亞書 41:10" },
  { text: "「人活著，不是單靠食物，乃是靠神口裡所出的一切話。」", source: "馬太福音 4:4" },
  { text: "「因他受的鞭傷，我們得醫治；因他受的刑罰，我們得平安。」", source: "以賽亞書 53:5" },
  { text: "「你們要靠主常常喜樂！我再說，你們要喜樂！」", source: "腓立比書 4:4" },
  { text: "「堅心倚賴你的，你必保守他十分平安，因為他倚靠你。」", source: "以賽亞書 26:3" },
  { text: "「所以，我們只管坦然無懼地來到施恩的寶座前，為要得憐恤，蒙恩惠，作隨時的幫助。」", source: "希伯來書 4:16" },
  { text: "「不可叫人小看你年輕，總要在言語、行為、愛心、信心、清潔上，都作信徒的榜樣。」", source: "提摩太前書 4:12" },
  { text: "「你們若有彼此相愛的心，眾人因此就認出你們是我的門徒了。」", source: "約翰福音 13:35" },
  { text: "「凡勞苦擔重擔的人，可以到我這裡來，我就使你們得安息。」", source: "馬太福音 11:28" },
  { text: "「至於我和我家，我們必定事奉耶和華。」", source: "約書亞記 24:15" },
  { text: "「耶和華必在你前面行，他必與你同在，必不撇下你，也不丟棄你。不要懼怕，也不要驚惶。」", source: "申命記 31:8" },
  { text: "「聖靈所結的果子，就是仁愛、喜樂、和平、忍耐、恩慈、良善、信實、溫柔、節制。這樣的事，沒有律法禁止。」", source: "加拉太書 5:22-23" },
  { text: "「我留下一條新命令給你們，乃是叫你們彼此相愛；我怎樣愛你們，你們也要怎樣彼此相愛。」", source: "約翰福音 13:34" },
  { text: "「耶和華是我的亮光，是我的拯救，我還怕誰呢？耶和華是我性命的保障，我還懼誰呢？」", source: "詩篇 27:1" },
  { text: "「那光是真光，照亮一切生在世上的人。」", source: "約翰福音 1:9" },
  { text: "「耶和華要保護你，免受一切的災害。他要保護你的性命。你出你入，耶和華要保護你，從今時直到永遠。」", source: "詩篇 121:7-8" },
  { text: "「神的道是活潑的，是有功效的，比一切兩刃的劍更快。」", source: "希伯來書 4:12" },
  { text: "「我們愛，因為神先愛我們。」", source: "約翰一書 4:19" },
  { text: "「你若能信，在信的人，凡事都能。」", source: "馬可福音 9:23" }
];

function updateDashboardView() {
  document.getElementById("user-greeting").textContent = state.currentUser.name || "弟兄姊妹";
  document.getElementById("streak-days").textContent = state.currentUser.streak || "0";
  
  // Render Daily Verse and Church Announcements
  renderDailyVerse();
  updateAnnouncementsList();

  // Render active plan card
  const planSummaryDiv = document.getElementById("active-plan-summary");
  if (state.activePlan) {
    const progress = state.activePlan.progress || 0;
    const started = isPlanStarted(state.activePlan);
    const isAdmin = state.currentUser && state.currentUser.role === 'admin';
    const isPlanAvailable = started || isAdmin;
    const statusText = started 
      ? `進度: ${progress}% (${state.activePlan.completedChapters} / ${state.activePlan.totalChapters} 章)`
      : `<span style="color: #3b82f6; font-weight: 700;">等待開始</span> (將於 ${state.activePlan.startDate} 開始)`;
      
    planSummaryDiv.innerHTML = `
      <div class="plan-progress-header">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
          <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">${state.activePlan.name}</h4>
          ${started 
            ? '<span style="font-size: 0.7rem; background: #10b981; color: white; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700; white-space: nowrap;">進行中</span>'
            : '<span style="font-size: 0.7rem; background: #3b82f6; color: white; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700; white-space: nowrap;">等待開始</span>'
          }
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.2rem;">
          計畫週期: ${state.activePlan.startDate} ~ ${state.activePlan.endDate} (${state.activePlan.totalDays} 天)
        </p>
        <div class="plan-progress-wrapper" style="margin-top: 1rem;">
          <div class="plan-progress-bar" style="width: ${progress}%;"></div>
        </div>
        <p style="font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); margin-top: 0.5rem; text-align: right;">
          ${statusText}
        </p>
      </div>
      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="primary-btn flex-btn" onclick="appRouter.switchTab('plan-view')">查看每日讀經表</button>
        <button class="secondary-btn flex-btn" onclick="appRouter.switchTab('reader-view')" ${isPlanAvailable ? '' : 'disabled style="opacity: 0.6; cursor: not-allowed;"'}>開始讀經</button>
      </div>
    `;
  } else {
    planSummaryDiv.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 2rem 0;">
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">目前沒有進行中的讀經計畫。</p>
        <button class="primary-btn" onclick="appRouter.switchTab('plan-view')">選擇計畫加入</button>
      </div>
    `;
  }

  // Render personal rankings
  calculateAndRenderPersonalRankings();

  // Render Pastoral ranking top 5 list
  renderPastoralZoneRankingList();

  // Load Devotional Notes & Group Progress
  loadTodayDevotional();
  renderTodayGroupProgress();

  // Render Pilgrimage Trail & controls
  renderPilgrimageTrail();
  if (!state.pilgrimageControlsInit) {
    initPilgrimageControls();
    state.pilgrimageControlsInit = true;
  }
}

async function calculateAndRenderPersonalRankings() {
  const rankGroupEl = document.getElementById("rank-group");
  const rankZoneEl = document.getElementById("rank-zone");
  const rankRegionEl = document.getElementById("rank-region");
  const rankChurchEl = document.getElementById("rank-church");

  if (!rankGroupEl || !rankZoneEl || !rankRegionEl || !rankChurchEl) return;

  const hasPlan = state.activePlans && state.activePlans.length > 0;
  if (!hasPlan) {
    rankGroupEl.textContent = "未加入計畫";
    rankZoneEl.textContent = "未加入計畫";
    rankRegionEl.textContent = "未加入計畫";
    rankChurchEl.textContent = "未加入計畫";
    return;
  }

  try {
    const rankings = await db.getUserRankings();
    if (rankings) {
      rankGroupEl.textContent = rankings.groupRank > 0 ? `第 ${rankings.groupRank} 名 / 共 ${rankings.groupTotal} 人` : "尚無資料";
      rankZoneEl.textContent = rankings.zoneRank > 0 ? `第 ${rankings.zoneRank} 名 / 共 ${rankings.zoneTotal} 人` : "尚無資料";
      rankRegionEl.textContent = rankings.regionRank > 0 ? `第 ${rankings.regionRank} 名 / 共 ${rankings.regionTotal} 人` : "尚無資料";
      rankChurchEl.textContent = rankings.churchRank > 0 ? `第 ${rankings.churchRank} 名 / 共 ${rankings.churchTotal} 人` : "尚無資料";
    } else {
      rankGroupEl.textContent = "無資料";
      rankZoneEl.textContent = "無資料";
      rankRegionEl.textContent = "無資料";
      rankChurchEl.textContent = "無資料";
    }
  } catch (err) {
    console.error("Error rendering personal rankings:", err);
    rankGroupEl.textContent = "載入失敗";
    rankZoneEl.textContent = "載入失敗";
    rankRegionEl.textContent = "載入失敗";
    rankChurchEl.textContent = "載入失敗";
  }
}

async function renderPastoralZoneRankingList() {
  const rankingContainer = document.getElementById("dashboard-pastoral-ranking");
  if (!rankingContainer) return;

  const hasPlan = state.activePlans && state.activePlans.length > 0;
  if (!hasPlan) {
    rankingContainer.innerHTML = `<div class="empty-state">請先加入計畫以查看排名</div>`;
    return;
  }

  rankingContainer.innerHTML = `<div class="empty-state">載入排行中...</div>`;

  let pastoralStats = [];
  if (state.isSupabaseMode && state.supabase) {
    try {
      const { data } = await state.supabase.from("view_pastoral_zone_stats").select("*");
      if (data) {
        pastoralStats = data.map(item => ({
          name: item.pastoral_zone,
          total_chapters: item.total_chapters_read
        })).sort((a, b) => b.total_chapters - a.total_chapters);
      }
    } catch (e) {
      console.error("Failed to load pastoral zone stats:", e);
    }
  } else {
    // Demo Mode
    const mockUser = {
      name: state.currentUser.name,
      great_region: state.currentUser.great_region || "東區",
      pastoral_zone: state.currentUser.pastoral_zone || "大安1",
      small_group: state.currentUser.small_group || "馬鈴",
      role: state.currentUser.role || "member",
      chapters_read: state.currentUser.chapters_read,
      plan_progress: state.currentUser.plan_progress,
      last_read: state.currentUser.last_read
    };
    pastoralStats = MockStatsService.getPastoralZoneStats(mockUser);
  }

  rankingContainer.innerHTML = "";
  if (pastoralStats.length === 0) {
    rankingContainer.innerHTML = `<div class="empty-state">尚無速讀數據</div>`;
    return;
  }

  pastoralStats.slice(0, 5).forEach((item, index) => {
    const rankClass = `rank-${index + 1}`;
    const rankItem = document.createElement("div");
    rankItem.className = "ranking-item";
    rankItem.innerHTML = `
      <div class="rank-number ${rankClass}">${index + 1}</div>
      <div class="rank-details">
        <div class="rank-name">${escapeHTML(item.name || item.pastoral_zone)}</div>
      </div>
      <div class="rank-value">${item.total_chapters || 0} 章</div>
    `;
    rankingContainer.appendChild(rankItem);
  });
}

// Devotional Notes View Handlers
async function loadTodayDevotional() {
  const textarea = document.getElementById("devotional-content");
  const countEl = document.getElementById("devotional-word-count");
  if (!textarea) return;
  
  textarea.value = "";
  if (countEl) countEl.textContent = "字數: 0 字";
  
  const todayStr = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  
  try {
    const content = await db.getDevotionalNote(todayStr);
    if (content) {
      textarea.value = content;
      if (countEl) countEl.textContent = `字數: ${content.length} 字`;
    }
  } catch (err) {
    console.error("Failed to load devotional note:", err);
  }
}

let devotionalDebounceTimer = null;

function initDevotionalControls() {
  const textarea = document.getElementById("devotional-content");
  const saveBtn = document.getElementById("btn-save-devotional");
  const countEl = document.getElementById("devotional-word-count");
  
  if (!textarea) return;
  
  textarea.addEventListener("input", () => {
    const text = textarea.value;
    if (countEl) countEl.textContent = `字數: ${text.length} 字`;
    
    clearTimeout(devotionalDebounceTimer);
    devotionalDebounceTimer = setTimeout(() => {
      saveDevotionalNote(true);
    }, 1000);
  });
  
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      clearTimeout(devotionalDebounceTimer);
      saveDevotionalNote(false);
    });
  }

  const searchInput = document.getElementById("member-today-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderProgressListFiltered(e.target.value);
    });
  }
}

async function saveDevotionalNote(isAuto) {
  const textarea = document.getElementById("devotional-content");
  const statusEl = document.getElementById("devotional-save-status");
  if (!textarea) return;
  
  const content = textarea.value.trim();
  const todayStr = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  
  if (statusEl && isAuto) {
    statusEl.textContent = "自動儲存中...";
    statusEl.style.opacity = "1";
  }
  
  try {
    await db.saveDevotionalNote(todayStr, content);
    showSaveSuccess(isAuto);
  } catch (err) {
    console.error("Failed to save devotional note:", err);
    if (statusEl) {
      statusEl.textContent = "儲存失敗";
      statusEl.style.color = "#ef4444";
      statusEl.style.opacity = "1";
    }
  }
}

function showSaveSuccess(isAuto) {
  const statusEl = document.getElementById("devotional-save-status");
  if (!statusEl) return;
  
  statusEl.innerHTML = `
    <span style="width: 5px; height: 5px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
    已自動儲存
  `;
  statusEl.style.color = "#10b981";
  statusEl.style.opacity = "1";
  
  if (!isAuto) {
    statusEl.innerHTML = `
      <span style="width: 5px; height: 5px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
      儲存成功
    `;
  }
  
  setTimeout(() => {
    statusEl.style.opacity = "0";
  }, 2000);
}

// Group Progress Handlers
async function renderTodayGroupProgress() {
  const listEl = document.getElementById("member-today-list");
  if (!listEl) return;
  
  const hasPlan = state.activePlans && state.activePlans.length > 0;
  if (!hasPlan) {
    listEl.innerHTML = '<div style="font-size: 0.88rem; color: var(--text-muted); text-align: center; padding: 2rem 0;">請先至「讀經計畫」加入計畫，以查看今日進度！</div>';
    return;
  }
  
  listEl.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1rem;">載入中...</div>';
  
  // Adapt header and search box visibility based on role
  const cardEl = listEl.closest('.glass-card');
  if (cardEl) {
    const cardTitleEl = cardEl.querySelector('.card-title');
    const searchBoxEl = cardEl.querySelector('.search-box-wrapper');
    
    if (state.currentUser && state.currentUser.role === 'member') {
      if (cardTitleEl) {
        cardTitleEl.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--primary-color)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          我的今日讀經進度
        `;
      }
      if (searchBoxEl) {
        searchBoxEl.style.display = 'none';
      }
    } else {
      if (cardTitleEl) {
        cardTitleEl.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--primary-color)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          小組今日讀經進度
        `;
      }
      if (searchBoxEl) {
        searchBoxEl.style.display = 'block';
      }
    }
  }

  let allUsers = await db.fetchMergedUsersList();
  
  const mockUser = {
    name: state.currentUser.name,
    great_region: state.currentUser.great_region || "東區",
    pastoral_zone: state.currentUser.pastoral_zone || "大安1",
    small_group: state.currentUser.small_group || "馬鈴",
    role: state.currentUser.role || "member"
  };
  
  let groupMembers = allUsers.filter(u => 
    u.pastoral_zone === mockUser.pastoral_zone && 
    u.small_group === mockUser.small_group
  );
  
  if (groupMembers.length === 0) {
    groupMembers = allUsers.slice(0, 10);
  }
  
  state.todayGroupMembers = groupMembers;
  
  renderProgressListFiltered("");
}

function renderProgressListFiltered(searchText) {
  const listEl = document.getElementById("member-today-list");
  if (!listEl || !state.todayGroupMembers) return;
  
  listEl.innerHTML = "";
  
  const todayStr = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  
  const query = searchText.trim().toLowerCase();
  const filtered = state.todayGroupMembers.filter(m => 
    m.name.toLowerCase().includes(query)
  );
  
  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1rem;">無相符成員</div>';
    return;
  }
  
  filtered.forEach(m => {
    const isRecentRead = m.last_read && (
      m.last_read === todayStr ||
      m.last_read === "2026-06-26" ||
      m.last_read === "2026-06-25"
    );

    const item = document.createElement("div");
    item.className = "member-progress-item";
    
    const nameInfo = document.createElement("div");
    nameInfo.className = "member-name-info";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "member-name";
    nameSpan.textContent = m.name;
    nameInfo.appendChild(nameSpan);
    
    const metaSpan = document.createElement("span");
    metaSpan.className = "member-meta";
    metaSpan.textContent = `連續讀經: ${m.streak || 0}天 | 總章數: ${m.chapters_read || 0}章`;
    nameInfo.appendChild(metaSpan);
    
    item.appendChild(nameInfo);
    
    const badge = document.createElement("span");
    if (isRecentRead) {
      badge.className = "progress-badge completed";
      badge.innerHTML = `
        <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="3" fill="none" style="display:inline-block; vertical-align:middle; margin-right:2px;"><polyline points="20 6 9 17 4 12"/></svg>
        今日已讀
      `;
    } else {
      badge.className = "progress-badge pending";
      badge.textContent = "未打卡";
    }
    item.appendChild(badge);
    
    listEl.appendChild(item);
  });
}

// ==========================================
// PILGRIMAGE TRAIL BOARD RENDER LOGIC
// ==========================================

state.pilgrimageZoom = 1.0;
state.pilgrimageControlsInit = false;

function getBookCoords(index) {
  const cols = 8;
  const spacingX = 110;
  const spacingY = 90;
  const startX = 65;
  const startY = 65;
  
  const row = Math.floor(index / cols);
  const col = index % cols;
  const isReversed = row % 2 === 1;
  const actualCol = isReversed ? (cols - 1 - col) : col;
  
  return {
    x: startX + actualCol * spacingX,
    y: startY + row * spacingY
  };
}

async function renderPilgrimageTrail() {
  const canvas = document.getElementById("pilgrimage-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  
  const width = 900;
  const height = 900;
  canvas.width = width;
  canvas.height = height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Calculate completed chapters per book
  const bookCompletion = BIBLE_BOOKS.map(book => {
    const readChapters = state.readingLogs.filter(l => l.book === book.name);
    const count = readChapters.length;
    return {
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters,
      readCount: count,
      isCompleted: count >= book.chapters,
      isStarted: count > 0
    };
  });
  
  // 1. Draw Winding Path Background
  ctx.beginPath();
  ctx.strokeStyle = "var(--border-card)"; // themed grey/border color
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  for (let i = 0; i < 66; i++) {
    const coords = getBookCoords(i);
    if (i === 0) ctx.moveTo(coords.x, coords.y);
    else ctx.lineTo(coords.x, coords.y);
  }
  ctx.stroke();
  
  // 2. Draw Active/Completed Path Progress
  let lastCompletedIndex = -1;
  for (let i = 0; i < 66; i++) {
    if (bookCompletion[i].isStarted || bookCompletion[i].isCompleted) {
      lastCompletedIndex = i;
    }
  }
  
  if (lastCompletedIndex >= 0) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(99, 102, 241, 0.4)"; // Translucent Indigo
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    for (let i = 0; i <= lastCompletedIndex; i++) {
      const coords = getBookCoords(i);
      if (i === 0) ctx.moveTo(coords.x, coords.y);
      else ctx.lineTo(coords.x, coords.y);
    }
    ctx.stroke();
  }

  // 3. Draw Book Stepping Stones (Nodes)
  for (let i = 0; i < 66; i++) {
    const coords = getBookCoords(i);
    const status = bookCompletion[i];
    
    const isActive = i === lastCompletedIndex;
    
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 16, 0, Math.PI * 2);
    
    let fillStyle = "var(--border-card)"; // Locked/Gray
    if (status.isCompleted) {
      fillStyle = "#10b981"; // Completed/Green
    } else if (status.isStarted) {
      fillStyle = "#3b82f6"; // In progress/Blue
    }
    
    ctx.fillStyle = fillStyle;
    ctx.fill();
    
    // Draw active glow
    if (isActive) {
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Text Abbreviation
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(status.abbrev, coords.x, coords.y);
  }

  // 4. Fetch Group Members and draw their Avatars
  let allUsers = await db.fetchMergedUsersList();
  
  const mockUser = {
    name: state.currentUser.name,
    great_region: state.currentUser.great_region || "東區",
    pastoral_zone: state.currentUser.pastoral_zone || "大安1",
    small_group: state.currentUser.small_group || "馬鈴",
    role: state.currentUser.role || "member"
  };
  
  let groupMembers = allUsers.filter(u => 
    u.pastoral_zone === mockUser.pastoral_zone && 
    u.small_group === mockUser.small_group
  );
  if (groupMembers.length === 0) {
    groupMembers = [ { name: state.currentUser.name, chapters_read: state.currentUser.chapters_read } ];
  }
  
  const nodeOccupancy = {};
  
  groupMembers.forEach(member => {
    let chaptersCount = member.chapters_read || 0;
    let bookIndex = 0;
    let sum = 0;
    
    for (let i = 0; i < BIBLE_BOOKS.length; i++) {
      sum += BIBLE_BOOKS[i].chapters;
      if (sum >= chaptersCount) {
        bookIndex = i;
        break;
      }
    }
    if (sum < chaptersCount) {
      bookIndex = 65;
    }
    
    const baseCoords = getBookCoords(bookIndex);
    
    if (!nodeOccupancy[bookIndex]) {
      nodeOccupancy[bookIndex] = 0;
    }
    const offsetNum = nodeOccupancy[bookIndex];
    nodeOccupancy[bookIndex] += 1;
    
    // Shift slightly to avoid stacking overlapping text
    const offsetX = offsetNum * 12;
    const offsetY = offsetNum * -12;
    
    const x = baseCoords.x + offsetX;
    const y = baseCoords.y + offsetY - 25;
    
    const isMe = member.name === state.currentUser.name;
    
    // Draw label background
    ctx.beginPath();
    ctx.fillStyle = isMe ? "#4f46e5" : "#475569";
    ctx.roundRect(x - 22, y - 18, 44, 18, 5);
    ctx.fill();
    
    // Little arrow pointing down
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x, y + 4);
    ctx.lineTo(x + 4, y);
    ctx.fillStyle = isMe ? "#4f46e5" : "#475569";
    ctx.fill();
    
    // Text Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const displayName = member.name.substring(0, 3);
    ctx.fillText(displayName, x, y - 9);
  });
}

function initPilgrimageControls() {
  const board = document.getElementById("pilgrimage-trail-board");
  const zoomIn = document.getElementById("increase-trail-zoom");
  const zoomOut = document.getElementById("decrease-trail-zoom");
  const zoomReset = document.getElementById("reset-trail-zoom");
  
  if (!board) return;
  
  const updateZoom = () => {
    board.style.transform = `scale(${state.pilgrimageZoom})`;
  };
  
  if (zoomIn) {
    zoomIn.onclick = () => {
      if (state.pilgrimageZoom < 2.0) {
        state.pilgrimageZoom += 0.15;
        updateZoom();
      }
    };
  }
  
  if (zoomOut) {
    zoomOut.onclick = () => {
      if (state.pilgrimageZoom > 0.6) {
        state.pilgrimageZoom -= 0.15;
        updateZoom();
      }
    };
  }
  
  if (zoomReset) {
    zoomReset.onclick = () => {
      state.pilgrimageZoom = 1.0;
      updateZoom();
    };
  }
}



window.openAnnouncementForm = function() {
  const form = document.getElementById("admin-announcement-form-container");
  if (form) form.classList.remove("hidden");
};

window.closeAnnouncementForm = function() {
  const form = document.getElementById("admin-announcement-form-container");
  if (form) form.classList.add("hidden");
  
  const titleInput = document.getElementById("announcement-title-input");
  const contentInput = document.getElementById("announcement-content-input");
  if (titleInput) titleInput.value = "";
  if (contentInput) contentInput.value = "";
};

window.saveAnnouncement = async function() {
  const titleInput = document.getElementById("announcement-title-input");
  const contentInput = document.getElementById("announcement-content-input");
  if (!titleInput || !contentInput) return;
  
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) {
    alert("請輸入公告標題與內容！");
    return;
  }
  
  loader.show("發布公告中...");
  const success = await db.saveAnnouncement(title, content);
  loader.hide();
  
  if (success) {
    window.closeAnnouncementForm();
    await updateAnnouncementsList();
  }
};

window.deleteAnnouncement = async function(id) {
  if (!confirm("確定要刪除此公告嗎？此動作將無法復原。")) return;
  
  loader.show("刪除公告中...");
  const success = await db.deleteAnnouncement(id);
  loader.hide();
  
  if (success) {
    await updateAnnouncementsList();
  }
};

async function updateAnnouncementsList() {
  const listContainer = document.getElementById("church-announcements-list");
  if (!listContainer) return;
  
  const isAdmin = state.currentUser && (state.currentUser.role === 'admin' || state.currentUser.role === 'senior_pastor');
  const publishBtn = document.getElementById("btn-show-announcement-form");
  if (publishBtn) {
    if (isAdmin) publishBtn.classList.remove("hidden");
    else publishBtn.classList.add("hidden");
  }
  
  const announcements = await db.fetchAnnouncements();
  listContainer.innerHTML = "";
  
  if (announcements.length === 0) {
    listContainer.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">目前尚無教會公告。</div>`;
    return;
  }
  
  announcements.forEach(ann => {
    const item = document.createElement("div");
    item.style = `
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-card);
      border-radius: 12px;
      padding: 0.8rem 1rem;
      position: relative;
    `;
    
    const formattedTime = new Date(ann.created_at).toLocaleDateString('zh-TW', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.3rem;">
        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.4;">${escapeHTML(ann.title)}</h4>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="font-size: 0.7rem; color: var(--text-muted); white-space: nowrap;">${formattedTime}</span>
          ${isAdmin ? `<button class="circular-action-btn" style="width: 22px; height: 22px; padding: 0; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; font-size: 0.65rem;" onclick="window.deleteAnnouncement('${ann.id}')" title="刪除公告">🗑️</button>` : ''}
        </div>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5; white-space: pre-wrap;">${escapeHTML(ann.content)}</p>
    `;
    listContainer.appendChild(item);
  });
}

function renderDailyVerse() {
  const verseTextEl = document.getElementById("daily-verse-text");
  const verseSourceEl = document.getElementById("daily-verse-source");
  if (verseTextEl && verseSourceEl) {
    const dayOfMonth = new Date().getDate();
    const verse = DAILY_VERSES[(dayOfMonth - 1) % DAILY_VERSES.length];
    verseTextEl.textContent = verse.text;
    verseSourceEl.textContent = `— ${verse.source}`;
  }
}
