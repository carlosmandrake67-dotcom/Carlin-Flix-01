const ADMIN_PASSWORD = '@Carlos22'; // Protótipo: não use senha embutida assim em um app público.
const KEY = 'carlinflix.catalog.v1';
let movies = [];
let coverDraft = null, videoDraft = null;
const $ = id => document.getElementById(id);
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message){$('toast').textContent=message;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2800)}
function load(){try{movies=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){movies=[]} render()}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(movies));return true}catch(e){toast('Armazenamento cheio. Tente uma imagem menor ou remova arquivos.');return false}}
function coverOf(m){return m.coverData||m.coverUrl||''}
function render(){
 const q=$('search').value.trim().toLowerCase(), cat=$('categoryFilter').value;
 const cats=['Todas',...new Set(movies.map(m=>m.category).filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR')))];
 const old=cat;$('categoryFilter').innerHTML=cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c==='Todas'?'Todas as categorias':c)}</option>`).join('');
 $('categoryFilter').value=cats.includes(old)?old:'Todas';
 const filtered=movies.filter(m=>(cat==='Todas'||m.category===cat)&&(`${m.title} ${m.description} ${m.category}`.toLowerCase().includes(q)));
 $('rows').innerHTML='';
 const grouped={};filtered.forEach(m=>(grouped[m.category||'Outros']??=[]).push(m));
 Object.entries(grouped).forEach(([category,list])=>{
   const shelf=document.createElement('section');shelf.className='shelf';
   shelf.innerHTML=`<h2>${escapeHTML(category)}</h2><div class="cards">${list.map(m=>`<article class="movie">
     <div class="poster">${coverOf(m)?`<img loading="lazy" src="${coverOf(m)}" alt="Capa de ${escapeHTML(m.title)}">`:'<span class="poster-placeholder">🎬</span>'}</div>
     <div class="movie-info"><span class="tag">${escapeHTML(m.category||'Outros')}${m.year?' • '+escapeHTML(m.year):''}</span><h3>${escapeHTML(m.title)}</h3><p>${escapeHTML(m.description||'')}</p><button data-play="${escapeHTML(m.id)}">▶ Assistir / detalhes</button></div></article>`).join('')}</div>`;
   $('rows').appendChild(shelf);
 });
 $('empty').classList.toggle('hidden',movies.length>0);
 $('rows').classList.toggle('hidden',filtered.length===0);
 if(movies.length && filtered.length===0){$('rows').innerHTML='<p class="empty">Nenhum título encontrado.</p>'}
 $('heroTitle').textContent=movies.length?movies[0].title:'Descubra sua próxima história.';
 $('heroDesc').textContent=movies.length?(movies[0].description||'Escolha algo para assistir.'):'Filmes e séries em um só lugar.';
 $('hero').style.backgroundImage=movies.length&&coverOf(movies[0])?`linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.25)),url("${coverOf(movies[0]).replace(/"/g,'%22')}")`:'';
 $('hero').style.backgroundSize='cover';$('hero').style.backgroundPosition='center';
 $('adminList').innerHTML=movies.length?movies.map(m=>`<div class="admin-item">${coverOf(m)?`<img src="${coverOf(m)}" alt="">`:'<span>🎬</span>'}<div class="meta"><strong>${escapeHTML(m.title)}</strong><br>${escapeHTML(m.category)}</div><button data-edit="${escapeHTML(m.id)}">Editar</button><button data-delete="${escapeHTML(m.id)}">Excluir</button></div>`).join(''):'<p class="muted">Nenhum título cadastrado.</p>';
}
function openModal(id){$(id).classList.remove('hidden')}
function closeModal(id){$(id).classList.add('hidden')}
$('adminOpen').onclick=$('emptyAdmin').onclick=()=>{openModal('adminModal');$('loginView').classList.remove('hidden');$('adminView').classList.add('hidden');$('adminPassword').value='';$('loginError').textContent=''};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
$('loginForm').onsubmit=e=>{e.preventDefault();if($('adminPassword').value===ADMIN_PASSWORD){$('loginView').classList.add('hidden');$('adminView').classList.remove('hidden');render()}else $('loginError').textContent='Senha incorreta.'};
$('logout').onclick=()=>{closeModal('adminModal');resetForm()};
$('search').oninput=render;$('categoryFilter').onchange=render;
$('heroPlay').onclick=()=>document.querySelector('.toolbar').scrollIntoView({behavior:'smooth'});
$('movieCover').onchange=async e=>{const f=e.target.files[0];if(f){if(f.size>2*1024*1024){toast('Capa acima de 2 MB. Escolha uma imagem menor.');e.target.value='';return}coverDraft=await fileToDataURL(f);$('movieCoverUrl').value=''}};
$('movieVideo').onchange=async e=>{const f=e.target.files[0];if(f){if(f.size>80*1024*1024){toast('Vídeo acima de 80 MB neste protótipo. Use um link de streaming autorizado.');e.target.value='';return}videoDraft={name:f.name,type:f.type,data:await fileToDataURL(f)} }};
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
function resetForm(){ $('movieForm').reset();$('movieId').value='';coverDraft=null;videoDraft=null;$('cancelEdit').classList.add('hidden');$('movieForm').querySelector('button[type=submit]').textContent='Salvar título'}
$('cancelEdit').onclick=resetForm;
$('movieForm').onsubmit=e=>{e.preventDefault();const id=$('movieId').value;const old=movies.find(m=>m.id===id);const item={id:id||String(Date.now()),title:$('movieTitle').value.trim(),description:$('movieDescription').value.trim(),category:$('movieCategory').value.trim()||'Outros',year:$('movieYear').value,coverData:coverDraft!==null?coverDraft:(old?.coverData||null),coverUrl:$('movieCoverUrl').value.trim()||(old?.coverUrl||''),videoData:videoDraft?videoDraft.data:(old?.videoData||null),videoType:videoDraft?videoDraft.type:(old?.videoType||''),videoName:videoDraft?videoDraft.name:(old?.videoName||''),stream:$('movieStream').value.trim(),updatedAt:new Date().toISOString()};
 const prior=movies;movies=id?movies.map(m=>m.id===id?item:m):[item,...movies];if(persist()){resetForm();render();toast('Título salvo neste dispositivo.')}else movies=prior};
document.addEventListener('click',e=>{
 const play=e.target.closest('[data-play]');if(play){showPlayer(play.dataset.play);return}
 const edit=e.target.closest('[data-edit]');if(edit){const m=movies.find(x=>x.id===edit.dataset.edit);if(!m)return;$('movieId').value=m.id;$('movieTitle').value=m.title;$('movieDescription').value=m.description||'';$('movieCategory').value=m.category;$('movieYear').value=m.year||'';$('movieCoverUrl').value=m.coverUrl||'';$('movieStream').value=m.stream||'';coverDraft=null;videoDraft=null;$('cancelEdit').classList.remove('hidden');$('movieForm').querySelector('button[type=submit]').textContent='Atualizar título';$('movieForm').scrollIntoView({behavior:'smooth'});return}
 const del=e.target.closest('[data-delete]');if(del){const m=movies.find(x=>x.id===del.dataset.delete);if(m&&confirm(`Excluir "${m.title}" deste dispositivo?`)){movies=movies.filter(x=>x.id!==m.id);persist();render();toast('Título removido.')}}});
function showPlayer(id){const m=movies.find(x=>x.id===id);if(!m)return;let media='';if(m.videoData)media=`<video class="video-player" controls playsinline preload="metadata" src="${m.videoData}"></video>`;else if(m.stream&&/^https:\/\//i.test(m.stream))media=`<p><a class="primary" style="display:inline-block;text-decoration:none" href="${escapeHTML(m.stream)}" target="_blank" rel="noopener">Abrir streaming autorizado ↗</a></p>`;else media='<p class="muted">Ainda não há vídeo local ou link de streaming cadastrado para este título.</p>';
$('playerContent').innerHTML=`<h2>${escapeHTML(m.title)}</h2>${coverOf(m)?`<img class="player-poster" src="${coverOf(m)}" alt="">`:''}<p class="player-description">${escapeHTML(m.description||'')}${m.year?' • '+escapeHTML(m.year):''}</p>${media}<p class="small-note">Disponibilize somente conteúdo que você tenha autorização para armazenar ou transmitir.</p>`;openModal('playerModal')}
$('exportData').onclick=()=>{const blob=new Blob([JSON.stringify(movies,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='carlin-flix-catalogo.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
load();
