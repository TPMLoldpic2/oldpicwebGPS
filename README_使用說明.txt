《城西尋影》網頁試玩包
========================

內容：
- index.html     網頁入口，開啟這個檔案
- styles.css     外觀樣式
- app.js         GPS 解鎖、地圖、照片與影片播放
- config.js      六個關卡資料、GPS 座標、半徑、對應照片與館藏網址
- images/        六張老照片（原始 ZIP 已重新輸出成完整可讀的 JPG）
- videos/        AI 影片（本次只有 today-department.mp4）

一、如何預覽
1. 將 ZIP 完整解壓縮，保持以上檔案與資料夾相對位置不變。
2. 用 Chrome / Safari 開啟 index.html，可查看版面。
3. 在首頁按「展示預覽」，即可開啟所有照片；今日百貨會出現半透明白框「看動圖」。
4. 地圖需要網路；若無法載入，仍可用關卡清單瀏覽。

二、正式測試 GPS
瀏覽器定位必須使用 HTTPS（或開發測試的 localhost）。
只開啟 file:// 開頭的本機 index.html，不能視為有效戶外 GPS 測試。
可將整個資料夾部署到支援 HTTPS 的靜態網站空間（例如 GitHub Pages、Netlify）。
也可以在開發者電腦的網站目錄執行：python -m http.server 8000
然後用該電腦的瀏覽器開啟 http://localhost:8000
（手機若透過局域網 IP 訪問，仍需要 HTTPS 才能使用定位）。

三、照片與影片命名規則
每個關卡圖片放在 images/<關卡id>.jpg
對應影片放在 videos/<關卡id>.mp4（H.264 MP4），主檔名完全相同。
目前六個關卡 ID：
- nishi-honganji
- ximen-redhouse
- new-world-cinema
- today-department
- zhonghua-market
- zhongshan-hall
影片可以缺省：沒有影片就不顯示「看動圖」。
部署在 HTTPS 網站後，app.js 會檢查 videos/<關卡id>.mp4 是否存在，新增影片後不需修改程式。
本機直接打開 file:// 時，僅會使用 config.js 已登記的影片；若之後要離線預覽新影片，請在 config.js 對應關卡的 video 欄位填入路徑。

四、GPS 設定很重要
config.js 內每個關卡的 lat / lng / radius 是『第一版測試座標』。
部分地點代表現代建築，而不是老照片的拍攝角度；中華商場尤其只有暫定示範點。
上線前請現地確認安全人行道位置及 GPS 訊號，逐點調整座標與觸發半徑。
不應讓觀眾為了定位走進馬路或危險區域。

五、關於領獎
目前為展覽試玩原型：解鎖紀錄只存在目前裝置的 localStorage，可被清除或修改。
尚未實作正式兌獎系統，不可把完成畫面或截圖當成可信的核銷憑證。
正式展出前需額外開發後端一次性兌換碼與核銷紀錄。

六、版權提醒
館藏照片與 AI 動態改作之使用權利，仍需由展覽主辦方確認。

七、資料夾拼字
原始上傳 ZIP 使用 vedios/，本包已修正成 videos/，請以 videos/ 為準。
