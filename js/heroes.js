/**
 * 8大虛擬 RPG 英雄角色設定庫
 * 包含高解析向量角色圖像、屬性、被動技能、生動介紹與自訂圖片替換支援
 */

const DEFAULT_HEROES = [
  {
    id: "momo",
    name: "大地鍊金術師 · 莫莫",
    title: "溪洲魔法生態學院首席生",
    element: "自然系 🌿",
    avatarBg: "radial-gradient(circle, #e8f5e9, #a5d6a7)",
    quote: "「落葉與枯枝，都是大地最珍貴的金礦！」",
    description: "手持生命之杖的綠之使者，能將腐朽化為肥沃黑金土。在土壤與微生物研究上無人能出其右。",
    passiveSkill: "【腐植酸護盾】防禦力提高，挑戰中答錯扣血減少 25%",
    hpModifier: 1.1,
    defBonus: 0.25,
    scoreBonus: 1.0,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="momoAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#81c784" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#2e7d32" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#momoAura)"/>
      <ellipse cx="100" cy="155" rx="45" ry="30" fill="#2e7d32"/>
      <path d="M70,140 Q100,120 130,140 L135,185 Q100,195 65,185 Z" fill="#4caf50"/>
      <circle cx="100" cy="85" r="38" fill="#ffe0b2"/>
      <!-- 眼睛 -->
      <ellipse cx="88" cy="82" rx="5" ry="7" fill="#1b5e20"/>
      <ellipse cx="112" cy="82" rx="5" ry="7" fill="#1b5e20"/>
      <circle cx="89" cy="80" r="2" fill="#fff"/>
      <circle cx="113" cy="80" r="2" fill="#fff"/>
      <!-- 笑容與腮紅 -->
      <path d="M94,94 Q100,102 106,94" stroke="#d84315" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="90" r="6" fill="#ffab91" opacity="0.6"/>
      <circle cx="120" cy="90" r="6" fill="#ffab91" opacity="0.6"/>
      <!-- 大法師草帽 -->
      <path d="M50,70 Q100,20 150,70 Q100,55 50,70 Z" fill="#388e3c"/>
      <path d="M85,55 L100,10 L115,55 Z" fill="#1b5e20"/>
      <circle cx="100" cy="10" r="7" fill="#ffd54f"/>
      <circle cx="100" cy="55" r="8" fill="#81c784"/>
      <!-- 魔法法杖 -->
      <rect x="145" y="50" width="8" height="135" rx="4" fill="#8d6e63"/>
      <circle cx="149" cy="45" r="16" fill="#ffd54f" opacity="0.9"/>
      <path d="M149,32 L153,42 L163,45 L153,48 L149,58 L145,48 L135,45 L145,42 Z" fill="#ffeb3b"/>
      <!-- 發芽葉子 -->
      <path d="M60,65 Q50,45 68,45 Q70,58 60,65 Z" fill="#aed581"/>
    </svg>`
  },
  {
    id: "koko",
    name: "水露精靈 · 寇寇",
    title: "清泉水份調諧使",
    element: "水靈系 💧",
    avatarBg: "radial-gradient(circle, #e1f5fe, #81d4fa)",
    quote: "「堆肥就像揉麵糰，水分剛好才是真魔法！」",
    description: "誕生於清晨葉梢的水之妖精，對水分極為敏感，最擅長協助堆肥掌握 60% 握之成團的黃金濕度。",
    passiveSkill: "【澄澈瀝乾術】瀝乾階段反應速度提升，連擊積分加成 20%",
    hpModifier: 1.0,
    defBonus: 0.1,
    scoreBonus: 1.2,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="kokoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#80d8ff" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0091ea" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#kokoGlow)"/>
      <!-- 精靈透明水翼 -->
      <ellipse cx="60" cy="90" rx="35" ry="18" fill="#b3e5fc" opacity="0.65" transform="rotate(-25 60 90)"/>
      <ellipse cx="140" cy="90" rx="35" ry="18" fill="#b3e5fc" opacity="0.65" transform="rotate(25 140 90)"/>
      <!-- 身體水滴形 -->
      <path d="M100,30 C60,80 55,140 100,175 C145,140 140,80 100,30 Z" fill="#29b6f6"/>
      <path d="M100,45 C75,90 70,135 100,165 C130,135 125,90 100,45 Z" fill="#4fc3f7"/>
      <!-- 水晶頭冠 -->
      <path d="M85,55 Q100,35 115,55" stroke="#ffffff" stroke-width="4" fill="none"/>
      <circle cx="100" cy="38" r="6" fill="#e0f7fa"/>
      <!-- 大眼睛 -->
      <ellipse cx="86" cy="105" rx="6" ry="8" fill="#01579b"/>
      <ellipse cx="114" cy="105" rx="6" ry="8" fill="#01579b"/>
      <circle cx="88" cy="103" r="3" fill="#ffffff"/>
      <circle cx="116" cy="103" r="3" fill="#ffffff"/>
      <circle cx="84" cy="108" r="1.5" fill="#ffffff"/>
      <circle cx="112" cy="108" r="1.5" fill="#ffffff"/>
      <!-- 俏皮表情 -->
      <path d="M96,118 Q100,123 104,118" stroke="#0277bd" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="76" cy="114" r="5" fill="#ff80ab" opacity="0.6"/>
      <circle cx="124" cy="114" r="5" fill="#ff80ab" opacity="0.6"/>
      <!-- 魔法水滴泡泡 -->
      <circle cx="45" cy="55" r="9" fill="#e1f5fe" opacity="0.8"/>
      <circle cx="155" cy="65" r="12" fill="#e1f5fe" opacity="0.8"/>
      <circle cx="160" cy="140" r="8" fill="#e1f5fe" opacity="0.8"/>
    </svg>`
  },
  {
    id: "earthworm",
    name: "地底神龍 · 蚯蚓領主",
    title: "翻堆通氣先鋒",
    element: "厚土系 🪱",
    avatarBg: "radial-gradient(circle, #efebe9, #bcaaa4)",
    quote: "「泥土是我的王國，翻動它就是我的榮耀！」",
    description: "日夜穿梭於土壤與腐葉之中，透過吞食排泄產出天下第一等黑金蚓糞肥，也是天然的鬆土發動機。",
    passiveSkill: "【翻堆狂潮】連續答對時連擊效果大幅增幅，通關獲得額外 150 積分",
    hpModifier: 1.15,
    defBonus: 0.15,
    scoreBonus: 1.15,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wormGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d7ccc8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#8d6e63" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#wormGlow)"/>
      <!-- 蚯蚓旋轉身體段落 -->
      <path d="M45,150 Q50,110 80,120 T125,120 Q160,110 150,155 Q135,180 95,170 Q55,175 45,150 Z" fill="#ff8a80"/>
      <path d="M70,125 Q100,80 100,50 Q105,90 130,125 Z" fill="#ff5252"/>
      <!-- 身體環帶 (受精環帶) 榮譽金環帶 -->
      <ellipse cx="100" cy="95" rx="22" ry="10" fill="#ffd54f" stroke="#ffa000" stroke-width="2"/>
      <!-- 頭部 -->
      <ellipse cx="100" cy="45" rx="24" ry="22" fill="#ff8a80"/>
      <!-- 鑽地金頭盔 -->
      <path d="M78,40 Q100,12 122,40 L124,46 Q100,32 76,46 Z" fill="#ffb300"/>
      <polygon points="100,12 92,28 108,28" fill="#fff59d"/>
      <circle cx="100" cy="30" r="4" fill="#d32f2f"/>
      <!-- 帥氣護目鏡/大眼睛 -->
      <rect x="80" y="38" width="16" height="12" rx="4" fill="#37474f"/>
      <rect x="104" y="38" width="16" height="12" rx="4" fill="#37474f"/>
      <circle cx="86" cy="43" r="3" fill="#00e676"/>
      <circle cx="110" cy="43" r="3" fill="#00e676"/>
      <!-- 微笑嘴巴 -->
      <path d="M93,56 Q100,62 107,56" stroke="#c62828" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 挖掘金色鏟杖 -->
      <rect x="140" y="80" width="7" height="90" rx="3" fill="#6d4c41"/>
      <path d="M133,160 L154,160 L149,185 L138,185 Z" fill="#ffd54f" stroke="#ffa000" stroke-width="2"/>
    </svg>`
  },
  {
    id: "bsfl",
    name: "黑金幻影騎士 · 黑水虻",
    title: "廚餘極速終結者",
    element: "暗影迅雷系 🪰",
    avatarBg: "radial-gradient(circle, #eceff1, #78909c)",
    quote: "「任何有機生廚餘，在我的雙刃下一秒都不會停留！」",
    description: "昆蟲界最強生物處理大師！幼蟲食慾驚人，可在幾天內轉化大量菜葉果皮，殘留蟲沙更是頂級黑金。",
    passiveSkill: "【暴食神速】生廚餘相關題型命中獲得額外 30% 暴擊分數",
    hpModifier: 1.05,
    defBonus: 0.1,
    scoreBonus: 1.3,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bsflAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00e676" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#263238" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#bsflAura)"/>
      <!-- 輕薄半透明翅膀 -->
      <ellipse cx="60" cy="85" rx="42" ry="18" fill="#80deea" opacity="0.6" transform="rotate(-35 60 85)"/>
      <ellipse cx="140" cy="85" rx="42" ry="18" fill="#80deea" opacity="0.6" transform="rotate(35 140 85)"/>
      <!-- 騎士身軀 -->
      <ellipse cx="100" cy="120" rx="26" ry="45" fill="#212121"/>
      <path d="M85,100 L115,100 L110,145 L90,145 Z" fill="#37474f"/>
      <rect x="88" y="115" width="24" height="6" rx="2" fill="#00e676"/>
      <rect x="91" y="128" width="18" height="5" rx="2" fill="#00e676"/>
      <!-- 騎士頭盔與複眼 -->
      <circle cx="100" cy="65" r="24" fill="#263238"/>
      <ellipse cx="88" cy="63" rx="8" ry="11" fill="#76ff03"/>
      <ellipse cx="112" cy="63" rx="8" ry="11" fill="#76ff03"/>
      <circle cx="89" cy="60" r="3" fill="#ffffff"/>
      <circle cx="113" cy="60" r="3" fill="#ffffff"/>
      <!-- 頭盔角觸鬚 -->
      <path d="M92,45 Q80,20 65,25" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M108,45 Q120,20 135,25" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 翠綠光刃雙劍 -->
      <line x1="45" y1="160" x2="75" y2="90" stroke="#00e676" stroke-width="6" stroke-linecap="round"/>
      <line x1="155" y1="160" x2="125" y2="90" stroke="#00e676" stroke-width="6" stroke-linecap="round"/>
      <circle cx="45" cy="160" r="5" fill="#ffd54f"/>
      <circle cx="155" cy="160" r="5" fill="#ffd54f"/>
    </svg>`
  },
  {
    id: "mycelium",
    name: "真菌魔導士 · 菌絲長老",
    title: "高溫發酵奧秘掌管者",
    element: "秘法真菌系 🍄",
    avatarBg: "radial-gradient(circle, #f3e5f5, #ce93d8)",
    quote: "「60度高溫升騰之時，頑強的粗纖維也將化為大地之露！」",
    description: "隱身於落葉與木屑之中的智慧長老，能催動好氧高溫發酵魔法，殺滅病菌，瓦解木質素與纖維素。",
    passiveSkill: "【菌絲共生】每連續答對 3 題立即回復自身 15 點生命值 (HP)",
    hpModifier: 1.0,
    defBonus: 0.2,
    scoreBonus: 1.1,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fungusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ab47bc" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#4a148c" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#fungusGlow)"/>
      <!-- 長袍法衣 -->
      <path d="M68,140 Q100,120 132,140 L140,185 Q100,195 60,185 Z" fill="#6a1b9a"/>
      <path d="M85,135 L115,135 L110,185 L90,185 Z" fill="#ba68c8"/>
      <!-- 蘑菇魔導帽 -->
      <path d="M40,90 Q100,20 160,90 Q100,75 40,90 Z" fill="#d32f2f"/>
      <ellipse cx="65" cy="65" rx="8" ry="6" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="135" cy="65" rx="9" ry="7" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="100" cy="45" rx="10" ry="7" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="100" cy="72" rx="7" ry="5" fill="#ffffff" opacity="0.8"/>
      <!-- 臉部 -->
      <circle cx="100" cy="108" r="28" fill="#fff9c4"/>
      <!-- 白花花長者鬍鬚 -->
      <path d="M80,118 Q100,155 120,118 Q100,135 80,118 Z" fill="#ffffff"/>
      <!-- 智慧長者微笑小眼睛 -->
      <path d="M88,105 Q93,100 98,105" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M102,105 Q107,100 112,105" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 孢子魔法球 -->
      <circle cx="50" cy="130" r="14" fill="#ffd54f" opacity="0.85"/>
      <circle cx="50" cy="130" r="8" fill="#ffffff"/>
      <!-- 漂浮金光孢子 -->
      <circle cx="145" cy="120" r="4" fill="#ffeb3b"/>
      <circle cx="160" cy="145" r="5" fill="#e1bee7"/>
      <circle cx="135" cy="40" r="3" fill="#ffeb3b"/>
    </svg>`
  },
  {
    id: "coffee",
    name: "焦糖魔劍士 · 咖啡渣守衛",
    title: "微孔異味淨化者",
    element: "芳香烘焙系 ☕",
    avatarBg: "radial-gradient(circle, #efebe9, #a1887f)",
    quote: "「香氣是正義的盔甲，異味與害蟲在微孔前無所遁形！」",
    description: "咖啡渣化身的英勇衛士，蘊含豐富氮元素與大量微孔結構，能吸附氨氣酸臭，讓堆肥香氣如同大地芬芳。",
    passiveSkill: "【異味淨化斬】遭遇突發危機題與除臭題時，獲得 2 倍超高得分",
    hpModifier: 1.1,
    defBonus: 0.2,
    scoreBonus: 1.25,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="coffeeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#bcaaa4" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#4e342e" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#coffeeGlow)"/>
      <!-- 棕色騎士盔甲身軀 -->
      <path d="M72,130 L128,130 L120,185 L80,185 Z" fill="#4e342e"/>
      <path d="M85,130 L115,130 L108,175 L92,175 Z" fill="#6d4c41"/>
      <!-- 咖啡豆徽章 -->
      <ellipse cx="100" cy="148" rx="8" ry="11" fill="#3e2723"/>
      <path d="M100,138 Q96,148 100,158" stroke="#d7ccc8" stroke-width="2" fill="none"/>
      <!-- 頭盔面罩 -->
      <circle cx="100" cy="80" r="32" fill="#5d4037"/>
      <rect x="76" y="74" width="48" height="12" rx="4" fill="#271c19"/>
      <!-- 炯炯有神的金黃眼神 -->
      <rect x="84" y="77" width="12" height="6" rx="2" fill="#ffb74d"/>
      <rect x="104" y="77" width="12" height="6" rx="2" fill="#ffb74d"/>
      <!-- 冒煙熱氣 -->
      <path d="M85,42 Q80,28 90,15" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.75" stroke-linecap="round"/>
      <path d="M100,38 Q108,24 98,12" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/>
      <path d="M115,44 Q110,30 120,18" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.75" stroke-linecap="round"/>
      <!-- 烘焙蒸氣巨劍 -->
      <line x1="145" y1="50" x2="145" y2="185" stroke="#d7ccc8" stroke-width="8" stroke-linecap="round"/>
      <line x1="130" y1="160" x2="160" y2="160" stroke="#8d6e63" stroke-width="6"/>
      <polygon points="145,35 138,50 152,50" fill="#ffd54f"/>
    </svg>`
  },
  {
    id: "paladin",
    name: "碳氮聖騎士 · 棕綠守護者",
    title: "黃金比例 25:1 天平大師",
    element: "聖光平衡系 🛡️",
    avatarBg: "radial-gradient(circle, #fff9c4, #fff176)",
    quote: "「棕多生寒，綠多成臭；唯有 25 比 1，方成聖潔真理！」",
    description: "手持神聖天平的騎士，嚴格監控碳源（枯葉碎紙）與氮源（菜葉果皮）的比例，守護發酵神殿永不失衡崩潰。",
    passiveSkill: "【天平聖裁】配方調配與生熟題型自動提供黃金提示，血量上限 +20",
    hpModifier: 1.2,
    defBonus: 0.2,
    scoreBonus: 1.1,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="paladinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff59d" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#fbc02d" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#paladinGlow)"/>
      <!-- 白金神聖甲冑身軀 -->
      <path d="M70,125 L130,125 L124,185 L76,185 Z" fill="#cfd8dc"/>
      <path d="M85,125 L115,125 L110,180 L90,180 Z" fill="#ffffff"/>
      <!-- 聖十字徽章 -->
      <rect x="96" y="140" width="8" height="24" rx="2" fill="#ffd54f"/>
      <rect x="88" y="148" width="24" height="8" rx="2" fill="#ffd54f"/>
      <!-- 騎士頭盔與面甲 -->
      <circle cx="100" cy="75" r="30" fill="#eceff1"/>
      <path d="M75,70 Q100,50 125,70 L120,95 Q100,105 80,95 Z" fill="#b0bec5"/>
      <line x1="100" y1="65" x2="100" y2="95" stroke="#37474f" stroke-width="3"/>
      <line x1="86" y1="80" x2="114" y2="80" stroke="#37474f" stroke-width="3"/>
      <!-- 神聖金羽羽飾 -->
      <path d="M100,45 Q100,15 118,22 Q105,32 100,45 Z" fill="#ffca28"/>
      <!-- 左右平衡天平法器 -->
      <!-- 天平中軸 -->
      <line x1="150" y1="65" x2="150" y2="150" stroke="#78909c" stroke-width="4"/>
      <line x1="125" y1="80" x2="175" y2="80" stroke="#ffd54f" stroke-width="4"/>
      <!-- 左盤 (棕色碳源標誌 🍂) -->
      <ellipse cx="132" cy="100" rx="10" ry="4" fill="#8d6e63"/>
      <!-- 右盤 (綠色氮源標誌 🌿) -->
      <ellipse cx="168" cy="100" rx="10" ry="4" fill="#4caf50"/>
    </svg>`
  },
  {
    id: "druid",
    name: "日曜德魯伊 · 豐收使者",
    title: "黃金果實催生者",
    element: "太陽豐收系 ☀️",
    avatarBg: "radial-gradient(circle, #ffe082, #ffb300)",
    quote: "「當黑金融入田土，每一顆種子都會長成參天希望！」",
    description: "大自然循環最後的守門人與引導者，將熟成的黑色黃金肥料施入大地，引導金燦陽光促成果實飽滿大豐收。",
    passiveSkill: "【豐收恩賜】最終通關結算時，總積分自動額外加乘 20%",
    hpModifier: 1.05,
    defBonus: 0.15,
    scoreBonus: 1.2,
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff176" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#ff8f00" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#sunGlow)"/>
      <!-- 陽光光芒冠冕 -->
      <circle cx="100" cy="75" r="50" fill="none" stroke="#ffe082" stroke-width="4" stroke-dasharray="10 8"/>
      <!-- 長袍身軀 -->
      <path d="M68,135 Q100,115 132,135 L138,185 Q100,195 62,185 Z" fill="#f57c00"/>
      <path d="M85,130 L115,130 L110,185 L90,185 Z" fill="#ffb74d"/>
      <!-- 德魯伊頭像 -->
      <circle cx="100" cy="78" r="32" fill="#ffe0b2"/>
      <!-- 向日葵花冠 -->
      <circle cx="100" cy="52" r="14" fill="#fbc02d"/>
      <circle cx="100" cy="52" r="7" fill="#5d4037"/>
      <!-- 溫暖雙眼與笑容 -->
      <ellipse cx="88" cy="75" rx="5" ry="7" fill="#e65100"/>
      <ellipse cx="112" cy="75" rx="5" ry="7" fill="#e65100"/>
      <circle cx="89" cy="73" r="2" fill="#ffffff"/>
      <circle cx="113" cy="73" r="2" fill="#ffffff"/>
      <path d="M92,88 Q100,96 108,88" stroke="#bf360c" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 豐收果實法杖 -->
      <line x1="145" y1="45" x2="145" y2="185" stroke="#795548" stroke-width="6" stroke-linecap="round"/>
      <circle cx="145" cy="40" r="16" fill="#e53935"/> <!-- 魔法大蘋果 -->
      <path d="M145,28 Q155,20 152,32" stroke="#2e7d32" stroke-width="3" fill="none"/>
    </svg>`
  }
];

class HeroManager {
  constructor() {
    this.heroes = [];
    this.loadHeroes();
  }

  loadHeroes() {
    const saved = localStorage.getItem('sjps_custom_heroes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.heroes = DEFAULT_HEROES.map(defHero => {
          const match = parsed.find(p => p.id === defHero.id);
          return match ? { ...defHero, ...match } : { ...defHero };
        });
        return;
      } catch (e) {
        console.error("載入英雄設定失敗，使用預設", e);
      }
    }
    this.heroes = JSON.parse(JSON.stringify(DEFAULT_HEROES));
  }

  saveHeroes() {
    const customData = this.heroes.map(h => ({
      id: h.id,
      name: h.name,
      title: h.title,
      description: h.description,
      passiveSkill: h.passiveSkill,
      customImage: h.customImage || null
    }));
    localStorage.setItem('sjps_custom_heroes', JSON.stringify(customData));
  }

  getAll() {
    return this.heroes;
  }

  getHeroById(id) {
    return this.heroes.find(h => h.id === id) || this.heroes[0];
  }

  updateHeroImage(id, dataUrl) {
    const hero = this.getHeroById(id);
    if (hero) {
      hero.customImage = dataUrl;
      this.saveHeroes();
      return true;
    }
    return false;
  }

  resetHeroImage(id) {
    const hero = this.getHeroById(id);
    if (hero) {
      delete hero.customImage;
      this.saveHeroes();
      return true;
    }
    return false;
  }

  resetAllToDefault() {
    localStorage.removeItem('sjps_custom_heroes');
    this.loadHeroes();
  }

  getHeroImageHtml(hero, extraClass = '') {
    if (hero.customImage) {
      return `<img src="${hero.customImage}" alt="${hero.name}" class="hero-render-img ${extraClass}" />`;
    }
    return `<div class="hero-render-svg ${extraClass}">${hero.svg}</div>`;
  }
}

window.heroManager = new HeroManager();
