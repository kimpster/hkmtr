"use strict";

/* Line, station and direction data from the official "Data Dictionary for
 * Next Train API" v1.7 (opendata.mtr.com.hk, 13 March 2025).
 * Station entries are [code, English name, Traditional Chinese name]. */

const LINES = {
  AEL: { name: ["Airport Express", "機場快綫"], color: "#00843A", stations: [
    ["HOK","Hong Kong","香港"], ["KOW","Kowloon","九龍"], ["TSY","Tsing Yi","青衣"],
    ["AIR","Airport","機場"], ["AWE","AsiaWorld-Expo","博覽館"]] },
  TCL: { name: ["Tung Chung Line", "東涌綫"], color: "#F7943E", stations: [
    ["HOK","Hong Kong","香港"], ["KOW","Kowloon","九龍"], ["OLY","Olympic","奧運"],
    ["NAC","Nam Cheong","南昌"], ["LAK","Lai King","荔景"], ["TSY","Tsing Yi","青衣"],
    ["SUN","Sunny Bay","欣澳"], ["TUC","Tung Chung","東涌"]] },
  TML: { name: ["Tuen Ma Line", "屯馬綫"], color: "#923011", stations: [
    ["WKS","Wu Kai Sha","烏溪沙"], ["MOS","Ma On Shan","馬鞍山"], ["HEO","Heng On","恆安"],
    ["TSH","Tai Shui Hang","大水坑"], ["SHM","Shek Mun","石門"], ["CIO","City One","第一城"],
    ["STW","Sha Tin Wai","沙田圍"], ["CKT","Che Kung Temple","車公廟"], ["TAW","Tai Wai","大圍"],
    ["HIK","Hin Keng","顯徑"], ["DIH","Diamond Hill","鑽石山"], ["KAT","Kai Tak","啟德"],
    ["SUW","Sung Wong Toi","宋皇臺"], ["TKW","To Kwa Wan","土瓜灣"], ["HOM","Ho Man Tin","何文田"],
    ["HUH","Hung Hom","紅磡"], ["ETS","East Tsim Sha Tsui","尖東"], ["AUS","Austin","柯士甸"],
    ["NAC","Nam Cheong","南昌"], ["MEF","Mei Foo","美孚"], ["TWW","Tsuen Wan West","荃灣西"],
    ["KSR","Kam Sheung Road","錦上路"], ["YUL","Yuen Long","元朗"], ["LOP","Long Ping","朗屏"],
    ["TIS","Tin Shui Wai","天水圍"], ["SIH","Siu Hong","兆康"], ["TUM","Tuen Mun","屯門"]] },
  EAL: { name: ["East Rail Line", "東鐵綫"], color: "#53B7A8", stations: [
    ["ADM","Admiralty","金鐘"], ["EXC","Exhibition Centre","會展"], ["HUH","Hung Hom","紅磡"],
    ["MKK","Mong Kok East","旺角東"], ["KOT","Kowloon Tong","九龍塘"], ["TAW","Tai Wai","大圍"],
    ["SHT","Sha Tin","沙田"], ["FOT","Fo Tan","火炭"], ["RAC","Racecourse","馬場"],
    ["UNI","University","大學"], ["TAP","Tai Po Market","大埔墟"], ["TWO","Tai Wo","太和"],
    ["FAN","Fanling","粉嶺"], ["SHS","Sheung Shui","上水"], ["LOW","Lo Wu","羅湖"],
    ["LMC","Lok Ma Chau","落馬洲"]] },
  TKL: { name: ["Tseung Kwan O Line", "將軍澳綫"], color: "#7D499D", stations: [
    ["NOP","North Point","北角"], ["QUB","Quarry Bay","鰂魚涌"], ["YAT","Yau Tong","油塘"],
    ["TIK","Tiu Keng Leng","調景嶺"], ["TKO","Tseung Kwan O","將軍澳"], ["LHP","LOHAS Park","康城"],
    ["HAH","Hang Hau","坑口"], ["POA","Po Lam","寶琳"]] },
  SIL: { name: ["South Island Line", "南港島綫"], color: "#A8C31B", stations: [
    ["ADM","Admiralty","金鐘"], ["OCP","Ocean Park","海洋公園"], ["WCH","Wong Chuk Hang","黃竹坑"],
    ["LET","Lei Tung","利東"], ["SOH","South Horizons","海怡半島"]] },
  TWL: { name: ["Tsuen Wan Line", "荃灣綫"], color: "#E2231A", stations: [
    ["CEN","Central","中環"], ["ADM","Admiralty","金鐘"], ["TST","Tsim Sha Tsui","尖沙咀"],
    ["JOR","Jordan","佐敦"], ["YMT","Yau Ma Tei","油麻地"], ["MOK","Mong Kok","旺角"],
    ["PRE","Prince Edward","太子"], ["SSP","Sham Shui Po","深水埗"], ["CSW","Cheung Sha Wan","長沙灣"],
    ["LCK","Lai Chi Kok","荔枝角"], ["MEF","Mei Foo","美孚"], ["LAK","Lai King","荔景"],
    ["KWF","Kwai Fong","葵芳"], ["KWH","Kwai Hing","葵興"], ["TWH","Tai Wo Hau","大窩口"],
    ["TSW","Tsuen Wan","荃灣"]] },
  ISL: { name: ["Island Line", "港島綫"], color: "#0075C2", stations: [
    ["KET","Kennedy Town","堅尼地城"], ["HKU","HKU","香港大學"], ["SYP","Sai Ying Pun","西營盤"],
    ["SHW","Sheung Wan","上環"], ["CEN","Central","中環"], ["ADM","Admiralty","金鐘"],
    ["WAC","Wan Chai","灣仔"], ["CAB","Causeway Bay","銅鑼灣"], ["TIH","Tin Hau","天后"],
    ["FOH","Fortress Hill","炮台山"], ["NOP","North Point","北角"], ["QUB","Quarry Bay","鰂魚涌"],
    ["TAK","Tai Koo","太古"], ["SWH","Sai Wan Ho","西灣河"], ["SKW","Shau Kei Wan","筲箕灣"],
    ["HFC","Heng Fa Chuen","杏花邨"], ["CHW","Chai Wan","柴灣"]] },
  KTL: { name: ["Kwun Tong Line", "觀塘綫"], color: "#00A651", stations: [
    ["WHA","Whampoa","黃埔"], ["HOM","Ho Man Tin","何文田"], ["YMT","Yau Ma Tei","油麻地"],
    ["MOK","Mong Kok","旺角"], ["PRE","Prince Edward","太子"], ["SKM","Shek Kip Mei","石硤尾"],
    ["KOT","Kowloon Tong","九龍塘"], ["LOF","Lok Fu","樂富"], ["WTS","Wong Tai Sin","黃大仙"],
    ["DIH","Diamond Hill","鑽石山"], ["CHH","Choi Hung","彩虹"], ["KOB","Kowloon Bay","九龍灣"],
    ["NTK","Ngau Tau Kok","牛頭角"], ["KWT","Kwun Tong","觀塘"], ["LAT","Lam Tin","藍田"],
    ["YAT","Yau Tong","油塘"], ["TIK","Tiu Keng Leng","調景嶺"]] },
  DRL: { name: ["Disneyland Resort Line", "迪士尼綫"], color: "#E75480", stations: [
    ["SUN","Sunny Bay","欣澳"], ["DIS","Disneyland Resort","迪士尼"]] },
};

/* Direction termini, used for tab labels when no live trains are listed. */
const DIR_DESTS = {
  AEL: { UP: ["AIR","AWE"], DOWN: ["HOK"] },
  TCL: { UP: ["TUC"],       DOWN: ["HOK"] },
  TML: { UP: ["TUM"],       DOWN: ["WKS"] },
  EAL: { UP: ["LOW","LMC"], DOWN: ["ADM"] },
  TKL: { UP: ["POA","LHP"], DOWN: ["TIK","NOP"] },
  SIL: { UP: ["SOH"],       DOWN: ["ADM"] },
  TWL: { UP: ["TSW"],       DOWN: ["CEN"] },
  ISL: { UP: ["CHW"],       DOWN: ["KET"] },
  KTL: { UP: ["TIK"],       DOWN: ["WHA"] },
  DRL: { UP: ["SUN"],       DOWN: ["DIS"] },
};

/* UI strings: [English, Traditional Chinese]. */
const STR = {
  pageTitle:   ["HK Next Train — Live MTR arrivals", "港鐵下一班車 — 實時到站時間"],
  appTitle:    ["Next Train", "下一班車"],
  station:     ["Station", "車站"],
  linesNav:    ["Line", "路綫"],
  dirNav:      ["Direction", "方向"],
  refreshNow:  ["Refresh now", "立即刷新"],
  to:          ["To ", "往"],
  departing:   ["Departing", "即將開出"],
  platform:    ["Platform", "號月台"],
  dep:         ["Dep ", ""],      // tc renders as "17:01 開出"
  depSuffix:   ["", " 開出"],
  viaRac:      ["via Racecourse", "經馬場"],
  arrival:     ["Arrival", "到站"],
  emptyTitle:  ["No upcoming trains listed", "暫無即將到站班次"],
  emptySub:    ["Train service may have ended for the night, or no timetable is currently available for this direction.",
                "列車服務可能已於今晚結束，或此方向暫時沒有班次。"],
  connecting:  ["Connecting to the Next Train API…", "正在連接港鐵實時班次資料…"],
  noTimetable: ["No timetable available", "暫無時間表"],
  updated:     ["Updated", "更新"],
  hkt:         ["HKT", "港時"],
  onTime:      ["On time", "準點"],
  delayed:     ["Delayed", "誤點"],
  refreshEvery:["refreshes every MIN", "每 MIN 刷新"],  // MIN replaced at runtime
  minUnit:     ["min", "分鐘"],
  delayBanner: ["⚠ Trains on this line are currently delayed.", "⚠ 此路綫列車現正延誤。"],
  special:     ["Special train service arrangement in effect — details", "現正實施特別列車服務安排 — 詳情"],
};

const API = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";
const REFRESH_MS = 60000;
const STORE_KEY = "hknexttrain.state.v1";

/* Any station code -> [en, tc], across all lines (dest codes may sit on
 * another line than the one being viewed). */
const STATION_INFO = {};
for (const l of Object.values(LINES))
  for (const [code, en, tc] of l.stations) STATION_INFO[code] = [en, tc];

const $ = (sel) => document.querySelector(sel);
const els = {
  chips: $("#lineChips"), station: $("#station"), tabs: $("#tabs"),
  list: $("#list"), banners: $("#banners"), status: $("#status"),
  statusText: $("#statusText"), refresh: $("#refresh"), progress: $("#refreshProgress"),
  langEn: $("#langEn"), langTc: $("#langTc"), staLabel: $(".staLabel"),
};

const state = {
  line: "AEL", sta: "TSY", dir: "DOWN", lang: "en",
  trains: { UP: [], DOWN: [] },
  specialUrl: null, isdelay: "N",
  serverOffsetMs: 0,   // Date.now() - serverTime, so countdowns ignore clock skew
  updated: "",         // server curr_time, "HH:MM:SS" in HKT
  ok: false, message: "",
};

const T = (key) => STR[key][state.lang === "tc" ? 1 : 0];
const stationName = (code) => (STATION_INFO[code] || [code, code])[state.lang === "tc" ? 1 : 0];
const lineName = (code) => LINES[code].name[state.lang === "tc" ? 1 : 0];

/* ---------- time helpers (API times are Hong Kong wall time) ---------- */

function parseHKT(s) {
  const [d, t] = s.split(" ");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi, se] = t.split(":").map(Number);
  return Date.UTC(y, mo - 1, da, h, mi, se) - 8 * 3600000;
}
const serverNow = () => Date.now() - state.serverOffsetMs;

function fmtCountdown(ms) {
  if (ms <= 0) return T("departing");
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- state persistence ---------- */

function defaultDir(line) {
  return (DIR_DESTS[line].DOWN || []).includes("HOK") ? "DOWN" : "UP";
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ line: state.line, sta: state.sta, dir: state.dir, lang: state.lang }));
  } catch {}
  const hash = `#${state.line}/${state.sta}/${state.dir}`;
  if (location.hash !== hash) history.replaceState(null, "", hash);
}

function restoreState() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch {}
  const m = (location.hash.match(/^#([A-Z]+)\/([A-Z]+)\/(UP|DOWN)$/));
  if (m) s = { line: m[1], sta: m[2], dir: m[3] };
  if (s && LINES[s.line] && LINES[s.line].stations.some(([c]) => c === s.sta)) {
    state.line = s.line;
    state.sta = s.sta;
    state.dir = s.dir === "UP" ? "UP" : "DOWN";
    if (s.lang === "tc" || s.lang === "en") state.lang = s.lang;
  } else {
    state.dir = defaultDir(state.line);
    state.lang = (navigator.language || "").toLowerCase().startsWith("zh") ? "tc" : "en";
  }
}

/* ---------- rendering ---------- */

function renderChips() {
  els.chips.innerHTML = "";
  for (const [code, line] of Object.entries(LINES)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (code === state.line ? " active" : "");
    b.style.setProperty("--line", line.color);
    b.setAttribute("aria-pressed", code === state.line);
    b.textContent = lineName(code);
    b.title = lineName(code);
    b.onclick = () => {
      if (state.line === code) return;
      state.line = code;
      state.sta = line.stations[0][0];
      state.dir = defaultDir(code);
      renderChips();
      renderStations();
      renderTabs();
      saveState();
      fetchSchedule(true);
    };
    els.chips.appendChild(b);
  }
  const active = els.chips.querySelector(".chip.active");
  active?.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
}

function renderStations() {
  els.station.innerHTML = "";
  for (const [code, en, tc] of LINES[state.line].stations) {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = state.lang === "tc" ? tc : en;
    els.station.append(o);
  }
  els.station.value = state.sta;
}

function dirLabel(dir) {
  const live = [...new Set(state.trains[dir].map((t) => t.dest))];
  const codes = live.length ? live : DIR_DESTS[state.line][dir];
  return codes.map(stationName).join(" / ");
}

function renderTabs() {
  els.tabs.innerHTML = "";
  for (const dir of ["UP", "DOWN"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tab" + (dir === state.dir ? " active" : "");
    b.style.setProperty("--line", LINES[state.line].color);
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", dir === state.dir);
    b.innerHTML = `<span class="dirArrow">${dir === "UP" ? "▲" : "▼"}</span><span class="dirName"></span>`;
    b.querySelector(".dirName").textContent = T("to") + dirLabel(dir);
    b.title = b.querySelector(".dirName").textContent;
    b.onclick = () => {
      if (state.dir === dir) return;
      state.dir = dir;
      renderTabs();
      renderTrains();
      saveState();
    };
    els.tabs.appendChild(b);
  }
}

function badge(text, cls) {
  const s = document.createElement("span");
  s.className = "badge" + (cls ? " " + cls : "");
  s.textContent = text;
  return s;
}

function renderTrains() {
  const line = LINES[state.line];
  const trains = state.trains[state.dir]
    .filter((t) => t.time)
    .sort((a, b) => Number(a.seq) - Number(b.seq));

  els.list.innerHTML = "";
  if (!state.ok) {
    els.list.appendChild(emptyCard(
      state.message ? T("noTimetable") : T("connecting"),
      state.message || undefined));
    return;
  }
  if (!trains.length) {
    els.list.appendChild(emptyCard(T("emptyTitle"), T("emptySub")));
    return;
  }

  for (const t of trains) {
    const eta = parseHKT(t.time);
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--line", line.color);
    card.dataset.eta = String(eta);

    const left = document.createElement("div");
    left.className = "cardLeft";

    const cd = document.createElement("div");
    cd.className = "countdown";
    cd.textContent = fmtCountdown(eta - serverNow());
    left.appendChild(cd);

    const dest = document.createElement("div");
    dest.className = "dest";
    dest.appendChild(badge(
      state.lang === "tc"
        ? `${t.plat || "—"}${T("platform")}`
        : `${T("platform")} ${t.plat || "—"}`));
    dest.appendChild(document.createTextNode(T("to") + stationName(t.dest)));
    if (state.line === "EAL" && t.route === "RAC") dest.appendChild(badge(T("viaRac"), "soft"));
    left.appendChild(dest);

    const right = document.createElement("div");
    right.className = "cardRight";
    right.appendChild(badge(`${T("dep")}${t.time.slice(11, 16)}${T("depSuffix")}`));
    if (state.line === "EAL" && t.timetype === "A") right.appendChild(badge(T("arrival"), "soft"));

    card.append(left, right);
    els.list.appendChild(card);
  }
  tickCountdowns();
}

function emptyCard(title, sub) {
  const d = document.createElement("div");
  d.className = "empty";
  d.innerHTML = `<div class="emptyTitle"></div><div class="emptySub"></div>`;
  d.querySelector(".emptyTitle").textContent = title;
  d.querySelector(".emptySub").textContent = sub || "";
  return d;
}

function tickCountdowns() {
  const now = serverNow();
  for (const cd of els.list.querySelectorAll(".countdown")) {
    const card = cd.closest(".card");
    const remaining = Number(card.dataset.eta) - now;
    const v = fmtCountdown(remaining);
    cd.textContent = v;
    cd.classList.toggle("now", v === T("departing"));
    card.classList.toggle("gone", remaining < -30000);
  }
}

function renderBanners() {
  els.banners.innerHTML = "";
  if (state.isdelay === "Y") {
    const d = document.createElement("div");
    d.className = "banner warn";
    d.textContent = T("delayBanner");
    els.banners.appendChild(d);
  }
  if (state.specialUrl) {
    const d = document.createElement("div");
    d.className = "banner info";
    const a = document.createElement("a");
    a.href = state.specialUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = T("special");
    d.appendChild(a);
    els.banners.appendChild(d);
  }
}

function renderStatus(error) {
  if (error) {
    els.statusText.textContent = state.lang === "tc" ? "連線錯誤 — 重試中" : "Connection error — retrying";
    els.statusText.className = "err";
    return;
  }
  if (!state.ok) {
    els.statusText.textContent = state.lang === "tc" ? "載入中…" : "Loading…";
    els.statusText.className = "";
    return;
  }
  const mins = Math.max(1, Math.round(REFRESH_MS / 60000));
  const onTime = state.isdelay === "Y" ? T("delayed") : T("onTime");
  els.statusText.className = state.isdelay === "Y" ? "err" : "";
  els.statusText.textContent = state.lang === "tc"
    ? `${T("updated")} ${state.updated || "—"} ${T("hkt")} · ${onTime} · 每 ${mins} ${T("minUnit")}刷新`
    : `${T("updated")} ${state.updated || "—"} ${T("hkt")} · ${onTime} · ${T("refreshEvery").replace("MIN", `${mins} ${T("minUnit")}`)}`;
}

/* Apply language to the static chrome, then re-render dynamic sections. */
function applyLang() {
  const tc = state.lang === "tc";
  document.documentElement.lang = tc ? "zh-Hant" : "en";
  document.title = T("pageTitle");
  document.querySelector("h1").textContent = T("appTitle");
  els.staLabel.textContent = T("station");
  els.chips.setAttribute("aria-label", T("linesNav"));
  els.tabs.setAttribute("aria-label", T("dirNav"));
  els.station.setAttribute("aria-label", T("station"));
  els.refresh.setAttribute("aria-label", T("refreshNow"));
  els.refresh.title = T("refreshNow");
  els.langEn.classList.toggle("active", !tc);
  els.langTc.classList.toggle("active", tc);
  renderChips();
  renderStations();
  renderTabs();
  renderTrains();
  renderBanners();
  renderStatus();
}

/* ---------- data ---------- */

let refreshTimer = null;
let fetching = false;

async function fetchSchedule(manual) {
  if (fetching) return;
  fetching = true;
  if (manual) els.refresh.classList.add("spin");
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 10000);
    const res = await fetch(`${API}?line=${state.line}&sta=${state.sta}&lang=${state.lang}`, { signal: ctl.signal, cache: "no-store" });
    clearTimeout(to);
    const json = await res.json();

    const entry = (json.data || {})[`${state.line}-${state.sta}`] || {};
    state.trains = { UP: entry.UP || [], DOWN: entry.DOWN || [] };
    state.isdelay = json.isdelay === "Y" ? "Y" : "N";
    state.specialUrl = json.url || null;
    if (json.curr_time) state.serverOffsetMs = Date.now() - parseHKT(json.curr_time);
    state.updated = (json.curr_time || "").slice(11, 19);
    state.ok = json.status === 1 || !!(entry.UP || entry.DOWN);
    state.message = json.status !== 1 ? (json.message || "") : "";

    renderTabs();       // tab labels use live destinations
    renderTrains();
    renderBanners();
    renderStatus();
    restartProgress();
    scheduleRefresh();
  } catch (e) {
    renderStatus(true);
    scheduleRefresh(5000);
  } finally {
    fetching = false;
    els.refresh.classList.remove("spin");
  }
}

function scheduleRefresh(delay = REFRESH_MS) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => fetchSchedule(false), delay);
}

function restartProgress() {
  els.progress.style.animation = "none";
  void els.progress.offsetWidth;
  els.progress.style.animation = "";
}

/* ---------- wiring ---------- */

els.station.addEventListener("change", () => {
  state.sta = els.station.value;
  saveState();
  fetchSchedule(true);
});

els.refresh.addEventListener("click", () => fetchSchedule(true));

for (const [btn, lang] of [[els.langEn, "en"], [els.langTc, "tc"]]) {
  btn.addEventListener("click", () => {
    if (state.lang === lang) return;
    state.lang = lang;
    saveState();
    applyLang();
    fetchSchedule(false);  // so API messages/banners come back in this language
  });
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) fetchSchedule(false);
});

restoreState();
applyLang();
saveState();
fetchSchedule(false);
setInterval(tickCountdowns, 1000);
