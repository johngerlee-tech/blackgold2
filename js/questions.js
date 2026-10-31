/**
 * 永續食物循環系統 - 完整階梯式題庫庫存
 * 支援三階段連續闖關、題庫自訂新增修改、JSON匯入匯出與投影簡報模式觀念解析
 */

const DEFAULT_QUESTIONS = [
  // ===================== 第一關：黑金魔法術 · 土地循環七部曲 =====================
  {
    id: "s1_q1",
    stage: 1,
    category: "食物循環概念",
    question: "為什麼我們把發酵完成的有機堆肥稱為「黑色黃金」（黑金）？",
    options: [
      "因為它是從地底挖出來的真正黑黃金",
      "因為含有豐富腐植質與養分，能使土地重獲生機，如同大地之寶",
      "因為加入了很多黑色食用色素所以看起來很高級",
      "因為價格比真的黃金還要昂貴很多倍"
    ],
    answer: 1,
    hint: "提示：思考它對土壤與農作物的巨大價值喔！",
    explanation: "「黑金」比喻的是熟成堆肥豐富的腐植質、微生物與氮磷鉀養分。它能改善土壤結構、保水保肥，讓作物茁壯生長，對大自然循環而言如同無價的黃金！"
  },
  {
    id: "s1_q2",
    stage: 1,
    category: "七步驟循環",
    question: "在「土地到餐桌到土地」的食物循環旅程中，最後一步最重要的關鍵是什麼？",
    options: [
      "將吃不完的廚餘直接丟入垃圾車送去掩埋場",
      "將廚餘與落葉經過微生物發酵轉化為黑金肥料，回歸滋養農田",
      "把廚餘全部倒入洗手槽用水沖走",
      "只要吃光食物就好，剩下的完全不用管"
    ],
    answer: 1,
    hint: "提示：回到大地的才是永續的圓環！",
    explanation: "食物循環的核心是「落葉歸根」。從土壤吸收養分長出作物，吃剩的廚餘經過分類與堆肥，重新變成有機肥料回饋大地，才能形成無窮無盡的閉環生態系。"
  },
  {
    id: "s1_q3",
    stage: 1,
    category: "生物分解角色",
    question: "在黑金堆肥的魔法大釜中，是哪一群「隱形魔法師」負責日夜不停分解有機物？",
    options: [
      "微生物（細菌、放線菌與真菌）以及土壤小動物",
      "只有大自然中的微風與雨水",
      "學校裡的自動機械人",
      "完全不需要任何生物，放著就會自動消失"
    ],
    answer: 0,
    hint: "提示：顯微鏡下可以看到很多勤奮的小精靈喔！",
    explanation: "好氧堆肥過程中，各類嗜溫菌、嗜熱菌、放線菌、真菌以及蚯蚓等生物，分泌酵素將蛋白質、澱粉與纖維分解為腐植質，是不可或缺的超級功臣！"
  },
  {
    id: "s1_q4",
    stage: 1,
    category: "環境減碳",
    question: "如果學校與家庭能落實廚餘堆肥再利用，對地球環境最直接的幫助是什麼？",
    options: [
      "可以讓焚化爐的溫度無限升高",
      "大幅減少焚化爐負擔與垃圾量，降低溫室氣體排放並守護土壤健康",
      "可以讓每個人都少吃一餐",
      "讓學校的垃圾桶變得更大更重"
    ],
    answer: 1,
    hint: "提示：想想看水分很多的廚餘送去焚化爐會發生什麼事！",
    explanation: "廚餘含水量高，直接送進焚化爐會降低燃燒溫度、增加助燃重油消耗、產生戴奧辛風險並破壞爐體。落實堆肥能減碳、固碳，是一舉數得的永續行動。"
  },
  {
    id: "s1_q5",
    stage: 1,
    category: "惜食觀念",
    question: "落實「永續食物循環」的最高指導原則（第一優先順位）應該是什麼？",
    options: [
      "盡情吃剩，反正都可以拿去做堆肥",
      "源頭減量、珍惜食物、吃多少煮多少，減少廚餘產生",
      "每天都要買很多食物堆在冰箱裡",
      "不管好不好吃，只要是食物就要丟掉"
    ],
    answer: 1,
    hint: "提示：最棒的魔法是根本不浪費喔！",
    explanation: "惜食金字塔的最頂層就是「源頭減量」。吃多少盛多少、愛惜盤中飧，其次才是再利用（養豬、堆肥），最後才是清運處理。"
  },

  // ===================== 第二關：廚餘分類王 · 熟廚餘 vs 生廚餘 vs 垃圾 =====================
  {
    id: "s2_q1",
    stage: 2,
    category: "生廚餘辨識",
    question: "削完的「香蕉皮、蘋果核與生菜葉」應該投入哪一個桶子最適合？",
    options: [
      "生廚餘桶（綠色堆肥）",
      "熟廚餘桶（黃色養豬）",
      "一般垃圾桶（直接焚化）",
      "資源回收桶（塑膠類）"
    ],
    answer: 0,
    hint: "提示：未經烹煮烹調的植物邊角料最適合堆肥！",
    explanation: "未經烹煮、低鹽分低油脂的果皮、蔬菜外葉、菜根都是標準的「生廚餘（堆肥廚餘）」，富含有機質，最適合微生物與黑水虻轉化為堆肥。"
  },
  {
    id: "s2_q2",
    stage: 2,
    category: "熟廚餘辨識",
    question: "午餐吃剩下的「煮熟白飯、炒麵與滷肉塊」應該投入哪裡？",
    options: [
      "生廚餘桶（堆肥）",
      "熟廚餘桶（養豬/高溫發酵）",
      "紙類回收桶",
      "一般垃圾桶"
    ],
    answer: 1,
    hint: "提示：煮熟的飯菜油脂與鹽分較高，豬豬很喜歡吃！",
    explanation: "煮熟的米飯、麵條、肉類屬於「熟廚餘（養豬廚餘）」，具備較高的熱量與蛋白質，經過高溫蒸煮消毒後是優良的豬隻飼料來源。"
  },
  {
    id: "s2_q3",
    stage: 2,
    category: "常見易錯混淆物",
    question: "喝蛤蜊湯剩下的「蛤蜊殼」、吃烤肉剩下的「大牛骨」，應該丟入哪一類？",
    options: [
      "生廚餘桶",
      "熟廚餘桶",
      "一般垃圾桶",
      "塑膠容器桶"
    ],
    answer: 2,
    hint: "提示：超級堅硬、豬吃不下去、堆肥幾年也不會爛的硬物！",
    explanation: "【重大易錯點】蛤蜊殼、生蠔殼、堅硬大骨頭、玉米芯、榴槤外殼等，雖然來自食物，但質地堅硬極難分解，且會損壞攪碎刀刃或割傷豬的腸胃，一律屬於「一般垃圾」！"
  },
  {
    id: "s2_q4",
    stage: 2,
    category: "瀝乾關鍵動作",
    question: "在將廚餘倒入廚餘桶之前，為什麼一定要先做「瀝乾水分」的動作？",
    options: [
      "只是為了讓手不會弄濕",
      "瀝乾能大幅減少廚餘重量與體積，防止湯汁發臭腐敗，並避免焚化爐戴奧辛產生",
      "因為水是有毒的不能碰到桶子",
      "瀝乾水分後廚餘會自動飛走"
    ],
    answer: 1,
    hint: "提示：廚餘有將近 70%~80% 都是水份喔！",
    explanation: "廚餘水分過多容易在桶內缺氧厭氧發酵產生惡臭酸味，滋生果蠅蚊蟲；若送入焚化爐，水份會大量吸收爐溫導致燃燒不完全，因此「瀝水再丟」是極為關鍵的環保習慣！"
  },
  {
    id: "s2_q5",
    stage: 2,
    category: "咖啡渣茶葉渣歸類",
    question: "爸爸泡完咖啡剩下的「咖啡渣」或泡茶後的「茶葉渣」，屬於哪一類？",
    options: [
      "生廚餘（堆肥優質材料）",
      "熟廚餘（給豬吃）",
      "有害垃圾",
      "廢紙類"
    ],
    answer: 0,
    hint: "提示：有芳香多孔的特性，是堆肥中的氮源與除臭好物！",
    explanation: "咖啡渣與茶葉渣屬於生廚餘。咖啡渣具有許多微細孔隙，能吸附異味，且含有約 2% 的氮元素，是極受園藝家與堆肥喜愛的天然好原料！"
  },
  {
    id: "s2_q6",
    stage: 2,
    category: "外帶餐盒雜質",
    question: "吃完便當後，便當盒裡附帶的「牙籤、紙巾、塑膠湯匙」，應該如何處理？",
    options: [
      "跟剩菜一起全部倒進熟廚餘桶",
      "全部倒進生廚餘桶做堆肥",
      "將雜質挑出丟入一般垃圾或塑膠回收，只有純剩飯菜才能入廚餘桶",
      "直接塞在桌子底下"
    ],
    answer: 2,
    hint: "提示：千萬不要把不可食用的非有機物混進去！",
    explanation: "塑膠袋、橡皮筋、牙籤、紙巾若混入廚餘桶，會造成嚴重的農田塑膠微粒污染或導致豬隻腸阻塞死亡。倒廚餘時務必徹底做好「除雜分類」。"
  },

  // ===================== 第三關：堆肥小勇士 · 黑金魔釜配方與實戰 =====================
  {
    id: "s3_q1",
    stage: 3,
    category: "堆肥五字口訣",
    question: "想要做出完美的黑金堆肥，朗朗上口的「堆肥五大黃金步驟口訣」是什麼？",
    options: [
      "洗淨、煮熟、油炸、冷凍、密封",
      "切小、混乾、保濕、通風、等待熟成",
      "泡水、密封、曬乾、丟棄、忘記",
      "越多、越濕、越密、加熱、快衝"
    ],
    answer: 1,
    hint: "提示：切細碎、加枯葉、有微濕、要翻堆、耐心等！",
    explanation: "【堆肥五字訣】1.切小（增加表面積） 2.混乾（加入枯葉碎紙平衡碳氮比） 3.保濕（約60%濕度） 4.通風（好氧翻堆提供氧氣） 5.等待熟成（微生物充分分解降溫）。"
  },
  {
    id: "s3_q2",
    stage: 3,
    category: "碳氮比 (C:N 比)",
    question: "堆肥魔法最講求平衡！「棕色材料（如枯落葉、木屑、紙箱紙屑）」主要提供什麼元素？",
    options: [
      "碳元素（C，作為微生物的能量來源與鬆散骨架）",
      "氮元素（N）",
      "水元素（水分）",
      "金屬鐵元素"
    ],
    answer: 0,
    hint: "提示：落葉乾草乾燥脆裂，是富含木質素與碳化物的棕色代表！",
    explanation: "棕色材料（如落葉、乾稻草、瓦楞紙條、鋸木屑）含碳量高（C:N 通常大於 50:1），能提供碳源作為微生物生命活動的能量，並建立蓬鬆透氣的堆肥骨架。"
  },
  {
    id: "s3_q3",
    stage: 3,
    category: "綠色材料與氮源",
    question: "相反地，「綠色材料（如生菜葉、果皮、咖啡渣、新鮮割草）」主要提供什麼養分？",
    options: [
      "塑膠微粒",
      "氮元素（N，微生物繁殖建構蛋白質所需）",
      "只有純水完全無養分",
      "大量二氧化碳"
    ],
    answer: 1,
    hint: "提示：綠色新鮮有機物含有豐富的蛋白質與氮！",
    explanation: "綠色材料含水量高、蛋白質豐富，提供微生物生長分裂所需的「氮元素」。若只有綠色材料而無棕色料，會因為過濕過氮而發出惡臭酸氣。"
  },
  {
    id: "s3_q4",
    stage: 3,
    category: "黃金濕度檢測",
    question: "如何用雙手快速判斷堆肥的濕度是否達到「黃金 50%~60%」的最佳狀態？",
    options: [
      "用手抓一把用力捏，指縫間有水氣但「不會有水滴滴落」，鬆開後成團不散開",
      "抓一把捏下去，水像瀑布一樣噴出來",
      "摸起來像乾燥的沙子一樣完全散開吹走",
      "一定要把整桶堆肥倒在水裡泡著"
    ],
    answer: 0,
    hint: "提示：就像剛擰乾的微濕海綿一樣！",
    explanation: "【握之成團法則】堆肥過濕會缺氧發臭爛掉，過乾微生物會休眠停止分解。最佳狀態是抓取堆料握緊時「手心感受濕潤、成團，但不滴出水珠」，如同吸足水分後用力扭乾的濕毛巾。"
  },
  {
    id: "s3_q5",
    stage: 3,
    category: "疑難排除與搶救",
    question: "如果學校的堆肥箱突然發出一股強烈的「腐爛酸臭味」甚至冒黑水，最佳的魔法搶救法是？",
    options: [
      "倒入更多生菜葉與洗菜水",
      "用塑膠布封得更死，完全不讓空氣進入",
      "立刻翻堆通氣，並混入大量的乾燥棕色材料（如枯落葉、撕碎紙屑）吸收水分",
      "噴灑大量殺蟲劑並直接把整個箱子丟掉"
    ],
    answer: 2,
    hint: "提示：酸臭代表太濕缺氧！需要乾燥劑（落葉）與呼吸（氧氣）！",
    explanation: "堆肥發臭的主因通常是「含水量過高」與「缺氧厭氧發酵」。搶救方法是立即補充大量乾燥落葉、乾草或撕碎瓦楞紙吸乾多餘水分，並徹底翻攪通風，讓好氧菌重新恢復工作！"
  },
  {
    id: "s3_q6",
    stage: 3,
    category: "發酵溫度秘密",
    question: "在堆肥剛製作的第 3~7 天，內部溫度常常會自主升高到 55°C~65°C，這代表什麼現象？",
    options: [
      "糟糕了！堆肥箱著火快爆炸了！",
      "微生物群正在旺盛呼吸發酵，產生發酵熱，能順便高溫殺死病原菌與雜草種子",
      "一定是有人偷偷在裡面放暖暖包或電熱毯",
      "堆肥壞掉了，微生物全都死光了"
    ],
    answer: 1,
    hint: "提示：這是好氧微生物辛勤工作的健康生命熱能喔！",
    explanation: "高溫發酵是良好堆肥的象徵！好氧微生物劇烈代謝分解有機質會釋放大量熱能，高達 55~65°C 的溫度能自然消滅大腸桿菌、寄生蟲卵與雜草種子，使堆肥安全衛生。"
  },
  {
    id: "s3_q7",
    stage: 3,
    category: "熟成驗收標準",
    question: "怎樣才算是一桶「完全成熟」可以安心拿去種植花草蔬果的黑金魔法肥料？",
    options: [
      "堆肥還在發燙 60 度，摸起來黏糊糊酸溜溜",
      "顏色轉變為深黑褐色、質地鬆軟有彈性、溫度降回室溫、聞起來有清新的森林泥土香",
      "裡面的菜葉依然翠綠完好無損",
      "長滿大量蒼蠅與綠頭蒼蠅幼蟲"
    ],
    answer: 1,
    hint: "提示：完全熟成的黑金土聞起來就像雨後森林泥土一樣清爽芬芳！",
    explanation: "未熟成的堆肥若直接施入田間，會在土中繼續發酵奪取氧氣並燒傷植物根部（燒根）。只有顏色呈黑褐腐植土狀、溫度降至室溫、具有宜人泥土芬芳的成熟黑金，才能給予幼苗最好的養分！"
  }
];

class QuestionBank {
  constructor() {
    this.questions = [];
    this.errorLogs = []; // 紀錄所有學生作答錯誤狀況 { qId, selectedOption, timestamp }
    this.loadQuestions();
    this.loadErrorLogs();
  }

  loadQuestions() {
    const saved = localStorage.getItem('sjps_custom_questions');
    if (saved) {
      try {
        this.questions = JSON.parse(saved);
        return;
      } catch (e) {
        console.error("載入自訂題庫失敗，恢復預設題庫", e);
      }
    }
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  }

  saveQuestions() {
    localStorage.setItem('sjps_custom_questions', JSON.stringify(this.questions));
  }

  loadErrorLogs() {
    const logs = localStorage.getItem('sjps_question_error_logs');
    if (logs) {
      try {
        this.errorLogs = JSON.parse(logs);
        return;
      } catch (e) {
        console.error("載入錯題紀錄失敗", e);
      }
    }
    // 預設預載一些示範統計，供老師一開啟後台就能看到生動的錯題簡報與分析圖表
    this.errorLogs = [
      { qId: "s2_q3", selectedOption: 0, timestamp: Date.now() - 3600000 },
      { qId: "s2_q3", selectedOption: 1, timestamp: Date.now() - 3400000 },
      { qId: "s2_q3", selectedOption: 1, timestamp: Date.now() - 3200000 },
      { qId: "s2_q3", selectedOption: 0, timestamp: Date.now() - 3000000 },
      { qId: "s3_q5", selectedOption: 1, timestamp: Date.now() - 2800000 },
      { qId: "s3_q5", selectedOption: 0, timestamp: Date.now() - 2600000 },
      { qId: "s3_q5", selectedOption: 1, timestamp: Date.now() - 2400000 },
      { qId: "s2_q4", selectedOption: 0, timestamp: Date.now() - 2000000 },
      { qId: "s3_q2", selectedOption: 1, timestamp: Date.now() - 1800000 },
      { qId: "s3_q2", selectedOption: 1, timestamp: Date.now() - 1600000 },
      { qId: "s1_q4", selectedOption: 0, timestamp: Date.now() - 1400000 }
    ];
    this.saveErrorLogs();
  }

  saveErrorLogs() {
    localStorage.setItem('sjps_question_error_logs', JSON.stringify(this.errorLogs));
  }

  recordError(qId, selectedOption) {
    this.errorLogs.push({
      qId,
      selectedOption,
      timestamp: Date.now()
    });
    this.saveErrorLogs();
  }

  clearErrorLogs() {
    this.errorLogs = [];
    this.saveErrorLogs();
  }

  getByStage(stageNumber) {
    return this.questions.filter(q => q.stage === stageNumber);
  }

  getById(qId) {
    return this.questions.find(q => q.id === qId);
  }

  addQuestion(newQ) {
    newQ.id = "q_" + Date.now() + "_" + Math.floor(Math.random()*1000);
    this.questions.push(newQ);
    this.saveQuestions();
    return newQ;
  }

  updateQuestion(updatedQ) {
    const idx = this.questions.findIndex(q => q.id === updatedQ.id);
    if (idx !== -1) {
      this.questions[idx] = updatedQ;
      this.saveQuestions();
      return true;
    }
    return false;
  }

  deleteQuestion(qId) {
    this.questions = this.questions.filter(q => q.id !== qId);
    this.saveQuestions();
  }

  resetToDefault() {
    localStorage.removeItem('sjps_custom_questions');
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  }

  // 取得統計排序後的錯題排行清單（供投影簡報使用）
  getErrorRanking() {
    const counts = {};
    const optionPicks = {};

    this.errorLogs.forEach(log => {
      counts[log.qId] = (counts[log.qId] || 0) + 1;
      if (!optionPicks[log.qId]) {
        optionPicks[log.qId] = {};
      }
      optionPicks[log.qId][log.selectedOption] = (optionPicks[log.qId][log.selectedOption] || 0) + 1;
    });

    const list = Object.keys(counts).map(qId => {
      const q = this.getById(qId);
      if (!q) return null;
      return {
        question: q,
        errorCount: counts[qId],
        optionPicks: optionPicks[qId] || {}
      };
    }).filter(Boolean);

    // 依錯誤次數由多到少排序
    list.sort((a, b) => b.errorCount - a.errorCount);

    // 若錯題不足，自動將所有題目排入簡報清單
    if (list.length < this.questions.length) {
      const recordedIds = new Set(list.map(item => item.question.id));
      this.questions.forEach(q => {
        if (!recordedIds.has(q.id)) {
          list.push({
            question: q,
            errorCount: 0,
            optionPicks: {}
          });
        }
      });
    }

    return list;
  }
}

window.questionBank = new QuestionBank();
