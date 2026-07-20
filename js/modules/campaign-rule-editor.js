// Admin editor for versioned church campaign rules.
function openCampaignRuleEditor(plan) {
  const definition = window.cloneChurchCampaign(plan.campaignDefinition || window.CHURCH_CAMPAIGN);
  document.getElementById("campaign-rule-editor")?.remove();

  const formatReadings = readings => (readings || []).map(reading =>
    reading.to ? `${reading.book} ${reading.from || 1}-${reading.to}` : reading.book
  ).join("\uff1b");
  const parseReadings = value => String(value || "").split(/[\uff1b;\n]/).map(value => value.trim()).filter(Boolean).map(value => {
    const match = value.match(/^(.+?)\s+(\d+)(?:\s*-\s*(\d+))?$/);
    return match
      ? { book: match[1].trim(), from: Number(match[2]), to: Number(match[3] || match[2]) }
      : { book: value, from: 1, to: null };
  });

  const overlay = document.createElement("div");
  overlay.id = "campaign-rule-editor";
  overlay.style.cssText = "position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.62);display:flex;align-items:center;justify-content:center;padding:1rem;";
  overlay.innerHTML = `
    <form id="campaign-rule-form" class="glass-card" style="width:min(1080px,100%);max-height:92vh;overflow:auto;padding:1.25rem;background:var(--bg-card);border:1px solid var(--border-card);">
      <div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:1rem;">
        <div><h3 style="margin:0;color:var(--text-primary);">\u7de8\u8f2f\u6559\u6703\u8b80\u7d93\u8a08\u756b\u898f\u5247</h3>
        <p style="margin:.3rem 0 0;font-size:.78rem;color:var(--text-muted);">\u76ee\u524d\u7248\u672c v${Number(plan.ruleVersion || 1)}\uff1b\u767c\u5e03\u6703\u4fdd\u7559\u820a\u7248\u672c\u8207\u65e2\u6709\u6253\u5361\u3002</p></div>
        <button type="button" data-close class="pill-btn">\u95dc\u9589</button>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:.6rem;margin-bottom:1rem;">
        <label style="grid-column:1/-1;font-size:.76rem;color:var(--text-secondary);">\u8a08\u756b\u540d\u7a31<input id="campaign-name" class="form-control" value="${escapeHTML(definition.name)}"></label>
        <label style="grid-column:1/-1;font-size:.76rem;color:var(--text-secondary);">\u8a08\u756b\u8aaa\u660e<textarea id="campaign-description" class="form-control" rows="2">${escapeHTML(definition.description || "")}</textarea></label>
        <label style="font-size:.76rem;color:var(--text-secondary);">\u958b\u59cb\u65e5\u671f<input id="campaign-start" type="date" class="form-control" value="${definition.startDate}"></label>
        <label style="font-size:.76rem;color:var(--text-secondary);">\u7d50\u675f\u65e5\u671f<input id="campaign-end" type="date" class="form-control" value="${definition.endDate}"></label>
        <label style="font-size:.76rem;color:var(--text-secondary);">\u8b8a\u66f4\u7bc4\u570d<select id="campaign-change-mode" class="form-control"><option value="future_only">\u53ea\u8abf\u6574\u4eca\u5929\u4ee5\u5f8c</option><option value="all">\u91cd\u65b0\u5957\u7528\u5168\u90e8\u65e5\u671f</option></select></label>
      </div>
      <fieldset style="border:1px solid var(--border-card);border-radius:12px;padding:.8rem;margin:0 0 1rem;">
        <legend style="font-size:.86rem;color:var(--text-primary);">\u53c3\u8cfd\u8207\u5206\u968a</legend>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;">
          <label>\u5c0f\u5bb6\u6700\u5c11<input id="small-home-min" type="number" min="2" max="4" class="form-control" value="${definition.rules.teamRules.smallHome.min}"></label>
          <label>\u5c0f\u5bb6\u6700\u591a<input id="small-home-max" type="number" min="2" max="4" class="form-control" value="${definition.rules.teamRules.smallHome.max}"></label>
          <label>\u5c0f\u7d44\u8cc7\u683c\u4eba\u6578<input id="small-group-min" type="number" min="6" class="form-control" value="${definition.rules.teamRules.smallGroup.min}"></label>
          <label style="padding-top:1.4rem;"><input id="campaign-mid-join" type="checkbox" ${definition.rules.allowMidJoin ? "checked" : ""}> \u5141\u8a31\u4e2d\u9014\u52a0\u5165</label>
        </div>
        <p style="font-size:.72rem;color:var(--text-muted);margin:.5rem 0 0;">\u5c0f\u7d44\u4f9d\u6703\u54e1\u57fa\u672c\u8cc7\u6599\u81ea\u52d5\u5206\u968a\uff0c\u9054\u8a2d\u5b9a\u4eba\u6578\u5373\u7b26\u5408\u8cc7\u683c\uff0c\u4e0d\u8a2d\u4e0a\u9650\u3002</p>
      </fieldset>
      <h4 style="margin:.7rem 0;color:var(--text-primary);">\u8f2a\u6b21\u3001\u6e2c\u9a57\u8207\u7d2f\u9032\u734e\u9805</h4>
      <div id="campaign-stage-rows" style="display:flex;flex-direction:column;gap:.45rem;">
        ${definition.stages.map((stage, index) => `<div class="campaign-stage-row" data-index="${index}" style="display:grid;grid-template-columns:55px 1.3fr 1fr 1fr 1fr 1fr;gap:.4rem;">
          <input data-field="stageNo" type="number" class="form-control" value="${stage.stageNo}">
          <input data-field="name" class="form-control" value="${escapeHTML(stage.name)}">
          <input data-field="startDate" type="date" class="form-control" value="${stage.startDate}">
          <input data-field="endDate" type="date" class="form-control" value="${stage.endDate}">
          <input data-field="examDate" type="date" class="form-control" value="${stage.examDate || ""}">
          <input data-field="awardName" class="form-control" value="${escapeHTML(stage.awardName)}">
        </div>`).join("")}
      </div>
      <h4 style="margin:1rem 0 .3rem;color:var(--text-primary);">\u7d93\u5377\u8207\u7ae0\u7bc0\u6392\u7a0b</h4>
      <p style="font-size:.72rem;color:var(--text-muted);margin:0 0 .55rem;">\u683c\u5f0f\uff1a\u5275\u4e16\u8a18 1-50\uff1b\u51fa\u57c3\u53ca\u8a18 1-40\u3002\u53ea\u5beb\u7d93\u5377\u540d\u7a31\u4ee3\u8868\u6574\u5377\u3002</p>
      <div id="campaign-segment-rows" style="display:flex;flex-direction:column;gap:.4rem;">
        ${definition.segments.map((segment, index) => `<div class="campaign-segment-row" data-index="${index}" style="display:grid;grid-template-columns:55px 105px 1fr 1fr 2.2fr;gap:.4rem;">
          <input data-field="stageNo" type="number" class="form-control" value="${segment.stageNo}">
          <input data-field="label" class="form-control" value="${escapeHTML(segment.label)}">
          <input data-field="startDate" type="date" class="form-control" value="${segment.startDate}">
          <input data-field="endDate" type="date" class="form-control" value="${segment.endDate}">
          <input data-field="readings" class="form-control" value="${escapeHTML(formatReadings(segment.readings))}">
        </div>`).join("")}
      </div>
      <div id="campaign-editor-result" role="alert" style="display:none;margin-top:.8rem;padding:.7rem;border-radius:10px;font-size:.78rem;"></div>
      <div style="position:sticky;bottom:-1.25rem;display:flex;justify-content:flex-end;gap:.6rem;margin:1rem -1.25rem -1.25rem;padding:.8rem 1.25rem;background:var(--bg-card);border-top:1px solid var(--border-card);">
        <button type="button" data-close class="pill-btn">\u53d6\u6d88</button><button type="submit" class="primary-btn">\u9a57\u8b49\u4e26\u767c\u5e03\u65b0\u7248\u672c</button>
      </div>
    </form>`;
  document.body.appendChild(overlay);
  overlay.querySelector("#campaign-change-mode").value = definition.rules.applyChangesFrom || "future_only";
  overlay.querySelectorAll("[data-close]").forEach(button => button.onclick = () => overlay.remove());
  overlay.onclick = event => { if (event.target === overlay) overlay.remove(); };

  overlay.querySelector("#campaign-rule-form").onsubmit = async event => {
    event.preventDefault();
    const next = window.cloneChurchCampaign(definition);
    next.name = overlay.querySelector("#campaign-name").value.trim();
    next.description = overlay.querySelector("#campaign-description").value.trim();
    next.startDate = overlay.querySelector("#campaign-start").value;
    next.endDate = overlay.querySelector("#campaign-end").value;
    next.rules.applyChangesFrom = overlay.querySelector("#campaign-change-mode").value;
    next.rules.allowMidJoin = overlay.querySelector("#campaign-mid-join").checked;
    next.rules.teamRules.smallHome.min = Number(overlay.querySelector("#small-home-min").value);
    next.rules.teamRules.smallHome.max = Number(overlay.querySelector("#small-home-max").value);
    next.rules.teamRules.smallGroup.min = Number(overlay.querySelector("#small-group-min").value);
    next.rules.teamRules.smallGroup.max = null;
    next.rules.teamRules.smallGroup.source = "profile.small_group";

    next.stages = Array.from(overlay.querySelectorAll(".campaign-stage-row")).map((row, index) => {
      const value = field => row.querySelector(`[data-field="${field}"]`).value;
      return { ...definition.stages[index], stageNo: Number(value("stageNo")), name: value("name").trim(), startDate: value("startDate"), endDate: value("endDate"), examDate: value("examDate") || null, awardName: value("awardName").trim() };
    });
    next.segments = Array.from(overlay.querySelectorAll(".campaign-segment-row")).map((row, index) => {
      const value = field => row.querySelector(`[data-field="${field}"]`).value;
      return { ...definition.segments[index], stageNo: Number(value("stageNo")), label: value("label").trim(), startDate: value("startDate"), endDate: value("endDate"), readings: parseReadings(value("readings")) };
    });

    if (next.rules.applyChangesFrom === "future_only") {
      const today = new Date();
      const todayIso = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      next.stages = next.stages.map((stage, index) =>
        definition.stages[index] && definition.stages[index].endDate < todayIso ? definition.stages[index] : stage
      );
      next.segments = next.segments.map((segment, index) =>
        definition.segments[index] && definition.segments[index].endDate < todayIso ? definition.segments[index] : segment
      );
    }

    const validation = window.validateChurchCampaign(next, BIBLE_BOOKS);
    const result = overlay.querySelector("#campaign-editor-result");
    result.style.display = "block";
    if (!validation.valid) {
      result.style.background = "var(--color-danger-soft)";
      result.style.color = "var(--color-danger)";
      result.textContent = validation.errors.join(" ");
      return;
    }
    result.style.background = "var(--color-success-soft)";
    result.style.color = "var(--color-success-foreground)";
    result.textContent = `\u9a57\u8b49\u901a\u904e\uff1a\u5171 ${validation.chapterCount} \u7ae0\u3002${validation.warnings.join(" ")}`;
    if (!confirm(`\u78ba\u8a8d\u767c\u5e03\u65b0\u7248\u672c\uff1f\u76ee\u524d\u6392\u7a0b\u5171 ${validation.chapterCount} \u7ae0\u3002`)) return;

    loader.show("\u6b63\u5728\u767c\u5e03\u6559\u6703\u8a08\u756b\u65b0\u7248\u672c\u2026");
    const published = await db.publishCampaignRules(plan, next);
    loader.hide();
    if (!published.success) return;
    overlay.remove();
    showToast(`\u6559\u6703\u8a08\u756b v${published.version} \u5df2\u767c\u5e03\u3002`);
    if (typeof renderPlanView === "function") await renderPlanView();
  };
}
window.openCampaignRuleEditor = openCampaignRuleEditor;

