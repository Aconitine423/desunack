/****************************************************
 * 대체당 판매자센터 - 리뷰 관리 JS 
 * 화면 전제
 *  - 리스트만 사용
 *  - 카드 하단 개별 버튼 없음
 *  - 상단 배지 옆에 "답변 수정" 버튼 있음
 * 기능
 *  - 탭 필터: 전체/노출/숨김/신고됨/답변완료/미답변
 *  - 검색, 정렬, 페이지네이션
 *  - 선택/전체선택, 일괄: 숨김/노출/신고/해제/내보내기/삭제/선택해제
 *  - 판매자 답변 등록·수정(입력칸 토글), 상태 배지 동기화
 *  - CSV(전체/선택) 내보내기
 ****************************************************/
(() => {
  'use strict';

  /* ========== 상태 ========== */
  const state = {
    list: [],
    filter: 'all',                    // all | visible | hidden | reported | answered | unanswered
    q: '', rating: '', visibility: '', from: '', to: '',
    sort: 'recent',                   // recent | rating_desc | rating_asc | helpful_desc
    page: 1, pageSize: 10,
    selected: new Set(),              // 체크된 리뷰 id 집합
  };

  /* ========== 데이터 소스 ========== */
  const DATA_URL = './review.json';   // 동일 폴더에 있으면 사용, 없으면 SAMPLE 사용
  const SAMPLE = [
    { id:1, orderId:'DT-2025-0001', date:'2025-08-25', rating:5,
      content:'대체당 시럽이 깔끔합니다. 아이스 라떼에도 잘 녹아요.',
      answered:false, reply:'', visible:true, reported:false, helpful:12,
      user:{ name:'김민수' }, product:{ name:'대체당 시럽 500ml', thumb:'https://via.placeholder.com/80x80?text=IMG' }
    },
    { id:2, orderId:'DT-2025-0002', date:'2025-08-18', rating:3,
      content:'달지만 뒷맛이 조금 남아요. 개인 취향엔 보통.',
      answered:false, reply:'', visible:true, reported:false, helpful:3,
      user:{ name:'이서연' }, product:{ name:'대체당 파우더 250g', thumb:'https://via.placeholder.com/80x80?text=IMG' }
    }
  ];

  /* ========== 헬퍼 ========== */
  const qs  = (s, r=document)=>r.querySelector(s);
  const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const toDate = d => { if(!d) return null; const t=new Date(d); return isNaN(t)?null:t; };
  const fmt   = d => (d||'').replaceAll('-', '.');                 // 2025-09-01 → 2025.09.01
  const stars = n => { const r=Math.round(Number(n)||0); return '★'.repeat(r)+'☆'.repeat(5-r); };
  const initial = name => (name && name.trim()[0]) || '대';
  const today = ()=> new Date().toISOString().slice(0,10);
  const activeFilter = ()=> qs('.status-tabs .tab.is-active')?.dataset.filter || 'all';

  // 외부 키를 내부 표준으로 정규화
  const normalize = v => ({
    ...v,
    rating: Number(v.rating ?? v.score ?? 0),
    visible: (v.visible ?? v.isVisible ?? (v.hidden===undefined ? true : !v.hidden)) ? true:false,
    reported: !!(v.reported ?? v.isReported ?? v.report ?? v.flagged),
    answered: !!v.answered,
    reply: v.reply ?? '',
    user: v.user || {name:''},
    product: v.product || {name:'', thumb:''},
  });

  /* ========== 데이터 로드 ========== */
  async function loadData(){
    try{
      const res = await fetch(DATA_URL, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      if(!Array.isArray(data) || data.length===0) throw new Error('empty');
      state.list = data.map(normalize);
    }catch{
      state.list = SAMPLE.map(normalize);
    }
  }

  /* ========== 필터/정렬/페이지 ========== */
  function computeFiltered(){
    const {list, filter, q, rating, visibility, from, to} = state;
    const fromD = toDate(from), toD = toDate(to);

    let arr = list.filter(v=>{
      if(filter==='visible'    && !v.visible)  return false;
      if(filter==='hidden'     &&  v.visible)  return false;
      if(filter==='reported'   && !v.reported) return false;
      if(filter==='answered'   && !v.answered) return false;
      if(filter==='unanswered' &&  v.answered) return false;

      if(q){
        const hay = `${v.user?.name||''} ${v.product?.name||''} ${v.orderId||''} ${v.content||''}`;
        if(!hay.includes(q)) return false;
      }
      if(rating && String(Math.round(v.rating||0))!==rating) return false;
      if(visibility==='visible' && !v.visible) return false;
      if(visibility==='hidden'  &&  v.visible) return false;

      if(fromD || toD){
        const vd = toDate(v.date); if(!vd) return false;
        if(fromD && vd<fromD) return false;
        if(toD   && vd>toD)   return false;
      }
      return true;
    });

    const s = state.sort;
    arr.sort((a,b)=>{
      if(s==='recent')       return (toDate(b.date)-toDate(a.date))||0;
      if(s==='rating_desc')  return (b.rating||0)-(a.rating||0);
      if(s==='rating_asc')   return (a.rating||0)-(b.rating||0);
      if(s==='helpful_desc') return (b.helpful||0)-(a.helpful||0);
      return 0;
    });
    return arr;
  }

  function paginate(arr){
    const {page,pageSize}=state;
    const total = arr.length;
    const pages = Math.max(1, Math.ceil(total/pageSize));
    state.page = Math.min(Math.max(1,page), pages);
    const start = (state.page-1)*pageSize;
    return { items: arr.slice(start, start+pageSize), total, pages };
  }

  /* ========== 리스트 렌더 ========== */
  function renderList(items){
    const ul = qs('#reviewList'); if(!ul) return;
    ul.innerHTML = '';
    const tpl = qs('#itemTemplate'); if(!tpl){ console.error('itemTemplate 없음'); return; }

    items.forEach(v=>{
      const li = tpl.content.firstElementChild.cloneNode(true);
      li.dataset.id = v.id;

      // 상단 정보
      qs('.avatar',li).textContent = initial(v.user?.name);
      qs('.u-name',li).textContent = v.user?.name || '';
      qs('.u-date',li).textContent = fmt(v.date);
      qs('.stars',li).textContent  = stars(v.rating);
      qs('.score-badge',li).textContent = Number(v.rating||0).toFixed(1);

      // 배지/상태 헬퍼
      const bv = qs('.badge-visibility',li);
      const br = qs('.badge-report',li);
      const ba = qs('.badge-answered',li);
      const bu = qs('.badge-unanswered',li);

      const setVisible = on => {
        bv.textContent = on ? '노출' : '숨김';
        bv.classList.toggle('hidden', !on);
        li.classList.toggle('is-hidden', !on);
      };
      const setReported = on => {
        br.hidden = !on;
        br.style.display = on ? '' : 'none';     // CSS [hidden] 충돌 대비
        li.classList.toggle('is-reported', !!on);
      };
      const setAnswered = on => {
        ba.hidden = !on;
        bu.hidden =  on;
      };

      setVisible(!!v.visible);
      setReported(!!v.reported);
      setAnswered(!!v.answered);

      // 상품/본문
      const th = qs('.p-thumb',li);
      if(th){ th.src = v.product?.thumb || 'https://via.placeholder.com/80x80?text=IMG'; th.alt = v.product?.name || '대체당 상품'; }
      qs('.p-name',li).textContent  = v.product?.name || '';
      qs('.order-id',li).textContent = v.orderId || '';
      qs('.r-content',li).textContent = v.content || '';

      // 답변 입력/수정
      const replyBox = qs('.reply',li);
      const replyTA  = qs('.reply-input',li);
      const editBtn  = qs('.btn-edit-reply',li);
      if(v.reply) replyTA.value = v.reply;
      replyBox.hidden = v.answered;         // 완료면 입력칸 숨김
      editBtn.hidden  = !v.answered;        // 완료일 때만 "답변 수정" 노출

      editBtn.addEventListener('click', ()=>{
        replyTA.value = v.reply || '';
        replyBox.hidden = false;            // 수정 모드
        editBtn.hidden  = true;
      });

      qs('.btn-reply-save',li)?.addEventListener('click', ()=>{
        const val = (replyTA?.value||'').trim();
        if(!val){ alert('답변 내용을 입력하세요.'); return; }
        v.reply = val; v.answered = true;
        setAnswered(true);
        replyBox.hidden = true;
        editBtn.hidden  = false;
        updateCounts();
        if(activeFilter()==='unanswered') refresh(); // 미답변 탭에서 즉시 제거
      });

      qs('.btn-reply-cancel',li)?.addEventListener('click', ()=>{
        replyTA.value = v.reply || '';
        if(v.answered){ replyBox.hidden = true; editBtn.hidden = false; }
      });

      // 체크박스
      const c = qs('.item-check',li);
      c.checked = state.selected.has(v.id);
      li.classList.toggle('is-selected', c.checked);
      c.addEventListener('change', ()=>{
        if(c.checked){ state.selected.add(v.id); li.classList.add('is-selected'); }
        else         { state.selected.delete(v.id); li.classList.remove('is-selected'); }
        syncMasterAndBulk();
      });

      ul.appendChild(li);
    });

    syncMasterAndBulk();
  }

  /* ========== 페이지네이션/카운트 ========== */
  function renderPagination(total,pages){
    const nav = qs('#pagination'); if(!nav) return;
    nav.innerHTML = '';
    const mk = (label,dis,on)=>{ const b=document.createElement('button'); b.className='btn'; b.textContent=label; b.disabled=dis; b.addEventListener('click',on); return b; };
    nav.append(mk('이전', state.page<=1, ()=>{ if(state.page>1){ state.page--; refresh(); }}));
    const info = document.createElement('span'); info.style.margin='0 8px'; info.textContent = `${state.page} / ${pages} (총 ${total}개)`; nav.append(info);
    nav.append(mk('다음', state.page>=pages, ()=>{ if(state.page<pages){ state.page++; refresh(); }}));
  }

  function updateCounts(){
    const all   = state.list.length;
    const vis   = state.list.filter(v=> v.visible).length;
    const hid   = state.list.filter(v=>!v.visible).length;
    const rep   = state.list.filter(v=> v.reported).length;
    const ans   = state.list.filter(v=> v.answered).length;
    const unans = state.list.filter(v=>!v.answered).length;
    const set = (id,val)=>{ const el=qs(id); if(el) el.textContent=val; };
    set('#count-all',all);
    set('#count-visible',vis);
    set('#count-hidden',hid);
    set('#count-reported',rep);
    set('#count-answered',ans);
    set('#count-unanswered',unans);
  }

  /* ========== 선택/일괄 처리 ========== */
  function syncMasterAndBulk(){
    const items = qsa('#reviewList .r-item');
    const total = items.length;
    let sel = 0;
    items.forEach(n=>{ if(state.selected.has(Number(n.dataset.id))) sel++; });

    const master = qs('#chkAllList');
    if(master){
      master.indeterminate = sel>0 && sel<total;
      master.checked = total>0 && sel===total;
    }

    const bar = qs('#bulkBar');
    if(bar){ bar.hidden = state.selected.size===0; bar.classList.toggle('show', state.selected.size>0); }
    const cnt = qs('#bulkCount'); if(cnt) cnt.textContent = String(state.selected.size);

    ['bulkHide','bulkShow','bulkReport','bulkUnreport','bulkExport','bulkDelete','bulkClear']
      .forEach(id=>{ const el=qs('#'+id); if(el) el.disabled = state.selected.size===0; });
  }

  function bindBulk(){
    // 전체선택
    qs('#chkAllList')?.addEventListener('change', e=>{
      const check = e.target.checked;
      qsa('#reviewList .r-item').forEach(li=>{
        const id = Number(li.dataset.id);
        const cb = qs('.item-check',li);
        if(cb) cb.checked = check;
        li.classList.toggle('is-selected', check);
        state.selected[check?'add':'delete'](id);
      });
      syncMasterAndBulk();
    });

    // 선택 해제
    qs('#bulkClear')?.addEventListener('click', ()=>{
      state.selected.clear();
      qsa('.item-check').forEach(c=> c.checked=false);
      qsa('#reviewList .r-item').forEach(li=> li.classList.remove('is-selected'));
      syncMasterAndBulk();
    });

    // 일괄 숨김/노출
    qs('#bulkHide')?.addEventListener('click', ()=>{
      state.list.forEach(v=>{ if(state.selected.has(v.id)) v.visible=false; });
      refresh();
    });
    qs('#bulkShow')?.addEventListener('click', ()=>{
      state.list.forEach(v=>{ if(state.selected.has(v.id)) v.visible=true; });
      refresh();
    });

    // 일괄 신고/해제
    qs('#bulkReport')?.addEventListener('click', ()=>{
      state.list.forEach(v=>{ if(state.selected.has(v.id)) v.reported=true; });
      refresh();
    });
    qs('#bulkUnreport')?.addEventListener('click', ()=>{
      state.list.forEach(v=>{ if(state.selected.has(v.id)) v.reported=false; });
      refresh();
    });

    // 선택 내보내기
    qs('#bulkExport')?.addEventListener('click', ()=>{
      const rows = state.list.filter(v=> state.selected.has(v.id)).map(v=>({
        id:v.id, orderId:v.orderId, date:v.date, rating:v.rating,
        answered: v.answered?'Y':'N', reply:v.reply||'',
        visible: v.visible?'Y':'N', reported: v.reported?'Y':'N',
        user: v.user?.name||'', product: v.product?.name||'',
        content:(v.content||'').replace(/\n/g,' ')
      }));
      if(rows.length===0) return;
      downloadCSV(rows, `reviews_selected_${today()}.csv`);
    });

    // 일괄 삭제(데모)
    qs('#bulkDelete')?.addEventListener('click', ()=>{
      state.list = state.list.filter(v=> !state.selected.has(v.id));
      state.selected.clear();
      state.page = 1;
      refresh();
    });
  }

  /* ========== 내보내기(전체) ========== */
  function bindExportAll(){
    qs('.btn.btn-export')?.addEventListener('click', ()=>{
      const rows = state.list.map(v=>({
        id:v.id, orderId:v.orderId, date:v.date, rating:v.rating,
        answered: v.answered?'Y':'N', reply:v.reply||'',
        visible: v.visible?'Y':'N', reported: v.reported?'Y':'N',
        user: v.user?.name||'', product: v.product?.name||'',
        content:(v.content||'').replace(/\n/g,' ')
      }));
      downloadCSV(rows, `reviews_${today()}.csv`);
    });
  }
  function downloadCSV(rows, filename){
    const header = Object.keys(rows[0]||{});
    const csv = [
      header.join(','),
      ...rows.map(r => header.map(k => `"${String(r[k]??'').replace(/"/g,'""')}"`).join(','))
    ].join('\r\n');
    const blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'}); // BOM으로 엑셀 한글 깨짐 방지
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = filename; a.click(); URL.revokeObjectURL(a.href);
  }

  /* ========== 메인 렌더 루프 ========== */
  function refresh(){
    const filtered = computeFiltered();
    const {items,total,pages} = paginate(filtered);
    renderList(items);
    renderPagination(total,pages);
    updateCounts();
    syncMasterAndBulk();
  }

  /* ========== 이벤트 바인딩 ========== */
  function bindEvents(){
    // 상태 탭
    qsa('.status-tabs .tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        qsa('.status-tabs .tab').forEach(b=>b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.filter = btn.dataset.filter;
        state.page = 1; refresh();
      });
    });

    // 검색/필터
    const form = qs('#searchBar');
    form?.addEventListener('submit', e=>{
      e.preventDefault();
      state.q          = qs('#q')?.value.trim() || '';
      state.rating     = qs('#rating')?.value || '';
      state.visibility = qs('#visibility')?.value || '';
      state.from       = qs('#from')?.value || '';
      state.to         = qs('#to')?.value || '';
      state.page = 1; refresh();
    });
    form?.addEventListener('reset', ()=> setTimeout(()=>{
      state.q=state.rating=state.visibility=state.from=state.to='';
      state.page=1; refresh();
    },0));

    // 정렬
    qs('#sort')?.addEventListener('change', e=>{
      state.sort = e.target.value; state.page=1; refresh();
    });

    // 일괄/내보내기
    bindBulk();
    bindExportAll();
  }

  /* ========== 시작 ========== */
  document.addEventListener('DOMContentLoaded', async ()=>{
    await loadData();
    bindEvents();
    refresh();
  });
})();
