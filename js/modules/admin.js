// js/modules/admin.js

export function updateFilterChipsUI() {
  const chipRegion = document.getElementById("chip-filter-region");
  const chipZone = document.getElementById("chip-filter-zone");
  const chipGroup = document.getElementById("chip-filter-group");

  if (chipRegion) {
    if (state.adminFilters.region) {
      chipRegion.classList.add("active");
      chipRegion.innerHTML = `<span>${state.adminFilters.region}</span> <span class="chip-clear" data-clear="region">���</span>`;
    } else {
      chipRegion.classList.remove("active");
      chipRegion.innerHTML = `<span>��券�典之���</span> <span class="chip-arrow">���</span>`;
    }
  }

  if (chipZone) {
    if (state.adminFilters.zone) {
      chipZone.classList.add("active");
      chipZone.innerHTML = `<span>${state.adminFilters.zone}</span> <span class="chip-clear" data-clear="zone">���</span>`;
    } else {
      chipZone.classList.remove("active");
      chipZone.innerHTML = `<span>��券�函�批��</span> <span class="chip-arrow">���</span>`;
    }
  }

  if (chipGroup) {
    if (state.adminFilters.group) {
      chipGroup.classList.add("active");
      chipGroup.innerHTML = `<span>${state.adminFilters.group}</span> <span class="chip-clear" data-clear="group">���</span>`;
    } else {
      chipGroup.classList.remove("active");
      chipGroup.innerHTML = `<span>��券�典��蝯�</span> <span class="chip-arrow">���</span>`;
    }
  }
}

export function openAdminFilterBottomSheet(type) {
  const overlay = document.getElementById("global-bottom-sheet");
  const titleEl = document.getElementById("bottom-sheet-title");
  const listEl = document.getElementById("bottom-sheet-list");
  if (!overlay || !listEl) return;

  let title = "��豢��蝭拚�豢��隞�";
  let options = [];
  let selectedValue = state.adminFilters[type];

  const getPredefinedRegions = () => {
    return (state.orgStructure && state.orgStructure.regions && state.orgStructure.regions.length > 0)
      ? state.orgStructure.regions
      : ["��勗��", "������", "镼踹��", "������", "���撠�撟�", "��嗅��", "��菔��"];
  };

  const getPredefinedZones = () => {
    if (state.adminFilters.region) {
      return state.orgStructure.zones[state.adminFilters.region] || [];
    }
    const all = [];
    if (state.orgStructure && state.orgStructure.zones) {
      Object.values(state.orgStructure.zones).forEach(arr => {
        if (Array.isArray(arr)) all.push(...arr);
      });
    }
    return Array.from(new Set(all));
  };

  const getPredefinedGroups = () => {
    if (state.adminFilters.zone) {
      return state.orgStructure.groups[state.adminFilters.zone] || [];
    }
    const all = [];
    if (state.orgStructure && state.orgStructure.groups) {
      Object.values(state.orgStructure.groups).forEach(arr => {
        if (Array.isArray(arr)) all.push(...arr);
      });
    }
    return Array.from(new Set(all));
  };

  if (type === "region") {
    title = "��豢��憭批��";
    options = getPredefinedRegions();
  } else if (type === "zone") {
    title = "��豢����批��";
    options = getPredefinedZones();
  } else if (type === "group") {
    title = "��豢��撠�蝯�";
    options = getPredefinedGroups();
  }

  if (titleEl) titleEl.textContent = title;
  listEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = `bottom-sheet-item ${!selectedValue ? "selected" : ""}`;
  allBtn.type = "button";
  allBtn.textContent = `��券��${type === "region" ? "憭批��" : (type === "zone" ? "��批��" : "撠�蝯�")}`;
  allBtn.onclick = () => {
    console.log(`���� [Debug] Bottom Sheet ��豢��皜���斤祟���: ��券��${type}`);
    state.adminFilters[type] = null;
    if (type === "region") {
      state.adminFilters.zone = null;
      state.adminFilters.group = null;
    } else if (type === "zone") {
      state.adminFilters.group = null;
    }
    updateFilterChipsUI();
    closeAdminFilterBottomSheet();
    renderAdminUserManagement();
  };
  listEl.appendChild(allBtn);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `bottom-sheet-item ${selectedValue === opt ? "selected" : ""}`;
    btn.type = "button";
    btn.textContent = opt;
    btn.onclick = () => {
      console.log(`���� [Debug] Bottom Sheet ��豢��蝭拚�豢��隞�: ${type} = ${opt}`);
      state.adminFilters[type] = opt;
      if (type === "region") {
        state.adminFilters.zone = null;
        state.adminFilters.group = null;
      } else if (type === "zone") {
        state.adminFilters.group = null;
      }
      updateFilterChipsUI();
      closeAdminFilterBottomSheet();
      renderAdminUserManagement();
    };
    listEl.appendChild(btn);
  });

  overlay.classList.add("active");
}

export function closeAdminFilterBottomSheet() {
  console.log("���� [Debug] ������蝞∠��蝭拚�� Bottom Sheet");
  const overlay = document.getElementById("global-bottom-sheet");
  if (overlay) overlay.classList.remove("active");
}

export function initAdminFiltersUI() {
  ["region", "zone", "group"].forEach(type => {
    const chip = document.getElementById(`chip-filter-${type}`);
    if (chip) {
      chip.onclick = (e) => {
        e.preventDefault();
        const clearBtn = e.target.closest(".chip-clear");
        if (clearBtn) {
          console.log(`��� [Debug] 皜���斤祟��豢��蝐斗�����暺����: ${type}`);
          e.stopPropagation();
          state.adminFilters[type] = null;
          if (type === "region") {
            state.adminFilters.zone = null;
            state.adminFilters.group = null;
          } else if (type === "zone") {
            state.adminFilters.group = null;
          }
          updateFilterChipsUI();
          renderAdminUserManagement();
        } else {
          console.log(`���� [Debug] 蝭拚�豢��蝐方�����暺����嚗������� Bottom Sheet: ${type}`);
          openAdminFilterBottomSheet(type);
        }
      };
    }
  });

  const closeBtn = document.getElementById("btn-close-bottom-sheet");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      console.log("���� [Debug] ������ Bottom Sheet ������暺����");
      e.preventDefault();
      closeAdminFilterBottomSheet();
    };
  }

  const overlay = document.getElementById("global-bottom-sheet");
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        console.log("���� [Debug] 暺���� Bottom Sheet 憭���券�桃蔗������");
        closeAdminFilterBottomSheet();
      }
    };
  }

  updateFilterChipsUI();
}

export async function renderAdminUserManagement() {
  const listContainer = document.getElementById("admin-users-list");
  if (!listContainer) return;

  const searchInput = document.getElementById("admin-search-user");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  ComponentSkeletonLoader.show('members', listContainer);

  try {
    const users = await db.fetchMergedUsersList(null, true);
    
    const roleOrder = { admin: 1, great_zone_leader: 2, zone_leader: 3, group_leader: 4, member: 5 };
    const sortedUsers = [...users].sort((a, b) => {
      if (a.name === state.currentUser.name) return -1;
      if (b.name === state.currentUser.name) return 1;
      return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
    });

    const filteredUsers = sortedUsers.filter(u => {
      const matchName = u.name.toLowerCase().includes(query);
      const matchEmail = u.email ? u.email.toLowerCase().includes(query) : false;
      const matchRegion = !state.adminFilters.region || u.great_region === state.adminFilters.region;
      const matchZone = !state.adminFilters.zone || u.pastoral_zone === state.adminFilters.zone;
      const matchGroup = !state.adminFilters.group || u.small_group === state.adminFilters.group;
      return (matchName || matchEmail) && matchRegion && matchZone && matchGroup;
    });

    listContainer.innerHTML = "";

    if (filteredUsers.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">��∠�貊泵������</div>`;
      return;
    }

    const roleLabels = {
      member: "銝���祉�����",
      group_leader: "撠�蝯����",
      zone_leader: "������",
      great_zone_leader: "憭批�����",
      admin: "蝟餌絞蝞∠�����"
    };

    filteredUsers.forEach(user => {
      const roleLabel = roleLabels[user.role] || user.role;
      
      const item = document.createElement("div");
      item.className = "member-list-item";
      
      item.innerHTML = `
        <div class="member-info-left">
          <div class="member-name-row">
            <span class="member-name-text">${escapeHTML(user.name)}</span>
            <span class="role-badge-pill">${escapeHTML(roleLabel)}</span>
          </div>
          <div class="member-sub-text">
            ${escapeHTML(user.great_region)} / ${escapeHTML(user.pastoral_zone)} / ${escapeHTML(user.small_group)}
          </div>
          ${user.email ? `<div class="member-email-text">${escapeHTML(user.email)}</div>` : ''}
        </div>
        <div class="member-arrow-right">
          ${typeof renderIcon === "function" ? renderIcon("chevronRight", { size: "sm", className: "nlc-icon" }) : ""}
        </div>
      `;

      item.onclick = (e) => {
        e.preventDefault();
        openMemberEditBottomSheet(user);
      };

      listContainer.appendChild(item);
    });

  } catch (err) {
    console.error("Failed to render admin user management:", err);
    listContainer.innerHTML = `<div class="text-danger" style="text-align: center; padding: 2.5rem;">頛���亙仃���: ${err.message || err}</div>`;
  }
}

export function openMemberEditBottomSheet(user) {
  const overlay = document.getElementById("global-bottom-sheet");
  const titleEl = document.getElementById("bottom-sheet-title");
  const listEl = document.getElementById("bottom-sheet-list");
  if (!overlay || !listEl) return;

  if (titleEl) titleEl.textContent = `蝞∠�� ${user.name} ���甈����`;
  listEl.innerHTML = "";

  const roleOptions = [
    { value: "member", label: "銝���祉�����" },
    { value: "group_leader", label: "撠�蝯����" },
    { value: "zone_leader", label: "������" },
    { value: "great_zone_leader", label: "憭批�����" },
    { value: "admin", label: "蝟餌絞蝞∠�����" }
  ];



  const isLeader = ["great_zone_leader", "zone_leader", "group_leader"].includes(user.role);
  if (isLeader) {
    const scopeBtn = document.createElement("button");
    scopeBtn.className = "bottom-sheet-item";
    scopeBtn.style.background = "var(--color-brand-subtle, rgba(4,169,210,0.12))";
    scopeBtn.style.borderColor = "var(--color-brand-border, rgba(4,169,210,0.24))";
    scopeBtn.style.color = "#a5b4fc";
    scopeBtn.style.marginBottom = "0.8rem";
    scopeBtn.type = "button";

    let scopeDesc = "";
    if (user.role === "great_zone_leader") scopeDesc = user.managed_regions || user.great_region || "��芾身摰�";
    else if (user.role === "zone_leader") scopeDesc = user.managed_zones || user.pastoral_zone || "��芾身摰�";
    else if (user.role === "group_leader") scopeDesc = user.managed_groups || user.small_group || "��芾身摰�";

    scopeBtn.innerHTML = iconLabel("edit", `靽格�寧恣頧�蝭���� (${scopeDesc})`);
    scopeBtn.onclick = async () => {
      console.log(`���儭� [Debug] 靽格�寧恣頧�蝭����������鋡恍�����嚗������∴��${user.name}`);
      closeAdminFilterBottomSheet();
      const resp = await showResponsibilityModal(user.role, user);
      if (!resp) return;

      loader.show();
      const success = await db.updateUserRole(user.id, user.role, user.name, resp);
      loader.hide();

      if (success) {
        user.managed_regions = resp.managed_regions;
        user.managed_zones = resp.managed_zones;
        user.managed_groups = resp.managed_groups;

        if (user.name === state.currentUser.name) {
          state.currentUser.managed_regions = resp.managed_regions;
          state.currentUser.managed_zones = resp.managed_zones;
          state.currentUser.managed_groups = resp.managed_groups;
          if (typeof renderProfileView === "function") renderProfileView();
        }
        alert("撌脫�������湔�啁恣頧�蝭����嚗�");
        renderAdminUserManagement();
      } else {
        alert("��湔�啁恣頧�蝭����憭望��嚗�隢����閰艾��");
      }
    };
    listEl.appendChild(scopeBtn);
  }

  const headerText = document.createElement("div");
  headerText.style.fontSize = "0.75rem";
  headerText.style.color = "var(--text-secondary)";
  headerText.style.margin = "0.2rem 0 0.5rem 0.2rem";
  headerText.style.fontWeight = "bold";
  headerText.textContent = "霈���渲����脰澈���嚗�";
  listEl.appendChild(headerText);

  roleOptions.forEach(opt => {
    const btn = document.createElement("button");
    const isSelected = user.role === opt.value;
    btn.className = `bottom-sheet-item ${isSelected ? "selected" : ""}`;
    btn.type = "button";
    btn.textContent = opt.label;
    btn.onclick = async () => {
      console.log(`���儭� [Debug] 霈���渲����脰澈���暺����: ${user.name} -> ${opt.label}`);
      closeAdminFilterBottomSheet();
      if (isSelected) return;

      let additionalFields = {};
      if (["great_zone_leader", "zone_leader", "group_leader"].includes(opt.value)) {
        const resp = await showResponsibilityModal(opt.value, user);
        if (!resp) return;
        additionalFields = resp;
      }

      loader.show();
      const success = await db.updateUserRole(user.id, opt.value, user.name, additionalFields);
      loader.hide();

      if (success) {
        user.role = opt.value;
        if (additionalFields.managed_regions !== undefined) user.managed_regions = additionalFields.managed_regions;
        if (additionalFields.managed_zones !== undefined) user.managed_zones = additionalFields.managed_zones;
        if (additionalFields.managed_groups !== undefined) user.managed_groups = additionalFields.managed_groups;

        if (user.name === state.currentUser.name) {
          state.currentUser.role = opt.value;
          state.realRole = opt.value;
          if (additionalFields.managed_regions !== undefined) state.currentUser.managed_regions = additionalFields.managed_regions;
          if (additionalFields.managed_zones !== undefined) state.currentUser.managed_zones = additionalFields.managed_zones;
          if (additionalFields.managed_groups !== undefined) state.currentUser.managed_groups = additionalFields.managed_groups;
          if (typeof renderProfileView === "function") renderProfileView();
        }
        alert("撌脫�����霈���湔����⊥�����閫���莎��");
        renderAdminUserManagement();
      } else {
        alert("霈���渲����脣仃���嚗�隢����閰艾��");
      }
    };
    listEl.appendChild(btn);
  });

  overlay.classList.add("active");
}

export function initAdminOrgManagement() {
  const regionSelect = document.getElementById("admin-org-region");
  const zoneSelect = document.getElementById("admin-org-zone");
  const groupSelect = document.getElementById("admin-org-group");

  if (!regionSelect || !zoneSelect || !groupSelect) return;

  regionSelect.onchange = () => {
    populateAdminZones();
  };

  zoneSelect.onchange = () => {
    populateAdminGroups();
  };

  document.getElementById("admin-add-region-btn").onclick = async () => {
    const name = prompt("隢�頛詨�交�啣之������蝔� (靘�憒�嚗���勗��)嚗�");
    if (name && name.trim()) {
      loader.show("��啣��憭批��銝�...");
      const success = await db.createGreatRegion(name.trim());
      loader.hide();
      if (success) {
        alert("憭批����啣��������嚗�");
        renderAdminOrgManagement();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-edit-region-btn").onclick = async () => {
    const val = regionSelect.valu  document.getElementById("admin-delete-region-btn").onclick = async () => {
    const val = regionSelect.value;
    if (!val) {
      showToast("隢���豢��閬���芷�斤��憭批��嚗�");
      return;
    }
    const opt = regionSelect.options[regionSelect.selectedIndex];
    const confirmed = await window.showConfirmDialog({
      title: "蝣箏��閬���芷�文之������嚗�",
      message: `��函Ⅱ摰�閬���芷�文之��� ${opt.text} ���嚗����撠����撣嗅�芷�斗迨憭批��銝������������批�����撠�蝯�嚗�`,
      confirmText: "蝣箄����芷��",
      cancelText: "���瘨�",
      isDestructive: true
    });
    if (confirmed) {
      loader.show("��芷�文之���銝�...");
      const success = await db.deleteGreatRegion(val);
      loader.hide();
      if (success) {
        showToast("憭批��撌脫�������芷�歹��");
        renderAdminOrgManagement();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-add-zone-btn").onclick = async () => {
    const regionVal = regionSelect.value;
    if (!regionVal) {
      showToast("隢������豢��憭批��嚗���批��敹����甇詨惇��潭�����憭批��銝����");
      return;
    }
    const name = prompt("隢�頛詨�交�啁�批�����蝔� (靘�憒�嚗�憭批��1)嚗�");
    if (name && name.trim()) {
      loader.show("��啣����批��銝�...");
      const success = await db.createPastoralZone(name.trim(), regionVal);
      loader.hide();
      if (success) {
        showToast("��批����啣��������嚗�");
        populateAdminZones();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-edit-zone-btn").onclick = async () => {
    const val = zoneSelect.value;
    if (!val) {
      showToast("隢���豢��閬�靽格�寧����批��嚗�");
      return;
    }
    const opt = zoneSelect.options[zoneSelect.selectedIndex];
    const oldName = opt.text;
    const newName = prompt(`隢�頛詨�亦�批�� ${oldName} �����啣��蝔梧��`, oldName);
    if (newName && newName.trim() && newName.trim() !== oldName) {
      loader.show("��湔�啁�批��銝�...");
      const success = await db.updatePastoralZone(val, newName.trim());
      loader.hide();
      if (success) {
        showToast("��批����湔�唳�����嚗�");
        populateAdminZones();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-delete-zone-btn").onclick = async () => {
    const val = zoneSelect.value;
    if (!val) {
      showToast("隢���豢��閬���芷�斤����批��嚗�");
      return;
    }
    const opt = zoneSelect.options[zoneSelect.selectedIndex];
    const confirmed = await window.showConfirmDialog({
      title: "蝣箏��閬���芷�斤�批�����嚗�",
      message: `��函Ⅱ摰�閬���芷�斤�批�� ${opt.text} ���嚗����撠����撣嗅�芷�斗迨��批��銝����������撠�蝯�嚗�`,
      confirmText: "蝣箄����芷��",
      cancelText: "���瘨�",
      isDestructive: true
    });
    if (confirmed) {
      loader.show("��芷�斤�批��銝�...");
      const success = await db.deletePastoralZone(val);
      loader.hide();
      if (success) {
        showToast("��批��撌脫�������芷�歹��");
        populateAdminZones();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-add-group-btn").onclick = async () => {
    const zoneVal = zoneSelect.value;
    if (!zoneVal) {
      showToast("隢������豢����批��嚗�撠�蝯�敹����甇詨惇��潭�������批��銝����");
      return;
    }
    const name = prompt("隢�頛詨�交�啣��蝯����蝔� (靘�憒�嚗�擐祇��)嚗�");
    if (name && name.trim()) {
      loader.show("��啣��撠�蝯�銝�...");
      const success = await db.createSmallGroup(name.trim(), zoneVal);
      loader.hide();
      if (success) {
        showToast("撠�蝯���啣��������嚗�");
        populateAdminGroups();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-edit-group-btn").onclick = async () => {
    const val = groupSelect.value;
    if (!val) {
      showToast("隢���豢��閬�靽格�寧��撠�蝯�嚗�");
      return;
    }
    const opt = groupSelect.options[groupSelect.selectedIndex];
    const oldName = opt.text;
    const newName = prompt(`隢�頛詨�亙��蝯� ${oldName} �����啣��蝔梧��`, oldName);
    if (newName && newName.trim() && newName.trim() !== oldName) {
      loader.show("��湔�啣��蝯�銝�...");
      const success = await db.updateSmallGroup(val, newName.trim());
      loader.hide();
      if (success) {
        showToast("撠�蝯���湔�唳�����嚗�");
        populateAdminGroups();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-delete-group-btn").onclick = async () => {
    const val = groupSelect.value;
    if (!val) {
      showToast("隢���豢��閬���芷�斤��撠�蝯�嚗�");
      return;
    }
    const opt = groupSelect.options[groupSelect.selectedIndex];
    const confirmed = await window.showConfirmDialog({
      title: "蝣箏��閬���芷�文��蝯����嚗�",
      message: `��函Ⅱ摰�閬���芷�文��蝯� ${opt.text} ���嚗�甇斗��雿�撠���⊥��敺拙�����`,
      confirmText: "蝣箄����芷��",
      cancelText: "���瘨�",
      isDestructive: true
    });
    if (confirmed) {
      loader.show("��芷�文��蝯�銝�...");
      const success = await db.deleteSmallGroup(val);
      loader.hide();
      if (success) {
        showToast("撠�蝯�撌脫�������芷�歹��");
        populateAdminGroups();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };��蝯�嚗�");
      return;
    }
    const opt = groupSelect.options[groupSelect.selectedIndex];
    const oldName = opt.text;
    const newName = prompt(`隢�頛詨�亙��蝯� ${oldName} �����啣��蝔梧��`, oldName);
    if (newName && newName.trim() && newName.trim() !== oldName) {
      loader.show("��湔�啣��蝯�銝�...");
      const success = await db.updateSmallGroup(val, newName.trim());
      loader.hide();
      if (success) {
        alert("撠�蝯���湔�唳�����嚗�");
        populateAdminGroups();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };

  document.getElementById("admin-delete-group-btn").onclick = async () => {
    const val = groupSelect.value;
    if (!val) {
      alert("隢���豢��閬���芷�斤��撠�蝯�嚗�");
      return;
    }
    const opt = groupSelect.options[groupSelect.selectedIndex];
    if (confirm(`��函Ⅱ摰�閬���芷�文��蝯� ${opt.text} ���嚗�`)) {
      loader.show("��芷�文��蝯�銝�...");
      const success = await db.deleteSmallGroup(val);
      loader.hide();
      if (success) {
        alert("撠�蝯�撌脫�������芷�歹��");
        populateAdminGroups();
        if (typeof renderProfileView === "function") renderProfileView();
      }
    }
  };
}

export function renderAdminOrgManagement() {
  const regionSelect = document.getElementById("admin-org-region");
  const zoneSelect = document.getElementById("admin-org-zone");
  const groupSelect = document.getElementById("admin-org-group");

  if (!regionSelect || !zoneSelect || !groupSelect) return;

  regionSelect.innerHTML = `<option value="">-- 隢���豢��憭批�� --</option>`;
  if (state.isSupabaseMode && state.orgStructure.rawRegions) {
    state.orgStructure.rawRegions.forEach(r => {
      regionSelect.innerHTML += `<option value="${r.id}">${r.name}</option>`;
    });
  } else {
    state.orgStructure.regions.forEach(rName => {
      regionSelect.innerHTML += `<option value="${rName}">${rName}</option>`;
    });
  }

  zoneSelect.innerHTML = `<option value="">-- 隢���豢��憭批��敺�頛���� --</option>`;
  groupSelect.innerHTML = `<option value="">-- 隢���豢����批��敺�頛���� --</option>`;
}

export function populateAdminZones() {
  const regionSelect = document.getElementById("admin-org-region");
  const zoneSelect = document.getElementById("admin-org-zone");
  const groupSelect = document.getElementById("admin-org-group");

  zoneSelect.innerHTML = `<option value="">-- 隢���豢����批�� --</option>`;
  groupSelect.innerHTML = `<option value="">-- 隢���豢����批��敺�頛���� --</option>`;

  const regionVal = regionSelect.value;
  if (!regionVal) return;

  if (state.isSupabaseMode && state.orgStructure.rawZones) {
    const regionZones = state.orgStructure.rawZones.filter(z => z.great_region_id === regionVal);
    regionZones.forEach(z => {
      zoneSelect.innerHTML += `<option value="${z.id}">${z.name}</option>`;
    });
  } else {
    const regionZones = state.orgStructure.zones[regionVal] || [];
    regionZones.forEach(zName => {
      zoneSelect.innerHTML += `<option value="${zName}">${zName}</option>`;
    });
  }
}

export function populateAdminGroups() {
  const zoneSelect = document.getElementById("admin-org-zone");
  const groupSelect = document.getElementById("admin-org-group");

  groupSelect.innerHTML = `<option value="">-- 隢���豢��撠�蝯� --</option>`;

  const zoneVal = zoneSelect.value;
  if (!zoneVal) return;

  if (state.isSupabaseMode && state.orgStructure.rawGroups) {
    const zoneGroups = state.orgStructure.rawGroups.filter(g => g.pastoral_zone_id === zoneVal);
    zoneGroups.forEach(g => {
      groupSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  } else {
    const zoneGroups = state.orgStructure.groups[zoneVal] || [];
    zoneGroups.forEach(gName => {
      groupSelect.innerHTML += `<option value="${gName}">${gName}</option>`;
    });
  }
}

export function showResponsibilityModal(role, user) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const container = document.createElement("div");
    container.className = "glass-card";
    container.style = `
      width: 90%;
      max-width: 460px;
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 16px;
      padding: 1.8rem;
      box-shadow: var(--shadow-lg);
      transform: translateY(20px);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `;
    
    let roleText = "";
    if (role === "great_zone_leader") roleText = "憭批�����";
    else if (role === "zone_leader") roleText = "������";
    else if (role === "group_leader") roleText = "撠�蝯����";
    
    let htmlContent = `
      <div style="margin-bottom: 0.2rem;">
        <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: 500; color: var(--text-primary);">
          閮剖�� ${roleText} ���鞎�鞎祉�����
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0; line-height: 1.4;">
          隢���暸�貉府�����⊥��蝞∟�����蝭����嚗���舀�渲����賂�����蝟餌絞撠�靘�甇斗��甈�蝞∠��甈�������
        </p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 0.8rem; max-height: 380px; overflow-y: auto; padding-right: 0.2rem;">
    `;
    
    if (role === "great_zone_leader") {
      htmlContent += `
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.3rem;">鞎�鞎砍之��� (��航�����)</label>
          <div id="modal-regions-container" style="background: var(--bg-input); border: 1px solid var(--border-card); border-radius: 6px; padding: 0.6rem; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.3rem;">
          </div>
        </div>
      `;
    } else if (role === "zone_leader") {
      htmlContent += `
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.3rem;">鞎�鞎祉�批�� (��航�����)</label>
          <div id="modal-zones-container" style="background: var(--bg-input); border: 1px solid var(--border-card); border-radius: 6px; padding: 0.6rem; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.3rem;">
          </div>
        </div>
      `;
    } else if (role === "group_leader") {
      htmlContent += `
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.3rem;">鞎�鞎砍��蝯� (��航�����)</label>
          <div id="modal-groups-container" style="background: var(--bg-input); border: 1px solid var(--border-card); border-radius: 6px; padding: 0.6rem; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.3rem;">
          </div>
        </div>
      `;
    }
    
    htmlContent += `
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 0.6rem; border-top: 1px solid var(--border-card); padding-top: 0.8rem; margin-top: 0.2rem;">
        <button id="modal-btn-cancel" class="pill-btn" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">���瘨�</button>
        <button id="modal-btn-confirm" class="primary-btn" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; font-weight: 500;">蝣箄��霈����</button>
      </div>
    `;
    
    container.innerHTML = htmlContent;
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.opacity = "1";
      container.style.transform = "translateY(0)";
    }, 10);
    
    const currentRegions = (user.managed_regions || user.great_region || "").split(",").map(s => s.trim()).filter(Boolean);
    const currentZones = (user.managed_zones || user.pastoral_zone || "").split(",").map(s => s.trim()).filter(Boolean);
    const currentGroups = (user.managed_groups || user.small_group || "").split(",").map(s => s.trim()).filter(Boolean);
    
    const regionContainer = overlay.querySelector("#modal-regions-container");
    const zoneContainer = overlay.querySelector("#modal-zones-container");
    const groupContainer = overlay.querySelector("#modal-groups-container");
    
    if (role === "great_zone_leader" && regionContainer) {
      let regions = [];
      if (state.isSupabaseMode && state.orgStructure.rawRegions) {
        regions = state.orgStructure.rawRegions;
      } else if (state.orgStructure.regions) {
        regions = state.orgStructure.regions.map(rName => ({ id: rName, name: rName }));
      }
      let html = "";
      regions.forEach(r => {
        const isChecked = currentRegions.includes(r.name) ? "checked" : "";
        html += `
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-primary); cursor: pointer; padding: 0.15rem 0;">
            <input type="checkbox" name="region-checkbox" value="${r.id}" data-name="${r.name}" ${isChecked} style="cursor: pointer;">
            <span>${r.name}</span>
          </label>
        `;
      });
      regionContainer.innerHTML = html || `<span style="font-size: 0.8rem; color: var(--text-muted);">��∪之���鞈����</span>`;
    }
    
    if (role === "zone_leader" && zoneContainer) {
      let zones = [];
      if (state.isSupabaseMode && state.orgStructure.rawZones) {
        state.orgStructure.rawZones.forEach(z => {
          const region = state.orgStructure.rawRegions?.find(r => r.id === z.great_region_id);
          const regionSuffix = region ? ` (${region.name})` : "";
          zones.push({ id: z.id, name: z.name, label: `${z.name}${regionSuffix}` });
        });
      } else if (state.orgStructure.zones) {
        for (const [rName, zList] of Object.entries(state.orgStructure.zones)) {
          zList.forEach(zName => {
            zones.push({ id: zName, name: zName, label: `${zName} (${rName})` });
          });
        }
      }
      let html = "";
      zones.forEach(z => {
        const isChecked = currentZones.includes(z.name) ? "checked" : "";
        html += `
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-primary); cursor: pointer; padding: 0.15rem 0;">
            <input type="checkbox" name="zone-checkbox" value="${z.id}" data-name="${z.name}" ${isChecked} style="cursor: pointer;">
            <span>${z.label}</span>
          </label>
        `;
      });
      zoneContainer.innerHTML = html || `<span style="font-size: 0.8rem; color: var(--text-muted);">��∠�批��鞈����</span>`;
    }
    
    if (role === "group_leader" && groupContainer) {
      let groups = [];
      if (state.isSupabaseMode && state.orgStructure.rawGroups) {
        state.orgStructure.rawGroups.forEach(g => {
          const zone = state.orgStructure.rawZones?.find(z => z.id === g.pastoral_zone_id);
          const zoneSuffix = zone ? ` (${zone.name})` : "";
          groups.push({ id: g.id, name: g.name, label: `${g.name}${zoneSuffix}` });
        });
      } else if (state.orgStructure.groups) {
        for (const [zName, gList] of Object.entries(state.orgStructure.groups)) {
          gList.forEach(gName => {
            groups.push({ id: gName, name: gName, label: `${gName} (${zName})` });
          });
        }
      }
      let html = "";
      groups.forEach(g => {
        const isChecked = currentGroups.includes(g.name) ? "checked" : "";
        html += `
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-primary); cursor: pointer; padding: 0.15rem 0;">
            <input type="checkbox" name="group-checkbox" value="${g.id}" data-name="${g.name}" ${isChecked} style="cursor: pointer;">
            <span>${g.label}</span>
          </label>
        `;
      });
      groupContainer.innerHTML = html || `<span style="font-size: 0.8rem; color: var(--text-muted);">��∪��蝯�鞈����</span>`;
    }
    
    const closeModal = (result) => {
      overlay.style.opacity = "0";
      container.style.transform = "translateY(20px)";
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 300);
    };
    
    overlay.querySelector("#modal-btn-cancel").onclick = () => closeModal(null);
    
    overlay.querySelector("#modal-btn-confirm").onclick = () => {
      if (role === "great_zone_leader") {
        const checkedRegions = Array.from(regionContainer.querySelectorAll("input[name='region-checkbox']:checked")).map(cb => cb.dataset.name);
        if (checkedRegions.length === 0) {
          alert("隢���喳����豢��銝����憭批��嚗�");
          return;
        }
        closeModal({
          managed_regions: checkedRegions.join(","),
          managed_zones: "",
          managed_groups: ""
        });
      } else if (role === "zone_leader") {
        const checkedZones = Array.from(zoneContainer.querySelectorAll("input[name='zone-checkbox']:checked")).map(cb => cb.dataset.name);
        if (checkedZones.length === 0) {
          alert("隢���喳����豢��銝������批��嚗�");
          return;
        }
        closeModal({
          managed_regions: "",
          managed_zones: checkedZones.join(","),
          managed_groups: ""
        });
      } else if (role === "group_leader") {
        const checkedGroups = Array.from(groupContainer.querySelectorAll("input[name='group-checkbox']:checked")).map(cb => cb.dataset.name);
        if (checkedGroups.length === 0) {
          alert("隢���喳����豢��銝����撠�蝯�嚗�");
          return;
        }
        closeModal({
          managed_regions: "",
          managed_zones: "",
          managed_groups: checkedGroups.join(",")
        });
      }
    };
  });
}
function updatePastoralWallControl(enabled, options = {}) {
  const toggle = document.getElementById("admin-pastoral-wall-toggle");
  const status = document.getElementById("admin-pastoral-wall-status");
  if (!toggle || !status) return;
  toggle.setAttribute("aria-checked", enabled ? "true" : "false");
  toggle.setAttribute("aria-label", enabled ? "撠�摮���批�����靽桀��鈭怎��" : "�����曄�批�����靽桀��鈭怎��");
  toggle.disabled = options.disabled === true;
  status.textContent = enabled ? "��桀�������橘��擐�������憿舐內���鈭怎��" : "��桀��撠�摮�嚗�擐����銝�憿舐內���鈭怎��";
}

export async function renderAdminFeatureSettings() {
  const card = document.querySelector(".admin-feature-settings-card")?.closest(".card-col");
  const toggle = document.getElementById("admin-pastoral-wall-toggle");
  const feedback = document.getElementById("admin-pastoral-wall-feedback");
  if (!card || !toggle || !feedback) return;

  const isAdmin = state.currentUser && state.currentUser.role === "admin";
  card.classList.toggle("hidden", !isAdmin);
  if (!isAdmin) return;

  feedback.classList.add("hidden");
  feedback.textContent = "";
  updatePastoralWallControl(false, { disabled: true });

  const result = await db.getFeatureSetting("pastoral_sharing_wall", false);
  if (result.error) {
    updatePastoralWallControl(false, { disabled: true });
    feedback.textContent = "��桀����⊥��霈����閮剖��嚗�隢�蝣箄��鞈����摨急�湔�啣歇摰�������";
    feedback.classList.remove("hidden");
    return;
  }

  updatePastoralWallControl(result.enabled === true);

  if (!toggle.dataset.featureSettingBound) {
    toggle.dataset.featureSettingBound = "true";
    toggle.addEventListener("click", async () => {
      const currentEnabled = toggle.getAttribute("aria-checked") === "true";
      const nextEnabled = !currentEnabled;
      updatePastoralWallControl(currentEnabled, { disabled: true });
      feedback.classList.add("hidden");

      const saveResult = await db.updateFeatureSetting("pastoral_sharing_wall", nextEnabled);
      if (saveResult.error) {
        updatePastoralWallControl(currentEnabled);
        feedback.textContent = "閮剖��瘝������脣��������嚗�隢�蝔�敺����閰艾��";
        feedback.classList.remove("hidden");
        return;
      }

      updatePastoralWallControl(nextEnabled);
      if (typeof showToast === "function") {
        showToast(nextEnabled ? "��批�����靽桀��鈭怎��撌脤�����" : "��批�����靽桀��鈭怎��撌脣��摮�");
      }
      window.dispatchEvent(new CustomEvent("pastoral-sharing-wall-changed", {
        detail: { enabled: nextEnabled }
      }));
    });
  }

  if (typeof hydrateIcons === "function") hydrateIcons(card);
}


export function init() {
  const searchInput = document.getElementById("admin-search-user");
  if (searchInput) {
    let debounceTimer;
    searchInput.oninput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderAdminUserManagement();
      }, 300);
    };
  }

  initAdminOrgManagement();
  initAdminFiltersUI();
}

// Bind to window for global access compatibility
window.renderAdminUserManagement = renderAdminUserManagement;
window.renderAdminOrgManagement = renderAdminOrgManagement;
window.initAdminFiltersUI = initAdminFiltersUI;
window.renderAdminFeatureSettings = renderAdminFeatureSettings;
window.openAdminFilterBottomSheet = openAdminFilterBottomSheet;
window.closeAdminFilterBottomSheet = closeAdminFilterBottomSheet;
window.initAdminUserManagement = init;
