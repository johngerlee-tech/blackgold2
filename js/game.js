/**
 * 核心遊戲引擎 - 登入、角色選擇、三關連貫冒險、數值升級與終局華麗表揚
 */

class GameManager {
  constructor() {
    this.state = 'LOGIN'; // LOGIN | HERO_SELECT | STAGE_INTRO | PLAYING | STAGE_CLEAR | VICTORY_HALL
    this.currentStage = 1; // 1, 2, 3
    this.player = {
      name: '',
      studentClass: '',
      seatNo: '',
      hero: null,
      hp: 100,
      maxHp: 100,
      score: 0,
      level: 1,
      exp: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      totalCount: 0,
      stageScores: { 1: 0, 2: 0, 3: 0 },
      wrongAnswers: [], // 紀錄本次挑戰答錯的題目 { qId, selectedOption, correctOption, question }
      startTime: null,
      endTime: null
    };

    this.settings = {
      initialHp: 100,
      wrongPenalty: 20,
      baseScore: 100,
      timeLimit: 25,
      soundEnabled: true,
      bgmEnabled: true
    };

    this.stageQuestions = [];
    this.currentQIndex = 0;
    this.currentQuestion = null;
    this.timer = null;
    this.timeLeft = 25;
    this.monsterHp = 100;
    this.monsterMaxHp = 100;

    this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('sjps_game_settings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error("載入設定失敗", e);
      }
    }
  }

  saveSettings() {
    localStorage.setItem('sjps_game_settings', JSON.stringify(this.settings));
  }

  // 初始化遊戲進入登入畫面
  start() {
    this.stopTimer();
    const bossModal = document.getElementById('bossUndefeatedModal');
    if (bossModal) bossModal.classList.add('hidden');
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) gameOverModal.classList.add('hidden');
    const stageClearModal = document.getElementById('stageClearModal');
    if (stageClearModal) stageClearModal.classList.add('hidden');

    this.showScreen('loginScreen');
    this.renderHeroSelectionList();
    this.applyLoginZhuyin();
    if (window.adminPanel && window.adminPanel.updateAllClassDropdowns) {
      window.adminPanel.updateAllClassDropdowns();
    }
  }

  // 從關主未倒或失敗畫面返回重選英雄
  returnHome() {
    this.stopTimer();
    const btnNavLobby = document.getElementById('btnNavReturnLobby');
    if (btnNavLobby) btnNavLobby.classList.add('hidden');

    const bossModal = document.getElementById('bossUndefeatedModal');
    if (bossModal) bossModal.classList.add('hidden');
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) gameOverModal.classList.add('hidden');
    const stageClearModal = document.getElementById('stageClearModal');
    if (stageClearModal) stageClearModal.classList.add('hidden');

    if (this.player.name) {
      this.showScreen('heroSelectScreen');
      this.renderHeroSelectionList();
    } else {
      this.start();
    }
  }

  // 對戰中手動中斷返回大廳重選英雄
  confirmReturnLobby() {
    if (confirm("⚠️ 確定要中斷當前戰鬥，返回大廳重新選擇出戰英雄嗎？\n\n（當前關卡將中斷重置，可重新挑選守護英雄出征）")) {
      window.soundEngine.playClick();
      this.stopTimer();

      // 復原戰鬥舞台與精靈動畫樣式
      const heroVisual = document.getElementById('battleHeroVisual');
      const monsterVisual = document.getElementById('battleMonsterVisual');
      if (heroVisual) heroVisual.className = 'battle-sprite-center';
      if (monsterVisual) monsterVisual.className = 'battle-sprite-center';

      // 隱藏頂部返回大廳按鈕
      const btnNavLobby = document.getElementById('btnNavReturnLobby');
      if (btnNavLobby) btnNavLobby.classList.add('hidden');

      // 重置當前關卡狀態，保留勇士基本資料 (姓名、班級、座號)
      this.currentQIndex = 0;
      this.player.hp = this.player.maxHp || 100;

      this.returnHome();
      this.showFloatingMessage("已返回大廳，請挑選出戰英雄！");
    }
  }

  // 首頁文字動態套用芫荽體右側直排注音
  applyLoginZhuyin() {
    const zm = window.zhuyinManager;
    if (!zm) return;
    const isZy = zm.isEnabled();

    // 1. 魔法徽章
    const badge = document.querySelector('.login-magic-badge');
    if (badge) {
      badge.innerHTML = isZy ? `🌱 ${zm.annotate('食物循環魔法陣開啟')}` : '🌱 食物循環魔法陣開啟';
    }

    // 2. 主標題 (已更新為「黑金魔法術🔮」，拿掉副標題以壓縮空間)
    const headline = document.querySelector('.login-headline');
    if (headline) {
      headline.innerHTML = isZy ? `${zm.annotate('黑金魔法術')}🔮` : '黑金魔法術🔮';
    }

    // 3. 導師的話
    const bubble = document.querySelector('.story-intro-bubble');
    if (bubble) {
      const p1 = '🧙‍♂️ 溪洲魔法導師的話：';
      const p2 = '餐桌上的每一口美味，都來自大地的養分！剩下的廚餘不是垃圾，而是大自然中最珍貴的「黑色黃金」。';
      const p3 = '選取你的專屬 RPG 英雄角色，攜手通過三道連續魔法考驗，擊敗荒漠混沌怪，登上榮譽大廳！';
      if (isZy) {
        bubble.innerHTML = `<strong>${zm.annotate(p1)}</strong><br>${zm.annotate(p2)}<br>${zm.annotate(p3)}`;
      } else {
        bubble.innerHTML = `<strong>${p1}</strong><br>${p2}<br>${p3}`;
      }
    }

    // 4. 表單標籤
    const lblName = document.getElementById('lblStudentName');
    if (lblName) lblName.innerHTML = isZy ? zm.annotate('勇士姓名：') : '勇士姓名：';
    const lblClass = document.getElementById('lblStudentClass');
    if (lblClass) lblClass.innerHTML = isZy ? zm.annotate('班級：') : '班級：';
    const lblSeat = document.getElementById('lblStudentSeat');
    if (lblSeat) lblSeat.innerHTML = isZy ? zm.annotate('座號：') : '座號：';

    // 5. 登入按鈕
    const btnSubmit = document.getElementById('btnLoginSubmit');
    if (btnSubmit) {
      btnSubmit.innerHTML = isZy 
        ? `✨ ${zm.annotate('進入英雄神殿，選擇出戰角色')} ➔` 
        : '✨ 進入英雄神殿，選擇出戰角色 ➔';
    }
  }

  showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(el => {
      el.classList.add('hidden');
      el.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // 登入驗證並進入英雄選擇
  handleLogin(name, studentClass, seatNo) {
    if (!name.trim()) {
      alert("請輸入冒險者勇士姓名！");
      return false;
    }
    this.player.name = name.trim();
    this.player.studentClass = studentClass.trim() || "溪洲魔法班";
    this.player.seatNo = seatNo.trim() || "1號";
    this.player.startTime = Date.now();

    window.soundEngine.playClick();
    this.showScreen('heroSelectScreen');
    return true;
  }

  // 渲染 8 位英雄卡片供選取 (全面支援注音模式)
  renderHeroSelectionList() {
    const grid = document.getElementById('heroSelectGrid');
    if (!grid) return;

    const zm = window.zhuyinManager;
    const isZy = zm && zm.isEnabled();

    const titleEl = document.getElementById('heroSelectHeadline');
    if (titleEl) titleEl.innerHTML = isZy ? `🧙‍♂️ ${zm.annotate('選取你的 RPG 守護英雄')}` : '🧙‍♂️ 選取你的 RPG 守護英雄';
    const descEl = document.getElementById('heroSelectSubline');
    if (descEl) descEl.innerHTML = isZy ? zm.annotate('8 位身懷絕技的大自然魔法使者，各具獨特屬性與被動天賦！') : '8 位身懷絕技的大自然魔法使者，各具獨特屬性與被動天賦！';

    const heroes = window.heroManager.getAll();
    grid.innerHTML = heroes.map((hero, idx) => `
      <div class="hero-card ${idx === 0 ? 'selected' : ''}" data-hero-id="${hero.id}" onclick="game.selectHero('${hero.id}')">
        <div class="hero-card-badge">${hero.element}</div>
        <div class="hero-card-img-wrap" style="background: ${hero.avatarBg}">
          ${window.heroManager.getHeroImageHtml(hero, 'card-avatar')}
        </div>
        <div class="hero-card-info">
          <h3 class="hero-name">${isZy ? zm.annotate(hero.name) : hero.name}</h3>
          <div class="hero-title">${isZy ? zm.annotate(hero.title) : hero.title}</div>
          <div class="hero-passive">${isZy ? zm.annotate(hero.passiveSkill) : hero.passiveSkill}</div>
          <div class="hero-stats-row">
            <span>❤️ 生命加成: +${Math.round((hero.hpModifier - 1) * 100)}%</span>
            <span>⚡ 分數加乘: x${hero.scoreBonus.toFixed(1)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // 預設選擇第一位英雄並更新預覽
    this.selectHero(heroes[0].id);
  }

  // 選取英雄時的反應 (全面支援注音模式)
  selectHero(heroId) {
    const hero = window.heroManager.getHeroById(heroId);
    if (!hero) return;

    this.player.hero = hero;
    window.soundEngine.playHeroSelect();

    // 更新選取高亮
    document.querySelectorAll('.hero-card').forEach(card => {
      card.classList.toggle('selected', card.getAttribute('data-hero-id') === heroId);
    });

    const zm = window.zhuyinManager;
    const isZy = zm && zm.isEnabled();

    // 更新預覽展演大圖區
    const previewArea = document.getElementById('selectedHeroPreview');
    if (previewArea) {
      previewArea.innerHTML = `
        <div class="preview-hero-container">
          <div class="preview-visual" style="background: ${hero.avatarBg}">
            ${window.heroManager.getHeroImageHtml(hero, 'preview-hero-img pulse-anim')}
            <div class="elemental-badge-floating">${hero.element}</div>
          </div>
          <div class="preview-details">
            <div class="hero-preview-badge">${isZy ? zm.annotate('當前選定英雄') : '當前選定英雄'}</div>
            <h2 class="preview-hero-title">${isZy ? zm.annotate(hero.name) : hero.name}</h2>
            <div class="preview-hero-sub">${isZy ? zm.annotate(hero.title) : hero.title}</div>
            <p class="preview-hero-quote">${isZy ? zm.annotate(hero.quote) : hero.quote}</p>
            <p class="preview-hero-desc">${isZy ? zm.annotate(hero.description) : hero.description}</p>
            <div class="preview-perk-box">
              <span class="perk-label">${isZy ? zm.annotate('固有被動天賦：') : '固有被動天賦：'}</span>
              <span class="perk-text">${isZy ? zm.annotate(hero.passiveSkill) : hero.passiveSkill}</span>
            </div>
            <button class="btn-primary start-adventure-btn" onclick="game.confirmHeroAndStart()">
              ✨ ${isZy ? zm.annotate('召喚此英雄出戰，踏上黑金冒險之路！') : '召喚此英雄出戰，踏上黑金冒險之路！'}
            </button>
          </div>
        </div>
      `;
    }
  }

  // 確認英雄並開始進入關卡冒險
  confirmHeroAndStart() {
    if (!this.player.hero) {
      alert("請選擇一位英雄！");
      return;
    }

    // 計算初始生命值 (基礎生命值 * 英雄加成)
    const heroHp = Math.round(this.settings.initialHp * (this.player.hero.hpModifier || 1.0));
    this.player.hp = heroHp;
    this.player.maxHp = heroHp;
    this.player.score = 0;
    this.player.level = 1;
    this.player.exp = 0;
    this.player.combo = 0;
    this.player.maxCombo = 0;
    this.player.correctCount = 0;
    this.player.totalCount = 0;
    this.player.stageScores = { 1: 0, 2: 0, 3: 0 };
    this.player.wrongAnswers = [];
    this.currentStage = 1;

    window.soundEngine.playClick();
    window.soundEngine.startBGM();

    this.showStageIntro(1);
  }

  // 關卡引導過場 (全面支援注音模式)
  showStageIntro(stageNum) {
    this.currentStage = stageNum;
    const stageData = {
      1: {
        title: "第一關：黑金魔法術 · 土地循環七部曲",
        subtitle: "土地到餐桌再到土地的完美閉環！",
        lore: "【任務情境】垃圾混沌怪正在吞噬學校與農田！大地鍊金術師莫莫需要你掌握「土地循環七步驟」，煉製黑色黃金，修復大地魔法陣！",
        goals: "🎯 擊敗混沌怪、收集循環魔法元素、淨化土地！",
        monsterName: "廚餘荒漠怪",
        monsterEmoji: "🌪️"
      },
      2: {
        title: "第二關：廚餘分類王 · 疾風瀝乾大試煉",
        subtitle: "熟廚餘、生廚餘、一般垃圾，眼明手快！",
        lore: "【任務情境】午餐過後，各種廚餘排山倒海而來！若放錯桶子會傷害豬豬與堆肥大釜，更千萬別忘了最重要的「瀝乾水分」關鍵步驟！",
        goals: "🎯 正確分類食材、瀝乾湯汁減量、保持最高連擊！",
        monsterName: "雜質混亂獸",
        monsterEmoji: "👾"
      },
      3: {
        title: "第三關：堆肥小勇士 · 黑金魔釜終極聖戰",
        subtitle: "五字口訣、碳氮比平衡、高溫熟成考驗！",
        lore: "【任務情境】黑金大魔釜已經點燃！調配棕色乾料與綠色生料、掌控60%黃金濕度與通風翻堆，排解惡臭危機，收穫金黃豐碩的大地果實！",
        goals: "🎯 平衡碳氮比、搶救堆肥危機、通過知識大魔王審判！",
        monsterName: "惡臭失衡魔王",
        monsterEmoji: "👹"
      }
    }[stageNum];

    const introModal = document.getElementById('stageIntroScreen');
    if (introModal) {
      const zm = window.zhuyinManager;
      document.getElementById('introStageTitle').innerHTML = zm.annotate(stageData.title);
      document.getElementById('introStageSubtitle').innerHTML = zm.annotate(stageData.subtitle);
      document.getElementById('introStageLore').innerHTML = zm.annotate(stageData.lore);
      document.getElementById('introStageGoals').innerHTML = zm.annotate(stageData.goals);
      document.getElementById('introMonsterPreview').textContent = stageData.monsterEmoji;
      document.getElementById('introMonsterName').innerHTML = zm.annotate(stageData.monsterName);

      const btnCombat = document.getElementById('btnStartCombat');
      if (btnCombat) {
        btnCombat.innerHTML = `⚔️ ${zm.annotate('拔劍迎戰，開始答題！')}`;
      }

      this.showScreen('stageIntroScreen');
    }
  }

  // 真正開始該關卡答題戰鬥
  startStageGameplay() {
    this.stageQuestions = window.questionBank.getByStage(this.currentStage);
    if (!this.stageQuestions || this.stageQuestions.length === 0) {
      this.stageQuestions = window.questionBank.getByStage(1);
    }
    // 洗牌亂序以增加變化性
    this.stageQuestions = [...this.stageQuestions].sort(() => Math.random() - 0.5);
    this.currentQIndex = 0;
    this.monsterMaxHp = this.stageQuestions.length * 100;
    this.monsterHp = this.monsterMaxHp;

    const btnNavLobby = document.getElementById('btnNavReturnLobby');
    if (btnNavLobby) btnNavLobby.classList.remove('hidden');

    this.showScreen('gameplayScreen');
    this.renderCurrentQuestion();
    this.updateHud();
  }

  // 更新頂部英雄與戰況抬頭顯示器 (HUD)，英雄與關卡妖怪血量分開計算呈現
  updateHud() {
    const hero = this.player.hero;
    if (!hero) return;

    // 英雄頭像與名稱
    const hudAvatar = document.getElementById('hudHeroAvatar');
    if (hudAvatar) hudAvatar.innerHTML = window.heroManager.getHeroImageHtml(hero, 'hud-avatar-img');
    const hudName = document.getElementById('hudHeroName');
    if (hudName) hudName.innerHTML = `${window.zhuyinManager.annotate(hero.name)} (Lv.${this.player.level})`;

    // 玩家姓名與班級座號
    const playerName = document.getElementById('hudPlayerName');
    if (playerName) playerName.innerHTML = `${window.zhuyinManager.annotate(this.player.name)} 勇士`;
    const playerClass = document.getElementById('hudPlayerClass');
    if (playerClass) playerClass.textContent = `${this.player.studentClass} ${this.player.seatNo}`;

    // 1. 英雄獨立血量計算與呈現
    const heroHpPercent = Math.max(0, Math.min(100, (this.player.hp / this.player.maxHp) * 100));
    const heroHpFill = document.getElementById('battleHeroHpFill');
    if (heroHpFill) {
      heroHpFill.style.width = `${heroHpPercent}%`;
      heroHpFill.className = 'bar-fill ' + (heroHpPercent > 50 ? 'hp-high' : heroHpPercent > 25 ? 'hp-mid' : 'hp-low');
    }
    const heroHpText = document.getElementById('battleHeroHpText');
    if (heroHpText) heroHpText.textContent = `${this.player.hp} / ${this.player.maxHp} HP`;

    // 2. 關卡妖怪獨立血量計算與呈現
    const monsterHpPercent = Math.max(0, Math.min(100, (this.monsterHp / this.monsterMaxHp) * 100));
    const monsterHpFill = document.getElementById('battleMonsterHpFill');
    if (monsterHpFill) monsterHpFill.style.width = `${monsterHpPercent}%`;
    const monsterHpText = document.getElementById('battleMonsterHpText');
    if (monsterHpText) monsterHpText.textContent = `${this.monsterHp} / ${this.monsterMaxHp} HP`;

    // 積分與連擊
    const scoreVal = document.getElementById('hudScoreVal');
    if (scoreVal) scoreVal.textContent = this.player.score;
    const comboVal = document.getElementById('hudComboVal');
    if (comboVal) {
      comboVal.textContent = this.player.combo > 1 ? `${this.player.combo} COMBO 🔥` : '';
    }

    // 當前關卡標籤
    const stagePill = document.getElementById('hudStagePill');
    if (stagePill) {
      stagePill.innerHTML = window.zhuyinManager.annotate(`第 ${this.currentStage} 關：${['黑金魔法術', '廚餘分類王', '堆肥小勇士'][this.currentStage - 1]}`);
    }
  }

  // 渲染當前題目與選項 (支援注音字體模式)
  renderCurrentQuestion() {
    this.stopTimer();

    // 關鍵修復：怪獸被打敗才能通關；若題目完畢怪獸未死，不可通關！
    if (this.currentQIndex >= this.stageQuestions.length) {
      if (this.monsterHp <= 0) {
        this.handleStageComplete();
      } else {
        this.handleBossUndefeated();
      }
      return;
    }

    const q = this.stageQuestions[this.currentQIndex];
    this.currentQuestion = q;

    // 更新進度與類別標籤
    const qCountBadge = document.getElementById('qCountBadge');
    if (qCountBadge) {
      qCountBadge.innerHTML = `題目 ${this.currentQIndex + 1} / ${this.stageQuestions.length} 【${window.zhuyinManager.annotate(q.category)}】`;
    }

    // 題目本文 (若啟用注音模式自動產生 <ruby><rt> 標籤)
    const qStem = document.getElementById('questionStem');
    if (qStem) qStem.innerHTML = window.zhuyinManager.annotate(q.question);

    // 選項按鈕 (支援注音標記)
    const optContainer = document.getElementById('questionOptionsContainer');
    if (optContainer) {
      const letters = ['A', 'B', 'C', 'D'];
      optContainer.innerHTML = q.options.map((opt, idx) => `
        <button class="choice-btn" data-index="${idx}" onclick="game.handleAnswerChoice(${idx})">
          <span class="choice-letter">${letters[idx]}</span>
          <span class="choice-text">${window.zhuyinManager.annotate(opt)}</span>
        </button>
      `).join('');
    }

    // 更新戰鬥對陣舞台
    this.updateBattleStageVisual(q);

    // 隱藏前一題的反饋提示框
    const feedbackBox = document.getElementById('answerFeedbackBox');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    // 啟動倒數計時
    this.startTimer();
    this.updateHud();
  }

  // 當注音開關切換時，立即重新整理當前題目的注音呈現
  refreshCurrentQuestionView() {
    if (this.currentQuestion) {
      const qStem = document.getElementById('questionStem');
      if (qStem) qStem.innerHTML = window.zhuyinManager.annotate(this.currentQuestion.question);
      const optTexts = document.querySelectorAll('.choice-text');
      optTexts.forEach((el, idx) => {
        if (this.currentQuestion.options[idx]) {
          el.innerHTML = window.zhuyinManager.annotate(this.currentQuestion.options[idx]);
        }
      });
      const qCountBadge = document.getElementById('qCountBadge');
      if (qCountBadge) {
        qCountBadge.innerHTML = `題目 ${this.currentQIndex + 1} / ${this.stageQuestions.length} 【${window.zhuyinManager.annotate(this.currentQuestion.category)}】`;
      }
      this.updateHud();
    }
  }

  // 更新戰鬥場景視覺氛圍 (英雄戰鬥座 vs 妖怪戰鬥座)
  updateBattleStageVisual(q) {
    const monsterVisual = document.getElementById('battleMonsterVisual');
    const heroVisual = document.getElementById('battleHeroVisual');
    const heroNameTag = document.getElementById('podHeroNameTag');
    const monsterNameTag = document.getElementById('podMonsterNameTag');

    if (heroVisual && this.player.hero) {
      heroVisual.innerHTML = window.heroManager.getHeroImageHtml(this.player.hero, 'battle-sprite-hero idle-float');
    }
    if (heroNameTag && this.player.hero) {
      // 依指示移除 (Lv.X) 標示，左側資訊欄已有完整顯示
      heroNameTag.innerHTML = window.zhuyinManager.annotate(this.player.hero.name);
    }

    const monsterNames = ['荒漠混沌怪', '雜質混亂獸', '惡臭失衡魔王'];
    const monsterIcons = { 1: "🌪️", 2: "👾", 3: "👹" };

    if (monsterVisual) {
      monsterVisual.innerHTML = `<div class="monster-figure shake-idle">${monsterIcons[this.currentStage] || '👾'}</div>`;
    }
    if (monsterNameTag) {
      monsterNameTag.innerHTML = window.zhuyinManager.annotate(monsterNames[this.currentStage - 1] || '關主');
    }
  }

  // 顯示題目後方答對/答錯懸浮提示圖層 (紅色/亮色字，3秒自動淡出)
  showAnswerFloatingBadge(isCorrect) {
    const badge = document.getElementById('answerFloatingBadge');
    if (!badge) return;

    badge.textContent = isCorrect ? '✨ 答對了！' : '💥 答錯了！';
    badge.className = `answer-floating-badge ${isCorrect ? 'badge-correct' : 'badge-wrong'}`;
    badge.classList.remove('hidden', 'badge-fadeout');

    if (this.badgeFadeTimer) clearTimeout(this.badgeFadeTimer);
    if (this.badgeTimer) clearTimeout(this.badgeTimer);

    // 2.2 秒後啟動淡出，3 秒後隱藏
    this.badgeFadeTimer = setTimeout(() => {
      badge.classList.add('badge-fadeout');
    }, 2200);

    this.badgeTimer = setTimeout(() => {
      badge.classList.add('hidden');
    }, 3000);
  }

  // 浮動傷害數字飄起動畫
  spawnDamagePopup(amount, target = 'monster') {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;

    const popup = document.createElement('div');
    popup.className = `damage-number-popup ${target === 'monster' ? 'damage-monster-hit' : 'damage-hero-hit'}`;
    popup.textContent = `-${amount}`;
    arena.appendChild(popup);

    setTimeout(() => popup.remove(), 850);
  }

  // 計時器
  startTimer() {
    this.timeLeft = this.settings.timeLimit;
    const timerFill = document.getElementById('timerFill');
    const timerText = document.getElementById('timerText');

    if (timerFill) timerFill.style.width = '100%';
    if (timerText) timerText.textContent = `${this.timeLeft}s`;

    this.timer = setInterval(() => {
      this.timeLeft--;
      const percent = (this.timeLeft / this.settings.timeLimit) * 100;
      if (timerFill) timerFill.style.width = `${Math.max(0, percent)}%`;
      if (timerText) timerText.textContent = `${Math.max(0, this.timeLeft)}s`;

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // 逾時處理
  handleTimeout() {
    this.handleAnswerChoice(-1); // -1 代表超時未作答
  }

  // 處理玩家選擇答案 (增強撞擊飄移、受擊血光與返回原位聲光效果)
  handleAnswerChoice(selectedIndex) {
    this.stopTimer();
    const q = this.currentQuestion;
    const isCorrect = selectedIndex === q.answer;
    this.player.totalCount++;

    // 鎖定所有選項按鈕防止重複點擊
    const btns = document.querySelectorAll('.choice-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correct-choice');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong-choice');
      }
    });

    const hero = this.player.hero;
    const heroVisual = document.getElementById('battleHeroVisual');
    const monsterVisual = document.getElementById('battleMonsterVisual');
    const arena = document.querySelector('.battle-arena');
    const bloodOverlay = document.getElementById('bloodFlashOverlay');
    const feedbackBox = document.getElementById('answerFeedbackBox');

    if (isCorrect) {
      // ==================== 答對：英雄發動撞擊衝殺 ====================
      this.player.correctCount++;
      this.player.combo++;
      if (this.player.combo > this.player.maxCombo) {
        this.player.maxCombo = this.player.combo;
      }

      // 音效：呼嘯衝刺
      window.soundEngine.playDash();

      // 計算扣除妖怪血量與得分
      const timeBonus = Math.floor(this.timeLeft * 2);
      const comboBonus = (this.player.combo - 1) * 20;
      const roundScore = Math.round((this.settings.baseScore + comboBonus + timeBonus) * (hero.scoreBonus || 1.0));
      this.player.score += roundScore;
      this.player.stageScores[this.currentStage] += roundScore;

      const baseDamage = Math.round(this.monsterMaxHp / this.stageQuestions.length);
      const comboBonusMultiplier = 1 + (Math.min(5, this.player.combo - 1) * 0.08);
      const damage = Math.round(baseDamage * comboBonusMultiplier);
      this.monsterHp = Math.max(0, this.monsterHp - damage);

      // 動畫 1：英雄高速飄移衝刺撞擊妖怪 (移動至右方撞擊)
      if (heroVisual) heroVisual.classList.add('hero-dash-strike');

      // 動畫 2：碰撞爆發瞬間 (約 380ms 撞擊對方)
      setTimeout(() => {
        // 重擊與血光音效
        window.soundEngine.playImpactStrike();
        window.soundEngine.playBloodSlash();
        window.soundEngine.playCorrect();

        // 妖怪受創劇烈震動與血光泛紅
        if (monsterVisual) monsterVisual.classList.add('hit-blood-shake');

        // 戰鬥舞台震動與血光閃爍
        if (arena) arena.classList.add('arena-screen-shake');
        if (bloodOverlay) bloodOverlay.classList.add('blood-flash-active');

        // 飄出高額傷害數字
        this.spawnDamagePopup(damage, 'monster');

        // 連擊音效加成
        if (this.player.combo > 1) {
          setTimeout(() => window.soundEngine.playCombo(this.player.combo), 150);
        }

        // 若妖怪生命歸零倒下
        if (this.monsterHp <= 0) {
          if (monsterVisual) monsterVisual.classList.add('monster-defeated-fade');
          setTimeout(() => window.soundEngine.playFanfare(), 300);
          this.showFloatingMessage("🏆 關卡領主已被徹底擊破！");
        }

        // 更新血量條
        this.updateHud();
      }, 380);

      // 檢查角色經驗值與升級
      this.player.exp += 40;
      if (this.player.exp >= this.player.level * 100) {
        this.player.level++;
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 20); // 升級回血
        setTimeout(() => {
          window.soundEngine.playLevelUp();
          this.showFloatingMessage(`🎉 英雄升級！升至 Lv.${this.player.level}，生命值回復！`);
        }, 500);
      }

      // 於題目後方顯示懸浮提示「答對了！」(3秒自動淡出，不佔用下方空間)
      this.showAnswerFloatingBadge(true);

    } else {
      // ==================== 答錯：妖怪發動撞擊反擊英雄 ====================
      this.player.combo = 0;

      // 妖怪呼嘯衝刺音效
      window.soundEngine.playMonsterDash();

      // 計算英雄扣血 (考量莫莫等被動防禦)
      const defMultiplier = 1.0 - (hero.defBonus || 0);
      const penalty = Math.max(5, Math.round(this.settings.wrongPenalty * defMultiplier));
      this.player.hp = Math.max(0, this.player.hp - penalty);

      // 紀錄錯題至系統 (持久化供投影檢討)
      window.questionBank.recordError(q.id, selectedIndex);
      this.player.wrongAnswers.push({
        questionId: q.id,
        stem: q.question,
        userSelect: selectedIndex >= 0 ? q.options[selectedIndex] : "超時未作答",
        correctText: q.options[q.answer],
        explanation: q.explanation
      });

      // 動畫 1：妖怪高速飄移撞擊英雄 (移動至左方撞擊)
      if (monsterVisual) monsterVisual.classList.add('monster-dash-strike');

      // 動畫 2：碰撞爆發瞬間 (約 380ms 撞擊英雄)
      setTimeout(() => {
        // 沉重打擊與失誤音效
        window.soundEngine.playImpactStrike();
        window.soundEngine.playWrong();

        // 英雄受重創劇烈震動與身體泛起血光
        if (heroVisual) heroVisual.classList.add('hit-blood-shake');

        // 戰鬥舞台劇烈震動與血光閃爍
        if (arena) arena.classList.add('arena-screen-shake');
        if (bloodOverlay) bloodOverlay.classList.add('blood-flash-active');

        // 英雄身上飄出扣血數字
        this.spawnDamagePopup(penalty, 'hero');

        // 更新血量條
        this.updateHud();
      }, 380);

      // 於題目後方顯示懸浮提示「答錯了！」(3秒自動淡出，不佔用下方空間)
      this.showAnswerFloatingBadge(false);

      // 檢查血量是否耗盡
      if (this.player.hp <= 0) {
        setTimeout(() => this.handleGameOver(), 1500);
        return;
      }
    }

    // 延遲後復原動畫狀態並進入下一題或結算過關
    setTimeout(() => {
      if (heroVisual) {
        heroVisual.classList.remove('hero-dash-strike');
        heroVisual.classList.remove('hit-blood-shake');
      }
      if (monsterVisual) {
        monsterVisual.classList.remove('monster-dash-strike');
        monsterVisual.classList.remove('hit-blood-shake');
        monsterVisual.classList.remove('monster-defeated-fade');
      }
      if (arena) arena.classList.remove('arena-screen-shake');
      if (bloodOverlay) bloodOverlay.classList.remove('blood-flash-active');

      // 關鍵判定：若關卡怪獸已被擊敗，直接勝利過關！
      if (this.monsterHp <= 0) {
        this.handleStageComplete();
        return;
      }

      this.currentQIndex++;
      this.renderCurrentQuestion();
    }, 2400);
  }

  // 漂浮通知訊息
  showFloatingMessage(msg) {
    const toast = document.createElement('div');
    toast.className = 'floating-toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // 單關通關處理
  handleStageComplete() {
    window.soundEngine.playFanfare();
    const btnNavLobby = document.getElementById('btnNavReturnLobby');
    if (btnNavLobby) btnNavLobby.classList.add('hidden');

    if (this.currentStage < 3) {
      // 進入下一關準備
      const nextStage = this.currentStage + 1;
      const clearModal = document.getElementById('stageClearModal');
      if (clearModal) {
        document.getElementById('clearStageName').textContent = `恭喜通過第 ${this.currentStage} 關！`;
        document.getElementById('clearStageScore').textContent = `本關獲得積分：+${this.player.stageScores[this.currentStage]}`;
        document.getElementById('nextStageBtn').onclick = () => {
          clearModal.classList.add('hidden');
          this.showStageIntro(nextStage);
        };
        clearModal.classList.remove('hidden');
      }
    } else {
      // 三關全通！進入【華麗登場表揚網頁】
      this.handleFinalVictory();
    }
  }

  // 關主尚未擊倒彈窗（題目答畢但妖怪生命仍大於0）
  handleBossUndefeated() {
    this.stopTimer();
    window.soundEngine.playWrong();
    const modal = document.getElementById('bossUndefeatedModal');
    if (modal) {
      const remainHp = document.getElementById('bossUndefeatedRemainHp');
      if (remainHp) remainHp.textContent = `${this.monsterHp} / ${this.monsterMaxHp} HP`;
      modal.classList.remove('hidden');
    }
  }

  // 追加支援題目（加開 3 題讓玩家繼續戰鬥徹底擊潰關主）
  addExtraQuestions() {
    const modal = document.getElementById('bossUndefeatedModal');
    if (modal) modal.classList.add('hidden');

    const allQuestions = window.questionBank.getByStage(this.currentStage);
    const extra = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    this.stageQuestions = this.stageQuestions.concat(extra);
    this.showFloatingMessage(`⚡ 救援魔法陣發動！加開 ${extra.length} 道破敵題目！`);

    this.renderCurrentQuestion();
  }

  // 生命耗盡遊戲結束
  handleGameOver() {
    this.stopTimer();
    window.soundEngine.playWrong();

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
      document.getElementById('gameOverScore').textContent = this.player.score;
      gameOverModal.classList.remove('hidden');
    }
  }

  // 重新挑戰此關
  retryCurrentStage() {
    const bossModal = document.getElementById('bossUndefeatedModal');
    if (bossModal) bossModal.classList.add('hidden');
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) gameOverModal.classList.add('hidden');

    this.player.hp = this.player.maxHp;
    this.startStageGameplay();
  }

  // ==================== 華麗登場表揚網頁 (HALL OF FAME & VICTORY) ====================
  handleFinalVictory() {
    this.player.endTime = Date.now();
    const durationSeconds = Math.round((this.player.endTime - this.player.startTime) / 1000);
    const hero = this.player.hero;

    // 德魯伊等被動技能結算加成
    if (hero.id === 'druid') {
      const bonus = Math.round(this.player.score * 0.2);
      this.player.score += bonus;
    }

    // 根據總分決定獲得稱號
    let titleAwarded = "黑金魔法學徒";
    if (this.player.score >= 1200) titleAwarded = "👑 傳奇黑金大魔導尊者";
    else if (this.player.score >= 900) titleAwarded = "🌟 永續大地守護使";
    else if (this.player.score >= 600) titleAwarded = "🌿 綠色食物循環勇士";

    // 準確率計算
    const accuracy = this.player.totalCount > 0 
      ? Math.round((this.player.correctCount / this.player.totalCount) * 100) 
      : 100;

    // 儲存挑戰者成績紀錄至後台
    this.saveChallengerRecord({
      id: "rec_" + Date.now(),
      name: this.player.name,
      studentClass: this.player.studentClass,
      seatNo: this.player.seatNo,
      heroId: hero.id,
      heroName: hero.name,
      totalScore: this.player.score,
      stageScores: { ...this.player.stageScores },
      accuracy: accuracy,
      level: this.player.level,
      maxCombo: this.player.maxCombo,
      durationSeconds: durationSeconds,
      wrongCount: this.player.wrongAnswers.length,
      wrongDetails: this.player.wrongAnswers,
      date: new Date().toLocaleString('zh-TW', { hour12: false })
    });

    // 播放盛大表揚號角與煙火
    window.soundEngine.playFanfare();
    this.triggerFireworksShow();

    // 渲染華麗登場畫面
    this.renderVictoryHall(titleAwarded, accuracy, durationSeconds);
    this.showScreen('victoryHallScreen');
  }

  // 儲存挑戰成績 (本機資料庫 + Firebase 雲端自動同步)
  saveChallengerRecord(record) {
    let records = [];
    const saved = localStorage.getItem('sjps_challenger_records');
    if (saved) {
      try { records = JSON.parse(saved); } catch (e) { records = []; }
    }
    records.unshift(record); // 最新紀錄排在最前
    localStorage.setItem('sjps_challenger_records', JSON.stringify(records));

    // 同步上傳至 Firebase Firestore
    if (window.firebaseBridge) {
      window.firebaseBridge.saveRecord(record);
    }
  }

  // 渲染表揚大廳
  renderVictoryHall(titleAwarded, accuracy, durationSeconds) {
    const hero = this.player.hero;
    const container = document.getElementById('victoryHallContent');
    if (!container) return;

    container.innerHTML = `
      <div class="victory-header-podium">
        <div class="podium-crown">👑</div>
        <h1 class="victory-headline-title">🎉 榮 耀 登 場 · 華 麗 表 揚 🎉</h1>
        <div class="victory-subtitle">恭喜通過溪洲魔法生態學院「黑金魔法術 · 永續食物循環」三大神殿考驗！</div>
      </div>

      <div class="victory-hero-spotlight">
        <div class="spotlight-rays"></div>
        <div class="giant-hero-render-wrap" style="background: ${hero.avatarBg}">
          ${window.heroManager.getHeroImageHtml(hero, 'giant-hero-img floating-victory-anim')}
          <div class="hero-level-crown-badge">等級 Lv.${this.player.level}</div>
        </div>
        <div class="victory-hero-meta">
          <div class="student-name-hero">${this.player.studentClass} ${this.player.seatNo} · <strong>${this.player.name}</strong> 勇士</div>
          <div class="hero-full-title">${hero.name} ｜ ${hero.title}</div>
          <div class="title-awarded-pill">${titleAwarded}</div>
        </div>
      </div>

      <!-- 成績數據看板 -->
      <div class="victory-stats-grid">
        <div class="v-stat-card">
          <span class="v-stat-icon">🏆</span>
          <span class="v-stat-label">終極總積分</span>
          <span class="v-stat-val text-gold">${this.player.score}</span>
        </div>
        <div class="v-stat-card">
          <span class="v-stat-icon">🎯</span>
          <span class="v-stat-label">答題準確率</span>
          <span class="v-stat-val text-green">${accuracy}%</span>
        </div>
        <div class="v-stat-card">
          <span class="v-stat-icon">🔥</span>
          <span class="v-stat-label">最高連擊數</span>
          <span class="v-stat-val text-orange">${this.player.maxCombo} 連擊</span>
        </div>
        <div class="v-stat-card">
          <span class="v-stat-icon">⏱️</span>
          <span class="v-stat-label">通關總耗時</span>
          <span class="v-stat-val">${durationSeconds} 秒</span>
        </div>
      </div>

      <!-- 各關卡表現細部 -->
      <div class="stage-breakdown-card">
        <h3>🌟 三大關卡榮譽戰績</h3>
        <div class="stage-pills-row">
          <div class="stage-pill-box">
            <span class="pill-stage">第一關 黑金魔法術</span>
            <span class="pill-score">+${this.player.stageScores[1]} 分</span>
          </div>
          <div class="stage-pill-box">
            <span class="pill-stage">第二關 廚餘分類王</span>
            <span class="pill-score">+${this.player.stageScores[2]} 分</span>
          </div>
          <div class="stage-pill-box">
            <span class="pill-stage">第三關 堆肥小勇士</span>
            <span class="pill-score">+${this.player.stageScores[3]} 分</span>
          </div>
        </div>
      </div>

      <!-- 榮譽證書預覽與列印區 -->
      <div class="certificate-paper-wrap" id="printableCertificate">
        <div class="cert-border-outer">
          <div class="cert-border-inner">
            <div class="cert-watermark">🔮 SJPS 🔮</div>
            <div class="cert-badge-top">溪洲魔法生態學院 · 永續環境教育榮譽證書</div>
            <h2 class="cert-title">黑金魔法大師榮譽證書</h2>
            <p class="cert-congrats">
              茲證明 <strong>${this.player.studentClass}</strong> 座號 <strong>${this.player.seatNo}</strong> 之
              <br><strong class="cert-hero-name">${this.player.name}</strong> 勇士
            </p>
            <p class="cert-body">
              帶領出戰英雄 <strong>【${hero.name}】</strong>，於「黑金魔法術 永續食物循環系統」三大關卡之挑戰中表現卓越，
              精準掌握土地循環七步驟、生熟廚餘與瀝乾要領、碳氮比平衡與堆肥五字訣，
              最終勇奪總積分 <span class="cert-score-highlight">${this.player.score}</span> 分，榮獲 <strong>【${titleAwarded}】</strong> 崇高榮銜！
            </p>
            <div class="cert-footer">
              <div class="cert-date">認證日期：${new Date().toLocaleDateString('zh-TW')}</div>
              <div class="cert-seal-box">
                <div class="cert-seal">溪洲國小<br>魔法認證</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="victory-action-buttons">
        <button class="btn-cert-print" onclick="window.print()">
          🖨️ 列印 / 保存此榮譽證書
        </button>
        <button class="btn-cert-replay" onclick="game.start()">
          🔄 換一位英雄重新挑戰
        </button>
        <button class="btn-cert-admin" onclick="adminPanel.open()">
          🔑 進入教師後台查看排行與錯題檢討
        </button>
      </div>
    `;
  }

  // 煙火爆破動畫特效循環
  triggerFireworksShow() {
    const container = document.getElementById('fireworksCanvasContainer');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#ffd700', '#ff4081', '#00e676', '#00e5ff', '#ff9100', '#7c4dff'];

    let count = 0;
    const launchInterval = setInterval(() => {
      count++;
      if (count > 8) {
        clearInterval(launchInterval);
        return;
      }

      window.soundEngine.playFirework();

      const burst = document.createElement('div');
      burst.className = 'firework-burst';
      const x = 15 + Math.random() * 70;
      const y = 10 + Math.random() * 50;
      burst.style.left = `${x}%`;
      burst.style.top = `${y}%`;

      // 散開的粒子
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'spark-particle';
        const angle = (i / 18) * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        const color = colors[Math.floor(Math.random() * colors.length)];

        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        p.style.backgroundColor = color;
        burst.appendChild(p);
      }

      container.appendChild(burst);
      setTimeout(() => burst.remove(), 1200);
    }, 450);
  }
}

window.game = new GameManager();
