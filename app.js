"use strict";

const ALL_TOPICS = "All topics";
const ALL_STRUCTURES = "All essay types";
const colourClass = {
  "Culture & Society":"category-coral","Economics & Development":"category-gold","Education & Technology":"category-blue",
  "Environment & Global Challenges":"category-green","Health & Social Issues":"category-rose","International Relations":"category-violet",
  "Media, Language & Communication":"category-cyan","Politics, Law & Governance":"category-ink"
};

const state = { essays:[], query:"", category:ALL_TOPICS, structure:ALL_STRUCTURES, view:"library", compareReady:false };
const $ = (selector) => document.querySelector(selector);
const esc = (value="") => String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[ch]);
const nfmt = value => Number(value).toLocaleString();
const examplesCount = essay => essay.arguments.reduce((sum, argument) => sum + argument.examples.length, 0);
const essayType = essay => essay.essayType === "Expository" ? "Expository (without however)" : "Argumentative (with however)";
const searchable = essay => [essay.title,essay.category,essayType(essay),...essay.tags,...essay.arguments.flatMap(a=>[a.name,a.summary,...a.examples]),...essay.quotes.flatMap(q=>[q.text,q.author])].join(" ").toLowerCase();
const sideClass = side => side === "Thesis" ? "side side-thesis" : side === "Antithesis" ? "side side-antithesis" : "side";
const badge = essay => `<span class="badge ${colourClass[essay.category]||""}">${esc(essay.category)}</span><span class="badge">${esc(essayType(essay))}</span>`;

function renderMetrics(){
  const totals = [
    [state.essays.length,"Essays"],
    [state.essays.reduce((s,e)=>s+e.arguments.length,0),"Arguments"],
    [state.essays.reduce((s,e)=>s+examplesCount(e),0),"Examples"],
    [state.essays.reduce((s,e)=>s+e.quotes.length,0),"Quotations"]
  ];
  $("#metrics").innerHTML = totals.map(([v,l])=>`<div class="metric"><strong>${nfmt(v)}</strong><span>${l}</span></div>`).join("");
}

function setupFilters(){
  const categories = [...new Set(state.essays.map(e=>e.category))].sort();
  const structures = [...new Set(state.essays.map(essayType))].sort();
  $("#mobile-category").innerHTML = [ALL_TOPICS,...categories].map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
  $("#structure").innerHTML = [ALL_STRUCTURES,...structures].map(x=>`<option>${esc(x)}</option>`).join("");
  $("#categories").innerHTML = [ALL_TOPICS,...categories].map(x=>{
    const count = x===ALL_TOPICS ? state.essays.length : state.essays.filter(e=>e.category===x).length;
    return `<button data-category="${esc(x)}" class="${x===state.category?"active":""}"><span>${esc(x)}</span><b>${count}</b></button>`;
  }).join("");
  $("#categories").addEventListener("click", event=>{
    const button=event.target.closest("button[data-category]"); if(!button)return;
    state.category=button.dataset.category; renderAll();
  });
  $("#mobile-category").addEventListener("change", event=>{
    state.category=event.target.value; renderAll();
  });
}

function filteredEssays(){
  const q=state.query.trim().toLowerCase();
  return state.essays.filter(e=>(!q||searchable(e).includes(q))&&(state.category===ALL_TOPICS||e.category===state.category)&&(state.structure===ALL_STRUCTURES||essayType(e)===state.structure));
}

function renderLibrary(){
  document.querySelectorAll("#categories button").forEach(b=>b.classList.toggle("active",b.dataset.category===state.category));
  const items=filteredEssays();
  $("#result-label").textContent=state.category===ALL_TOPICS?"Complete catalogue":state.category;
  $("#result-count").textContent=`${items.length} ${items.length===1?"essay":"essays"}`;
  $("#essay-cards").innerHTML=items.length?items.map((e,i)=>{
    const thesis=e.arguments.filter(a=>a.side==="Thesis").length, anti=e.arguments.filter(a=>a.side==="Antithesis").length;
    return `<article class="essay-card"><div class="card-index">${String(i+1).padStart(2,"0")}</div><div class="card-body"><div class="badges">${badge(e)}</div><h3 class="essay-title">${esc(e.title)}</h3><div class="stats"><span>${e.arguments.length} arguments</span><span>${examplesCount(e)} examples</span><span>${e.quotes.length} quotes</span></div>${thesis||anti?`<div class="stance"><span><i class="thesis"></i>${thesis} thesis</span><span><i class="antithesis"></i>${anti} antithesis</span></div>`:""}<div class="tags">${e.tags.slice(0,4).map(t=>`<span>#${esc(t)}</span>`).join("")}</div><button class="open-button" data-open="${esc(e.id)}">View essay <span aria-hidden="true">→</span></button></div></article>`;
  }).join(""):`<div class="empty"><h3>No matching essay</h3><p>Try another keyword or clear the current filters.</p></div>`;
}

function quotesFiltered(){
  const q=state.query.trim().toLowerCase();
  return state.essays.filter(e=>state.category===ALL_TOPICS||e.category===state.category).flatMap(e=>e.quotes.map(quote=>({...quote,essayTitle:e.title,essayId:e.id}))).filter(x=>!q||`${x.text} ${x.author} ${x.essayTitle}`.toLowerCase().includes(q));
}

function renderQuotes(){
  const quotes=quotesFiltered(); $("#quote-count").textContent=`${quotes.length} ${quotes.length===1?"quotation":"quotations"}`;
  $("#quote-grid").innerHTML=quotes.length?quotes.map(q=>`<button class="quote-card" data-open="${esc(q.essayId)}"><span class="eyebrow">Quotation</span><blockquote>“${esc(q.text)}”</blockquote><strong>${esc(q.author)}</strong><small>${esc(q.location)} · ${esc(q.essayTitle)}</small></button>`).join(""):`<div class="empty"><h3>No matching quotation</h3><p>Try another keyword or topic.</p></div>`;
}

function comparisonColumn(essay,label){
  return `<section class="compare-column"><header class="compare-head"><p class="eyebrow">${label}</p><h3>${esc(essay.title)}</h3><div class="badges">${badge(essay)}</div></header><div class="compare-list">${essay.arguments.map((a,i)=>`<article class="compare-argument"><span>${String(i+1).padStart(2,"0")}</span><div><span class="${sideClass(a.side)}">${esc(a.side)}</span><h4>${esc(a.name)}</h4><p>${a.examples.length} extracted examples</p></div></article>`).join("")}</div><div class="compare-quotes"><p class="eyebrow">Quotations</p>${essay.quotes.length?essay.quotes.map(q=>`<blockquote>“${esc(q.text)}” <small>— ${esc(q.author)}</small></blockquote>`).join(""):`<p class="note">No attributed quotation identified.</p>`}</div></section>`;
}

function renderCompare(){
  const selects=[$("#compare-a"),$("#compare-b")];
  if(!selects[0].options.length){
    const choices=`<option value="">Choose an essay…</option>`+state.essays.map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join("");
    selects.forEach(s=>s.innerHTML=choices);
  }
  const a=state.essays.find(e=>e.id===selects[0].value), b=state.essays.find(e=>e.id===selects[1].value);
  const valid=a&&b&&a.id!==b.id;
  $("#compare-action").disabled=!valid;
  if(!a||!b){$("#comparison").innerHTML=`<div class="compare-empty"><strong>Choose two essays above</strong><p>The comparison will appear here after you press the button.</p></div>`;return;}
  if(a.id===b.id){$("#comparison").innerHTML=`<div class="compare-empty"><strong>Choose two different essays</strong><p>This helps you spot useful similarities and differences.</p></div>`;return;}
  if(!state.compareReady){$("#comparison").innerHTML=`<div class="compare-empty"><strong>Your essays are ready</strong><p>Tap “Compare essays” to continue.</p></div>`;return;}
  $("#comparison").innerHTML=comparisonColumn(a,"First essay")+comparisonColumn(b,"Second essay");
}

function openEssay(id){
  const e=state.essays.find(item=>item.id===id); if(!e)return;
  const thesis=e.arguments.filter(a=>a.side==="Thesis").length, anti=e.arguments.filter(a=>a.side==="Antithesis").length;
  $("#dialog-content").innerHTML=`<header class="detail-head"><p class="eyebrow">Essay contents</p><h2 id="dialog-title">${esc(e.title)}</h2><p>Arguments, examples and quotations extracted from the submitted essay.</p></header><div class="detail-body"><div class="badges">${badge(e)}</div><div class="detail-counts"><span>${e.arguments.length} arguments</span><span>${examplesCount(e)} examples</span><span>${e.quotes.length} quotations</span>${thesis?`<span>${thesis} thesis</span>`:""}${anti?`<span>${anti} antithesis</span>`:""}</div><section class="detail-section"><p class="eyebrow">Arguments in original order</p>${e.arguments.map((a,i)=>`<article class="argument"><div class="argument-title"><span>${String(i+1).padStart(2,"0")}</span><div><span class="${sideClass(a.side)}">${esc(a.side)}</span><h3>${esc(a.name)}</h3></div></div><p class="argument-summary">${esc(a.summary)}</p><div class="examples">${a.examples.map((x,j)=>`<div class="example"><strong>Example ${j+1}</strong><p>${esc(x)}</p></div>`).join("")}</div></article>`).join("")}</section><section class="detail-section"><p class="eyebrow">Quotations used</p><div class="detail-quotes">${e.quotes.length?e.quotes.map(q=>`<figure><blockquote>“${esc(q.text)}”</blockquote><figcaption>${esc(q.author)} · ${esc(q.location)}${q.excerpt?" · excerpt":""}</figcaption></figure>`).join(""):`<p class="note">No attributed quotation was identified in the submitted text.</p>`}</div></section><p class="note">${esc(e.note)}</p></div>`;
  $("#essay-dialog").showModal();
}

function setView(view){
  state.view=view;
  document.querySelectorAll(".tab").forEach(b=>{const active=b.dataset.view===view;b.classList.toggle("active",active);b.setAttribute("aria-selected",active);});
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`${view}-view`));
  $(".controls").hidden=view==="compare";
  $(".mobile-guide").hidden=view!=="library";
  if(view==="quotes")renderQuotes(); if(view==="compare")renderCompare();
}

function renderAll(){
  const has=state.query||state.category!==ALL_TOPICS||state.structure!==ALL_STRUCTURES; $("#clear").hidden=!has;
  $("#mobile-category").value=state.category;
  renderLibrary(); renderQuotes(); if(state.view==="compare")renderCompare();
}

function bindEvents(){
  $("#search").addEventListener("input",e=>{state.query=e.target.value;renderAll()});
  $("#structure").addEventListener("change",e=>{state.structure=e.target.value;renderAll()});
  $("#clear").addEventListener("click",()=>{state.query="";state.category=ALL_TOPICS;state.structure=ALL_STRUCTURES;$("#search").value="";$("#mobile-category").value=ALL_TOPICS;$("#structure").value=ALL_STRUCTURES;renderAll()});
  $(".tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-view]");if(b)setView(b.dataset.view)});
  document.body.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)openEssay(b.dataset.open)});
  $("#compare-a").addEventListener("change",()=>{state.compareReady=false;renderCompare()});
  $("#compare-b").addEventListener("change",()=>{state.compareReady=false;renderCompare()});
  $("#compare-action").addEventListener("click",()=>{state.compareReady=true;renderCompare()});
  $("#dialog-close").addEventListener("click",()=>$("#essay-dialog").close());
  $("#essay-dialog").addEventListener("click",e=>{if(e.target===$("#essay-dialog"))$("#essay-dialog").close()});
}

fetch("./data/essays.json").then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(data=>{
  state.essays=data; renderMetrics(); setupFilters(); bindEvents(); renderAll(); $("#loading").classList.add("done");
}).catch(error=>{$("#loading").textContent="The catalogue could not be loaded. Open this site through a web server, not as a file.";console.error(error)});
