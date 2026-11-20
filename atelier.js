const ATELIER_KEY = 'deadline-buddy-atelier';
let atelierTab = 'today';
let atelierCat = null;
let atelierArmed = false;

function emptyAtelier() {
  return {
    stock: {},
    keycaps: [],
    days: [],
    draft: { deepMinutes: 0, reading: false, lowScroll: false, todos: 0 },
    bonus: { streak35: 0, streak40: 0, claimed3: false, claimed5: false, claimed7: false },
    pity: { sinceEpic: 0, sinceLegendary: 0 },
    setup: {
      deskId: null, chairId: null,
      pc: { caseId: null, motherboardId: null, cpuId: null, gpuId: null, ramId: null, storageId: null, psuId: null, coolerId: null, fanId: null, pasteId: null, riserId: null, bracketId: null, hubId: null, sleeveId: null, soundCardId: null, nicId: null, opticalId: null, cpuBlockId: null, gpuBlockId: null, pumpId: null, radiatorId: null, tubeId: null },
      armId: null, monitorIds: [null, null], kbCaseId: null, kbPcbId: null, kbPlateId: null,
      mouseId: null, mousepadId: null, wristId: null, webcamId: null, micId: null, dockId: null, standId: null,
      headphoneId: null, iemId: null, dacId: null, cableId: null, tipsId: null, audioMode: 'none',
      speakerIds: [], lightIds: [], mechaKitId: null
    },
    pending: [],
    reveal: null,
    updatedAt: null
  };
}

function atelierState() {
  const saved = readLocal(ATELIER_KEY, null);
  const base = emptyAtelier();
  if (!saved || typeof saved !== 'object') return base;
  const setup = { ...base.setup, ...(saved.setup || {}) };
  setup.pc = { ...base.setup.pc, ...((saved.setup && saved.setup.pc) || {}) };
  setup.monitorIds = (saved.setup && saved.setup.monitorIds) || base.setup.monitorIds;
  setup.speakerIds = (saved.setup && saved.setup.speakerIds) || [];
  setup.lightIds = (saved.setup && saved.setup.lightIds) || [];
  return {
    ...base,
    ...saved,
    stock: saved.stock || {},
    keycaps: Array.isArray(saved.keycaps) ? saved.keycaps : [],
    days: Array.isArray(saved.days) ? saved.days : [],
    pending: Array.isArray(saved.pending) ? saved.pending : [],
    bonus: { ...base.bonus, ...(saved.bonus || {}) },
    pity: { ...base.pity, ...(saved.pity || {}) },
    setup,
    draft: { ...base.draft, ...(saved.draft || {}) }
  };
}

function writeAtelier(bag) {
  bag.updatedAt = new Date().toISOString();
  writeLocal(ATELIER_KEY, bag);
  if (typeof scheduleSync === 'function') scheduleSync();
}

function atelierSnapshot() { return atelierState(); }
function applyAtelierSnapshot(data) {
  if (!data || typeof data !== 'object') return;
  writeLocal(ATELIER_KEY, data);
  if (document.body.dataset.screen === 'atelier') renderAtelier();
}

function atelierLiveDraft(bag) {
  const today = dateKey(new Date());
  const minutes = (typeof pomoSessions === 'function' ? pomoSessions() : []).filter(session => session.date === today).reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
  const todos = (state.tasks || []).filter(task => task.priority === 'high' && task.status === 'done' && task.completedAt && dateKey(task.completedAt) === today).length;
  return { deepMinutes: minutes, reading: !!bag.draft.reading, lowScroll: !!bag.draft.lowScroll, todos };
}

function atelierAbsorb(bag, tiers) {
  const L = AtelierLib;
  let stock = { ...bag.stock };
  let keycaps = bag.keycaps.map(cap => ({ ...cap }));
  let setup = bag.setup;
  let pity = { ...bag.pity };
  const reveal = [];
  const gained = [];
  for (const tier of tiers) {
    const rolled = L.rollChest(tier, pity, Math.random);
    pity = rolled.pity;
    reveal.push(...rolled.drops);
    for (const drop of rolled.drops) {
      if (drop.kind === 'item') {
        stock[drop.itemId] = (stock[drop.itemId] || 0) + drop.qty;
        gained.push(drop.itemId);
      } else keycaps = L.mergeCaps(keycaps, drop.caps);
    }
  }
  setup = L.applyAutoEquip(setup, stock, gained);
  return { ...bag, stock, keycaps, setup, pity, reveal, pending: [] };
}

function atelierLockDay() {
  const bag = atelierState();
  const today = dateKey(new Date());
  if (bag.days.some(day => day.date === today)) return;
  const draft = atelierLiveDraft(bag);
  const points = AtelierLib.scoreDraft(draft);
  const base = AtelierLib.chestsForPoints(points, Math.random);
  const streak = AtelierLib.applyStreak(bag.bonus, points);
  const chests = ['common', ...base, ...streak.chests];
  bag.days = [...bag.days, { ...draft, date: today, points, chests }];
  bag.pending = [...bag.pending, ...chests];
  bag.bonus = streak.bonus;
  bag.draft = { deepMinutes: 0, reading: false, lowScroll: false, todos: 0 };
  writeAtelier(bag);
  renderAtelier();
  showToast(`Đã chốt ngày, ${points} điểm, ${chests.length} rương.`);
}

function atelierOpen(all) {
  const bag = atelierState();
  if (!bag.pending.length) return;
  const tiers = all ? bag.pending : [bag.pending[0]];
  const next = atelierAbsorb({ ...bag, pending: [] }, tiers);
  if (!all) next.pending = bag.pending.slice(1);
  writeAtelier(next);
  renderAtelier();
}

function atelierItemMeta(item) {
  const L = AtelierLib;
  const bits = [L.RARITY_LABEL[item.rarity]];
  if (item.layout) bits.push(L.LAYOUT_LABEL[item.layout]);
  if (item.kbKind) bits.push(L.KIND_LABEL[item.kbKind]);
  if (item.caseMaterial) bits.push(L.CASE_MATERIAL_LABEL[item.caseMaterial]);
  if (item.feel) bits.push(L.FEEL_LABEL[item.feel]);
  if (item.sound) bits.push(L.SOUND_LABEL[item.sound]);
  if (item.price) bits.push(L.formatPrice(item.price));
  return bits.join(' · ');
}

function atelierOwned(stock, category) {
  return AtelierLib.itemsIn(category).filter(item => (stock[item.id] || 0) > 0);
}

function atelierPick(label, items, selected, slot, stock) {
  const on = item => Array.isArray(selected) ? selected.includes(item.id) : selected === item.id;
  const buttons = items.map(item => `<button type="button" class="atelier-chip ${on(item) ? 'selected' : ''}" data-atelier-pick="${escapeHtml(slot)}" data-atelier-id="${escapeHtml(item.id)}"><strong>${escapeHtml(item.name)}</strong><small class="rarity-${item.rarity}">${escapeHtml(atelierItemMeta(item))} · ${stock[item.id] || 0}</small></button>`).join('');
  return `<div class="atelier-pick"><p>${escapeHtml(label)}</p>${items.length ? `<div class="atelier-chips">${buttons}</div>` : '<p class="atelier-muted">Chưa có trong kho.</p>'}</div>`;
}

function atelierKeyGrid(layout, size) {
  const cover = AtelierLib.coverKeys(layout, atelierState().keycaps);
  const wide = new Set(['bspc', 'tab', 'caps', 'enter', 'lshift', 'rshift', '\\']);
  return `<div class="keygrid ${size === 'md' ? 'keygrid-md' : ''}">${AtelierLib.LAYOUT_ROWS[layout].map(row => `<div class="keygrid-row">${row.map(key => {
    if (key === 'gap') return '<span class="key-gap"></span>';
    const cap = cover.filled[key];
    const cls = key === 'space' ? 'key-space' : wide.has(key) ? 'key-wide' : '';
    return `<span class="keycap ${cls}" style="background:${cap ? cap.color : '#3a342b'}" title="${escapeHtml(key)}"></span>`;
  }).join('')}</div>`).join('')}</div>`;
}

function atelierScene(bag) {
  const L = AtelierLib;
  const setup = bag.setup;
  const desk = L.getItem(setup.deskId);
  const chair = L.getItem(setup.chairId);
  const arm = L.getItem(setup.armId);
  const slots = L.monitorSlots(setup.armId);
  const screens = setup.monitorIds.filter((id, index) => id && index < slots);
  const tower = L.getItem(setup.pc.caseId);
  const kb = L.getItem(setup.kbCaseId);
  const mouse = L.getItem(setup.mouseId);
  const pad = L.getItem(setup.mousepadId);
  const cam = L.getItem(setup.webcamId);
  const mic = L.getItem(setup.micId);
  const stand = L.getItem(setup.standId);
  const kit = L.KITS.find(entry => entry.id === setup.mechaKitId);
  const showKit = kit && L.kitComplete(kit.id, bag.stock);
  const lights = setup.lightIds.map(id => L.getItem(id)).filter(Boolean);
  const speakers = setup.speakerIds.map(id => L.getItem(id)).filter(Boolean);
  const pair = speakers.find(item => item.speakerKind === 'pair');
  const singles = speakers.filter(item => item.speakerKind === 'single');
  const ears = setup.audioMode === 'headphone' ? L.getItem(setup.headphoneId) : setup.audioMode === 'iem' && L.iemReady(setup) ? L.getItem(setup.iemId) : null;
  const deskCls = ['scene-desk', !desk ? 'scene-desk-ghost' : '', desk && desk.deskShape === 'l' ? 'scene-desk-l' : '', desk && desk.deskShape === 'u' ? 'scene-desk-u' : '', desk && desk.deskShape === 'k' ? 'scene-desk-k' : ''].filter(Boolean).join(' ');
  const monitors = screens.map(id => {
    const item = L.getItem(id);
    if (!item) return '';
    const width = item.sizeIn === 32 ? 'mon-32' : item.sizeIn === 27 ? 'mon-27' : 'mon-24';
    return `<div class="monitor ${width} ${item.curve === 'curved' ? 'monitor-curved' : ''}"><span>${escapeHtml(item.res || '')}</span><small>${item.sizeIn || ''}</small></div>`;
  }).join('');
  return `<div class="scene" aria-label="Góc setup">
    <div class="scene-wall"></div><div class="scene-floor"></div>
    ${lights.some(item => item.lightKind === 'bias') ? '<div class="scene-bias"></div>' : ''}
    ${lights.some(item => item.lightKind === 'desk') ? '<div class="scene-glow"></div>' : ''}
    ${lights.some(item => item.lightKind === 'monitor') && screens.length ? '<div class="scene-bar"></div>' : ''}
    <div class="scene-shelf"></div>
    ${showKit ? `<div class="scene-mecha" title="${escapeHtml(kit.name)}"><i style="background:${kit.tone}"></i><b style="background:${kit.tone}"></b></div>` : ''}
    ${arm ? `<div class="scene-arm ${arm.armKind === 'dual' ? 'scene-arm-dual' : ''}"></div>` : ''}
    ${screens.length && cam ? `<span class="scene-cam" title="${escapeHtml(cam.name)}"></span>` : ''}
    ${screens.length ? `<div class="scene-screens">${monitors}</div>` : ''}
    ${(pair || singles.length) ? `<div class="scene-speakers">${pair ? `<i style="background:${pair.tone}"></i><i style="background:${pair.tone}"></i>` : singles.map(item => `<i style="background:${item.tone}"></i>`).join('')}</div>` : ''}
    <div class="${deskCls}">${desk && desk.deskShape === 'k' ? '<i></i><i></i>' : ''}</div>
    ${pad ? `<span class="scene-pad" style="background:${pad.tone}" title="${escapeHtml(pad.name)}"></span>` : ''}
    ${kb && kb.layout ? `<div class="scene-kb">${atelierKeyGrid(kb.layout, 'sm')}</div>` : ''}
    ${mouse ? `<span class="scene-mouse" style="background:${mouse.tone}"></span>` : ''}
    ${mic ? `<span class="scene-mic" style="background:${mic.tone}" title="${escapeHtml(mic.name)}"></span>` : ''}
    ${stand ? `<span class="scene-stand" style="background:${stand.tone}" title="${escapeHtml(stand.name)}"></span>` : ''}
    ${ears ? `<span class="scene-audio"><i style="background:${ears.tone}"></i><i style="background:${ears.tone}"></i></span>` : ''}
    ${tower ? `<span class="scene-tower ${L.pcComplete(setup) ? 'is-on' : ''}" style="background:${tower.tone}" title="${escapeHtml(tower.name)}"></span>` : ''}
    ${chair ? `<span class="scene-chair"><i class="${chair.chairKind === 'plastic' ? 'chair-low' : 'chair-high'}" style="background:${chair.tone}"></i><b style="background:${chair.tone}"></b></span>` : ''}
  </div>`;
}

function atelierTodayHtml(bag) {
  const L = AtelierLib;
  const today = dateKey(new Date());
  const locked = bag.days.find(day => day.date === today);
  const draft = locked || atelierLiveDraft(bag);
  const points = locked ? locked.points : L.scoreDraft(draft);
  const hint = L.deepPoints(draft.deepMinutes) === 0 ? 'Dưới 25 phút chưa có điểm. Mỗi 25 phút +10.' : `+${L.deepPoints(draft.deepMinutes)} điểm tập trung`;
  const chestLine = locked ? `Rương điểm danh: thường${locked.chests.length > 1 ? ` · thêm: ${locked.chests.slice(1).map(tier => L.RARITY_LABEL[tier].toLowerCase()).join(', ')}` : ''}` : 'Chưa chốt. Luôn có 1 rương điểm danh, rương thêm theo điểm và chuỗi.';
  return `<section class="atelier-score">
      <p>${locked ? 'Đã chốt hôm nay' : 'Điểm chưa chốt'}</p>
      <strong>${points}</strong>
      <p>${chestLine}</p>
      <div class="atelier-meters">
        <div><small>Chuỗi ≥ 35</small><b>${bag.bonus.streak35}</b><small>3 ngày +thường · 7 ngày +sử thi</small></div>
        <div><small>Chuỗi ≥ 40</small><b>${bag.bonus.streak40}</b><small>5 ngày +hiếm</small></div>
        <div><small>Còn tới bảo hiểm sử thi</small><b>${Math.max(0, 10 - bag.pity.sinceEpic)}</b><small>Sau 10 rương trượt</small></div>
        <div><small>Còn tới bảo hiểm huyền thoại</small><b>${Math.max(0, 20 - bag.pity.sinceLegendary)}</b><small>Sau 20 rương trượt</small></div>
      </div>
    </section>
    <section class="atelier-block">
      <h3>Hôm nay lấy từ việc đang làm</h3>
      <p>Tập trung ${draft.deepMinutes} phút · ${hint}</p>
      <p>Việc ưu tiên cao đã xong hôm nay: ${draft.todos} · +${draft.todos * 10}</p>
      <button type="button" class="atelier-toggle ${draft.reading ? 'on' : ''}" data-atelier-flag="reading" ${locked ? 'disabled' : ''}>Đọc sách <span>${draft.reading ? 'Có · +10' : 'Không · +10'}</span></button>
      <button type="button" class="atelier-toggle ${draft.lowScroll ? 'on' : ''}" data-atelier-flag="lowScroll" ${locked ? 'disabled' : ''}>Ít lướt <span>${draft.lowScroll ? 'Có · +5' : 'Không · +5'}</span></button>
      ${locked ? `<div class="atelier-actions">${bag.pending.length ? `<button type="button" class="primary-button" data-atelier-open="one">Mở 1 rương</button>` : '<p class="atelier-muted">Hết rương đang chờ.</p>'}${bag.pending.length > 1 ? `<button type="button" class="secondary-button" data-atelier-open="all">Mở hết (${bag.pending.length})</button>` : ''}</div>` : `<button type="button" class="primary-button" data-atelier-lock>Chốt ngày</button>`}
    </section>
    <details class="atelier-rules"><summary>Luật chơi</summary>
      <p>Mỗi ngày chốt một lần. Dưới 25 phút tập trung không tính. Từ 25 phút, mỗi 25 phút +10, không trần. Mỗi task ưu tiên cao vừa chuyển sang đã làm trong hôm nay +10. Đọc +10, ít lướt +5.</p>
      <p>25–34 điểm có 30% thêm rương thường. 35 chắc một rương thường. 45 thêm 40% rương hiếm. 55 một rương hiếm. 70 một rương sử thi, rồi mỗi +30 điểm thêm một rương sử thi.</p>
      <p>Arm đơn một màn, arm đôi hai màn. Case phím cơ và HE là hai loại. IEM cần đủ thân, DAC, dây, eartips. Mô hình đủ 8 mảnh mới lên kệ.</p>
    </details>
    <button type="button" class="atelier-reset" data-atelier-reset>${atelierArmed ? 'Bấm lần nữa để xoá kho' : 'Xoá dữ liệu xưởng'}</button>`;
}

function atelierDeskHtml(bag) {
  const L = AtelierLib;
  const setup = bag.setup;
  const slots = L.monitorSlots(setup.armId);
  const notes = [];
  if (!setup.deskId) notes.push('Chưa có bàn.');
  if (!setup.armId) notes.push('Chưa có arm, màn chưa gắn được.');
  else if (slots === 1) notes.push('Arm đơn: chỉ một màn.');
  if (setup.audioMode === 'iem' && !L.iemReady(setup)) notes.push('IEM còn thiếu DAC, dây hoặc eartips.');
  const kb = L.getItem(setup.kbCaseId);
  if (kb && kb.layout) {
    const sw = L.bestSwitch(kb.layout, bag.stock, kb.kbKind || 'mechanical');
    const caps = L.coverKeys(kb.layout, bag.keycaps);
    notes.push(`Switch cùng loại ${sw.have}/${sw.need}. Keycap lắp ${Object.keys(caps.filled).length}/${caps.keys.length}.`);
  }
  const kit = L.KITS.find(entry => entry.id === setup.mechaKitId);
  if (kit && !L.kitComplete(kit.id, bag.stock)) notes.push(`${kit.name} chưa đủ mảnh.`);
  if (L.pcComplete(setup)) notes.push('PC đã đủ bộ chính.');
  return `${atelierScene(bag)}<ul class="atelier-notes">${notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul>`;
}

function atelierShopHtml(bag) {
  const L = AtelierLib;
  const setup = bag.setup;
  const stock = bag.stock;
  const slots = L.monitorSlots(setup.armId);
  const caseItem = L.getItem(setup.kbCaseId);
  const caseLayout = caseItem && caseItem.layout;
  const caseKind = (caseItem && caseItem.kbKind) || 'mechanical';
  const pcbs = atelierOwned(stock, 'kb_pcb').filter(item => (!caseLayout || item.layout === caseLayout) && (!caseItem || item.kbKind === caseKind));
  const plates = atelierOwned(stock, 'plate').filter(item => !caseLayout || item.layout === caseLayout);
  const grades = [...new Set(L.KITS.map(kit => kit.brand))];
  const mecha = grades.map(grade => `<section><h4>${escapeHtml(grade)}</h4>${L.KITS.filter(kit => kit.brand === grade).map(kit => {
    const parts = L.kitParts(kit.id);
    const have = parts.filter(part => (stock[part.id] || 0) > 0).length;
    const done = have === parts.length;
    return `<button type="button" class="atelier-chip ${setup.mechaKitId === kit.id ? 'selected' : ''}" data-atelier-mecha="${escapeHtml(kit.id)}" ${done ? '' : 'disabled'}><strong>${escapeHtml(kit.name)}</strong><small>${L.formatPrice(kit.price)} · ${have}/8 mảnh ${done ? '· trưng được' : '· chưa đủ'}</small></button>`;
  }).join('')}</section>`).join('');
  const kbNote = caseLayout ? `${atelierKeyGrid(caseLayout, 'md')}<p class="atelier-muted">${escapeHtml(L.LAYOUT_LABEL[caseLayout])} · ${escapeHtml(L.KIND_LABEL[caseKind])} · switch ${L.bestSwitch(caseLayout, stock, caseKind).have}/${L.bestSwitch(caseLayout, stock, caseKind).need}</p>` : '';
  return `<section class="atelier-block"><h3>Bàn và ghế</h3>${atelierPick('Bàn', atelierOwned(stock, 'desk'), setup.deskId, 'deskId', stock)}${atelierPick('Ghế', atelierOwned(stock, 'chair'), setup.chairId, 'chairId', stock)}</section>
    <section class="atelier-block"><h3>Mặt bàn</h3>${atelierPick('Lót chuột', atelierOwned(stock, 'mousepad'), setup.mousepadId, 'mousepadId', stock)}${atelierPick('Kê tay', atelierOwned(stock, 'wrist'), setup.wristId, 'wristId', stock)}${atelierPick('Webcam', atelierOwned(stock, 'webcam'), setup.webcamId, 'webcamId', stock)}${atelierPick('Mic', atelierOwned(stock, 'mic'), setup.micId, 'micId', stock)}${atelierPick('Dock', atelierOwned(stock, 'dock'), setup.dockId, 'dockId', stock)}${atelierPick('Chân tai', atelierOwned(stock, 'stand'), setup.standId, 'standId', stock)}</section>
    <section class="atelier-block"><h3>Màn hình</h3><p class="atelier-muted">${slots === 0 ? 'Cần arm trước.' : slots === 1 ? 'Arm này gắn được một màn.' : 'Arm đôi gắn được hai màn.'}</p>${atelierPick('Arm', atelierOwned(stock, 'arm'), setup.armId, 'armId', stock)}${atelierPick('Màn trái', atelierOwned(stock, 'monitor'), setup.monitorIds[0], 'monitor:0', stock)}${slots === 2 ? atelierPick('Màn phải', atelierOwned(stock, 'monitor'), setup.monitorIds[1], 'monitor:1', stock) : ''}</section>
    <section class="atelier-block"><h3>PC</h3>${L.PC_FIELDS.map(field => atelierPick(field.required ? field.label : `${field.label} (tuỳ)`, atelierOwned(stock, field.category), setup.pc[field.key], `pc:${field.key}`, stock)).join('')}<p class="${L.pcComplete(setup) ? 'atelier-good' : 'atelier-muted'}">${L.pcComplete(setup) ? 'Đủ bộ để bật thùng.' : 'Còn thiếu linh kiện chính.'}</p></section>
    <section class="atelier-block"><h3>Bàn phím</h3>${atelierPick('Case', atelierOwned(stock, 'kb_case'), setup.kbCaseId, 'kbCaseId', stock)}${atelierPick('Mạch cùng loại và layout', pcbs, setup.kbPcbId, 'kbPcbId', stock)}${atelierPick('Plate cùng layout', plates, setup.kbPlateId, 'kbPlateId', stock)}${kbNote}</section>
    <section class="atelier-block"><h3>Chuột, tai, loa, đèn</h3>${atelierPick('Chuột', atelierOwned(stock, 'mouse'), setup.mouseId, 'mouseId', stock)}
      <div class="atelier-actions">${['none', 'headphone', 'iem'].map(mode => `<button type="button" class="secondary-button ${setup.audioMode === mode ? 'selected' : ''}" data-atelier-audio="${mode}">${mode === 'none' ? 'Không đeo' : mode === 'headphone' ? 'Headphone' : 'IEM'}</button>`).join('')}</div>
      ${atelierPick('Headphone', atelierOwned(stock, 'headphone'), setup.headphoneId, 'headphoneId', stock)}${atelierPick('IEM', atelierOwned(stock, 'iem'), setup.iemId, 'iemId', stock)}${atelierPick('DAC', atelierOwned(stock, 'dac'), setup.dacId, 'dacId', stock)}${atelierPick('Dây', atelierOwned(stock, 'cable'), setup.cableId, 'cableId', stock)}${atelierPick('Eartips', atelierOwned(stock, 'eartips'), setup.tipsId, 'tipsId', stock)}
      <p class="atelier-muted">${L.iemReady(setup) ? 'Bộ IEM đã đủ.' : 'IEM cần đủ thân, DAC, dây, eartips.'}</p>
      ${atelierPick('Loa', atelierOwned(stock, 'speaker'), setup.speakerIds, 'speaker', stock).replaceAll('data-atelier-pick="speaker"', 'data-atelier-speaker="1"')}
      ${atelierPick('Đèn', atelierOwned(stock, 'light'), setup.lightIds, 'light', stock).replaceAll('data-atelier-pick="light"', 'data-atelier-light="1"')}
    </section>
    <section class="atelier-block"><h3>Mô hình</h3><p class="atelier-muted">Robot lắp ráp. Đủ đầu, thân, hai tay, hai chân, lưng và vũ khí mới trưng được.</p>${mecha}</section>`;
}

function atelierBagHtml(bag) {
  const L = AtelierLib;
  const groups = [
    { title: 'Bàn và ghế', cats: ['desk', 'chair'] },
    { title: 'Mặt bàn', cats: ['mousepad', 'wrist', 'webcam', 'mic', 'dock', 'stand'] },
    { title: 'Màn, arm, đèn, loa', cats: ['monitor', 'arm', 'light', 'speaker'] },
    { title: 'PC', cats: L.PC_FIELDS.map(field => field.category) },
    { title: 'Bàn phím', cats: ['kb_case', 'kb_pcb', 'plate', 'switch'] },
    { title: 'Chuột và tai nghe', cats: ['mouse', 'headphone', 'iem', 'dac', 'cable', 'eartips'] },
    { title: 'Mô hình', cats: ['mecha_part'] }
  ];
  const caps = new Map();
  for (const cap of bag.keycaps) {
    const sig = `${cap.color}|${cap.shine}|${cap.legend}`;
    const color = (L.CAP_COLORS.find(entry => entry.hex === cap.color) || {}).label || 'Màu lạ';
    const row = caps.get(sig) || { label: `${color}${cap.shine ? ' · xuyên LED' : ''}${cap.legend === 'north' ? ' · north-facing' : ' · nhìn trên'}`, qty: 0 };
    row.qty += cap.qty;
    caps.set(sig, row);
  }
  const lists = groups.map(group => {
    const items = group.cats.flatMap(cat => L.itemsIn(cat).filter(item => (bag.stock[item.id] || 0) > 0));
    if (!items.length) return '';
    return `<section class="atelier-block"><h3>${group.title}</h3><ul class="atelier-list">${items.map(item => `<li><span><strong>${escapeHtml(item.name)}</strong><small class="rarity-${item.rarity}">${escapeHtml(atelierItemMeta(item))}</small></span><b>${bag.stock[item.id]}</b></li>`).join('')}</ul></section>`;
  }).join('');
  const capList = caps.size ? `<ul class="atelier-list">${[...caps.values()].map(row => `<li><span>${escapeHtml(row.label)}</span><b>${row.qty}</b></li>`).join('')}</ul>` : '<p class="atelier-muted">Chưa rơi phím nào.</p>';
  return `${lists}<section class="atelier-block"><h3>Keycap</h3>${capList}</section>`;
}

function atelierCodexHtml(bag) {
  const L = AtelierLib;
  if (atelierCat) {
    const items = L.itemsIn(atelierCat);
    const have = items.filter(item => (bag.stock[item.id] || 0) > 0).sort((a, b) => (a.price || 0) - (b.price || 0));
    const missing = items.filter(item => !(bag.stock[item.id] || 0)).sort((a, b) => (a.price || 0) - (b.price || 0));
    const row = (item, gone) => `<li class="${gone ? 'is-missing' : ''}"><span><strong>${escapeHtml(item.name)}</strong><small class="rarity-${item.rarity}">${escapeHtml(atelierItemMeta(item))}</small></span><b>${gone ? '—' : bag.stock[item.id]}</b></li>`;
    return `<button type="button" class="atelier-back" data-atelier-codex="">Tất cả loại</button><h3>${escapeHtml(L.CATEGORY_LABEL[atelierCat])}</h3><p class="atelier-muted">Đã có ${have.length}/${items.length}</p><section class="atelier-block"><h3>Đã có · ${have.length}</h3>${have.length ? `<ul class="atelier-list">${have.map(item => row(item, false)).join('')}</ul>` : '<p class="atelier-muted">Chưa có món nào.</p>'}</section><section class="atelier-block"><h3>Chưa có · ${missing.length}</h3>${missing.length ? `<ul class="atelier-list">${missing.map(item => row(item, true)).join('')}</ul>` : '<p class="atelier-muted">Đã đủ loại này.</p>'}</section>`;
  }
  const groups = [
    { title: 'Bàn và ghế', cats: ['desk', 'chair'] },
    { title: 'Mặt bàn', cats: ['mousepad', 'wrist', 'webcam', 'mic', 'dock', 'stand'] },
    { title: 'Màn, arm, đèn, loa', cats: ['monitor', 'arm', 'light', 'speaker'] },
    { title: 'PC', cats: [...new Set(L.PC_FIELDS.map(field => field.category))] },
    { title: 'Bàn phím', cats: ['kb_case', 'kb_pcb', 'plate', 'switch'] },
    { title: 'Chuột và tai nghe', cats: ['mouse', 'headphone', 'iem', 'dac', 'cable', 'eartips'] },
    { title: 'Mô hình', cats: ['mecha_part'] }
  ];
  const ownedCount = L.ITEMS.filter(item => (bag.stock[item.id] || 0) > 0).length;
  return `<p class="atelier-muted">${ownedCount}/${L.ITEMS.length} món. Keycap không vào danh mục vì rơi màu ngẫu nhiên.</p>${groups.map(group => `<section class="atelier-block"><h3>${group.title}</h3><div class="atelier-codex">${group.cats.map(id => {
    const items = L.itemsIn(id);
    const have = items.filter(item => (bag.stock[item.id] || 0) > 0).length;
    const ratio = items.length ? Math.round(have / items.length * 100) : 0;
    return `<button type="button" data-atelier-codex="${id}"><strong>${escapeHtml(L.CATEGORY_LABEL[id])}</strong><small>${have}/${items.length}</small><i style="width:${ratio}%"></i></button>`;
  }).join('')}</div></section>`).join('')}`;
}

function atelierRevealHtml(bag) {
  if (!bag.reveal || !bag.reveal.length) return '';
  const L = AtelierLib;
  const rows = bag.reveal.map(drop => {
    if (drop.kind === 'item') {
      const item = L.getItem(drop.itemId);
      return `<li><strong>${escapeHtml(item ? item.name : 'Món')}${drop.qty > 1 ? ` ×${drop.qty}` : ''}</strong><small class="rarity-${drop.rarity}">${escapeHtml(L.RARITY_LABEL[drop.rarity])}</small></li>`;
    }
    const shine = drop.caps.filter(cap => cap.shine).length;
    const swatches = drop.caps.slice(0, 18).map(cap => `<span style="background:${cap.color}">${escapeHtml(cap.key)}</span>`).join('');
    return `<li><strong>${drop.caps.length} keycap</strong><small class="rarity-${drop.rarity}">${escapeHtml(L.RARITY_LABEL[drop.rarity])}${shine ? ` · ${shine} xuyên LED` : ''}</small><div class="cap-swatches">${swatches}</div></li>`;
  }).join('');
  return `<div class="atelier-reveal"><section><h3>Rương mở</h3><ul>${rows}</ul><button type="button" class="primary-button" data-atelier-dismiss>Cất vào kho</button></section></div>`;
}

function renderAtelier() {
  const root = $('atelierRoot');
  if (!root || !globalThis.AtelierLib) return;
  const bag = atelierState();
  const titles = { today: 'Hôm nay', desk: 'Góc setup', shop: 'Xưởng lắp', bag: 'Kho đồ', codex: 'Danh mục' };
  const body = atelierTab === 'desk' ? atelierDeskHtml(bag) : atelierTab === 'shop' ? atelierShopHtml(bag) : atelierTab === 'bag' ? atelierBagHtml(bag) : atelierTab === 'codex' ? atelierCodexHtml(bag) : atelierTodayHtml(bag);
  root.innerHTML = `<div class="atelier-head"><div><p>Xưởng cá nhân</p><h2>${titles[atelierTab]}</h2></div>${bag.pending.length && atelierTab !== 'today' ? `<button type="button" class="primary-button" data-atelier-tab="today">${bag.pending.length} rương</button>` : ''}</div>
    <div class="atelier-tabs">${[['today', 'Hôm nay'], ['desk', 'Góc'], ['shop', 'Xưởng'], ['bag', 'Kho'], ['codex', 'Loại']].map(([id, label]) => `<button type="button" class="${atelierTab === id ? 'selected' : ''}" data-atelier-tab="${id}">${label}</button>`).join('')}</div>
    ${body}${atelierRevealHtml(bag)}`;
}

function atelierApplyPick(bag, slot, id) {
  const L = AtelierLib;
  const setup = bag.setup;
  if (slot.startsWith('pc:')) {
    const key = slot.slice(3);
    setup.pc[key] = setup.pc[key] === id ? null : id;
    return;
  }
  if (slot.startsWith('monitor:')) {
    const index = Number(slot.slice(8));
    const slots = L.monitorSlots(setup.armId);
    if (index === 1 && slots < 2) return;
    if (index === 0 && slots < 1) return;
    const monitorIds = [...setup.monitorIds];
    const next = monitorIds[index] === id ? null : id;
    const other = index === 0 ? 1 : 0;
    if (next && monitorIds[other] === next && (bag.stock[next] || 0) < 2) return;
    monitorIds[index] = next;
    setup.monitorIds = monitorIds;
    return;
  }
  if (slot === 'armId') {
    setup.armId = setup.armId === id ? null : id;
    const slots = L.monitorSlots(setup.armId);
    if (slots < 1) setup.monitorIds = [null, null];
    else if (slots < 2) setup.monitorIds = [setup.monitorIds[0], null];
    return;
  }
  if (slot === 'kbCaseId') {
    setup.kbCaseId = setup.kbCaseId === id ? null : id;
    const caseItem = L.getItem(setup.kbCaseId);
    const pcb = L.getItem(setup.kbPcbId);
    const plate = L.getItem(setup.kbPlateId);
    if (pcb && caseItem && (pcb.layout !== caseItem.layout || (caseItem.kbKind && pcb.kbKind !== caseItem.kbKind))) setup.kbPcbId = null;
    if (plate && caseItem && plate.layout !== caseItem.layout) setup.kbPlateId = null;
    return;
  }
  if (slot === 'kbPcbId') {
    const caseItem = L.getItem(setup.kbCaseId);
    const pcb = L.getItem(id);
    if (id && caseItem && caseItem.layout && pcb && pcb.layout !== caseItem.layout) return;
    if (id && caseItem && caseItem.kbKind && pcb && pcb.kbKind !== caseItem.kbKind) return;
    setup.kbPcbId = setup.kbPcbId === id ? null : id;
    return;
  }
  if (slot === 'kbPlateId') {
    const layout = L.getItem(setup.kbCaseId) && L.getItem(setup.kbCaseId).layout;
    const plate = L.getItem(id);
    if (id && layout && plate && plate.layout !== layout) return;
    setup.kbPlateId = setup.kbPlateId === id ? null : id;
    return;
  }
  setup[slot] = setup[slot] === id ? null : id;
}

function atelierToggleSpeaker(bag, id) {
  const item = AtelierLib.getItem(id);
  if (!item) return;
  if (item.speakerKind === 'pair') {
    bag.setup.speakerIds = bag.setup.speakerIds.length === 1 && bag.setup.speakerIds[0] === id ? [] : [id];
    return;
  }
  const singles = bag.setup.speakerIds.filter(entry => AtelierLib.getItem(entry) && AtelierLib.getItem(entry).speakerKind === 'single');
  if (singles.includes(id)) bag.setup.speakerIds = singles.filter(entry => entry !== id);
  else if (singles.length < 2) bag.setup.speakerIds = [...singles, id];
  else bag.setup.speakerIds = [singles[0], id];
}

function atelierToggleLight(bag, id) {
  const lights = [...bag.setup.lightIds];
  if (lights.includes(id)) bag.setup.lightIds = lights.filter(entry => entry !== id);
  else bag.setup.lightIds = lights.length < 2 ? [...lights, id] : [lights[1], id];
}

function wireAtelier() {
  const root = $('atelierRoot');
  if (!root || root.dataset.wired) return;
  root.dataset.wired = '1';
  root.addEventListener('click', event => {
    const node = event.target.closest('[data-atelier-tab],[data-atelier-lock],[data-atelier-open],[data-atelier-flag],[data-atelier-reset],[data-atelier-pick],[data-atelier-audio],[data-atelier-speaker],[data-atelier-light],[data-atelier-mecha],[data-atelier-codex],[data-atelier-dismiss]');
    if (!node) return;
    if (node.dataset.atelierTab) { atelierTab = node.dataset.atelierTab; atelierArmed = false; renderAtelier(); return; }
    if (node.hasAttribute('data-atelier-lock')) { atelierLockDay(); return; }
    if (node.dataset.atelierOpen) { atelierOpen(node.dataset.atelierOpen === 'all'); return; }
    if (node.hasAttribute('data-atelier-dismiss')) { const bag = atelierState(); bag.reveal = null; writeAtelier(bag); renderAtelier(); return; }
    if (node.dataset.atelierFlag) {
      const bag = atelierState();
      if (bag.days.some(day => day.date === dateKey(new Date()))) return;
      bag.draft[node.dataset.atelierFlag] = !bag.draft[node.dataset.atelierFlag];
      writeAtelier(bag); renderAtelier(); return;
    }
    if (node.hasAttribute('data-atelier-reset')) {
      if (!atelierArmed) { atelierArmed = true; renderAtelier(); return; }
      writeAtelier(emptyAtelier()); atelierArmed = false; atelierTab = 'today'; atelierCat = null; renderAtelier(); showToast('Đã xoá kho Atelier.'); return;
    }
    if (node.dataset.atelierCodex !== undefined) { atelierCat = node.dataset.atelierCodex || null; renderAtelier(); return; }
    const bag = atelierState();
    if (node.dataset.atelierPick) atelierApplyPick(bag, node.dataset.atelierPick, node.dataset.atelierId);
    else if (node.dataset.atelierAudio) bag.setup.audioMode = node.dataset.atelierAudio;
    else if (node.hasAttribute('data-atelier-speaker')) atelierToggleSpeaker(bag, node.dataset.atelierId);
    else if (node.hasAttribute('data-atelier-light')) atelierToggleLight(bag, node.dataset.atelierId);
    else if (node.dataset.atelierMecha) bag.setup.mechaKitId = bag.setup.mechaKitId === node.dataset.atelierMecha ? null : node.dataset.atelierMecha;
    writeAtelier(bag);
    renderAtelier();
  });
}
