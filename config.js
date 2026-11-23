// 《城西尋影》關卡設定。修改關卡時可編輯此檔。
window.GAME_CONFIG = {
  "gameTitle": "城西尋影",
  "year": "2026",
  "radiusNote": "GPS 解鎖距離為測試設定，正式展出前須逐點實測、核對安全人行動線。",
  "start": {
    "name": "臺北市立文獻館",
    "lat": 25.040198,
    "lng": 121.507287,
    "address": "臺北市萬華區中華路一段174之1號"
  },
  "stops": [
    {
      "id": "nishi-honganji",
      "title": "西本願寺",
      "era": "1930 年代",
      "tag": "序章・消失的寺院",
      "description": "曾矗立於此的西本願寺本堂，如今只剩下遺構與城市記憶。走進舊址，看看當年建築的樣貌。",
      "lat": 25.04006,
      "lng": 121.5069,
      "radius": 75,
      "address": "西本願寺廣場（文獻館周邊）",
      "image": "images/nishi-honganji.jpg",
      "video": null,
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=6617&ctNode=404&mp=3",
      "note": "西本願寺廣場代表點，非舊照片攝影位置。"
    },
    {
      "id": "ximen-redhouse",
      "title": "西門紅樓",
      "era": "1920 年代",
      "tag": "第一幕・市場的聲音",
      "description": "從新起街市場到今天的西門紅樓，熟悉的建築曾有另一種熱鬧。",
      "lat": 25.0420652,
      "lng": 121.5069348,
      "radius": 70,
      "address": "萬華區成都路10號",
      "image": "images/ximen-redhouse.jpg",
      "video": null,
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=6506&ctNode=404&mp=3",
      "note": "使用紅樓地標代表點，請於公共通道、安全位置停留。"
    },
    {
      "id": "new-world-cinema",
      "title": "新世界大戲院",
      "era": "1950 年代",
      "tag": "第二幕・銀幕亮起",
      "description": "電影是西門町的重要記憶。回望戲院門前，想像城市曾經如何為一場電影聚集。",
      "lat": 25.0429,
      "lng": 121.50733,
      "radius": 70,
      "address": "萬華區漢中街116號附近",
      "image": "images/new-world-cinema.jpg",
      "video": null,
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=6507&ctNode=404&mp=3",
      "note": "以現存新世界大樓代表點作為測試 GPS 位置。"
    },
    {
      "id": "today-department",
      "title": "今日百貨",
      "era": "1986 年",
      "tag": "第三幕・西門繁華",
      "description": "從一張1986年的照片，走進當年的西門町百貨街景。這一幕已準備好動態重現。",
      "lat": 25.04368,
      "lng": 121.50537,
      "radius": 75,
      "address": "萬華區峨眉街52號附近",
      "image": "images/today-department.jpg",
      "video": "videos/today-department.mp4",
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=7230&ctNode=404&mp=3",
      "note": "以峨眉街52號現代建築代表點為測試 GPS 位置。"
    },
    {
      "id": "zhonghua-market",
      "title": "中華商場",
      "era": "1960 年代",
      "tag": "第四幕・消失的街廓",
      "description": "曾經沿著中華路排成一列的中華商場，已不在今日街景之中。",
      "lat": 25.04458,
      "lng": 121.50805,
      "radius": 120,
      "address": "中華路一段與武昌街口附近（暫定）",
      "image": "images/zhonghua-market.jpg",
      "video": null,
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=6494&ctNode=404&mp=3",
      "note": "暫定示範點；原商場範圍很長，尚未核對館藏照片確切路段。正式展出前必須調整座標。"
    },
    {
      "id": "zhongshan-hall",
      "title": "中山堂",
      "era": "1970 年",
      "tag": "終幕・城市舞台",
      "description": "曾見證城市重要活動的中山堂，至今仍站在街區之中。",
      "lat": 25.04348,
      "lng": 121.50957,
      "radius": 85,
      "address": "中正區延平南路98號",
      "image": "images/zhongshan-hall.jpg",
      "video": null,
      "archive": "https://archive.tpml.edu.tw/TaipeiLib/wSite/ct?xItem=0&dataId=4007&ctNode=404&mp=3",
      "note": "位於中正區，屬本企劃城西周邊延伸景點。"
    }
  ]
};
