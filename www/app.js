const DB_NAME = 'deadline-buddy-db';
const DB_VERSION = 1;
const STORE = 'tasks';
const SETTINGS_KEY = 'deadline-buddy-settings';
const LEGACY_KEY = 'deadline-buddy-tasks';
const TASK_VIEWS = ['today','upcoming','all','done'];
const state = { tasks: [], view: 'today', taskScope: 'today', calendarMode: 'month', filter: 'all', query: '', sort: 'deadline', selectedDate: dateKey(new Date()), monthCursor: new Date(), monthSelectedDate: dateKey(new Date()), db: null, toastTimer: null, selectedMood: null, selectedHabitIcon: '💪', selectedHabitColor: '#1d4ed8', pomoTaskId: null, moodSpan: 'week', moodCursor: new Date(), habitCursor: new Date(), pomoHistCursor: new Date(), pomoHistDate: dateKey(new Date()) };
const MOOD_KEY='deadline-buddy-moods-v1', HABIT_KEY='deadline-buddy-habits-v1';
function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function writeLocal(key,value){localStorage.setItem(key,JSON.stringify(value))}
function moods(){return readLocal(MOOD_KEY,{})}
function habits(){return readLocal(HABIT_KEY,[])}
const $ = (id) => document.getElementById(id);

function dateKey(date) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function localDateTimeValue(date) { const d = new Date(date); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,16); }
function parseDate(value) { return value ? new Date(value) : null; }
function startOfDay(date = new Date()) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function dayDiff(date) { return Math.ceil((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / 86400000); }
function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function uid() { return crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
const DEFAULT_SETTINGS = { morningDigest:'08:00', eveningDigest:'20:00', noon:'12:00', evening:'19:00', late:'21:00' };
function settings() { try { return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; } catch { return { ...DEFAULT_SETTINGS }; } }
function setSettings(value) { localStorage.setItem(SETTINGS_KEY, JSON.stringify({...value, updatedAt: value.updatedAt || new Date().toISOString()})); }
function openDB() {
  return new Promise((resolve,reject) => {
    if (!('indexedDB' in window)) { reject(new Error('Trình duyệt không hỗ trợ IndexedDB')); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'}); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function dbAll() { return new Promise((resolve,reject) => { const tx=state.db.transaction(STORE,'readonly'); const req=tx.objectStore(STORE).getAll(); req.onsuccess=()=>resolve(req.result||[]); req.onerror=()=>reject(req.error); }); }
function dbPut(task) { return new Promise((resolve,reject) => { const tx=state.db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(task); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error); }); }
function dbDelete(id) { return new Promise((resolve,reject) => { const tx=state.db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error); }); }
async function initStorage() {
  try {
    state.db = await openDB();
    state.tasks = await dbAll();
    if (!state.tasks.length) {
      const old = localStorage.getItem(LEGACY_KEY);
      if (old) { try { const parsed=JSON.parse(old); for (const task of parsed) await dbPut(task); state.tasks=await dbAll(); } catch {} }
    }
  } catch (error) {
    console.warn(error);
    try { state.tasks=JSON.parse(localStorage.getItem(LEGACY_KEY))||[]; } catch { state.tasks=[]; }
    showToast('Không mở được IndexedDB. Dữ liệu tạm dùng localStorage.');
  }
  render();
}
async function persistTask(task) {
  task.updatedAt = new Date().toISOString();
  const index = state.tasks.findIndex(t=>t.id===task.id);
  if (index>=0) state.tasks[index]=task; else state.tasks.push(task);
  try { if(state.db) await dbPut(task); else localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks)); } catch { localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks)); }
  updateSaveStatus(); render(); scheduleVisibleReminders(); scheduleSync();
}
async function removeTask(id) {
  state.tasks=state.tasks.filter(t=>t.id!==id);
  const deleted=readLocal('deadline-buddy-deleted-tasks',{});
  deleted[id]=new Date().toISOString();
  writeLocal('deadline-buddy-deleted-tasks',deleted);
  try { if(state.db) await dbDelete(id); else localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks)); } catch { localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks)); }
  updateSaveStatus(); render(); showToast('Đã xóa task.'); scheduleSync();
}
function updateSaveStatus() { const el=$('saveStatus'); if(el) el.innerHTML='<i></i> Đã lưu trên thiết bị'; }
function isDone(task) { return task.status==='done'; }
function isOverdue(task) { const due=parseDate(task.dueAt); return !isDone(task) && !!due && !Number.isNaN(due.getTime()) && due < new Date(); }
function dueLabel(task) {
  const due=parseDate(task.dueAt); if(!due) return 'Chưa đặt deadline';
  const diff=dayDiff(due); const time=due.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
  if(isDone(task)) return `Hạn ${due.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})}`;
  if(isOverdue(task)) return `Quá hạn · ${due.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})}`;
  if(diff===0) return `Hôm nay · ${time}`;
  if(diff===1) return `Ngày mai · ${time}`;
  return `${due.toLocaleDateString('vi-VN',{weekday:undefined,day:'2-digit',month:'2-digit'})} · ${time}`;
}
function reminderPlan(task) {
  const due=parseDate(task.dueAt); if(!due||isDone(task)) return [];
  const days=dayDiff(due); const s=settings();
  let times;
  if(days>4) times=[s.evening];
  else if(days>=3) times=[s.evening];
  else if(days===2) times=[s.noon,s.evening];
  else if(days===1) times=[s.noon,s.evening,s.late];
  else if(days===0) times=[s.noon,s.evening,s.late].filter(t=>{const [h,m]=t.split(':').map(Number);return h*60+m>new Date().getHours()*60+new Date().getMinutes();});
  else times=[s.evening];
  return [...new Set(times)];
}
function reminderSummary(task) {
  if(isDone(task)) return 'Đã hoàn thành — thông báo đã dừng';
  const plan=reminderPlan(task); const days=dayDiff(parseDate(task.dueAt));
  const count=days>2?1:days===2?2:3;
  return `${Math.max(1,plan.length)} lần/ngày · ${days<0?'Đã quá hạn':days===0?'Deadline hôm nay':`Còn ${days} ngày`}`;
}
function formatDayHeading(date) { return date.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long'}); }
function taskMatchesView(task) {
  const done=isDone(task); const due=parseDate(task.dueAt); const diff=due?dayDiff(due):999;
  if(state.view==='all') return true;
  if(state.view==='done') return done;
  if(done) return false;
  if(state.view==='today') return true;
  if(state.view==='upcoming') return due && diff>=0 && diff<=7;
  return true;
}
function urgencyOf(task) {
  if(isDone(task)||!task.dueAt) return null;
  const diff=dayDiff(parseDate(task.dueAt));
  if(diff<=2) return {key:'critical',label:'Rất nguy cấp'};
  if(diff===3) return {key:'urgent',label:'Nguy cấp'};
  return null;
}
function filteredTasks() {
  let list=state.tasks.filter(taskMatchesView);
  if(state.filter==='not-started') list=list.filter(t=>t.status==='not-started');
  if(state.filter==='in-progress') list=list.filter(t=>t.status==='in-progress');
  if(state.filter==='overdue') list=list.filter(isOverdue);
  if(state.query) { const q=state.query.toLowerCase(); list=list.filter(t=>`${t.title} ${t.category||''} ${t.notes||''}`.toLowerCase().includes(q)); }
  if(state.sort==='priority') { const rank={high:0,medium:1,low:2}; list.sort((a,b)=>(rank[a.priority]??1)-(rank[b.priority]??1)||new Date(a.dueAt)-new Date(b.dueAt)); }
  else if(state.sort==='created') list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  else list.sort((a,b)=>{const ad=parseDate(a.dueAt),bd=parseDate(b.dueAt);const av=ad&&!Number.isNaN(ad.getTime())?ad.getTime():Infinity;const bv=bd&&!Number.isNaN(bd.getTime())?bd.getTime():Infinity;return av-bv;});
  return list;
}
function statusLabel(task) { if(isOverdue(task)) return ['Quá hạn','status-overdue']; const due=parseDate(task.dueAt); if(!due||Number.isNaN(due.getTime())) return task.status==='in-progress'?['Đang làm','']:['Chưa bắt đầu','']; const days=dayDiff(due); if(days<=1&&!isDone(task))return ['Sắp đến hạn','status-soon']; if(task.status==='in-progress')return ['Đang làm','']; return ['Chưa bắt đầu','']; }
function taskStatusKey(task) {
  if (isDone(task) || task.status==='done') return 'done';
  if (task.status==='in-progress') return 'in-progress';
  return 'not-started';
}
function renderTask(task) {
  const due=parseDate(task.dueAt); const dueClass=isOverdue(task)?'overdue':(due&&!Number.isNaN(due.getTime())&&dayDiff(due)<=1?'soon':'');
  const progress=isDone(task)?100:(task.progress||0);
  const statusKey=taskStatusKey(task);
  const statusName=statusKey==='done'?'Đã xong':statusKey==='in-progress'?'Đang làm':'Chưa làm';
  const urgency=urgencyOf(task);
  return `<article class="task-item ${isDone(task)?'completed':''} ${urgency?`urgency-${urgency.key}`:''}" data-task="${escapeHtml(task.id)}">
    <button class="status-toggle status-${statusKey}" data-action="cycle-status" data-id="${escapeHtml(task.id)}" title="${statusName}. Bấm để đổi trạng thái" aria-label="Trạng thái ${statusName}. Bấm để đổi"><span class="status-orb" aria-hidden="true"></span></button>
    <div class="task-main"><div class="task-title-row"><button class="task-title" data-action="edit" data-id="${escapeHtml(task.id)}">${escapeHtml(task.title)}</button>${task.category?`<span class="category-pill">${escapeHtml(task.category)}</span>`:''}<span class="status-word status-${statusKey}">${statusName}</span>${urgency?`<span class="urgency-badge urgency-${urgency.key}">${urgency.label}</span>`:''}</div>
    ${task.notes?`<p class="task-notes">${escapeHtml(task.notes)}</p>`:''}
    <div class="task-meta"><span class="${dueClass}">◷ ${escapeHtml(dueLabel(task))}</span><span><i class="priority-dot priority-${escapeHtml(task.priority||'medium')}"></i>${task.priority==='high'?'Ưu tiên cao':task.priority==='low'?'Ưu tiên thấp':'Bình thường'}</span><span>◴ ${Number(task.estimate||60)} phút</span></div>
    <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><span class="progress-label">${progress}% hoàn thành</span>${!isDone(task)?`<button class="text-button" data-action="progress" data-id="${escapeHtml(task.id)}">+ Tiến độ</button>`:''}</div>
    </div></article>`;
}
function renderStats() {
  const active=state.tasks.filter(t=>!isDone(t));
  $('openStat').textContent=active.length;
  $('dueStat').textContent=active.filter(t=>{const d=parseDate(t.dueAt);return d&&d-new Date()>=0&&d-new Date()<=48*3600000;}).length;
  $('doneStat').textContent=state.tasks.filter(isDone).length;
  $('todayCount').textContent=active.length;
}
function renderWeek() {
  const now=startOfDay(new Date()); const days=Array.from({length:7},(_,i)=>new Date(now.getFullYear(),now.getMonth(),now.getDate()+i));
  $('weekStrip').innerHTML=days.map(d=>{const key=dateKey(d);const count=state.tasks.filter(t=>!isDone(t)&&t.dueAt&&dateKey(parseDate(t.dueAt))===key).length;return `<button class="day-button ${state.selectedDate===key?'selected':''} ${count?'has-task':''}" data-day="${key}"><small>${d.toLocaleDateString('vi-VN',{weekday:'short'}).replace('.','')}</small><strong>${d.getDate()}</strong><span class="day-dot"></span></button>`;}).join('');
  const selected=state.selectedDate; const list=state.tasks.filter(t=>!isDone(t)&&t.dueAt&&dateKey(parseDate(t.dueAt))===selected).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt));
  $('weekTasks').innerHTML=list.length?list.slice(0,4).map(t=>`<div class="week-task"><span class="week-task-line"></span><div><strong>${escapeHtml(t.title)}</strong><small>${parseDate(t.dueAt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}${t.category?' · '+escapeHtml(t.category):''}</small></div></div>`).join(''):`<p class="week-empty">${selected===dateKey(now)?'Chưa có deadline nào trong ngày hôm nay.':'Không có deadline trong ngày này.'}</p>`;
}

function monthName(date) { return date.toLocaleDateString('vi-VN',{month:'long',year:'numeric'}); }
function tasksForDate(key) { return state.tasks.filter(t=>t.dueAt&&dateKey(parseDate(t.dueAt))===key).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt)); }
function renderMonth() {
  const cursor=new Date(state.monthCursor.getFullYear(),state.monthCursor.getMonth(),1);
  $('monthTitle').textContent=monthName(cursor);
  const firstDay=(cursor.getDay()+6)%7;
  const daysInMonth=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
  const prevMonthDays=new Date(cursor.getFullYear(),cursor.getMonth(),0).getDate();
  const todayKey=dateKey(new Date());
  const cells=[];
  for(let i=0;i<42;i++){
    let day, date, outside=false;
    if(i<firstDay){day=prevMonthDays-firstDay+i+1;date=new Date(cursor.getFullYear(),cursor.getMonth()-1,day);outside=true;}
    else if(i>=firstDay+daysInMonth){day=i-(firstDay+daysInMonth)+1;date=new Date(cursor.getFullYear(),cursor.getMonth()+1,day);outside=true;}
    else {day=i-firstDay+1;date=new Date(cursor.getFullYear(),cursor.getMonth(),day);}
    const key=dateKey(date); const tasks=tasksForDate(key); const active=tasks.filter(t=>!isDone(t));
    const previews=tasks.slice(0,2).map(t=>{const u=urgencyOf(t);return `<span class="month-task-chip ${isDone(t)?'is-done':''} ${isOverdue(t)?'is-overdue':''} ${u?`urgency-${u.key}`:''}"><i></i>${escapeHtml(t.title)}</span>`;}).join('');
    const more=tasks.length>2?`<span class="month-more">+${tasks.length-2} nữa</span>`:'';
    cells.push(`<button class="month-day ${outside?'outside-month':''} ${key===todayKey?'is-today':''} ${key===state.monthSelectedDate?'is-selected':''} ${active.length?'has-deadline':''}" data-month-day="${key}" aria-label="${date.toLocaleDateString('vi-VN')} · ${tasks.length} task"><span class="month-day-number">${day}</span>${active.length?`<span class="month-count">${active.length} deadline</span>`:'<span class="month-no-task"></span>'}<span class="month-day-tasks">${previews}${more}</span></button>`);
  }
  $('monthGrid').innerHTML=cells.join('');
  const selected=state.monthSelectedDate; const selectedDate=new Date(`${selected}T12:00:00`); const tasks=tasksForDate(selected);
  $('monthAgendaTitle').textContent=selectedDate.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long'});
  $('monthAgendaSubtitle').textContent=tasks.length?`${tasks.length} task có deadline trong ngày này`:'Chưa có task nào có deadline trong ngày này.';
  $('monthAgendaTasks').innerHTML=tasks.length?tasks.map(t=>{const u=urgencyOf(t);return `<article class="month-agenda-task ${isDone(t)?'completed':''}"><span class="agenda-time">${parseDate(t.dueAt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</span><div class="agenda-task-main"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category||'Không phân loại')} · ${u?u.label:isDone(t)?'Đã hoàn thành':isOverdue(t)?'Quá hạn':`Còn ${Math.max(0,dayDiff(parseDate(t.dueAt)))} ngày`}</small></div><button class="secondary-button agenda-edit" data-month-edit="${escapeHtml(t.id)}">Mở task</button></article>`;}).join(''):`<div class="month-empty"><span>✳</span><p>Ngày này còn trống. M có thể dành nó để bắt đầu bài tập trước khi deadline đến.</p></div>`;
  renderCalendarBoard();
}
function startOfWeek(date){const d=startOfDay(date);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function calendarChip(task){const u=urgencyOf(task);return `<button class="cal-chip ${isDone(task)?'is-done':''} ${u?`urgency-${u.key}`:''}" data-month-edit="${escapeHtml(task.id)}">${escapeHtml(task.title)}</button>`;}
function renderCalendarBoard(){
  const mode=state.calendarMode||'month';
  const board=$('calBoard');
  if(!board) return;
  board.hidden=mode==='month';
  $('monthGrid').hidden=mode!=='month';
  document.querySelector('.month-weekdays').hidden=mode!=='month';
  document.querySelector('.month-agenda').hidden=mode==='day';
  document.querySelectorAll('.cal-mode').forEach(b=>b.classList.toggle('selected',b.dataset.cal===mode));
  const cursor=state.monthCursor;
  if(mode==='month'){$('monthTitle').textContent=monthName(new Date(cursor.getFullYear(),cursor.getMonth(),1));return;}
  if(mode==='week'){
    const start=startOfWeek(cursor);
    const days=Array.from({length:7},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));
    $('monthTitle').textContent=`${days[0].toLocaleDateString('vi-VN',{day:'numeric',month:'short'})} – ${days[6].toLocaleDateString('vi-VN',{day:'numeric',month:'short',year:'numeric'})}`;
    board.innerHTML=`<div class="week-board">${days.map(d=>{const key=dateKey(d);const tasks=tasksForDate(key);return `<section class="week-col ${key===dateKey(new Date())?'is-today':''} ${key===state.monthSelectedDate?'is-selected':''}"><button class="week-col-head" data-cal-day="${key}"><small>${d.toLocaleDateString('vi-VN',{weekday:'short'}).replace('.','')}</small><strong>${d.getDate()}</strong></button><div class="week-col-tasks">${tasks.map(calendarChip).join('')||'<p class="week-empty">Trống</p>'}</div></section>`;}).join('')}</div>`;
    return;
  }
  const key=dateKey(cursor);
  const tasks=tasksForDate(key);
  $('monthTitle').textContent=new Date(`${key}T12:00:00`).toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  board.innerHTML=`<div class="day-board">${tasks.length?tasks.map(t=>{const u=urgencyOf(t);return `<article class="day-task ${isDone(t)?'completed':''}"><span class="agenda-time">${parseDate(t.dueAt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</span><div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category||'Không phân loại')}${u?` · ${u.label}`:''}</small></div><button class="secondary-button agenda-edit" data-month-edit="${escapeHtml(t.id)}">Mở task</button></article>`;}).join(''):'<div class="month-empty"><span>✳</span><p>Ngày này chưa có deadline.</p></div>'}</div>`;
}
function shiftCalendar(dir){
  const cursor=new Date(state.monthCursor);
  if(state.calendarMode==='day') cursor.setDate(cursor.getDate()+dir);
  else if(state.calendarMode==='week') cursor.setDate(cursor.getDate()+dir*7);
  else cursor.setMonth(cursor.getMonth()+dir);
  state.monthCursor=cursor;
  state.monthSelectedDate=dateKey(cursor);
  renderMonth();
}

function render() {
  const special=['pomodoro','mood','habit'].includes(state.view);
  const viewInfo={month:['Lịch','LỊCH','Xem theo ngày, tuần hoặc tháng.','Deadline còn 3 ngày được đánh dấu nguy cấp, còn 2 ngày trở xuống là rất nguy cấp.','Lịch','Các deadline được hiển thị trên lịch.'],today:['Task','VIỆC CHƯA XONG','Hôm nay, mọi việc chưa xong.','Việc đã hoàn thành không còn nằm ở đây. Bấm N để thêm task nhanh.','Hôm nay','Tất cả việc chưa hoàn thành.'],upcoming:['Task','7 NGÀY TỚI','Những hạn trong 7 ngày.','Chỉ gồm việc chưa xong.','Sắp hạn','Deadline trong 7 ngày tới.'],all:['Task','TOÀN BỘ VIỆC','Mọi task, kể cả việc đã xong.','Hôm nay chỉ giữ việc chưa hoàn thành.','Tất cả','Toàn bộ task đang lưu trên máy.'],done:['Task','ĐÃ XONG','Những việc đã hoàn thành.','Những việc này không còn tính vào Hôm nay.','Xong','Task đã hoàn thành sẽ ngừng nhắc.'],pomodoro:['Pomodoro','FOCUS, THEN REST','Tập trung theo nhịp của m.','Học ngắn dần, nghỉ đúng lúc.','', ''],mood:['Mood Tracker','CHECK IN WITH YOURSELF','Hôm nay m thấy thế nào?','Không cần lúc nào cũng ổn. Chỉ cần thành thật với mình.','', ''],habit:['Habit Tracker','SMALL THINGS ADD UP','Xây thói quen nhỏ mỗi ngày.','Theo dõi tiến độ, không cần hoàn hảo.','', '']};
  const info=viewInfo[state.view]||viewInfo.today;
  $('pageLabel').textContent=info[0];$('eyebrow').textContent=info[1];$('heading').textContent=info[2];$('subheading').textContent=info[3];$('listTitle').textContent=info[4];$('listDescription').textContent=info[5];
  document.body.dataset.screen=state.view;
  document.querySelectorAll('.nav-item').forEach(b=>{const v=b.dataset.view;b.classList.toggle('active',v==='tasks'?TASK_VIEWS.includes(state.view):v===state.view);});
  document.querySelectorAll('.scope-chip').forEach(b=>b.classList.toggle('selected',b.dataset.scope===state.view));
  const monthMode=state.view==='month';
  $('monthCalendar').hidden=!monthMode;
  document.querySelector('.page-heading').hidden=special;
  document.querySelector('.stats-grid').style.display=monthMode||special?'none':'grid';
  document.querySelector('.content-grid').style.display=monthMode||special?'none':'grid';
  $('pomodoroPage').hidden=state.view!=='pomodoro';$('moodPage').hidden=state.view!=='mood';$('habitPage').hidden=state.view!=='habit';
  $('filterRow').style.display=state.view==='done'||special?'none':'flex';
  if(!special&&!monthMode){const list=filteredTasks();$('taskList').innerHTML=list.map(renderTask).join('');$('emptyState').hidden=!!list.length;}
  renderStats();renderWeek();renderMonth();renderMood();renderHabits();renderPomo();
}
function renderMood(){
  const all=moods(),today=dateKey(new Date()),entry=all[today];
  const labels={amazing:['🤩','Tuyệt vời',5],good:['😊','Vui vẻ',4],okay:['😐','Bình thường',3],bad:['😔','Không ổn',2],terrible:['😫','Rất tệ',1]};
  document.querySelectorAll('.mood-emoji-btn').forEach(b=>b.classList.toggle('selected',b.dataset.mood===(entry?.mood||state.selectedMood)));
  if($('moodNote')&&document.activeElement!==$('moodNote'))$('moodNote').value=entry?.note||'';
  const span=state.moodSpan==='month'?'month':'week';
  document.querySelectorAll('[data-mood-span]').forEach(b=>b.classList.toggle('selected',b.dataset.moodSpan===span));
  let days;
  if(span==='week'){
    const start=startOfWeek(state.moodCursor);
    days=Array.from({length:7},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));
    $('moodSpanTitle').textContent=`${days[0].toLocaleDateString('vi-VN',{day:'numeric',month:'short'})} – ${days[6].toLocaleDateString('vi-VN',{day:'numeric',month:'short'})}`;
  }else{
    const cursor=state.moodCursor;
    const count=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
    days=Array.from({length:count},(_,i)=>new Date(cursor.getFullYear(),cursor.getMonth(),i+1));
    $('moodSpanTitle').textContent=cursor.toLocaleDateString('vi-VN',{month:'long',year:'numeric'});
  }
  const recorded=days.map(d=>all[dateKey(d)]).filter(Boolean);
  if(!recorded.length)$('moodAverage').innerHTML='<p>Chưa có tâm trạng trong kỳ này.</p>';
  else{
    const score=recorded.reduce((sum,item)=>sum+(labels[item.mood]?.[2]||3),0)/recorded.length;
    const nearest=Object.values(labels).reduce((best,item)=>Math.abs(item[2]-score)<Math.abs(best[2]-score)?item:best,labels.okay);
    $('moodAverage').innerHTML=`<span class="mood-average-emoji">${nearest[0]}</span><div><strong>Trung bình ${span==='week'?'tuần':'tháng'}</strong><p>${nearest[1]} · ${score.toFixed(1)}/5 · ${recorded.length} ngày đã ghi</p></div>`;
  }
  $('moodChart').className=span==='month'?'mood-chart mood-chart-month':'mood-chart';
  $('moodChart').innerHTML=days.map(d=>{const key=dateKey(d);const item=all[key];const meta=item?(labels[item.mood]||labels.okay):null;return `<div class="mood-chart-day ${key===today?'is-today':''}"><span>${meta?meta[0]:'·'}</span><small>${span==='week'?d.toLocaleDateString('vi-VN',{weekday:'short'}).replace('.',''):d.getDate()}</small><div class="mood-bar"><i style="height:${meta?meta[2]*20:8}%"></i></div></div>`;}).join('');
  const notes=days.map(d=>[dateKey(d),all[dateKey(d)]]).filter(([,item])=>item).reverse();
  $('moodLog').innerHTML=notes.length?notes.map(([day,item])=>{const meta=labels[item.mood]||labels.okay;return `<article class="mood-log-row"><span class="mood-log-emoji">${meta[0]}</span><div><strong>${meta[1]}</strong><small>${new Date(day+'T12:00:00').toLocaleDateString('vi-VN',{weekday:'short',day:'numeric',month:'long'})}</small>${item.note?`<p>${escapeHtml(item.note)}</p>`:''}</div></article>`;}).join(''):'<p class="tracker-empty-copy">Chưa có bản ghi trong kỳ này.</p>';
}
function shiftMood(dir){const d=new Date(state.moodCursor);if(state.moodSpan==='month')d.setMonth(d.getMonth()+dir);else d.setDate(d.getDate()+dir*7);state.moodCursor=d;renderMood();}
function habitStreak(habit){let streak=0;const done=new Set(habit.doneDates||[]);let d=startOfDay(new Date());while(done.has(dateKey(d))){streak++;d.setDate(d.getDate()-1)}return streak;}
function habitMonthStats(habit,cursor){
  const done=new Set(habit.doneDates||[]);
  const year=cursor.getFullYear(),month=cursor.getMonth();
  const count=new Date(year,month+1,0).getDate();
  let longest=0,run=0,total=0;
  for(let day=1;day<=count;day++){
    const key=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    if(done.has(key)){run+=1;total+=1;longest=Math.max(longest,run);}else run=0;
  }
  return {longest,total,count};
}
function renderHabits(){
  const list=habits(),today=dateKey(new Date()),cursor=state.habitCursor;
  $('habitEmpty').hidden=list.length>0;
  $('habitMonthTitle').textContent=cursor.toLocaleDateString('vi-VN',{month:'long',year:'numeric'});
  const year=cursor.getFullYear(),month=cursor.getMonth();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const first=(new Date(year,month,1).getDay()+6)%7;
  $('habitList').innerHTML=list.map(h=>{
    const doneToday=(h.doneDates||[]).includes(today),streak=habitStreak(h),stats=habitMonthStats(h,cursor),done=new Set(h.doneDates||[]);
    const cells=[];
    for(let i=0;i<first;i++) cells.push('<span class="habit-month-day is-empty"></span>');
    for(let day=1;day<=daysInMonth;day++){
      const key=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      cells.push(`<span class="habit-month-day ${done.has(key)?'done':''} ${key===today?'today':''}" title="${key}">${day}</span>`);
    }
    return `<article class="habit-card glass-card" style="--habit-color:${h.color}"><div class="habit-card-main"><span class="habit-big-icon">${h.icon}</span><div class="habit-title-wrap"><h3>${escapeHtml(h.name)}</h3><p>${streak?`🔥 ${streak} ngày liên tiếp`:'Bắt đầu chuỗi hôm nay'}</p></div><button class="habit-check ${doneToday?'checked':''}" data-habit-toggle="${escapeHtml(h.id)}" aria-label="${doneToday?'Bỏ đánh dấu':'Đánh dấu hoàn thành'}">${doneToday?'✓':'○'}</button></div><div class="habit-month">${cells.join('')}</div><div class="habit-card-footer"><small>Chuỗi dài nhất trong tháng: ${stats.longest} ngày · ${stats.total}/${stats.count} ngày</small><button class="habit-delete" data-habit-delete="${escapeHtml(h.id)}">Xóa</button></div></article>`;
  }).join('');
}
function showToast(message) { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(state.toastTimer); state.toastTimer=setTimeout(()=>el.classList.remove('show'),2800); }
function anyModalOpen(){return ['taskModal','settingsModal','habitModal','dumpModal','pomoNoteModal'].some(id=>{const el=$(id);return el&&!el.hidden;});}
function openModal(id) { $(id).hidden=false; document.body.style.overflow='hidden'; if(id==='taskModal') setTimeout(()=>$('taskTitle').focus(),50); if(id==='dumpModal') setTimeout(()=>$('dumpLines').focus(),50); if(id==='pomoNoteModal') setTimeout(()=>$('pomoNoteInput').focus(),50); }
function closeModal(id) { const modal=$(id);if(modal)modal.hidden=true;if(!anyModalOpen())document.body.style.overflow=''; }
function resetTaskForm() { $('taskForm').reset(); $('taskId').value=''; $('taskPriority').value='medium'; $('taskEstimate').value='60'; $('modalTitle').textContent='Thêm task mới'; if($('deleteTaskBtn')) $('deleteTaskBtn').hidden=true; $('taskDue').value=localDateTimeValue(new Date(Date.now()+3*86400000)); updateReminderPreview(); }
function editTask(task) { resetTaskForm(); $('taskId').value=task.id; $('taskTitle').value=task.title; $('taskCategory').value=task.category||''; $('taskDue').value=task.dueAt&&!Number.isNaN(new Date(task.dueAt).getTime())?localDateTimeValue(task.dueAt):''; $('taskPriority').value=task.priority||'medium'; $('taskEstimate').value=String(task.estimate||60); $('taskNotes').value=task.notes||''; $('modalTitle').textContent='Chỉnh sửa task'; if($('deleteTaskBtn')) $('deleteTaskBtn').hidden=false; updateReminderPreview(); openModal('taskModal'); }
function nextWeekday(target, now){
  const due=startOfDay(now);
  due.setDate(due.getDate()+((target-due.getDay()+7)%7));
  return due;
}
function parseTaskText(raw, now=new Date()){
  let text=String(raw||'').replace(/\s+/g,' ').trim();
  if(!text) return {title:'',dueAt:null};
  let hour=null, minute=null;
  const timePatterns=[/(?:lúc\s+)?(\d{1,2})\s*h(?!\p{L})(?:\s*(\d{2}))?(?!\d)/iu,/(?:lúc\s+)?(\d{1,2}):(\d{2})(?!\d)/,/(?:lúc\s+)?(\d{1,2})\s*giờ(?:\s*(\d{1,2}))?(?!\d)/i];
  for(const pattern of timePatterns){
    const match=text.match(pattern);
    if(!match) continue;
    const h=Number(match[1]), m=match[2]?Number(match[2]):0;
    if(h>23||m>59) continue;
    hour=h; minute=m;
    text=text.replace(match[0],' ');
    break;
  }
  let dueDay=null;
  const dateMatch=text.match(/(?:ngày\s+)?(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?(?!\d)/i);
  if(dateMatch){
    const day=Number(dateMatch[1]), month=Number(dateMatch[2]);
    let year=dateMatch[3]?Number(dateMatch[3]):now.getFullYear();
    if(year<100) year+=2000;
    const candidate=new Date(year,month-1,day);
    if(candidate.getFullYear()===year&&candidate.getMonth()===month-1&&candidate.getDate()===day){
      if(!dateMatch[3]&&candidate<startOfDay(now)) candidate.setFullYear(candidate.getFullYear()+1);
      dueDay=candidate;
      text=text.replace(dateMatch[0],' ');
    }
  }
  if(!dueDay){
    const relative=text.match(/(^|\s)(hôm\s*nay|ngày\s*mai|mai)(?=\s|$|[,.])/i);
    if(relative){
      dueDay=startOfDay(now);
      if(!/hôm/i.test(relative[2])) dueDay.setDate(dueDay.getDate()+1);
      text=text.replace(relative[0],' ');
    }
  }
  if(!dueDay){
    const weekdays=[[/thứ\s*2(?!\d)|thứ\s*hai/i,1],[/thứ\s*3(?!\d)|thứ\s*ba/i,2],[/thứ\s*4(?!\d)|thứ\s*tư|thứ\s*tu(?!\w)/i,3],[/thứ\s*5(?!\d)|thứ\s*năm|thứ\s*nam(?!\w)/i,4],[/thứ\s*6(?!\d)|thứ\s*sáu|thứ\s*sau(?!\w)/i,5],[/thứ\s*7(?!\d)|thứ\s*bảy|thứ\s*bay(?!\w)/i,6],[/chủ\s*nhật|\bcn(?=\s|$|[,.])/i,0]];
    for(const [pattern,day] of weekdays){
      const match=text.match(pattern);
      if(!match) continue;
      dueDay=nextWeekday(day,now);
      text=text.replace(match[0],' ');
      break;
    }
  }
  text=text.replace(/\s+/g,' ').replace(/^[\s,.;:-]+|[\s,.;:-]+$/g,'').trim();
  if(!dueDay&&hour!=null) dueDay=startOfDay(now);
  if(!dueDay) return {title:text||String(raw).trim(),dueAt:null};
  const due=new Date(dueDay);
  due.setHours(hour==null?23:hour,minute==null?0:minute,0,0);
  return {title:text||String(raw).trim(),dueAt:due.toISOString()};
}
function fillFormFromTitle(){
  const parsed=parseTaskText($('taskTitle').value);
  if(!parsed.dueAt) return;
  if(parsed.title) $('taskTitle').value=parsed.title;
  $('taskDue').value=localDateTimeValue(parsed.dueAt);
  updateReminderPreview();
}
function openDumpModal(){if($('dumpForm'))$('dumpForm').reset();openModal('dumpModal');}
async function createDumpTasks(event){
  event.preventDefault();
  const titles=$('dumpLines').value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
  if(!titles.length){showToast('Nhập ít nhất một tên task.');return;}
  const raw=($('dumpDue').value||'').trim();
  let dueAt=null;
  if(raw){
    const due=new Date(`${raw}T23:00:00`);
    if(Number.isNaN(due.getTime())){showToast('M kiểm tra lại deadline nhé.');return;}
    dueAt=due.toISOString();
  }
  const now=new Date().toISOString();
  for(const line of titles){
    const parsed=parseTaskText(line);
    await persistTask({id:uid(),title:(parsed.title||line).slice(0,120),category:'',dueAt:parsed.dueAt||dueAt,priority:'medium',estimate:60,notes:'',status:'not-started',progress:0,createdAt:now,updatedAt:now});
  }
  closeModal('dumpModal');
  showToast(`Đã tạo ${titles.length} task.`);
}
function updateReminderPreview() { const val=$('taskDue').value; if(!val){$('reminderPreview').querySelector('p').textContent='Thêm deadline để xem lịch nhắc.';return;} const task={dueAt:new Date(val).toISOString(),status:'not-started'}; const days=dayDiff(parseDate(task.dueAt)); const count=days>2?1:days===2?2:3; $('reminderPreview').querySelector('p').textContent=`Dự kiến ${count} lần/ngày · ${days<0?'deadline đã qua':days===0?'deadline hôm nay':`còn ${days} ngày`}. Hoàn thành task sẽ dừng nhắc.`; }
async function handleSubmit(event) { event.preventDefault(); const parsed=parseTaskText($('taskTitle').value); const title=(parsed.title||$('taskTitle').value).trim(); if(!title)return; if(parsed.dueAt){$('taskTitle').value=title;$('taskDue').value=localDateTimeValue(parsed.dueAt);} const id=$('taskId').value||uid(); const previous=state.tasks.find(t=>t.id===id); const dueAt=new Date(parsed.dueAt||$('taskDue').value); if(Number.isNaN(dueAt.getTime())){showToast('M kiểm tra lại deadline nhé.');return;} const task={id,title,category:$('taskCategory').value.trim(),dueAt:dueAt.toISOString(),priority:$('taskPriority').value,estimate:Number($('taskEstimate').value),notes:$('taskNotes').value.trim(),status:previous?.status||'not-started',progress:previous?.progress||0,createdAt:previous?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}; await persistTask(task); closeModal('taskModal'); showToast(previous?'Đã cập nhật task.':'Đã thêm task mới.'); }
async function changeTaskStatus(id, status) {
  const task=state.tasks.find(t=>t.id===id);
  if(!task || !['not-started','in-progress','done'].includes(status)) return;
  task.status=status;
  if(status==='done') task.progress=100;
  else if(status==='not-started') task.progress=0;
  else task.progress=Math.max(1,Math.min(99,Number(task.progress)||25));
  await persistTask(task);
  showToast(status==='done'?'Đã đánh dấu task là đã làm ✨':status==='in-progress'?'Đã chuyển task sang đang làm.':'Đã chuyển task về chưa làm.');
}
async function toggleTask(id) { const task=state.tasks.find(t=>t.id===id); if(!task)return; if(isDone(task)){task.status='in-progress';task.progress=Math.min(task.progress||0,99);await persistTask(task);showToast('Đã mở lại task.');}else{task.status='done';task.progress=100;await persistTask(task);showToast('Xong một việc rồi đó ✨');} }
async function adjustProgress(id) { const task=state.tasks.find(t=>t.id===id);if(!task)return; const current=Number(task.progress||0); const next=current>=75?100:current+25;task.progress=next;task.status=next===100?'done':'in-progress';await persistTask(task);showToast(next===100?'Task hoàn thành — đã dừng nhắc.':`Tiến độ đã cập nhật: ${next}%.`); }
async function taskMenu(id) { const task=state.tasks.find(t=>t.id===id);if(!task)return;const choice=prompt(`Task: ${task.title}\nNhập 1 để chỉnh sửa, 2 để xóa, 3 để đánh dấu đang làm.\n(Hủy để quay lại)`);if(choice==='1')editTask(task);else if(choice==='2'&&confirm(`Xóa task “${task.title}”?`))removeTask(id);else if(choice==='3'){task.status='in-progress';await persistTask(task);showToast('Đã chuyển sang đang làm.');} }
function reminderKey(task,time,day) { return `deadline-buddy-notified:${task.id}:${day}:${time}`; }
function dueWithinNextWeek(task, now=new Date()) {
  if(isDone(task)||!task.dueAt)return false;
  const due=parseDate(task.dueAt);if(!due||Number.isNaN(due.getTime()))return false;
  const start=startOfDay(now);const end=new Date(start);end.setDate(end.getDate()+8);
  return due>=start && due<end;
}
async function scheduleDigestReminders(now, today, minute) {
  const s=settings();
  const dueTasks=state.tasks.filter(task=>dueWithinNextWeek(task,now)).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt));
  if(!dueTasks.length)return;
  for(const [kind,time,label] of [['morning',s.morningDigest,'Buổi sáng'],['evening',s.eveningDigest,'Buổi tối']]) {
    const [hour,mins]=String(time||'').split(':').map(Number);
    if(!Number.isFinite(hour)||!Number.isFinite(mins))continue;
    const target=hour*60+mins;const current=now.getHours()*60+now.getMinutes();
    // Nếu mở app trễ, vẫn cho gửi trong vòng 2 giờ sau giờ đã đặt; tránh gửi dồn vào thời điểm khác.
    if(current<target||current-target>120)continue;
    const key=`deadline-buddy-digest:${kind}:${today}`;if(localStorage.getItem(key))continue;
    const lines=dueTasks.slice(0,5).map(task=>`• ${task.title} — ${dueLabel(task)}`);
    const extra=dueTasks.length>5?`\n+ ${dueTasks.length-5} task khác` : '';
    const body=`Còn ${dueTasks.length} task chưa hoàn thành có deadline trong 7 ngày tới.\n${lines.join('\n')}${extra}`;
    try {
      await notifyUser(`Deadline Buddy · ${label}: xem lại task`, body, `digest:${kind}:${today}`);
      localStorage.setItem(key,'1');
    } catch(error) { console.warn('Digest notification failed',error); }
  }
}
function nativeNotifications(){return window.Capacitor?.Plugins?.LocalNotifications||null;}
function notifId(text){let hash=0;for(const ch of String(text))hash=(hash*31+ch.charCodeAt(0))>>>0;return (hash%2000000000)+1;}
function atToday(day,time){const [hour,minute]=String(time||'').split(':').map(Number);if(!Number.isFinite(hour)||!Number.isFinite(minute))return null;const when=startOfDay(day);when.setHours(hour,minute,0,0);return when;}
function timesOnDay(task,day){
  if(isDone(task)||!task.dueAt)return [];
  const due=parseDate(task.dueAt);if(!due)return [];
  const diff=Math.ceil((startOfDay(due).getTime()-startOfDay(day).getTime())/86400000);
  const s=settings();
  if(diff>2)return [s.evening];
  if(diff===2)return [s.noon,s.evening];
  if(diff===1||diff===0)return [s.noon,s.evening,s.late];
  return [s.evening];
}
async function ensureNativeChannel(){
  const native=nativeNotifications();
  if(!native?.createChannel)return;
  await native.createChannel({id:'deadline-buddy-v2',name:'Nhắc Deadline Buddy',description:'Nhắc deadline và Pomodoro',importance:5,vibration:true});
}
function desktopNotifyReady(){return !!(window.pywebview?.api?.notify && localStorage.getItem('deadline-buddy-desktop-notify')==='1');}
function canSendVisibleReminders(){return !!(window.pywebview?.api?.notify)||(('Notification'in window)&&Notification.permission==='granted');}
function enableDesktopNotifications(){
  if(!window.pywebview?.api?.notify)return;
  const already=localStorage.getItem('deadline-buddy-desktop-notify')==='1';
  localStorage.setItem('deadline-buddy-desktop-notify','1');
  if(!already)window.pywebview.api.notify('Deadline Buddy','Đã bật thông báo trên máy tính.').catch(()=>{});
}
async function catchUpMissedDigests(){
  if(nativeNotifications()||!canSendVisibleReminders())return;
  const now=new Date();const today=dateKey(now);const s=settings();
  const dueTasks=state.tasks.filter(task=>dueWithinNextWeek(task,now)).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt));
  if(!dueTasks.length)return;
  const current=now.getHours()*60+now.getMinutes();
  for(const [kind,time,label] of [['morning',s.morningDigest,'Buổi sáng'],['evening',s.eveningDigest,'Buổi tối']]){
    const [hour,mins]=String(time||'').split(':').map(Number);
    if(!Number.isFinite(hour)||!Number.isFinite(mins))continue;
    const late=current-(hour*60+mins);
    if(late<0||late>180)continue;
    const key=`deadline-buddy-digest:${kind}:${today}`;if(localStorage.getItem(key))continue;
    const lines=dueTasks.slice(0,5).map(task=>`• ${task.title} — ${dueLabel(task)}`);
    const extra=dueTasks.length>5?`\n+ ${dueTasks.length-5} task khác`:'';
    const body=`Còn ${dueTasks.length} task chưa hoàn thành có deadline trong 7 ngày tới.\n${lines.join('\n')}${extra}`;
    try{await notifyUser(`Deadline Buddy · ${label}: xem lại task`,body,`digest:${kind}:${today}`);localStorage.setItem(key,'1');}
    catch(error){console.warn('Digest notification failed',error);}
  }
}
async function notifyUser(title,body,key){
  if(window.pywebview?.api?.notify){
    await window.pywebview.api.notify(String(title),String(body));
    return true;
  }
  const native=nativeNotifications();
  if(native){
    await native.schedule({notifications:[{id:notifId(key||`${title}:${Date.now()}`),title,body,channelId:'deadline-buddy-v2',schedule:{at:new Date(Date.now()+700),allowWhileIdle:true}}]});
    return true;
  }
  if('Notification'in window&&Notification.permission==='granted'){new Notification(title,{body});return true;}
  return false;
}
async function scheduleNativeReminders(){
  const native=nativeNotifications();
  if(!native)return;
  const perm=await native.checkPermissions();
  if(perm.display!=='granted')return;
  await ensureNativeChannel();
  const now=new Date();
  const planned=[];
  for(let offset=0;offset<7;offset++){
    const day=new Date();day.setDate(day.getDate()+offset);
    const dayKey=dateKey(day);
    const open=state.tasks.filter(task=>!isDone(task)&&task.dueAt);
    if(open.length){
      for(const [kind,time,label] of [['morning',settings().morningDigest,'Buổi sáng'],['evening',settings().eveningDigest,'Buổi tối']]){
        const when=atToday(day,time);
        if(!when||when.getTime()<=now.getTime()+15000)continue;
        const lines=open.slice(0,5).map(task=>`• ${task.title}`);
        planned.push({id:notifId(`digest:${kind}:${dayKey}`),title:`Deadline Buddy · ${label}`,body:`Còn ${open.length} việc chưa xong.\n${lines.join('\n')}`,channelId:'deadline-buddy-v2',schedule:{at:when,allowWhileIdle:true}});
      }
    }
    for(const task of open){
      for(const time of timesOnDay(task,day)){
        const when=atToday(day,time);
        if(!when||when.getTime()<=now.getTime()+15000)continue;
        planned.push({id:notifId(`task:${task.id}:${dayKey}:${time}`),title:task.title,body:`${dueLabel(task)}. ${task.progress?`Tiến độ ${task.progress}%.`:'Thử làm 5 phút đầu tiên nhé.'}`,channelId:'deadline-buddy-v2',schedule:{at:when,allowWhileIdle:true}});
      }
    }
  }
  const pending=await native.getPending();
  if(pending.notifications?.length)await native.cancel({notifications:pending.notifications.map(item=>({id:item.id}))});
  if(planned.length)await native.schedule({notifications:planned.slice(0,40)});
}
async function scheduleVisibleReminders() {
  if(nativeNotifications()){try{await scheduleNativeReminders();}catch(error){console.warn(error);}return;}
  if(!canSendVisibleReminders())return;
  const now=new Date();const today=dateKey(now);const minute=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  scheduleDigestReminders(now,today,minute);
  const current=now.getHours()*60+now.getMinutes();
  for(const task of state.tasks.filter(t=>!isDone(t)&&t.dueAt)) {
    const due=parseDate(task.dueAt);if(!due)continue;
    let times=reminderPlan(task);
    if(dayDiff(due)===0){const s=settings();times=[...new Set([...times,s.noon,s.evening,s.late])];}
    for(const time of times) {
      const [hour,mins]=String(time||'').split(':').map(Number);
      if(!Number.isFinite(hour)||!Number.isFinite(mins))continue;
      const late=current-(hour*60+mins);
      if(late<0||late>45)continue;
      const key=reminderKey(task,time,today);if(localStorage.getItem(key))continue;
      try { await notifyUser(`Deadline Buddy · ${task.title}`,`${dueLabel(task)}. ${task.progress?`Tiến độ ${task.progress}%.`:'Thử làm 5 phút đầu tiên nhé.'}`,key); localStorage.setItem(key,'1'); } catch(error) { console.warn('Notification failed',error); }
    }
  }
}
function requestNotifications() {
  if(window.pywebview?.api?.notify){
    localStorage.setItem('deadline-buddy-desktop-notify','1');
    window.pywebview.api.notify('Deadline Buddy','Đã bật thông báo trên máy tính.').catch(()=>{});
    showToast('Đã bật thông báo trên máy tính.');
    scheduleVisibleReminders();
    return;
  }
  const native=nativeNotifications();
  if(native){
    ensureNativeChannel().then(()=>native.requestPermissions()).then(perm=>{
      if(perm.display==='granted'){showToast('Đã bật thông báo trên điện thoại.');scheduleNativeReminders();}
      else showToast('Thông báo chưa được cấp quyền. Hãy bật trong Cài đặt Android.');
    }).catch(()=>showToast('Không bật được thông báo.'));
    return;
  }
  if(!('Notification' in window)){showToast('Trình duyệt này chưa hỗ trợ thông báo.');return;} Notification.requestPermission().then(permission=>{if(permission==='granted'){showToast('Đã bật thông báo. Giữ app mở để kiểm tra lịch nhắc; tổng hợp task sẽ gửi buổi sáng và buổi tối.');scheduleVisibleReminders();}else showToast('Thông báo chưa được cấp quyền.');});
}
function setView(view) { if(view==='tasks') view=TASK_VIEWS.includes(state.taskScope)?state.taskScope:'today'; if(TASK_VIEWS.includes(view)) state.taskScope=view; state.view=view;state.filter='all';document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('selected',b.dataset.filter==='all'));render(); }
function exportData() { const payload={app:'Deadline Buddy',version:1,exportedAt:new Date().toISOString(),tasks:state.tasks,settings:settings(),moods:moods(),habits:habits()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`deadline-buddy-backup-${dateKey(new Date())}.json`;a.click();URL.revokeObjectURL(url);showToast('Đã xuất bản sao lưu JSON.'); }
function importData(file) { const reader=new FileReader();reader.onload=async()=>{try{const data=JSON.parse(reader.result);const tasks=Array.isArray(data)?data:data.tasks;if(!Array.isArray(tasks))throw new Error('invalid');if(!confirm(`Nhập ${tasks.length} task? Task trùng ID sẽ được cập nhật.`))return;for(const task of tasks){if(!task.id||!task.title||!task.dueAt)continue;await persistTask({...task,updatedAt:new Date().toISOString()});}if(data.settings)setSettings(data.settings);render();showToast('Đã nhập dữ liệu.');}catch{showToast('File không hợp lệ hoặc không đọc được.');}};reader.readAsText(file); }
function openSettings() { const s=settings();$('morningDigestTime').value=s.morningDigest;$('eveningDigestTime').value=s.eveningDigest;$('noonTime').value=s.noon;$('eveningTime').value=s.evening;$('lateTime').value=s.late;if($('syncUrlInput'))$('syncUrlInput').value=syncUrl();openModal('settingsModal'); }
function saveSettings() { const s={morningDigest:$('morningDigestTime').value||'08:00',eveningDigest:$('eveningDigestTime').value||'20:00',noon:$('noonTime').value||'12:00',evening:$('eveningTime').value||'19:00',late:$('lateTime').value||'21:00',updatedAt:new Date().toISOString()};setSettings(s);const url=($('syncUrlInput').value||'').trim().replace(/\/$/,'');localStorage.setItem(SYNC_URL_KEY,url);closeModal('settingsModal');showToast('Đã lưu giờ nhắc sáng và tối.');render();scheduleVisibleReminders();scheduleSync(); }
const SYNC_URL_KEY='deadline-buddy-sync-url';
let syncing=false, applyingSync=false, syncTimer=null;
function syncUrl(){return (localStorage.getItem(SYNC_URL_KEY)||'').replace(/\/$/,'');}
function localSnapshot(){return {tasks:state.tasks,moods:moods(),habits:habits(),settings:settings(),deletedTasks:readLocal('deadline-buddy-deleted-tasks',{}),deletedHabits:readLocal('deadline-buddy-deleted-habits',{})};}
function scheduleSync(){if(applyingSync||!syncUrl())return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(false),900);}
async function replaceAllTasks(tasks){
  state.tasks=tasks;
  if(!state.db){localStorage.setItem(LEGACY_KEY,JSON.stringify(tasks));return;}
  await new Promise((resolve,reject)=>{const tx=state.db.transaction(STORE,'readwrite');const store=tx.objectStore(STORE);store.clear();for(const task of tasks)store.put(task);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
}
async function applySnapshot(data){
  applyingSync=true;
  try{
    writeLocal('deadline-buddy-deleted-tasks',data.deletedTasks||{});
    writeLocal('deadline-buddy-deleted-habits',data.deletedHabits||{});
    writeLocal(MOOD_KEY,data.moods||{});
    writeLocal(HABIT_KEY,data.habits||[]);
    if(data.settings)localStorage.setItem(SETTINGS_KEY,JSON.stringify({...DEFAULT_SETTINGS,...data.settings}));
    await replaceAllTasks(Array.isArray(data.tasks)?data.tasks:[]);
    render();
  } finally { applyingSync=false; }
}
async function restoreSavedTasks(){
  const base=syncUrl();
  if(!base)return;
  try{
    const response=await fetch(`${base}/api/sync`);
    if(!response.ok)return;
    const remote=await response.json();
    const remoteTasks=Array.isArray(remote.tasks)?remote.tasks:[];
    if(!remoteTasks.length)return;
    const byId=new Map(state.tasks.map(task=>[task.id,task]));
    let changed=state.tasks.length!==remoteTasks.length;
    for(const task of remoteTasks){
      const old=byId.get(task.id);
      if(!old||String(task.updatedAt||'')>=String(old.updatedAt||'')){
        if(!old)changed=true;
        byId.set(task.id,task);
      }
    }
    if(!changed && byId.size===state.tasks.length)return;
    if(remote.moods)writeLocal(MOOD_KEY,{...moods(),...remote.moods});
    if(Array.isArray(remote.habits)&&remote.habits.length)writeLocal(HABIT_KEY,remote.habits);
    await replaceAllTasks([...byId.values()]);
    render();
  }catch(error){console.warn(error);}
}
async function syncNow(manual){
  const base=syncUrl();
  if(!base){if(manual)showToast('Nhập địa chỉ đồng bộ trong Cài đặt.');return;}
  if(syncing)return;
  syncing=true;
  try{
    if(!state.tasks.length){
      const saved=await fetch(`${base}/api/sync`);
      if(!saved.ok)throw new Error('sync failed');
      const remote=await saved.json();
      if((remote.tasks||[]).length){await applySnapshot(remote);if(manual)showToast('Đã lấy lại dữ liệu đã lưu.');return;}
    }
    const response=await fetch(`${base}/api/sync`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(localSnapshot())});
    if(!response.ok)throw new Error('sync failed');
    await applySnapshot(await response.json());
    if(manual)showToast('Đã đồng bộ với máy tính.');
  }catch(error){console.warn(error);if(manual)showToast('Không kết nối được máy tính. Kiểm tra Wi-Fi và địa chỉ.');}
  finally{syncing=false;}
}
async function prepareSync(){
  const input=$('syncUrlInput');
  if(input)input.value=syncUrl();
  const onCapacitor=location.protocol==='https:'||location.protocol==='capacitor:'||window.Capacitor;
  if(!onCapacitor){
    try{
      const info=await fetch('/api/info').then(r=>r.json());
      if(!syncUrl())localStorage.setItem(SYNC_URL_KEY,location.origin);
      const hint=$('syncHint');
      const address=info.ips&&info.ips[0]?`http://${info.ips[0]}:${info.port}`:'';
      if(hint&&address)hint.textContent=`Máy tính đang mở. Trên điện thoại, cùng Wi-Fi, dán địa chỉ này: ${address}`;
      if(input&&!input.value)input.value=location.origin;
    }catch{}
  }
}
const POMO_SETTINGS_KEY='deadline-buddy-pomo-settings';
const POMO_SESSION_KEY='deadline-buddy-pomo-sessions';
const DEFAULT_POMO={focus:50,short:10,long:15,rounds:4};
function clampPomo(value,min,max,fallback){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):fallback;}
function pomoSettings(){const saved=readLocal(POMO_SETTINGS_KEY,{});return {focus:clampPomo(saved.focus,1,180,DEFAULT_POMO.focus),short:clampPomo(saved.short,1,60,DEFAULT_POMO.short),long:clampPomo(saved.long,1,120,DEFAULT_POMO.long),rounds:clampPomo(saved.rounds,1,8,DEFAULT_POMO.rounds)};}
function buildPomoStages(settings=pomoSettings()){const stages=[];for(let i=0;i<settings.rounds;i++){stages.push({kind:'study',minutes:settings.focus});const last=i===settings.rounds-1;stages.push({kind:'break',minutes:last?settings.long:settings.short,long:last});}return stages;}
function pomoSessions(){const list=readLocal(POMO_SESSION_KEY,[]);return Array.isArray(list)?list:[];}
function savePomoSessions(list){writeLocal(POMO_SESSION_KEY,list.slice(-400));}
let pomoStages=buildPomoStages();
let pomoIndex=0, pomoRemaining=pomoStages[0].minutes*60, pomoRunning=false, pomoInterval=null, pomoLastTick=0, pomoStudyStartedAt=0, pomoNoteId=null;
function applyTheme(theme){document.body.dataset.theme=theme;localStorage.setItem('deadline-buddy-theme',theme);const labels={light:'☼',dark:'☾','pastel-pink':'♡','pastel-blue':'☁','pastel-mint':'❀','pastel-lavender':'✦','pastel-peach':'☀'};$('themeBtn').textContent=labels[theme]||'☼';$('themeBtn').title=`Giao diện: ${theme}. Bấm để đổi`;}
function cycleTheme(){const themes=['light','pastel-pink','pastel-blue','pastel-mint','pastel-lavender','pastel-peach','dark'];const current=localStorage.getItem('deadline-buddy-theme')||'light';applyTheme(themes[(themes.indexOf(current)+1)%themes.length]);showToast(`Đã đổi giao diện: ${{light:'sáng',dark:'tối','pastel-pink':'pastel hồng','pastel-blue':'pastel xanh dương','pastel-mint':'pastel xanh mint'}[document.body.dataset.theme]}`);}
function renderNowClock(){
  const root=$('pomoNow');if(!root)return;
  const now=new Date();
  const pad=n=>String(n).padStart(2,'0');
  const next=(pad(now.getHours())+pad(now.getMinutes())).split('');
  root.setAttribute('aria-label',`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  root.querySelectorAll('.flip-card').forEach((card,i)=>{
    const digit=next[i];
    if(card.dataset.value===digit) return;
    const top=card.querySelector('.flip-top');
    const bottom=card.querySelector('.flip-bottom');
    const flap=card.querySelector('.flip-flap');
    const first=!card.dataset.value;
    card.dataset.value=digit;
    if(first){top.textContent=bottom.textContent=flap.textContent=digit;return;}
    flap.textContent=top.textContent;
    top.textContent=digit;
    flap.classList.remove('play');
    void flap.offsetWidth;
    flap.classList.add('play');
    window.setTimeout(()=>{bottom.textContent=digit;},240);
  });
}
function renderPomoFocus(){
  const el=$('pomoFocus');if(!el)return;
  const list=state.tasks.filter(t=>t.status==='in-progress').sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt));
  if(!list.length){state.pomoTaskId=null;el.innerHTML='<span class="modal-kicker">Đang làm</span><p class="pomo-focus-empty">Chưa có task đang làm. Chuyển một task sang màu vàng để gắn vào phiên này.</p>';return;}
  if(!list.some(t=>t.id===state.pomoTaskId)) state.pomoTaskId=list[0].id;
  el.innerHTML=`<span class="modal-kicker">Đang làm</span><div class="pomo-focus-list">${list.map(t=>`<button type="button" class="pomo-focus-task ${t.id===state.pomoTaskId?'selected':''}" data-pomo-task="${escapeHtml(t.id)}"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(dueLabel(t))}</small></button>`).join('')}</div>`;
}
let pomoAudio;
let pomoBell;
let pomoWarmGen=0;
function pomoBellEl(){
  return $('pomoBellEl') || pomoBell;
}
function preparePomoAudio(){
  const bell=$('pomoBellEl') || pomoBell || new Audio('pomo-bell.mp3?v=22');
  pomoBell=bell;
  bell.preload='auto';
  bell.volume=1;
  const gen=++pomoWarmGen;
  bell.muted=true;
  const warm=bell.play();
  if(warm&&warm.then) warm.then(()=>{
    if(gen!==pomoWarmGen) return;
    bell.pause();
    bell.currentTime=0;
    bell.muted=false;
  }).catch(()=>{if(gen===pomoWarmGen) bell.muted=false;});
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx) return;
  if(!pomoAudio) pomoAudio=new Ctx();
  if(pomoAudio.state==='suspended') pomoAudio.resume();
}
function ringPomo(){
  pomoWarmGen++;
  try{
    const bell=pomoBellEl() || new Audio('pomo-bell.mp3?v=22');
    pomoBell=bell;
    bell.muted=false;
    bell.volume=1;
    try{bell.currentTime=0;}catch(_){}
    const playing=bell.play();
    if(playing&&playing.catch) playing.catch(error=>console.warn(error));
  }catch(error){console.warn(error);}
  if(window.pywebview?.api?.ring){
    window.pywebview.api.ring().catch(error=>console.warn(error));
  }
}
function pomoStageLabel(stage,index=pomoIndex){const total=pomoStages.filter(item=>item.kind==='study').length;const number=pomoStages.slice(0,index+1).filter(item=>item.kind==='study').length;if(stage.kind==='study')return `Phiên học ${number}/${total} · Tập trung`;return stage.long?`Nghỉ dài ${stage.minutes} phút`:`Nghỉ giải lao ${stage.minutes} phút`;}
function renderPomo(){renderNowClock();renderPomoFocus();renderPomoHistory();const stage=pomoStages[pomoIndex];if(!stage||!$('pomoStage'))return;$('pomoStage').textContent=pomoStageLabel(stage);const m=Math.floor(Math.max(0,pomoRemaining)/60),s=Math.max(0,pomoRemaining)%60;$('pomoClock').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;const pct=100*(1-pomoRemaining/(stage.minutes*60));if($('pomoProgress'))$('pomoProgress').style.width=`${pct}%`;if($('pomoRingFill'))$('pomoRingFill').style.strokeDashoffset=553*(1-pct/100);if($('pomoTimeline'))$('pomoTimeline').innerHTML=pomoStages.map((x,i)=>`<span class="pomo-step ${i===pomoIndex?'active':''}"><strong>${x.kind==='study'?'📚':'☕'}</strong>${x.kind==='study'?'Học':'Nghỉ'} ${x.minutes}p</span>`).join('');$('pomoStartBtn').textContent=pomoRunning?'Ⅱ Tạm dừng':'▶ Bắt đầu';$('pomoHint').textContent=pomoRunning?'Đang chạy — cứ tập trung vào một việc thôi.':(pomoRemaining===stage.minutes*60?'Bấm Bắt đầu khi m sẵn sàng.':'Đã tạm dừng. Khi sẵn sàng thì tiếp tục nhé.');}
function completeStudySession(){const stage=pomoStages[pomoIndex];if(!stage||stage.kind!=='study')return null;const focused=Math.max(0,stage.minutes*60-Math.max(0,pomoRemaining));if(focused<30&&pomoRemaining>0){pomoStudyStartedAt=0;return null;}const ended=new Date();const started=new Date(pomoStudyStartedAt||ended.getTime()-focused*1000);const task=state.tasks.find(item=>item.id===state.pomoTaskId);const session={id:uid(),date:dateKey(started),startedAt:started.toISOString(),endedAt:ended.toISOString(),minutes:Math.max(1,Math.round(focused/60)),taskId:task?.id||null,title:task?.title||'',note:''};const all=pomoSessions();all.push(session);savePomoSessions(all);pomoStudyStartedAt=0;openPomoNote(session.id);return session;}
function advancePomo(){const finished=pomoStages[pomoIndex];if(finished?.kind==='study')completeStudySession();pomoIndex+=1;if(pomoIndex>=pomoStages.length){pomoStages=buildPomoStages();pomoIndex=0;}pomoRemaining=pomoStages[pomoIndex].minutes*60;pomoStudyStartedAt=pomoRunning&&pomoStages[pomoIndex].kind==='study'?Date.now():0;renderPomo();const stage=pomoStages[pomoIndex];const title='Deadline Buddy · Pomodoro';const body=stage.kind==='study'?`Bắt đầu phiên học ${stage.minutes} phút.`:`Nghỉ ${stage.minutes} phút nhé.`;showToast(stage.kind==='study'?`Hết giờ nghỉ, bắt đầu học ${stage.minutes} phút nhé!`:`Đến giờ nghỉ ${stage.minutes} phút rồi!`);notifyUser(title,body,`pomo:${Date.now()}`).catch(()=>{});}
function pomoTick(){const now=Date.now();if(pomoLastTick){pomoRemaining-=Math.max(1,Math.floor((now-pomoLastTick)/1000));}pomoLastTick=now;if(pomoRemaining<=0){ringPomo();advancePomo();}else renderPomo();}
function togglePomo(){pomoRunning=!pomoRunning;if(pomoRunning){preparePomoAudio();if(pomoStages[pomoIndex].kind==='study'&&!pomoStudyStartedAt)pomoStudyStartedAt=Date.now();pomoLastTick=Date.now();pomoInterval=setInterval(pomoTick,1000);}else{clearInterval(pomoInterval);pomoInterval=null;pomoLastTick=0;}renderPomo();}
function resetPomo(){completeStudySession();clearInterval(pomoInterval);pomoInterval=null;pomoRunning=false;pomoStages=buildPomoStages();pomoIndex=0;pomoRemaining=pomoStages[0].minutes*60;pomoLastTick=0;pomoStudyStartedAt=0;renderPomo();}
function skipPomo(){advancePomo();if(pomoRunning)pomoLastTick=Date.now();}
function openPomoNote(id){const session=pomoSessions().find(item=>item.id===id);if(!session||!$('pomoNoteModal'))return;pomoNoteId=id;if($('pomoNoteHeading'))$('pomoNoteHeading').textContent=session.note?'Sửa ghi chú phiên':'Phiên vừa xong thế nào?';$('pomoNoteInput').value=session.note||'';openModal('pomoNoteModal');}
function savePomoNote(event){if(event?.preventDefault)event.preventDefault();const all=pomoSessions();const session=all.find(item=>item.id===pomoNoteId);if(!session){closeModal('pomoNoteModal');return;}session.note=$('pomoNoteInput').value.trim();savePomoSessions(all);closeModal('pomoNoteModal');renderPomoHistory();showToast('Đã lưu ghi chú.');}
function savePomoSetup(event){if(event?.preventDefault)event.preventDefault();const next={focus:clampPomo($('pomoFocusMin').value,1,180,DEFAULT_POMO.focus),short:clampPomo($('pomoShortMin').value,1,60,DEFAULT_POMO.short),long:clampPomo($('pomoLongMin').value,1,120,DEFAULT_POMO.long),rounds:clampPomo($('pomoRounds').value,1,8,DEFAULT_POMO.rounds)};writeLocal(POMO_SETTINGS_KEY,next);const fresh=!pomoRunning&&pomoIndex===0&&pomoRemaining===pomoStages[0].minutes*60&&!pomoStudyStartedAt;if(!fresh){showToast('Đã lưu giờ. Phiên hiện tại giữ nhịp cũ, bấm Đặt lại để dùng giờ mới.');return;}pomoStages=buildPomoStages(next);pomoRemaining=pomoStages[0].minutes*60;renderPomo();showToast('Đã lưu giờ Pomodoro.');}
function renderPomoHistory(){const grid=$('pomoHistGrid');if(!grid)return;const settings=pomoSettings();const editing=['pomoFocusMin','pomoShortMin','pomoLongMin','pomoRounds'].some(id=>document.activeElement===$(id));if(!editing){if($('pomoFocusMin'))$('pomoFocusMin').value=settings.focus;if($('pomoShortMin'))$('pomoShortMin').value=settings.short;if($('pomoLongMin'))$('pomoLongMin').value=settings.long;if($('pomoRounds'))$('pomoRounds').value=settings.rounds;}const cursor=new Date(state.pomoHistCursor.getFullYear(),state.pomoHistCursor.getMonth(),1);if($('pomoHistTitle'))$('pomoHistTitle').textContent=cursor.toLocaleDateString('vi-VN',{month:'long',year:'numeric'});const sessions=pomoSessions();const counts={};for(const session of sessions)counts[session.date]=(counts[session.date]||0)+1;const first=(cursor.getDay()+6)%7;const daysInMonth=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();const today=dateKey(new Date());const cells=[];for(let i=0;i<first;i++)cells.push('<span></span>');for(let day=1;day<=daysInMonth;day++){const key=dateKey(new Date(cursor.getFullYear(),cursor.getMonth(),day));const count=counts[key]||0;cells.push(`<button type="button" class="pomo-hist-daybtn ${key===state.pomoHistDate?'selected':''} ${key===today?'today':''} ${count?'has':''}" data-pomo-day="${key}"><strong>${day}</strong>${count?`<small>${count}</small>`:''}</button>`);}grid.innerHTML=cells.join('');const dayEl=$('pomoHistDay');if(!dayEl)return;const list=sessions.filter(session=>session.date===state.pomoHistDate).sort((a,b)=>a.startedAt.localeCompare(b.startedAt));const heading=new Date(`${state.pomoHistDate}T12:00:00`).toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long'});dayEl.innerHTML=list.length?`<h3>${escapeHtml(heading)}</h3>${list.map(session=>{const start=new Date(session.startedAt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});const end=new Date(session.endedAt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});return `<article class="pomo-session-card"><div><strong>${start} – ${end}</strong><span>${session.minutes} phút</span></div>${session.title?`<p>${escapeHtml(session.title)}</p>`:'<p>Không gắn task</p>'}${session.note?`<small>${escapeHtml(session.note)}</small>`:'<small>Chưa có ghi chú</small>'}<button type="button" class="secondary-button" data-pomo-note="${escapeHtml(session.id)}">Sửa ghi chú</button></article>`;}).join('')}`:`<h3>${escapeHtml(heading)}</h3><p class="pomo-focus-empty">Ngày này chưa có phiên tập trung.</p>`;}

function wireEvents() {
  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  document.querySelectorAll('.filter-chip').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(c=>c.classList.toggle('selected',c===b));render();}));
  $('addTaskBtn').addEventListener('click',()=>{resetTaskForm();openModal('taskModal');});$('emptyAddBtn').addEventListener('click',()=>{resetTaskForm();openModal('taskModal');});if($('dumpTaskBtn'))$('dumpTaskBtn').addEventListener('click',openDumpModal);if($('dumpForm'))$('dumpForm').addEventListener('submit',createDumpTasks);$('taskTitle').addEventListener('blur',fillFormFromTitle);$('taskForm').addEventListener('submit',handleSubmit);$('taskDue').addEventListener('change',updateReminderPreview);
  $('deleteTaskBtn').addEventListener('click',()=>{const id=$('taskId').value;const task=state.tasks.find(t=>t.id===id);if(task&&confirm(`Xóa task “${task.title}”?`)){removeTask(id);closeModal('taskModal');}});
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
  document.querySelectorAll('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal(backdrop.id);}));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeModal('taskModal');closeModal('settingsModal');closeModal('habitModal');closeModal('dumpModal');closeModal('pomoNoteModal');return;}
    const typing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
    if(typing||e.metaKey||e.ctrlKey||e.altKey) return;
    if((e.key==='n'||e.key==='N')&&!anyModalOpen()){e.preventDefault();resetTaskForm();openModal('taskModal');}
  });
  document.querySelectorAll('.scope-chip').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.scope)));
  $('calModes').addEventListener('click',e=>{const b=e.target.closest('[data-cal]');if(!b)return;state.calendarMode=b.dataset.cal;renderMonth();});
  $('calBoard').addEventListener('click',e=>{const day=e.target.closest('[data-cal-day]');if(day){state.monthSelectedDate=day.dataset.calDay;state.monthCursor=new Date(`${day.dataset.calDay}T12:00:00`);renderMonth();return;}const btn=e.target.closest('[data-month-edit]');if(btn){const task=state.tasks.find(t=>t.id===btn.dataset.monthEdit);if(task)editTask(task);}});
  if($('searchInput'))$('searchInput').addEventListener('input',e=>{state.query=e.target.value.trim();render();});$('sortSelect').addEventListener('change',e=>{state.sort=e.target.value;render();});
  $('taskList').addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(!target)return;const {action,id}=target.dataset;if(action==='edit'){const task=state.tasks.find(t=>t.id===id);if(task)editTask(task);}else if(action==='progress')adjustProgress(id);else if(action==='cycle-status'){const task=state.tasks.find(t=>t.id===id);if(!task)return;const next=taskStatusKey(task)==='not-started'?'in-progress':taskStatusKey(task)==='in-progress'?'done':'not-started';changeTaskStatus(id,next);}else if(action==='menu')taskMenu(id);});
  $('taskList').addEventListener('change',e=>{if(e.target.matches('[data-action="toggle"]'))toggleTask(e.target.dataset.id);else if(e.target.matches('[data-action="status"]'))changeTaskStatus(e.target.dataset.id,e.target.value);});
  $('weekStrip').addEventListener('click',e=>{const btn=e.target.closest('[data-day]');if(btn){state.selectedDate=btn.dataset.day;renderWeek();}});
  $('monthGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-month-day]');if(btn){state.monthSelectedDate=btn.dataset.monthDay;const d=new Date(`${btn.dataset.monthDay}T12:00:00`);state.monthCursor=new Date(d.getFullYear(),d.getMonth(),1);renderMonth();}});
  $('monthPrevBtn').addEventListener('click',()=>shiftCalendar(-1));
  $('monthNextBtn').addEventListener('click',()=>shiftCalendar(1));
  $('monthTodayBtn').addEventListener('click',()=>{const now=new Date();state.monthCursor=now;state.monthSelectedDate=dateKey(now);renderMonth();});
  $('addTaskOnDateBtn').addEventListener('click',()=>{resetTaskForm();const d=new Date(`${state.monthSelectedDate}T18:00:00`);$('taskDue').value=localDateTimeValue(d);updateReminderPreview();openModal('taskModal');});
  $('monthAgendaTasks').addEventListener('click',e=>{const btn=e.target.closest('[data-month-edit]');if(btn){const task=state.tasks.find(t=>t.id===btn.dataset.monthEdit);if(task)editTask(task);}});
  $('exportBtn').addEventListener('click',exportData);$('importBtn').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value='';});
  $('settingsBtn').addEventListener('click',openSettings);$('settingsTopBtn').addEventListener('click',openSettings);
  $('pomoFocus').addEventListener('click',e=>{const btn=e.target.closest('[data-pomo-task]');if(!btn)return;state.pomoTaskId=btn.dataset.pomoTask;renderPomoFocus();});
  $('pomoStartBtn').addEventListener('click',togglePomo);$('pomoResetBtn').addEventListener('click',resetPomo);$('pomoSkipBtn').addEventListener('click',skipPomo);if($('pomoBellBtn'))$('pomoBellBtn').addEventListener('click',()=>{ringPomo();showToast('Đang rung chuông…');});if($('pomoSetup'))$('pomoSetup').addEventListener('submit',savePomoSetup);if($('pomoNoteForm'))$('pomoNoteForm').addEventListener('submit',savePomoNote);if($('pomoHistPrev'))$('pomoHistPrev').addEventListener('click',()=>{const cursor=new Date(state.pomoHistCursor);cursor.setMonth(cursor.getMonth()-1);state.pomoHistCursor=cursor;renderPomoHistory();});if($('pomoHistNext'))$('pomoHistNext').addEventListener('click',()=>{const cursor=new Date(state.pomoHistCursor);cursor.setMonth(cursor.getMonth()+1);state.pomoHistCursor=cursor;renderPomoHistory();});if($('pomoHistGrid'))$('pomoHistGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-pomo-day]');if(!btn)return;state.pomoHistDate=btn.dataset.pomoDay;state.pomoHistCursor=new Date(`${btn.dataset.pomoDay}T12:00:00`);renderPomoHistory();});if($('pomoHistDay'))$('pomoHistDay').addEventListener('click',e=>{const btn=e.target.closest('[data-pomo-note]');if(btn)openPomoNote(btn.dataset.pomoNote);});if($('viewRulesBtn'))$('viewRulesBtn').addEventListener('click',openSettings);$('saveSettingsBtn').addEventListener('click',saveSettings);$('syncNowBtn').addEventListener('click',()=>{const url=($('syncUrlInput').value||'').trim().replace(/\/$/,'');localStorage.setItem(SYNC_URL_KEY,url);syncNow(true);});$('notificationBtn').addEventListener('click',requestNotifications);
  $('moodEmojiRow').addEventListener('click',e=>{const b=e.target.closest('[data-mood]');if(!b)return;state.selectedMood=b.dataset.mood;document.querySelectorAll('.mood-emoji-btn').forEach(x=>x.classList.toggle('selected',x===b));});
  $('saveMoodBtn').addEventListener('click',()=>{if(!state.selectedMood&&!moods()[dateKey(new Date())]?.mood){showToast('Chọn một biểu tượng cảm xúc trước nhé.');return;}const all=moods();all[dateKey(new Date())]={mood:state.selectedMood||all[dateKey(new Date())].mood,note:$('moodNote').value.trim(),updatedAt:new Date().toISOString()};writeLocal(MOOD_KEY,all);state.selectedMood=all[dateKey(new Date())].mood;renderMood();showToast('Đã lưu tâm trạng hôm nay 💗');scheduleSync();});
  $('moodSpan').addEventListener('click',e=>{const b=e.target.closest('[data-mood-span]');if(!b)return;state.moodSpan=b.dataset.moodSpan;state.moodCursor=new Date();renderMood();});
  $('moodPrevBtn').addEventListener('click',()=>shiftMood(-1));
  $('moodNextBtn').addEventListener('click',()=>shiftMood(1));
  $('addHabitBtn').addEventListener('click',()=>{ $('habitForm').reset();state.selectedHabitIcon='💪';state.selectedHabitColor='#1d4ed8';document.querySelectorAll('.habit-icon-opt').forEach(b=>b.classList.toggle('selected',b.dataset.icon===state.selectedHabitIcon));document.querySelectorAll('.habit-color-opt').forEach(b=>b.classList.toggle('selected',b.dataset.color===state.selectedHabitColor));openModal('habitModal');});
  $('habitIconPicker').addEventListener('click',e=>{const b=e.target.closest('[data-icon]');if(!b)return;state.selectedHabitIcon=b.dataset.icon;document.querySelectorAll('.habit-icon-opt').forEach(x=>x.classList.toggle('selected',x===b));});
  $('habitColorPicker').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(!b)return;state.selectedHabitColor=b.dataset.color;document.querySelectorAll('.habit-color-opt').forEach(x=>x.classList.toggle('selected',x===b));});
  $('habitPrevBtn').addEventListener('click',()=>{const d=new Date(state.habitCursor);d.setMonth(d.getMonth()-1);state.habitCursor=d;renderHabits();});
  $('habitNextBtn').addEventListener('click',()=>{const d=new Date(state.habitCursor);d.setMonth(d.getMonth()+1);state.habitCursor=d;renderHabits();});
  $('habitForm').addEventListener('submit',e=>{e.preventDefault();const name=$('habitName').value.trim();if(!name)return;const all=habits();all.push({id:uid(),name,icon:state.selectedHabitIcon,color:state.selectedHabitColor,doneDates:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});writeLocal(HABIT_KEY,all);closeModal('habitModal');renderHabits();showToast('Đã thêm thói quen mới ✨');scheduleSync();});
  $('habitList').addEventListener('click',e=>{const toggle=e.target.closest('[data-habit-toggle]');const del=e.target.closest('[data-habit-delete]');if(toggle){const all=habits(),h=all.find(x=>x.id===toggle.dataset.habitToggle);if(!h)return;h.doneDates=h.doneDates||[];const today=dateKey(new Date());h.doneDates=h.doneDates.includes(today)?h.doneDates.filter(x=>x!==today):[...h.doneDates,today];h.updatedAt=new Date().toISOString();writeLocal(HABIT_KEY,all);renderHabits();showToast(h.doneDates.includes(today)?'Đã đánh dấu hoàn thành hôm nay!':'Đã bỏ đánh dấu hôm nay.');scheduleSync();}else if(del&&confirm('Xóa thói quen này?')){const deleted=readLocal('deadline-buddy-deleted-habits',{});deleted[del.dataset.habitDelete]=new Date().toISOString();writeLocal('deadline-buddy-deleted-habits',deleted);writeLocal(HABIT_KEY,habits().filter(h=>h.id!==del.dataset.habitDelete));renderHabits();showToast('Đã xóa thói quen.');scheduleSync();}});
  document.querySelectorAll('[data-theme-pick]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.themePick);$('themeDropdown').hidden=true;showToast('Đã đổi giao diện.');}));
  $('themeBtn').addEventListener('click',e=>{e.stopPropagation();$('themeDropdown').hidden=!$('themeDropdown').hidden;});document.addEventListener('click',e=>{if(!e.target.closest('.theme-picker-wrap'))$('themeDropdown').hidden=true;});
  const refreshVisibleReminders=async()=>{await catchUpMissedDigests();await scheduleVisibleReminders();};
  window.addEventListener('focus',refreshVisibleReminders);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshVisibleReminders();});
}
function seedIfEmpty() {
  if(state.tasks.length)return;
  const now=new Date();const due=new Date(now);due.setDate(due.getDate()+4);due.setHours(23,0,0,0);
  const seed=[{id:uid(),title:'BTVN — Giải tích',category:'Giải tích',dueAt:due.toISOString(),priority:'high',estimate:120,notes:'Bắt đầu bằng cách đọc đề và làm câu đầu tiên trong 5 phút.',status:'not-started',progress:0,createdAt:now.toISOString(),updatedAt:now.toISOString()},{id:uid(),title:'Ôn tập Toán rời rạc',category:'Toán rời rạc',dueAt:new Date(now.getTime()+2*86400000).toISOString(),priority:'medium',estimate:60,notes:'',status:'in-progress',progress:25,createdAt:now.toISOString(),updatedAt:now.toISOString()}];
  // Chỉ tạo dữ liệu mẫu trong lần chạy đầu để minh họa; người dùng có thể xóa ngay.
  state.tasks=seed;
}
async function start() {
  $('todayDate').textContent=formatDayHeading(new Date());
  applyTheme(localStorage.getItem('deadline-buddy-theme')||'light');
  wireEvents();
  await initStorage();
  if(!syncUrl() && (location.hostname==='127.0.0.1' || location.hostname==='localhost')) localStorage.setItem(SYNC_URL_KEY, location.origin);
  await prepareSync();
  await restoreSavedTasks();
  if(!state.tasks.length){seedIfEmpty();for(const task of state.tasks)await dbPutIfAvailable(task);render();}
  const desktopHost=location.hostname==='127.0.0.1'||location.hostname==='localhost'||!!window.pywebview;
  if('serviceWorker' in navigator){
    if(desktopHost) navigator.serviceWorker.getRegistrations().then(regs=>regs.forEach(reg=>reg.unregister())).catch(()=>{});
    else if(location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Service worker registration failed',err));
  }
  enableDesktopNotifications();
  if(!window.pywebview?.api?.notify)window.addEventListener('pywebviewready',async()=>{enableDesktopNotifications();await catchUpMissedDigests();await scheduleVisibleReminders();},{once:true});
  await catchUpMissedDigests();
  await scheduleVisibleReminders();
  setInterval(scheduleVisibleReminders,60000);
  setInterval(renderNowClock,1000);
  if(nativeNotifications())nativeNotifications().checkPermissions().then(perm=>{if(perm.display==='granted')scheduleNativeReminders();}).catch(()=>{});
  setInterval(()=>syncNow(false),20000);
}
async function dbPutIfAvailable(task) { try{if(state.db)await dbPut(task);else localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks));}catch{localStorage.setItem(LEGACY_KEY,JSON.stringify(state.tasks));} }
start();
