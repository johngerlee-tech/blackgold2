# 🔮 blackgold2 · Firebase 雲端資料庫與 Google 管理者綁定設定指南

本指南專為 **黑金魔法術🔮 永續食物循環系統 (RPG 闖關遊戲)** 量身打造，指導您如何於 Google Firebase 建立資料庫專案 `blackgold2`，並將後台管理權限嚴密綁定至您的專屬 Google 帳號 **`johngerlee@gmail.com`**，最後將專案推送至 GitHub 進行永久線上託管與學生連線對戰。

---

## 📌 目錄
1. [第一步：在 Firebase Console 建立專案 (blackgold2)](#第一步在-firebase-console-建立專案-blackgold2)
2. [第二步：啟用 Google 登入驗證 (Authentication)](#第二步啟用-google-登入驗證-authentication)
3. [第三步：建立 Firestore 雲端資料庫與設定安全規則](#第三步建立-firestore-雲端資料庫與設定安全規則)
4. [第四步：取得 Web 設定檔並貼入 js/firebase-config.js](#第四步取得-web-設定檔並貼入-jsfirebase-configjs)
5. [第五步：推送到 GitHub 儲存庫並啟用 GitHub Pages](#第五步推送到-github-儲存庫並啟用-github-pages)
6. [第六步：離線與容錯備援機制說明](#第六步離線與容錯備援機制說明)

---

## 第一步：在 Firebase Console 建立專案 (blackgold2)

1. 開啟瀏覽器並登入您的 Google 帳號 (`johngerlee@gmail.com`)，前往 [Firebase Console 官方主控台](https://console.firebase.google.com/)。
2. 點選 **「建立專案」**（或「新增專案」）。
3. **專案名稱** 請輸入：`blackgold2`。
4. Google Analytics 分析功能可依個人喜好選擇開啟或關閉（學校教學用途建議關閉或直接繼續）。
5. 點選 **「建立專案」**，等待數秒鐘系統部署完成後點選「繼續」。

---

## 第二步：啟用 Google 登入驗證 (Authentication)

為了讓您在教師後台點選「使用 Google 帳號登入」時能一鍵授權身分，需在主控台啟用 Google 驗證：

1. 在 Firebase 主控台左側導覽列，點選 **「建構」 (Build)** ➔ **「Authentication」**。
2. 點選 **「開始使用」 (Get started)**。
3. 在「登入方法」標籤頁中，於提供者清單選取 **「Google」**。
4. 將狀態開關切換為 **「啟用」 (Enable)**。
5. 設定 **專案公開名稱**（例如：`黑金魔法術RPG後台`）以及 **專案支援電子郵件**（選取 `johngerlee@gmail.com`）。
6. 點選右下角 **「儲存」 (Save)**。
7. **設定已授權網域 (Authorized Domains)**：
   - 仍在 Authentication 頁面中，切換到 **「設定」 (Settings)** ➔ **「已授權網域」 (Authorized domains)**。
   - 預設已有 `localhost` 與 `blackgold2.firebaseapp.com`。
   - 點選 **「新增網域」**，輸入您的 GitHub Pages 網域：
     ```text
     johngerlee.github.io
     ```
   - 點選新增儲存。（此步驟極為關鍵，能確保學生在 GitHub 網頁遊玩或您在線上後台登入時不會被安全性阻擋）。

---

## 第三步：建立 Firestore 雲端資料庫與設定安全規則

Firestore 是用來即時儲存所有學生挑戰成績、積分、各關錯題統計與班級名稱的雲端資料庫：

1. 在左側導覽列點選 **「建構」 (Build)** ➔ **「Firestore Database」**。
2. 點選 **「建立資料庫」 (Create database)**。
3. 資料庫 ID 保留預設 `(default)`，地區建議選取鄰近的 **`asia-east1` (台灣)** 或 `asia-northeast1` (東京)。
4. 安全規則選項選擇 **「以生產模式啟動」 (Start in production mode)**，點選「建立」。
5. 資料庫建立完成後，點選上方的 **「規則」 (Rules)** 標籤頁。
6. 將編輯器內的原有規則清空，換成以下專為 `blackgold2` 與 `johngerlee@gmail.com` 設計的安全規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 檢查當前登入者是否為指定的 Google 管理者 (johngerlee@gmail.com)
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email.lower() == 'johngerlee@gmail.com';
    }

    // 1. 學生挑戰成績與錯題集合 (blackgold2_records)
    match /blackgold2_records/{recordId} {
      // 允許任何學生訪客上傳建立自己的闖關成績 (create)
      allow create: if true;
      
      // 只有管理員 johngerlee@gmail.com 可以查詢成績列表、編輯與刪除
      allow read, update, delete: if isAdmin();
    }

    // 2. 班級名稱選單列表 (blackgold2_classes)
    match /blackgold2_classes/{docId} {
      // 任何人皆可讀取班級選單
      allow read: if true;
      // 只有管理員可以修改班級
      allow write: if isAdmin();
    }

    // 3. 遊戲各項參數與設定 (blackgold2_settings)
    match /blackgold2_settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

7. 點選右上角的 **「發布」 (Publish)** 生效。

> [!TIP]
> 採用此規則後：
> - 學生完全不需要註冊或登入 Google，作答完畢後成績與錯題會自動即時寫入雲端。
> - 只有您的 Google 帳號 `johngerlee@gmail.com` 在登入後有權調閱全校學生成績、下載 CSV、開啟大螢幕錯題投影簡報與調整後台參數！

---

## 第四步：取得 Web 設定檔並貼入 js/firebase-config.js

1. 在 Firebase 主控台左上方，點選齒輪圖示 **「專案設定」 (Project settings)**。
2. 滾動至「一般」頁面最下方的 **「您的應用程式」 (Your apps)** 區塊。
3. 點選 **「</>」 (網頁圖示 Web)** 以新增應用程式。
4. 輸入應用程式暱稱：`blackgold2-web`，不用勾選「Firebase Hosting」，點選 **「註冊應用程式」**。
5. 畫面會出現一段 `firebaseConfig` 物件，類似如下：
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyBxxxx-xxxxxxxxxxxxxxxxxxxxxxx",
     authDomain: "blackgold2.firebaseapp.com",
     projectId: "blackgold2",
     storageBucket: "blackgold2.appspot.com",
     messagingSenderId: "987654321000",
     appId: "1:987654321000:web:abcdef1234567890abcdef"
   };
   ```
6. 開啟專案資料夾下的 [js/firebase-config.js](file:///C:/Users/User/.gemini/antigravity/scratch/blackgold2/js/firebase-config.js)。
7. 將第 10~17 行的 `firebaseConfig` 替換為您剛剛複製的真實物件。
8. 存檔即可！系統會自動即時連接至您的 Firebase 資料庫！

---

## 第五步：推送到 GitHub 儲存庫並啟用 GitHub Pages

### 1. 在 GitHub 建立儲存庫
1. 開啟 [GitHub 網站](https://github.com/) 並登入您的帳號 `johngerlee`。
2. 點選右上角 **「+」 ➔ 「New repository」**。
3. **Repository name** 請輸入：`blackgold2`。
4. 選擇 **Public**（公開），不要勾選「Initialize this repository with a README」（因為本地已有完整檔案）。
5. 點選 **「Create repository」**。

### 2. 在本地命令列執行推送
打開 PowerShell 或終端機，執行以下指令：

```powershell
# 進入 blackgold2 專案目錄
cd "C:\Users\User\.gemini\antigravity\scratch\blackgold2"

# 將所有檔案加入暫存區並提交初版
git add .
git commit -m "feat: complete blackgold2 RPG with 1366x768 zero-scroll, floating sprites, Iansui Zhuyin and Firebase integration"

# 關聯至遠端 GitHub 儲存庫 (以您的帳號 johngerlee 為例)
git remote add origin https://github.com/johngerlee/blackgold2.git

# 推送至 main 分支
git branch -M main
git push -u origin main
```

### 3. 開啟 GitHub Pages 網頁託管
1. 回到 GitHub 上的 `blackgold2` 專案頁面。
2. 點選 **「Settings」 (設定)** 標籤頁。
3. 在左側功能表中選取 **「Pages」**。
4. 在「Build and deployment」➔「Source」選擇 **「Deploy from a branch」**。
5. Branch 選擇 **`main`**，資料夾選擇 **`/(root)`**，點選 **「Save」**。
6. 約 1~2 分鐘後，即可在以下專屬網址暢玩與投影：
   👉 **`https://johngerlee.github.io/blackgold2/`**

---

## 第六步：離線與容錯備援機制說明

本系統具備業界級的高容錯雙軌架構：

1. **若尚未配置 Firebase 或無網路連線**：
   - 系統會無縫降級為「純前端本機模式」。
   - 學生成績會保存在本機 `localStorage`，遊玩與音效衝撞動畫 100% 正常。
   - 後台提供離線備用管理密碼 `sjps888`，依然可查閱本機成績與開啟錯題投影。

2. **配置 Firebase 後**：
   - 教師點擊「🔑 教師後台」時，彈出驗證視窗支援 **「使用 Google 帳號登入 (johngerlee@gmail.com)」**。
   - 系統自動驗證登入信箱，非 `johngerlee@gmail.com` 的一般訪客將被嚴格拒絕存取，確保學生隱私與後台安全。
   - 後台提供「☁️ 雲端同步 (Firebase)」按鈕，隨時匯總各班作答紀錄！
