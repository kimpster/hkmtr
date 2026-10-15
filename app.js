"use strict";

/* Line, station and direction data from the official "Data Dictionary for
 * Next Train API" v1.7 (opendata.mtr.com.hk, 13 March 2025). */

const LINES = {
  AEL: { name: "Airport Express",      color: "#00843A", stations: [["HOK","Hong Kong"],["KOW","Kowloon"],["TSY","Tsing Yi"],["AIR","Airport"],["AWE","AsiaWorld-Expo"]] },
  TCL: { name: "Tung Chung Line",      color: "#F7943E", stations: [["HOK","Hong Kong"],["KOW","Kowloon"],["OLY","Olympic"],["NAC","Nam Cheong"],["LAK","Lai King"],["TSY","Tsing Yi"],["SUN","Sunny Bay"],["TUC","Tung Chung"]] },
  TML: { name: "Tuen Ma Line",         color: "#923011", stations: [["WKS","Wu Kai Sha"],["MOS","Ma On Shan"],["HEO","Heng On"],["TSH","Tai Shui Hang"],["SHM","Shek Mun"],["CIO","City One"],["STW","Sha Tin Wai"],["CKT","Che Kung Temple"],["TAW","Tai Wai"],["HIK","Hin Keng"],["DIH","Diamond Hill"],["KAT","Kai Tak"],["SUW","Sung Wong Toi"],["TKW","To Kwa Wan"],["HOM","Ho Man Tin"],["HUH","Hung Hom"],["ETS","East Tsim Sha Tsui"],["AUS","Austin"],["NAC","Nam Cheong"],["MEF","Mei Foo"],["TWW","Tsuen Wan West"],["KSR","Kam Sheung Road"],["YUL","Yuen Long"],["LOP","Long Ping"],["TIS","Tin Shui Wai"],["SIH","Siu Hong"],["TUM","Tuen Mun"]] },
  EAL: { name: "East Rail Line",       color: "#53B7A8", stations: [["ADM","Admiralty"],["EXC","Exhibition Centre"],["HUH","Hung Hom"],["MKK","Mong Kok East"],["KOT","Kowloon Tong"],["TAW","Tai Wai"],["SHT","Sha Tin"],["FOT","Fo Tan"],["RAC","Racecourse"],["UNI","University"],["TAP","Tai Po Market"],["TWO","Tai Wo"],["FAN","Fanling"],["SHS","Sheung Shui"],["LOW","Lo Wu"],["LMC","Lok Ma Chau"]] },
  TKL: { name: "Tseung Kwan O Line",   color: "#7D499D", stations: [["NOP","North Point"],["QUB","Quarry Bay"],["YAT","Yau Tong"],["TIK","Tiu Keng Leng"],["TKO","Tseung Kwan O"],["LHP","LOHAS Park"],["HAH","Hang Hau"],["POA","Po Lam"]] },
  SIL: { name: "South Island Line",    color: "#A8C31B", stations: [["ADM","Admiralty"],["OCP","Ocean Park"],["WCH","Wong Chuk Hang"],["LET","Lei Tung"],["SOH","South Horizons"]] },
  TWL: { name: "Tsuen Wan Line",       color: "#E2231A", stations: [["CEN","Central"],["ADM","Admiralty"],["TST","Tsim Sha Tsui"],["JOR","Jordan"],["YMT","Yau Ma Tei"],["MOK","Mong Kok"],["PRE","Prince Edward"],["SSP","Sham Shui Po"],["CSW","Cheung Sha Wan"],["LCK","Lai Chi Kok"],["MEF","Mei Foo"],["LAK","Lai King"],["KWF","Kwai Fong"],["KWH","Kwai Hing"],["TWH","Tai Wo Hau"],["TSW","Tsuen Wan"]] },
  ISL: { name: "Island Line",          color: "#0075C2", stations: [["KET","Kennedy Town"],["HKU","HKU"],["SYP","Sai Ying Pun"],["SHW","Sheung Wan"],["CEN","Central"],["ADM","Admiralty"],["WAC","Wan Chai"],["CAB","Causeway Bay"],["TIH","Tin Hau"],["FOH","Fortress Hill"],["NOP","North Point"],["QUB","Quarry Bay"],["TAK","Tai Koo"],["SWH","Sai Wan Ho"],["SKW","Shau Kei Wan"],["HFC","Heng Fa Chuen"],["CHW","Chai Wan"]] },
  KTL: { name: "Kwun Tong Line",       color: "#00A651", stations: [["WHA","Whampoa"],["HOM","Ho Man Tin"],["YMT","Yau Ma Tei"],["MOK","Mong Kok"],["PRE","Prince Edward"],["SKM","Shek Kip Mei"],["KOT","Kowloon Tong"],["LOF","Lok Fu"],["WTS","Wong Tai Sin"],["DIH","Diamond Hill"],["CHH","Choi Hung"],["KOB","Kowloon Bay"],["NTK","Ngau Tau Kok"],["KWT","Kwun Tong"],["LAT","Lam Tin"],["YAT","Yau Tong"],["TIK","Tiu Keng Leng"]] },
  DRL: { name: "Disneyland Resort",    color: "#E75480", stations: [["SUN","Sunny Bay"],["DIS","Disneyland Resort"]] },
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

const API = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";
const REFRESH_MS = 60000;
const STORE_KEY = "hknexttrain.state.v1";

/* Any station code -> name, across all lines (dest codes may sit on
 * another line than the one being viewed). */
const STATION_NAMES = {};
for (const l of Object.values(LINES))
  for (const [code, name] of l.stations) STATION_NAMES[code] = name;

const $ = (sel) => document.querySelector(sel);
const els = {
  chips: $("#lineChips"), station: $("#station"), tabs: $("#tabs"),
  list: $("#list"), banners: $("#banners"), status: $("#status"),
  statusText: $("#statusText"), refresh: $("#refresh"), progress: $("#refreshProgress"),
};

const state = {
  line: "AEL", sta: "TSY", dir: "DOWN",
  trains: { UP: [], DOWN: [] },
  specialUrl: null, isdelay: "N",
  serverOffsetMs: 0,   // Date.now() - serverTime, so countdowns ignore clock skew
  updated: "",         // server curr_time, "HH:MM:SS" in HKT
  ok: false, message: "",
};

/* ---------- time helpers (API times are Hong Kong wall time) ---------- */

function parseHKT(s) {
  const [d, t] = s.split(" ");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi, se] = t.split(":").map(Number);
  return Date.UTC(y, mo - 1, da, h, mi, se) - 8 * 3600000;
}
const serverNow = () => Date.now() - state.serverOffsetMs;

function fmtCountdown(ms) {
  if (ms <= 0) return "Departing";
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- state persistence ---------- */

function defaultDir(line) {
  return (DIR_DESTS[line].DOWN || []).includes("HOK") ? "DOWN" : "UP";
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ line: state.line, sta: state.sta, dir: state.dir }));
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
  } else {
    state.dir = defaultDir(state.line);
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
    b.textContent = code;
    b.title = line.name;
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
  for (const [code, name] of LINES[state.line].stations) {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = name;
    els.station.append(o);
  }
  els.station.value = state.sta;
}

function dirLabel(dir) {
  const live = [...new Set(state.trains[dir].map((t) => t.dest))];
  const codes = live.length ? live : DIR_DESTS[state.line][dir];
  return codes.map((c) => STATION_NAMES[c] || c).join(" / ");
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
    b.querySelector(".dirName").textContent = `To ${dirLabel(dir)}`;
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
      state.message ? "No timetable available" : "Connecting to the Next Train API…",
      state.message || undefined));
    return;
  }
  if (!trains.length) {
    els.list.appendChild(emptyCard("No upcoming trains listed", "Train service may have ended for the night, or no timetable is currently available for this direction."));
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
    dest.appendChild(badge(`Platform ${t.plat || "—"}`));
    dest.appendChild(document.createTextNode("To " + (STATION_NAMES[t.dest] || t.dest)));
    if (state.line === "EAL" && t.route === "RAC") dest.appendChild(badge("via Racecourse", "soft"));
    left.appendChild(dest);

    const right = document.createElement("div");
    right.className = "cardRight";
    right.appendChild(badge("Dep " + t.time.slice(11, 16)));
    if (state.line === "EAL" && t.timetype === "A") right.appendChild(badge("Arrival", "soft"));

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
    cd.classList.toggle("now", v === "Departing");
    card.classList.toggle("gone", remaining < -30000);
  }
}

function renderBanners() {
  els.banners.innerHTML = "";
  if (state.isdelay === "Y") {
    const d = document.createElement("div");
    d.className = "banner warn";
    d.textContent = "⚠ Trains on this line are currently delayed.";
    els.banners.appendChild(d);
  }
  if (state.specialUrl) {
    const d = document.createElement("div");
    d.className = "banner info";
    const a = document.createElement("a");
    a.href = state.specialUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Special train service arrangement in effect — details";
    d.appendChild(a);
    els.banners.appendChild(d);
  }
}

function renderStatus(error) {
  if (error) {
    els.statusText.textContent = "Connection error — retrying";
    els.statusText.className = "err";
    return;
  }
  if (!state.ok) { els.statusText.textContent = "Loading…"; els.statusText.className = ""; return; }
  els.statusText.className = state.isdelay === "Y" ? "err" : "";
  const refreshLabel = REFRESH_MS >= 60000 ? `${REFRESH_MS / 60000} min` : `${REFRESH_MS / 1000} s`;
  els.statusText.textContent = `Updated ${state.updated || "—"} HKT · ${state.isdelay === "Y" ? "Delayed" : "On time"} · refreshes every ${refreshLabel}`;
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
    const res = await fetch(`${API}?line=${state.line}&sta=${state.sta}&lang=en`, { signal: ctl.signal, cache: "no-store" });
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

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) fetchSchedule(false);
});

restoreState();
renderChips();
renderStations();
renderTabs();
saveState();
fetchSchedule(false);
setInterval(tickCountdowns, 1000);
