/**
 * Firebase 雲端資料庫與 Google 帳號身分驗證模組
 * 專案名稱: blackgold2
 */

// 管理者身分雜湊特徵碼 (SHA-256)，嚴格保護個人信箱不直接暴露於公開前端程式碼
const ADMIN_EMAIL_HASH = "01a93d7af3a4891ab7fb5aeff85347a92d9825b35ab423d2c53ed0cadf7625a7";

// 安全單向雜湊運算函式
async function computeSha256(str) {
  if (!str) return '';
  const buffer = new TextEncoder().encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Firebase 專案配置 (請於 Firebase Console 建立專案 'blackgold2' 後將配置貼至此處)
const firebaseConfig = { 
  apiKey : "AIzaSyAf3KzDH1eH-g4wADF6ZQB0aYt5Ahg3L7I" , 
  authDomain : "blackgold2-eb1a1.firebaseapp.com" , 
  projectId : "blackgold2-eb1a1" , 
  storageBucket : "blackgold2-eb1a1.firebasestorage.app" , 
  messagingSenderId : "304164262299" , 
  appId : "1:304164262299:web:1a416730fede2bdc5a113e" 
};

class FirebaseBridge {
  constructor() {
    this.isInitialized = false;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.init();
  }

  init() {
    if (typeof firebase === 'undefined') {
      console.warn("[Firebase] SDK 未載入，將採用純離線模式運作。");
      return;
    }

    // 檢查是否已設定有效金鑰
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_API_KEY")) {
      console.info("[Firebase] 尚未配置真實 API Key，已準備好 Google 登入與 Firestore 介面，請依引導指南填入金鑰。");
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.isInitialized = true;

      // 監聽登入狀態改變
      this.auth.onAuthStateChanged(user => {
        this.currentUser = user;
        if (window.adminPanel && window.adminPanel.onAuthChanged) {
          window.adminPanel.onAuthChanged(user);
        }
      });

      console.log("🔥 [Firebase] blackgold2 初始化成功！");
    } catch (err) {
      console.warn("[Firebase] 初始化失敗，降級為離線模式:", err.message);
    }
  }

  // 使用 Google 帳號彈出視窗登入
  async loginWithGoogle() {
    if (!this.isInitialized || !this.auth) {
      throw new Error("NOT_CONFIGURED");
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await this.auth.signInWithPopup(provider);
    return result.user;
  }

  // 登出
  async logout() {
    if (this.auth) {
      await this.auth.signOut();
      this.currentUser = null;
    }
  }

  // 驗證當前登入者是否具備管理者權限 (透過 SHA-256 特徵碼比對，保護隱私與資安)
  async isAdmin(user) {
    if (!user || !user.email) return false;
    const hash = await computeSha256(user.email);
    return hash === ADMIN_EMAIL_HASH;
  }

  // 上傳單筆挑戰成績至 Firestore
  async saveRecord(record) {
    if (!this.isInitialized || !this.db) return false;
    try {
      await this.db.collection('blackgold2_records').doc(record.id).set({
        ...record,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (e) {
      console.warn("[Firebase] 成績同步雲端失敗:", e);
      return false;
    }
  }

  // 從 Firestore 獲取全體最新成績
  async fetchAllRecords() {
    if (!this.isInitialized || !this.db) return [];
    try {
      const snap = await this.db.collection('blackgold2_records').orderBy('totalScore', 'desc').get();
      const records = [];
      snap.forEach(doc => records.push(doc.data()));
      return records;
    } catch (e) {
      console.warn("[Firebase] 讀取雲端成績失敗:", e);
      return [];
    }
  }

  // 同步班級清單至 Firestore
  async saveClassList(classList) {
    if (!this.isInitialized || !this.db) return false;
    try {
      await this.db.collection('blackgold2_config').doc('classes').set({
        list: classList,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (e) {
      console.warn("[Firebase] 班級同步雲端失敗:", e);
      return false;
    }
  }
}

window.firebaseBridge = new FirebaseBridge();
