/**
 * 管理者後台與投影簡報錯題檢討模組
 * 功能：成績查閱與匯出、遊戲參數調校、角色圖片上傳更換、題庫更新與匯入、投影簡報錯題檢討
 */

class AdminManager {
  constructor() {
    this.isAuthenticated = false;
    this.adminPasscode = "sjps888";
    this.currentSlideIndex = 0;
    this.slidesList = [];
    this.initKeyboardEvents();
  }

  // 開啟後台登入檢查 (Google 驗證 / 離線密碼)
  open() {
    if (this.isAuthenticated) {
      this.showAdminModal();
    } else {
      this.showLoginModal();
    }
  }

  showLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.remove('hidden');
  }

  closeLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.add('hidden');
  }

  // Google 帳號管理者身分驗證 (資安強化版本)
  async loginWithGoogle() {
    const fb = window.firebaseBridge;
    if (!fb || !fb.isInitialized) {
      alert("【Firebase 尚未完成連線設定】\n\n請先依據設定指南啟用 Firebase，或直接使用管理密碼進行登入。");
      return;
    }

    try {
      const user = await fb.loginWithGoogle();
      const isAuthorized = await fb.isAdmin(user);
      if (isAuthorized) {
        this.isAuthenticated = true;
        this.adminUser = user;
        this.closeLoginModal();
        this.showAdminModal();
        this.updateAdminStatusUI();
        alert(`🎉 驗證成功！歡迎管理員 ${user.displayName || ''} 進入後台。`);
      } else {
        await fb.logout();
        alert("⛔ 存取遭拒：此 Google 帳號未獲得本系統管理者授權。");
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        alert("Google 登入失敗: " + err.message);
      }
    }
  }

  // 管理密碼驗證
  loginWithPassword() {
    const pwdInput = document.getElementById('adminPasswordInput');
    const pwd = pwdInput ? pwdInput.value : '';
    if (pwd === this.adminPasscode) {
      this.isAuthenticated = true;
      this.adminUser = { email: "管理者 (密碼驗證)", displayName: "管理員" };
      this.closeLoginModal();
      this.showAdminModal();
      this.updateAdminStatusUI();
      if (pwdInput) pwdInput.value = '';
    } else {
      alert("管理密碼錯誤，請重新輸入！");
    }
  }

  logout() {
    if (confirm("確定要登出教師管理後台嗎？")) {
      this.isAuthenticated = false;
      this.adminUser = null;
      if (window.firebaseBridge) window.firebaseBridge.logout();
      this.close();
      alert("已成功登出管理後台。");
    }
  }

  updateAdminStatusUI() {
    const badge = document.getElementById('adminUserStatusBadge');
    if (badge && this.adminUser) {
      badge.textContent = `👤 管理者：${this.adminUser.email} (已通過驗證)`;
    }
  }

  showAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.classList.remove('hidden');
      this.switchTab('recordsTab');
      this.updateAdminStatusUI();
    }
  }

  close() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
  }

  switchTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');

    const activeBtn = document.querySelector(`.admin-nav-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'recordsTab') this.renderRecords();
    if (tabId === 'settingsTab') this.renderSettings();
    if (tabId === 'classesTab') this.renderClassesManagement();
    if (tabId === 'heroesTab') this.renderHeroesManagement();
    if (tabId === 'questionsTab') this.renderQuestionsManagement();
    if (tabId === 'reviewTab') this.renderReviewSummary();
  }

  // ==================== TAB 1: 挑戰者成績紀錄 ====================
  getRecords() {
    const saved = localStorage.getItem('sjps_challenger_records');
    if (!saved) return [];
    try { return JSON.parse(saved); } catch (e) { return []; }
  }

  renderRecords() {
    const records = this.getRecords();
    const container = document.getElementById('recordsTableBody');
    const filterClass = document.getElementById('recordClassFilter')?.value || 'ALL';
    if (!container) return;

    const filtered = records.filter(r => filterClass === 'ALL' || r.studentClass === filterClass);

    if (filtered.length === 0) {
      container.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 25px; color:#888;">尚未有挑戰紀錄。點擊下方按鈕可產生班級示範數據以供測試！</td></tr>`;
      return;
    }

    container.innerHTML = filtered.map((r, idx) => `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td>${r.date || '-'}</td>
        <td><span class="badge-tag">${r.studentClass}</span> ${r.seatNo}</td>
        <td><strong>${r.name}</strong></td>
        <td>${r.heroName} (Lv.${r.level})</td>
        <td><span class="text-green font-bold">${r.totalScore}</span></td>
        <td>1關:${r.stageScores?.[1]||0} / 2關:${r.stageScores?.[2]||0} / 3關:${r.stageScores?.[3]||0}</td>
        <td>${r.accuracy}%</td>
        <td>${r.maxCombo} 連擊</td>
        <td><span class="${r.wrongCount > 0 ? 'text-danger font-bold' : 'text-green'}">${r.wrongCount} 題</span></td>
      </tr>
    `).join('');
  }

  exportRecordsCsv() {
    const records = this.getRecords();
    if (records.length === 0) {
      alert("目前沒有任何挑戰者紀錄可匯出！");
      return;
    }

    // 建立 UTF-8 BOM 與 CSV 表頭
    let csv = "\uFEFF序號,挑戰時間,班級,座號,姓名,出戰英雄,總積分,第一關得分,第二關得分,第三關得分,答題準確率,最高連擊,答錯題數,通關秒數\n";
    records.forEach((r, idx) => {
      csv += `"${idx + 1}","${r.date}","${r.studentClass}","${r.seatNo}","${r.name}","${r.heroName}","${r.totalScore}","${r.stageScores?.[1]||0}","${r.stageScores?.[2]||0}","${r.stageScores?.[3]||0}","${r.accuracy}%","${r.maxCombo}","${r.wrongCount}","${r.durationSeconds}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SJPS_黑金魔法術_學生挑戰成績表_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  generateSampleData() {
    const sampleHeroes = window.heroManager.getAll();
    const names = ["林小睿", "陳宇恩", "黃巧晴", "張佑嘉", "李心怡", "王宥翔", "吳羽辰", "劉子齊"];
    const records = names.map((name, i) => {
      const hero = sampleHeroes[i % sampleHeroes.length];
      const s1 = 300 + Math.floor(Math.random() * 200);
      const s2 = 350 + Math.floor(Math.random() * 200);
      const s3 = 400 + Math.floor(Math.random() * 250);
      const total = s1 + s2 + s3;
      return {
        id: "sample_" + Date.now() + "_" + i,
        name: name,
        studentClass: "六年一班",
        seatNo: `${i + 1}號`,
        heroId: hero.id,
        heroName: hero.name,
        totalScore: total,
        stageScores: { 1: s1, 2: s2, 3: s3 },
        accuracy: 75 + Math.floor(Math.random() * 25),
        level: 2 + Math.floor(Math.random() * 2),
        maxCombo: 3 + Math.floor(Math.random() * 5),
        durationSeconds: 150 + Math.floor(Math.random() * 80),
        wrongCount: Math.floor(Math.random() * 3),
        wrongDetails: [],
        date: new Date(Date.now() - i * 1800000).toLocaleString('zh-TW', { hour12: false })
      };
    });

    localStorage.setItem('sjps_challenger_records', JSON.stringify(records));
    this.renderRecords();
    alert("已成功注入 8 筆六年一班學生挑戰範例數據！");
  }

  clearRecords() {
    if (confirm("確定要清空所有學生挑戰成績紀錄嗎？此動作無法復原。")) {
      localStorage.removeItem('sjps_challenger_records');
      this.renderRecords();
    }
  }

  // 從 Firebase 雲端資料庫同步成績
  async syncRecordsFromFirebase() {
    const fb = window.firebaseBridge;
    if (!fb || !fb.isInitialized) {
      alert("【Firebase 尚未連線】\n\n目前使用本機離線資料庫 (localStorage)。若已於 Firebase Console 建立 blackgold2 專案，請檢查 js/firebase-config.js 金鑰設定。");
      return;
    }
    const cloudRecords = await fb.fetchAllRecords();
    if (cloudRecords && cloudRecords.length > 0) {
      localStorage.setItem('sjps_challenger_records', JSON.stringify(cloudRecords));
      this.renderRecords();
      alert(`☁️ 已成功從 Firebase 雲端資料庫同步 ${cloudRecords.length} 筆最新學生挑戰成績！`);
    } else {
      alert("Firebase 雲端資料庫目前尚無新紀錄。學生完成挑戰後將會自動同步上傳！");
    }
  }

  // ==================== 班級清單設定與名冊管理 (CLASS LIST MANAGEMENT) ====================
  getClassList() {
    const saved = localStorage.getItem('sjps_class_list');
    if (!saved) {
      return ["六年一班", "六年二班", "六年三班", "六年四班", "五年一班", "五年二班", "四年一班", "三年一班", "溪洲魔法班"];
    }
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["六年一班", "六年二班", "六年三班", "溪洲魔法班"];
    } catch (e) {
      return ["六年一班", "六年二班", "六年三班", "溪洲魔法班"];
    }
  }

  saveClassList(list) {
    localStorage.setItem('sjps_class_list', JSON.stringify(list));
    this.updateAllClassDropdowns();
    if (window.firebaseBridge) {
      window.firebaseBridge.saveClassList(list);
    }
  }

  addNewClass() {
    const input = document.getElementById('newClassNameInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      alert("請輸入要新增的班級名稱！");
      return;
    }
    const list = this.getClassList();
    if (list.includes(name)) {
      alert("該班級名稱已存在於清單中！");
      return;
    }
    list.push(name);
    this.saveClassList(list);
    input.value = '';
    this.renderClassesManagement();
    alert(`🎉 班級「${name}」已成功新增！已同步更新至學生登入選單。`);
  }

  deleteClass(index) {
    const list = this.getClassList();
    const target = list[index];
    if (!target) return;
    if (confirm(`確定要刪除班級「${target}」嗎？`)) {
      list.splice(index, 1);
      if (list.length === 0) list.push("溪洲魔法班");
      this.saveClassList(list);
      this.renderClassesManagement();
    }
  }

  resetClassesDefault() {
    if (confirm("確定要恢復官方預設班級清單嗎？")) {
      const defaults = ["六年一班", "六年二班", "六年三班", "六年四班", "五年一班", "五年二班", "四年一班", "三年一班", "溪洲魔法班"];
      this.saveClassList(defaults);
      this.renderClassesManagement();
      alert("已成功恢復官方預設班級清單！");
    }
  }

  renderClassesManagement() {
    const container = document.getElementById('adminClassesListContainer');
    if (!container) return;
    const list = this.getClassList();
    container.innerHTML = list.map((cls, idx) => `
      <div class="class-manage-chip" style="display:inline-flex; align-items:center; gap:8px; background:#e8f5e9; border:2px solid #a5d6a7; padding:8px 16px; border-radius:999px; font-weight:800; color:#1b5e20;">
        <span>🏫 ${cls}</span>
        <button style="border:none; background:transparent; color:#c62828; font-weight:900; cursor:pointer; font-size:16px; margin-left:6px;" onclick="adminPanel.deleteClass(${idx})" title="刪除此班級">✕</button>
      </div>
    `).join('');
  }

  updateAllClassDropdowns() {
    const list = this.getClassList();

    // 1. 首頁學生登入下拉選單
    const studentSelect = document.getElementById('studentClassSelect');
    if (studentSelect) {
      const prevVal = studentSelect.value;
      studentSelect.innerHTML = list.map(cls => `<option value="${cls}">${cls}</option>`).join('');
      if (list.includes(prevVal)) {
        studentSelect.value = prevVal;
      }
    }

    // 2. 教師後台成績篩選下拉選單
    const filterSelect = document.getElementById('recordClassFilter');
    if (filterSelect) {
      const prevFilter = filterSelect.value;
      filterSelect.innerHTML = `<option value="ALL">全部班級</option>` + list.map(cls => `<option value="${cls}">${cls}</option>`).join('');
      if (prevFilter && (prevFilter === 'ALL' || list.includes(prevFilter))) {
        filterSelect.value = prevFilter;
      }
    }
  }

  // ==================== TAB 2: 參數調整 ====================
  renderSettings() {
    const s = window.game.settings;
    document.getElementById('setInitialHp').value = s.initialHp;
    document.getElementById('setWrongPenalty').value = s.wrongPenalty;
    document.getElementById('setTimeLimit').value = s.timeLimit;
    document.getElementById('setBaseScore').value = s.baseScore;
    const zhuyinCheck = document.getElementById('setZhuyinMode');
    if (zhuyinCheck) {
      zhuyinCheck.checked = window.zhuyinManager.isEnabled();
    }
  }

  saveSettings() {
    const s = window.game.settings;
    s.initialHp = parseInt(document.getElementById('setInitialHp').value) || 100;
    s.wrongPenalty = parseInt(document.getElementById('setWrongPenalty').value) || 20;
    s.timeLimit = parseInt(document.getElementById('setTimeLimit').value) || 25;
    s.baseScore = parseInt(document.getElementById('setBaseScore').value) || 100;
    window.game.saveSettings();

    const zhuyinCheck = document.getElementById('setZhuyinMode');
    if (zhuyinCheck) {
      window.zhuyinManager.setEnabled(zhuyinCheck.checked);
      if (window.game.refreshCurrentQuestionView) {
        window.game.refreshCurrentQuestionView();
      }
      // 同步頂部導航列按鈕文字
      const btn = document.getElementById('btnToggleZhuyin');
      if (btn) btn.textContent = zhuyinCheck.checked ? '🔤 注音: 開' : '🔤 注音: 關';
    }

    alert("✨ 遊戲規則、數值參數與低年級注音設定已成功儲存！");
  }

  // ==================== TAB 3: 角色管理與圖片上傳 ====================
  renderHeroesManagement() {
    const grid = document.getElementById('adminHeroesGrid');
    if (!grid) return;

    const heroes = window.heroManager.getAll();
    grid.innerHTML = heroes.map(hero => `
      <div class="admin-hero-card" data-hero-id="${hero.id}">
        <div class="admin-hero-avatar-wrap" style="background: ${hero.avatarBg}">
          ${window.heroManager.getHeroImageHtml(hero, 'admin-preview-img')}
        </div>
        <div class="admin-hero-content">
          <h4>${hero.name}</h4>
          <span class="element-tag">${hero.element}</span>
          <div class="admin-file-upload-row">
            <label class="btn-file-label">
              📁 上傳更換圖片
              <input type="file" accept="image/*" onchange="adminPanel.handleHeroImageUpload('${hero.id}', this)" style="display:none;" />
            </label>
            ${hero.customImage ? `<button class="btn-reset-hero-img" onclick="adminPanel.resetHeroImage('${hero.id}')">恢復預設</button>` : ''}
          </div>
          <div class="admin-hero-edit-fields">
            <label>角色稱號：<input type="text" id="hTitle_${hero.id}" value="${hero.title}" class="input-sm" /></label>
            <label>被動天賦：<input type="text" id="hSkill_${hero.id}" value="${hero.passiveSkill}" class="input-sm" /></label>
          </div>
          <button class="btn-save-single-hero" onclick="adminPanel.saveHeroMeta('${hero.id}')">儲存角色文字</button>
        </div>
      </div>
    `).join('');
  }

  handleHeroImageUpload(heroId, inputEl) {
    const file = inputEl.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("請選擇正確的圖片檔案格式（PNG, JPG, WebP, GIF）！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      window.heroManager.updateHeroImage(heroId, dataUrl);
      this.renderHeroesManagement();
      alert("🎉 英雄角色圖片已成功更換！在遊戲中將會清晰放大顯示。");
    };
    reader.readAsDataURL(file);
  }

  resetHeroImage(heroId) {
    if (confirm("確定要將該英雄圖片恢復為預設高解析向量繪圖嗎？")) {
      window.heroManager.resetHeroImage(heroId);
      this.renderHeroesManagement();
    }
  }

  saveHeroMeta(heroId) {
    const hero = window.heroManager.getHeroById(heroId);
    if (!hero) return;

    const newTitle = document.getElementById(`hTitle_${heroId}`)?.value;
    const newSkill = document.getElementById(`hSkill_${heroId}`)?.value;

    if (newTitle) hero.title = newTitle;
    if (newSkill) hero.passiveSkill = newSkill;

    window.heroManager.saveHeroes();
    alert(`【${hero.name}】設定已儲存！`);
  }

  // ==================== TAB 4: 題庫管理與上傳更新 ====================
  renderQuestionsManagement() {
    const container = document.getElementById('adminQuestionsList');
    const stageFilter = parseInt(document.getElementById('adminStageFilter')?.value || 0);
    if (!container) return;

    let list = window.questionBank.questions;
    if (stageFilter > 0) {
      list = list.filter(q => q.stage === stageFilter);
    }

    container.innerHTML = list.map((q, idx) => `
      <div class="admin-q-card">
        <div class="admin-q-header">
          <span class="stage-tag">第 ${q.stage} 關</span>
          <span class="category-tag">${q.category}</span>
          <span class="q-id-tag">ID: ${q.id}</span>
          <div class="q-actions">
            <button class="btn-delete-q" onclick="adminPanel.deleteQuestion('${q.id}')">🗑️ 刪除</button>
          </div>
        </div>
        <div class="admin-q-stem">${idx + 1}. ${q.question}</div>
        <div class="admin-q-options">
          ${q.options.map((opt, oIdx) => `
            <div class="admin-opt-item ${oIdx === q.answer ? 'is-correct' : ''}">
              ${['A', 'B', 'C', 'D'][oIdx]}. ${opt} ${oIdx === q.answer ? ' (✅ 正確解答)' : ''}
            </div>
          `).join('')}
        </div>
        <div class="admin-q-explanation">
          <strong>🎓 教學觀念解析（投影簡報版重點）：</strong>${q.explanation}
        </div>
      </div>
    `).join('');
  }

  addNewQuestionPrompt() {
    const stage = parseInt(prompt("請輸入關卡編號 (1:黑金魔法術, 2:廚餘分類王, 3:堆肥小勇士)：", "1")) || 1;
    const category = prompt("請輸入題目類別（例如：七步驟循環、生熟廚餘辨識、碳氮比）：", "環保知識") || "一般";
    const question = prompt("請輸入題目內容：");
    if (!question) return;

    const optA = prompt("請輸入選項 A：");
    const optB = prompt("請輸入選項 B：");
    const optC = prompt("請輸入選項 C：");
    const optD = prompt("請輸入選項 D：");
    const ans = parseInt(prompt("請輸入正確答案編號 (0 代表 A, 1 代表 B, 2 代表 C, 3 代表 D)：", "0")) || 0;
    const explanation = prompt("請輸入教師重點解析（供投影簡報檢討使用）：") || "此觀念為重要環境教育要點。";

    window.questionBank.addQuestion({
      stage,
      category,
      question,
      options: [optA, optB, optC, optD].filter(Boolean),
      answer: ans,
      hint: "仔細思考大自然法則喔！",
      explanation
    });

    this.renderQuestionsManagement();
    alert("題目新增成功！");
  }

  deleteQuestion(qId) {
    if (confirm("確定要刪除這道題目嗎？")) {
      window.questionBank.deleteQuestion(qId);
      this.renderQuestionsManagement();
    }
  }

  exportQuestionsJson() {
    const dataStr = JSON.stringify(window.questionBank.questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SJPS_永續食物循環題庫_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importQuestionsJson(inputEl) {
    const file = inputEl.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("題庫格式必須為題目陣列！");
        }
        window.questionBank.questions = parsed;
        window.questionBank.saveQuestions();
        this.renderQuestionsManagement();
        alert(`🎉 成功匯入更新 ${parsed.length} 道題庫！`);
      } catch (err) {
        alert("匯入失敗：檔案格式不符合 JSON 規範 (" + err.message + ")");
      }
    };
    reader.readAsText(file);
  }

  resetQuestionsDefault() {
    if (confirm("確定要恢復官方預設題庫嗎？所有自訂題目將被重設。")) {
      window.questionBank.resetToDefault();
      this.renderQuestionsManagement();
      alert("已恢復預設題庫！");
    }
  }

  // ==================== TAB 5: 投影簡報版錯題檢討 (🌟 HIGHLIGHT) ====================
  renderReviewSummary() {
    const container = document.getElementById('reviewSummaryContainer');
    if (!container) return;

    const list = window.questionBank.getErrorRanking();
    container.innerHTML = `
      <div class="review-intro-box">
        <h3>📽️ 電子白板 / 投影機 全螢幕錯題檢討簡報模式</h3>
        <p>系統已自動統整所有學生作答錯誤數據，按「錯誤率最高」依序排列。點擊下方按鈕可一鍵進入劇院級高對比度簡報模式，支援鍵盤左右鍵切換，方便全班進行精準錯題解說與觀念複習！</p>
        <button class="btn-start-presentation" onclick="adminPanel.startProjectorSlideshow()">
          🖥️ 立即啟動全螢幕投影簡報模式 (快捷鍵: F 全螢幕)
        </button>
      </div>

      <div class="error-ranking-preview">
        <h4>📊 全校/全班 易錯題型排行榜 TOP 5</h4>
        <div class="ranking-preview-list">
          ${list.slice(0, 5).map((item, idx) => `
            <div class="rank-preview-item" onclick="adminPanel.startProjectorSlideshow(${idx})">
              <span class="rank-badge rank-${idx + 1}">TOP ${idx + 1}</span>
              <span class="rank-error-count">答錯 ${item.errorCount} 次</span>
              <span class="rank-stage-pill">第 ${item.question.stage} 關</span>
              <span class="rank-stem">${item.question.question}</span>
              <button class="btn-jump-slide">簡報解說 ➔</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 啟動全螢幕投影簡報模式
  startProjectorSlideshow(startIndex = 0) {
    this.slidesList = window.questionBank.getErrorRanking();
    if (this.slidesList.length === 0) {
      alert("目前尚無足夠的題庫資料！");
      return;
    }

    this.currentSlideIndex = Math.max(0, Math.min(startIndex, this.slidesList.length - 1));
    this.close(); // 關閉一般設定後台

    const projectorModal = document.getElementById('projectorSlideModal');
    if (projectorModal) {
      projectorModal.classList.remove('hidden');
      this.renderCurrentSlide();
    }
  }

  closeProjectorSlideshow() {
    const projectorModal = document.getElementById('projectorSlideModal');
    if (projectorModal) projectorModal.classList.add('hidden');
    this.showAdminModal(); // 回到後台
  }

  renderCurrentSlide() {
    const item = this.slidesList[this.currentSlideIndex];
    if (!item) return;

    const q = item.question;
    const totalSlides = this.slidesList.length;

    // 簡報頁碼與統計
    document.getElementById('slidePageIndicator').textContent = `${this.currentSlideIndex + 1} / ${totalSlides}`;
    document.getElementById('slideStageTag').textContent = `第 ${q.stage} 關：${['黑金魔法術', '廚餘分類王', '堆肥小勇士'][q.stage - 1]}`;
    document.getElementById('slideCategoryTag').textContent = q.category;
    document.getElementById('slideErrorBadge').textContent = item.errorCount > 0 
      ? `⚠️ 全班共累積 ${item.errorCount} 人次答錯` 
      : `✅ 全班掌握度優良`;

    // 巨大題目文字（投影機遠距清晰可見，支援注音模式）
    document.getElementById('slideQuestionStem').innerHTML = window.zhuyinManager.annotate(q.question);

    // 選項長條圖與正解呈現
    const optionsGrid = document.getElementById('slideOptionsGrid');
    const letters = ['A', 'B', 'C', 'D'];
    const totalPicks = Object.values(item.optionPicks).reduce((a, b) => a + b, 0) || 1;

    optionsGrid.innerHTML = q.options.map((opt, idx) => {
      const isCorrect = idx === q.answer;
      const pickCount = item.optionPicks[idx] || 0;
      const pct = Math.round((pickCount / totalPicks) * 100);

      return `
        <div class="slide-option-card ${isCorrect ? 'is-correct-slide' : ''}">
          <div class="slide-opt-top">
            <span class="slide-opt-letter">${letters[idx]}</span>
            <span class="slide-opt-text">${window.zhuyinManager.annotate(opt)}</span>
            ${isCorrect ? `<span class="slide-correct-stamp">✨ 正確解答</span>` : ''}
          </div>
          ${item.errorCount > 0 ? `
            <div class="slide-stats-bar-wrap">
              <div class="slide-stats-bar-fill" style="width: ${pct}%"></div>
              <span class="slide-stats-bar-label">${pickCount} 人選擇 (${pct}%)</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // 教師重點導讀與觀念解析大方塊
    document.getElementById('slideExplanationContent').innerHTML = `
      <div class="slide-teacher-badge">🎓 導師教學重點引導與觀念解析</div>
      <p class="slide-explanation-text">${window.zhuyinManager.annotate(q.explanation)}</p>
    `;
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderCurrentSlide();
      window.soundEngine.playClick();
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.slidesList.length - 1) {
      this.currentSlideIndex++;
      this.renderCurrentSlide();
      window.soundEngine.playClick();
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      const projectorModal = document.getElementById('projectorSlideModal');
      if (projectorModal && !projectorModal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          this.prevSlide();
        } else if (e.key === 'Escape') {
          this.closeProjectorSlideshow();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullscreen();
        }
      }
    });
  }
}

window.adminPanel = new AdminManager();
