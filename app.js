/* 《城西尋影》第一版：GPS 找點 + 館藏照片 + 有 MP4 才顯示「看動圖」。
   GPS 為戶外體驗輔助，非安全或兌獎驗證。 */
(() => {
  'use strict';
  const config = window.GAME_CONFIG;
  if (!config?.stops?.length) return;
  const stops = config.stops;
  const key = 'westcity-lostframes-unlocked-v1';
  const $ = id => document.getElementById(id);
  const safeGet = () => { try { const value=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(value)?value.filter(id=>stops.some(s=>s.id===id)):[]; } catch {return []} };
  const safeSet = value => { try { localStorage.setItem(key,JSON.stringify(value)); } catch {} };
  let visited = new Set(safeGet()), demo = false, userPosition = null, watchId=null, map=null, currentMarker=null, circles=[], markers=[];
  const availableVideos = new Map(stops.filter(s=>s.video).map(s=>[s.id,s.video]));
  let activeDialogStop=null;
  const pad = num=>String(num).padStart(2,'0');
  const escapeHTML = val => String(val??'').replace(/[&<>"']/g,chr=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[chr]));
  const geoDistance = (a,b) => {
    const R=6371000, rad=Math.PI/180, deltaLat=(a.lat-b.lat)*rad,deltaLng=(a.lng-b.lng)*rad;
    const h=Math.sin(deltaLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(deltaLng/2)**2;
    return 2*R*Math.asin(Math.min(1,Math.sqrt(h)));
  };
  const distanceLabel = d=>Number.isFinite(d)?d<1000?`${Math.round(d)} 公尺`:`${(d/1000).toFixed(1)} 公里`:'尚未取得位置';
  const unlocked = stop => demo||visited.has(stop.id);
  const canOpen = stop => unlocked(stop);
  const stopDistance = stop => userPosition ? geoDistance(userPosition,stop) : null;
  const navURL = stop => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.lat+','+stop.lng)}&travelmode=walking`;
  let toastTimeout;
  function toast(message){const node=$('toast');node.textContent=message;node.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('visible'),3500)}
  function setGPS(text,sub){$('gpsText').textContent=text;$('gpsSub').textContent=sub;$('gpsHeader').textContent=text}
  function unlockNearby(){
    if(demo||!userPosition) return;
    const acc = userPosition.accuracy;
    if(!Number.isFinite(acc)||acc>110){
      $('accuracyText').textContent=`定位誤差約 ${Math.round(acc||0)} m，等待更準確訊號`;
      setGPS('定位訊號較弱','請到較開闊的安全位置，等待定位精度改善。');
      return;
    }
    $('accuracyText').textContent=`位置誤差約 ±${Math.round(acc)} m（僅供參考）`;
    const nearby=stops.filter(s=>stopDistance(s)<=s.radius&&!visited.has(s.id));
    if(nearby.length){nearby.forEach(s=>visited.add(s.id));safeSet([...visited]);render();toast(nearby.length===1?`已找到「${nearby[0].title}」！歷史照片已解鎖`:`已解鎖 ${nearby.length} 處歷史影格`)}
  }
  function requestGPS(){
    if(!navigator.geolocation){setGPS('無法使用 GPS','此裝置或瀏覽器未提供定位功能。');toast('目前裝置不支援定位');return}
    if(!window.isSecureContext){setGPS('需要安全連線','請以 HTTPS 或 localhost 開啟網頁，再允許定位。');toast('GPS 需以 HTTPS 部署後測試');return}
    setGPS('正在取得 GPS 位置…','請允許瀏覽器使用位置資訊。');
    if(watchId!==null)navigator.geolocation.clearWatch(watchId);
    watchId=navigator.geolocation.watchPosition(pos=>{
      userPosition={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy};
      setGPS('位置已取得',`目前約 ±${Math.round(pos.coords.accuracy)} 公尺；接近指定地點可自動解鎖。`);
      unlockNearby(); updateMap();render();
    },err=>{
      const msgs={1:'尚未允許定位權限',2:'無法判定目前位置',3:'定位逾時'};
      setGPS(msgs[err.code]||'定位失敗','可在瀏覽器設定中開啟位置權限後重試。');
      $('accuracyText').textContent='未取得位置';toast(msgs[err.code]||'定位失敗');
    },{enableHighAccuracy:true,maximumAge:2500,timeout:16000});
  }
  function videoButton(stop,cls='video-pill'){
    if(!canOpen(stop)||!availableVideos.has(stop.id))return '';
    return `<button class="${cls}" data-video="${escapeHTML(stop.id)}" title="播放 AI 歷史影像">▷ &nbsp;看動圖</button>`;
  }
  function render(){
    const total=stops.length,count=visited.size, showCount=demo?total:count;
    $('heroDone').textContent=pad(showCount);$('heroTotal').textContent=pad(total);
    $('progressCount').textContent=pad(showCount);$('progressFill').style.width=(showCount/total*100)+'%';
    $('progressHint').textContent=demo?'目前為展示預覽：所有照片可瀏覽，但不會記錄 GPS 到訪。':count===total?'所有歷史影格都已解鎖！記得返回文獻館。':count===0?'還沒開始尋影。先啟用手機定位，再走到任務地點。':`已解鎖 ${count} 處，還有 ${total-count} 處等你尋找。`;
    $('demoBanner').hidden=!demo;
    const complete=count===total && !demo;
    $('completionTitle').textContent=demo?'展示預覽模式':complete?'六段歷史影格，全部收集完成！':'尚未完成尋影任務';
    $('completionDescription').textContent=demo?'這不是實地到訪憑證':complete?'回到文獻館，完成這段城西故事':`還有 ${total-count} 處影格等待 GPS 解鎖`;
    $('completeBox').classList.toggle('completed',complete);
    $('cards').innerHTML=stops.map((stop,index)=>{
      const isOpen=canOpen(stop),distance=stopDistance(stop),status=isOpen?'已解鎖':'未到點';
      return `<article class="stop-card" id="stop-${escapeHTML(stop.id)}">
        <div class="stop-img-wrap ${isOpen?'':'locked'}">
          <span class="frame-number">FRAME ${pad(index+1)}</span>
          <img src="${escapeHTML(stop.image)}" alt="${escapeHTML(stop.title)}歷史照片" loading="lazy">
          ${isOpen?videoButton(stop):'<div class="lock-overlay"><span class="lock-glyph">⌖</span><b>等待你抵達現場</b></div>'}
        </div>
        <div class="card-body"><span class="card-category">${escapeHTML(stop.era)} / ${escapeHTML(stop.tag)}</span>
          <div class="card-title-row"><h3>${escapeHTML(stop.title)}</h3><span class="status-tag ${isOpen?'done':''}">${status}</span></div>
          <p>${escapeHTML(stop.description)}</p>
          <div class="card-geo"><span>⌖ ${escapeHTML(stop.address)}</span><span>${distance!==null?distanceLabel(distance):''}</span></div>
          <div class="card-foot"><button data-detail="${escapeHTML(stop.id)}">${isOpen?'查看歷史影格':'查看任務資訊'} →</button><button data-nav="${escapeHTML(stop.id)}">路線 ↗</button></div>
        </div></article>`;
    }).join('');
    markers.forEach((item,index)=>{
      const s=stops[index];if(!item)return;
      item.setIcon(markerIcon(index+1,visited.has(s.id)||demo));
    });
  }
  function detail(stop){
    activeDialogStop=stop;
    const isOpen=canOpen(stop);const isVideo=availableVideos.has(stop.id);
    const picture=isOpen?`<img src="${escapeHTML(stop.image)}" alt="${escapeHTML(stop.title)}老照片">${videoButton(stop)}`:`<img src="${escapeHTML(stop.image)}" alt="${escapeHTML(stop.title)}老照片" style="filter:brightness(.35) sepia(.25)"><div class="lock-overlay"><span class="lock-glyph">⌖</span><b>尚未到點，影格未解鎖</b></div>`;
    $('dialogContent').innerHTML=`<div class="dialog-image">${picture}</div><div class="dialog-copy"><span class="subline">${escapeHTML(stop.era)}　/　${escapeHTML(stop.tag)}</span><h2>${escapeHTML(stop.title)}</h2><p>${escapeHTML(stop.description)}</p><div class="dialog-foot"><span class="distance">⌖ ${escapeHTML(stop.address)}　${userPosition?' · '+distanceLabel(stopDistance(stop)):''}<br><small>${escapeHTML(stop.note||'')}</small></span><a href="${escapeHTML(stop.archive)}" target="_blank" rel="noopener noreferrer">查看圖書館館藏 ↗</a></div>${(!isOpen)?'<p style="font-size:11px;color:#ad7458">請到現場附近，允許 GPS 後即可解鎖老照片；或使用展示預覽檢查版面。</p>':''}${isOpen&&!isVideo?'<p style="font-size:11px;color:#977f6c">此關尚無 AI 影片，因此不顯示「看動圖」。</p>':''}</div>`;
    const d=$('detailDialog');if(!d.open)d.showModal();
  }
  function playVideo(stop){
    const src=availableVideos.get(stop.id);if(!src||!canOpen(stop))return;
    const d=$('detailDialog');activeDialogStop=stop;
    $('dialogContent').innerHTML=`<div class="video-frame"><video id="activeVideo" class="video-player" src="${escapeHTML(src)}" controls playsinline preload="metadata" autoplay aria-label="${escapeHTML(stop.title)}歷史重現影片"></video></div><div class="video-actions"><span>◈ ${escapeHTML(stop.title)} · AI 歷史情境重現</span><button data-backphoto="${escapeHTML(stop.id)}">← 返回照片</button></div>`;
    if(!d.open)d.showModal();
    const v=$('activeVideo');v.addEventListener('error',()=>toast('影片載入失敗，請確認 videos 資料夾和 MP4 檔名'),{once:true});v.play().catch(()=>{});
  }
  function closeDetail(){const v=$('activeVideo');if(v){v.pause();v.removeAttribute('src');v.load()}$('detailDialog').close()}
  function markerIcon(num,done=false){return window.L?.divIcon({className:'',html:`<div class="map-marker ${done?'done':''}">${pad(num)}</div>`,iconSize:[30,30],iconAnchor:[15,15]})}
  function initMap(){
    if(!window.L){$('mapFallback').classList.add('error');$('mapFallback').querySelector('small').innerHTML='互動地圖暫時無法載入。<br>請使用下方關卡清單與「路線」按鈕。';return}
    $('mapFallback')?.remove();
    map=L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView([25.0425,121.507],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(map);
    const bounds=[];
    stops.forEach((s,index)=>{
      const marker=L.marker([s.lat,s.lng],{icon:markerIcon(index+1,visited.has(s.id)||demo)}).addTo(map);
      marker.bindPopup(`<b>${escapeHTML(s.title)}</b><div>${escapeHTML(s.address)}</div><button data-detail="${escapeHTML(s.id)}">查看關卡 →</button>`);
      const ring=L.circle([s.lat,s.lng],{radius:s.radius,color:'#983d30',weight:1,opacity:.26,fillColor:'#bc7d51',fillOpacity:.055}).addTo(map);
      markers.push(marker);circles.push(ring);bounds.push([s.lat,s.lng]);
    });
    const archive=L.marker([config.start.lat,config.start.lng],{icon:L.divIcon({className:'',html:'<div class="map-marker start">館</div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(map);
    archive.bindPopup(`<b>${escapeHTML(config.start.name)}</b><div>集合出發及返館地點</div>`);
    bounds.push([config.start.lat,config.start.lng]);map.fitBounds(bounds,{padding:[32,32]});
  }
  function updateMap(){if(!map||!userPosition)return;if(currentMarker)currentMarker.remove();currentMarker=L.circleMarker([userPosition.lat,userPosition.lng],{radius:7,color:'#fff',weight:2,fillColor:'#2583bd',fillOpacity:1}).addTo(map);}
  async function probeExtraVideos(){
    if(location.protocol==='file:')return;
    await Promise.all(stops.map(async s=>{
      const path=`videos/${s.id}.mp4`;
      try{const res=await fetch(path,{method:'HEAD',cache:'no-store'});if(res.ok)availableVideos.set(s.id,path);else availableVideos.delete(s.id)}catch{/* keep zip manifest */}
    }));render();
  }
  document.addEventListener('click',evt=>{
    const t=evt.target.closest('[data-detail],[data-video],[data-nav],[data-backphoto]');if(!t)return;
    let s=stops.find(p=>p.id===(t.dataset.detail||t.dataset.video||t.dataset.nav||t.dataset.backphoto));if(!s)return;
    if(t.dataset.detail)detail(s);
    else if(t.dataset.video)playVideo(s);
    else if(t.dataset.backphoto)detail(s);
    else if(t.dataset.nav)window.open(navURL(s),'_blank','noopener,noreferrer');
  });
  $('startButton').addEventListener('click',()=>{requestGPS();$('explore').scrollIntoView({behavior:'smooth'})});
  $('enableGps').addEventListener('click',requestGPS);$('refreshGps').addEventListener('click',requestGPS);
  $('demoButton').addEventListener('click',()=>{demo=!demo;render();toast(demo?'已開啟展示預覽（不計入實地到訪）':'已結束展示預覽')});
  $('leaveDemo').addEventListener('click',()=>{demo=false;render()});
  $('closeDetail').addEventListener('click',closeDetail);
  $('detailDialog').addEventListener('click',event=>{if(event.target===$('detailDialog'))closeDetail()});
  $('detailDialog').addEventListener('close',()=>{const v=$('activeVideo');if(v)v.pause()});
  const showHelp=()=>$('helpDialog').showModal();
  $('helpButton').addEventListener('click',showHelp);$('howButton').addEventListener('click',showHelp);
  $('closeHelp').addEventListener('click',()=>$('helpDialog').close());$('closeHelpBottom').addEventListener('click',()=>$('helpDialog').close());
  $('helpDialog').addEventListener('click',e=>{if(e.target===$('helpDialog'))$('helpDialog').close()});
  $('shareButton').addEventListener('click',()=>{
    const result=`《城西尋影》探索紀錄｜已解鎖 ${visited.size}/${stops.length} 處。${visited.size?'已找到：'+stops.filter(s=>visited.has(s.id)).map(s=>s.title).join('、'):''}（目前為試玩紀錄，非兌獎憑證）`;
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(result).then(()=>toast('已複製探索紀錄')).catch(()=>toast('此瀏覽器無法複製，請使用 HTTPS'))}else toast('複製功能需 HTTPS 或相容瀏覽器');
  });
  $('resetButton').addEventListener('click',()=>{if(confirm('確定清除本機 GPS 試玩進度？此操作無法還原。')){visited=new Set();safeSet([]);demo=false;render();toast('已清除本機試玩進度')}});
  render();initMap();probeExtraVideos();
  if(location.protocol==='file:'){
    setGPS('目前為本機預覽','圖片和影片可預覽；GPS 請用 HTTPS 部署或以 localhost 測試。');
    $('accuracyText').textContent='本機預覽：請使用「展示預覽」';
  }
})();
