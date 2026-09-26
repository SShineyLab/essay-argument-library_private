"use strict";

const ALL_TOPICS = "All topics";
const ALL_STRUCTURES = "All essay types";
const colourClass = {
  "Culture & Society":"category-coral","Economics & Development":"category-gold","Education & Technology":"category-blue",
  "Environment & Global Challenges":"category-green","Health & Social Issues":"category-rose","International Relations":"category-violet",
  "Media, Language & Communication":"category-cyan","Politics, Law & Governance":"category-ink"
};

const COMPARE_THEMES = [{"name":"Education and skills","keywords":["education","school","university","student","learning","literacy","curriculum","qualification","training","academic","vocational","teacher"]},{"name":"Housing and living conditions","keywords":["housing","household","home ownership","homeless","accommodation","residential","living conditions","shelter"]},{"name":"Healthcare and wellbeing","keywords":["health","medical","hospital","disease","treatment","vaccination","medicine","patient","wellbeing","well-being"]},{"name":"Poverty and inequality","keywords":["poverty","poor families","low-income","inequality","deprivation","disadvantaged","wealth gap","social mobility"]},{"name":"Employment and human capital","keywords":["employment","jobs","workforce","labour","labor","wages","pay","productivity","human capital","brain drain","skilled workers"]},{"name":"Public finance and welfare","keywords":["tax","public expenditure","government spending","funding","welfare","budget","public finances","subsid","fiscal"]},{"name":"Culture and identity","keywords":["culture","tradition","heritage","language","religion","identity","custom","ceremon"]},{"name":"Governance and rights","keywords":["governance","corruption","democra","rights","law","justice","government","accountability","politic","representation"]},{"name":"Environment and sustainability","keywords":["environment","climate","pollution","wildlife","conservation","sustainab","natural resources"]},{"name":"Technology and innovation","keywords":["technology","internet","research","innovation","artificial intelligence","digital","computer","social media"]},{"name":"Migration and international relations","keywords":["migration","immigration","refugee","international","foreign","globalisation","trade","sanction","diplomacy"]},{"name":"Crime and security","keywords":["crime","criminal","drug trafficking","terrorism","security","police","prison","violence"]}];

const definitions = [
{"term":"Education","definition":"The process through which people acquire knowledge, skills, values and understanding.","category":"Education"},
{"term":"University education","definition":"Advanced study, research and specialised training undertaken at institutions of higher education.","category":"Education"},
{"term":"Poverty","definition":"A condition in which people lack sufficient resources to meet basic needs and participate adequately in society.","category":"Economics & Development"},
{"term":"Housing","definition":"The provision of accommodation that offers people shelter, security and suitable living conditions.","category":"Economics & Development"},
{"term":"Medical care","definition":"Services aimed at preventing, diagnosing and treating illness to improve health and quality of life.","category":"Health & Society"},
{"term":"Culture","definition":"The shared beliefs, customs, language, arts and ways of life of a community or society.","category":"Culture & Society"},
{"term":"Tradition","definition":"A belief, practice or custom transmitted from one generation to another.","category":"Culture & Society"},
{"term":"Industrialisation","definition":"The expansion of manufacturing and mechanised production as an economy develops.","category":"Economics & Development"},
{"term":"Immigration","definition":"The movement of people into another country to live there temporarily or permanently.","category":"International Relations"},
{"term":"National unity","definition":"A sense of solidarity and shared belonging among the people of a nation.","category":"Culture & Society"},
{"term":"Rule of law","definition":"The principle that everyone, including public authorities, is subject to publicly established and fairly applied laws.","category":"Politics, Law & Governance"},
{"term":"Globalisation","definition":"The growing interconnectedness of economies, societies and cultures across national borders.","category":"International Relations"},
{"term":"Economic cooperation","definition":"Joint economic action between countries or institutions to pursue shared development and trade objectives.","category":"Economics & Development"},
{"term":"Human migration","definition":"The movement of people from one place to another, within or across national borders.","category":"International Relations"},
{"term":"Capital punishment","definition":"A criminal penalty in which the state imposes a death sentence for an offence.","category":"Politics, Law & Governance"},
{"term":"Referendum","definition":"A direct public vote on a particular political or constitutional question.","category":"Politics, Law & Governance"},
{"term":"Examination","definition":"A formal assessment used to measure a learner's knowledge, understanding or skills.","category":"Education"},
{"term":"Religious education","definition":"Teaching about religious beliefs, practices and traditions, whether as a subject of study or faith instruction.","category":"Education"},
{"term":"Dangerous drugs","definition":"Substances whose use can cause serious physical, psychological or social harm.","category":"Health & Society"},
{"term":"Music","definition":"The art of organising sound through elements such as rhythm, melody and harmony.","category":"Culture & Society"},
{"term":"Ceremony","definition":"A formal occasion or series of acts performed to mark an important event, belief or achievement.","category":"Culture & Society"},
{"term":"Journalism","definition":"The practice of gathering, verifying and reporting information of public interest.","category":"Media, Language & Communication"},
{"term":"Social cohesion","definition":"The trust, solidarity and sense of belonging that connect members of a society.","category":"Culture & Society"},
{"term":"Economic development","definition":"The process of improving a society's economic opportunities, productivity and living standards.","category":"Economics & Development"},
{"term":"Globalisation","definition":"The increasing interconnectedness and interdependence of countries through trade, technology, migration and cultural exchange.","category":"Culture & Society"},
{"term":"Human capital","definition":"The knowledge, skills, experience and health of people that contribute to their productivity and economic potential.","category":"Education"},
{"term":"Social mobility","definition":"The movement of individuals or groups between different social or economic positions, often through education or employment.","category":"Education"},
{"term":"Universal healthcare","definition":"A system in which all people can access the health services they need without suffering financial hardship.","category":"Health & Society"},
{"term":"Preventive healthcare","definition":"Medical services and public-health measures designed to prevent disease or detect it early, including vaccination and screening.","category":"Health & Society"},
{"term":"Brain drain","definition":"The emigration of skilled or highly educated people from their home country, often in search of better opportunities.","category":"Education"},
{"term":"Democratisation of education","definition":"The process of making educational opportunities more accessible and equitable, regardless of income or social background.","category":"Education"},
{"term":"Economic sanctions","definition":"Restrictions on trade, finance or other economic activity imposed to influence the behaviour of a country, organisation or individual.","category":"Politics, Law & Governance"},
{"term":"Cultural heritage","definition":"The traditions, languages, practices, monuments and other inherited expressions that communities preserve across generations.","category":"Culture & Society"},
{"term":"Social cohesion","definition":"The degree of trust, solidarity and sense of belonging among members of a society.","category":"Culture & Society"},
{"term":"Sustainable development","definition":"Development that meets present needs without compromising the ability of future generations to meet their own needs.","category":"Economics & Development"},
{"term":"Opportunity cost","definition":"The value of the next-best alternative forgone when resources are used for a particular purpose.","category":"Economics & Development"},
{"term":"Public expenditure","definition":"Spending by government on services, infrastructure, administration and other public responsibilities.","category":"Economics & Development"},
{"term":"International cooperation","definition":"Joint action by countries and international organisations to address shared problems and pursue common objectives.","category":"International Relations"},
{"term":"Sovereignty","definition":"The authority of a state to govern its own territory and affairs without external control.","category":"International Relations"},
{"term":"Social justice","definition":"The principle of fair access to rights, opportunities and resources across society.","category":"Health & Society"},
{"term":"Industrialisation","definition":"The transformation of an economy through the growth of manufacturing, mechanisation and industrial production.","category":"Economics & Development"},
{"term":"Rehabilitation","definition":"Support and treatment intended to help people recover functioning and reintegrate into everyday social or working life.","category":"Health & Society"}
];

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

function renderDefinitions(){
  const q=state.query.trim().toLowerCase();
  const terms=definitions.filter(d=>(state.category===ALL_TOPICS||d.category===state.category)&&(!q||`${d.term} ${d.definition} ${d.category}`.toLowerCase().includes(q)));
  $("#definition-count").textContent=`${terms.length} ${terms.length===1?"definition":"definitions"}`;
  $("#definition-grid").innerHTML=terms.length?terms.map(d=>`<article class="definition-card"><span class="eyebrow">${esc(d.category)}</span><h3>${esc(d.term)}</h3><p>${esc(d.definition)}</p></article>`).join(""):`<div class="empty"><h3>No matching definition</h3><p>Try another term or clear the filters.</p></div>`;
}

function comparisonColumn(essay,label){
  return `<section class="compare-column"><header class="compare-head"><p class="eyebrow">${label}</p><h3>${esc(essay.title)}</h3><div class="badges">${badge(essay)}</div></header><div class="compare-list">${essay.arguments.map((a,i)=>`<article class="compare-argument"><span>${String(i+1).padStart(2,"0")}</span><div><span class="${sideClass(a.side)}">${esc(a.side)}</span><h4>${esc(a.name)}</h4><p>${a.examples.length} extracted examples</p></div></article>`).join("")}</div><div class="compare-quotes"><p class="eyebrow">Quotations</p>${essay.quotes.length?essay.quotes.map(q=>`<blockquote>“${esc(q.text)}” <small>— ${esc(q.author)}</small></blockquote>`).join(""):`<p class="note">No attributed quotation identified.</p>`}</div></section>`;
}

function themeMatches(argument,theme){
  const text=[argument.name,argument.summary].join(" ").toLowerCase();
  return theme.keywords.some(k=>text.includes(k));
}
function sharedThemes(a,b){
  return COMPARE_THEMES.map(theme=>({
    name:theme.name,
    left:a.arguments.map((argument,index)=>({argument,index})).filter(x=>themeMatches(x.argument,theme)),
    right:b.arguments.map((argument,index)=>({argument,index})).filter(x=>themeMatches(x.argument,theme))
  })).filter(group=>group.left.length&&group.right.length);
}
function renderCompare(){
  const selects=[$("#compare-a"),$("#compare-b")];
  if(!selects[0].options.length){
    const choices='<option value="">Choose an essay…</option>'+state.essays.map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join("");
    selects.forEach(s=>s.innerHTML=choices);
  }
  const a=state.essays.find(e=>e.id===selects[0].value),b=state.essays.find(e=>e.id===selects[1].value);
  $("#compare-action").disabled=!(a&&b&&a.id!==b.id);
  if(!a||!b||a.id===b.id){$("#comparison").innerHTML='<div class="compare-empty"><strong>Choose two different essays</strong><p>Select the titles above to find shared paragraph themes.</p></div>';return;}
  if(!state.compareReady){$("#comparison").innerHTML='<div class="compare-empty"><strong>Your essays are ready</strong><p>Tap “Compare essays” to discover their shared themes.</p></div>';return;}
  const groups=sharedThemes(a,b);
  $("#comparison").innerHTML=groups.length?'<div class="theme-overview"><p class="eyebrow">Shared themes</p><h3>'+groups.length+' themes found</h3><p>These matches use paragraph titles and explanations. Open any theme to compare the original arguments and examples.</p></div>'+groups.map((g,i)=>`<button class="theme-card" data-theme="${i}"><span class="eyebrow">Shared theme</span><strong>${esc(g.name)}</strong><span>${g.left.length} paragraph(s) in the first essay · ${g.right.length} in the second</span><em>View explanations and examples →</em></button>`).join(""):'<div class="compare-empty"><strong>No shared themes identified automatically</strong><p>The essays may still share ideas expressed in different language. Try another pair.</p></div>';
}
function openTheme(index){
  const a=state.essays.find(e=>e.id===$("#compare-a").value),b=state.essays.find(e=>e.id===$("#compare-b").value);
  if(!a||!b)return;
  const group=sharedThemes(a,b)[index];if(!group)return;
  const column=(essay,items,label)=>`<section class="theme-column"><p class="eyebrow">${label}</p><h3>${esc(essay.title)}</h3>${items.map(x=>`<article class="theme-argument"><span class="${sideClass(x.argument.side)}">${esc(x.argument.side)}</span><h4>Paragraph ${x.index+1}: ${esc(x.argument.name)}</h4><p>${esc(x.argument.summary)}</p><div class="theme-examples">${x.argument.examples.map((example,i)=>`<div class="example"><strong>Example ${i+1}</strong><p>${esc(example)}</p></div>`).join("")}</div></article>`).join("")}</section>`;
  $("#theme-dialog-content").innerHTML=`<header class="detail-head"><p class="eyebrow">Theme comparison</p><h2 id="theme-dialog-title">${esc(group.name)}</h2><p>Matching arguments from both essays, with their explanations and all stored examples.</p></header><div class="theme-detail">${column(a,group.left,"First essay")}${column(b,group.right,"Second essay")}</div>`;
  $("#theme-dialog").showModal();
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
  $("#structure").hidden=view==="definitions";
  $("#search").placeholder=view==="definitions"?"Search terms or definitions…":"Search essays, topics or examples…";
  $(".mobile-guide").hidden=view!=="library";
  if(view==="quotes")renderQuotes(); if(view==="compare")renderCompare(); if(view==="definitions")renderDefinitions();
}

function renderAll(){
  const has=state.query||state.category!==ALL_TOPICS||state.structure!==ALL_STRUCTURES; $("#clear").hidden=!has;
  $("#mobile-category").value=state.category;
  renderLibrary(); renderQuotes(); renderDefinitions(); if(state.view==="compare")renderCompare();
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
  $("#comparison").addEventListener("click",event=>{const card=event.target.closest("[data-theme]");if(card)openTheme(Number(card.dataset.theme))});
  $("#theme-dialog-close").addEventListener("click",()=>$("#theme-dialog").close());
  $("#theme-dialog").addEventListener("click",event=>{if(event.target===$("#theme-dialog"))$("#theme-dialog").close()});
  $("#dialog-close").addEventListener("click",()=>$("#essay-dialog").close());
  $("#essay-dialog").addEventListener("click",e=>{if(e.target===$("#essay-dialog"))$("#essay-dialog").close()});
}

fetch("./data/essays.json").then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(data=>{
  state.essays=data; renderMetrics(); setupFilters(); bindEvents(); renderAll(); $("#loading").classList.add("done");
}).catch(error=>{$("#loading").textContent="The catalogue could not be loaded. Open this site through a web server, not as a file.";console.error(error)});
