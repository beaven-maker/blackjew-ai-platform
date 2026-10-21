const chat=document.querySelector('#chat'),chatForm=document.querySelector('#chatForm'),chatInput=document.querySelector('#chatInput');function add(t,c){const d=document.createElement('div');d.className='msg '+c;if(c!=='bot'){d.textContent=t}else{const content=document.createElement('div');content.className='bot-content';const escapeHtml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');let list=null;String(t).split(/\r?\n/).forEach(raw=>{const line=raw.trim();if(!line){list=null;return}const bullet=/^(?:[-•]|\*\s)(?:\s+)?(.+)$/.exec(line);if(bullet){if(!list){list=document.createElement('ul');content.appendChild(list)}const li=document.createElement('li');li.innerHTML=escapeHtml(bullet[1]).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');list.appendChild(li);return}list=null;const p=document.createElement('p');p.innerHTML=escapeHtml(line).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/(^|\s)\*(\S[^*]*?)\*(?=\s|$)/g,'$1<em>$2</em>');content.appendChild(p)});d.appendChild(content)}chat.appendChild(d);chat.scrollTop=chat.scrollHeight}async function ask(q){add(q,'user');const t=document.createElement('div');t.className='msg bot';t.textContent='Thinking…';chat.appendChild(t);try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q})});const x=await r.json();t.remove();add(x.reply||'Please contact Blackjew Consultants directly.','bot')}catch(e){t.textContent='AI connection unavailable. Please use WhatsApp or email.'}}chatForm.onsubmit=e=>{e.preventDefault();const q=chatInput.value.trim();if(q){chatInput.value='';ask(q)}};document.querySelectorAll('.quick button').forEach(b=>b.onclick=()=>ask(b.dataset.q));document.querySelectorAll('.service').forEach(b=>b.onclick=()=>{document.querySelector('#ai').scrollIntoView({behavior:'smooth'});setTimeout(()=>ask('I want to enquire about '+b.dataset.service+'. Please explain what is included and what information you need from me.'),400)});const lead=document.querySelector('#leadForm'),result=document.querySelector('#leadResult');lead.onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(lead));result.textContent='Submitting…';try{const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const x=await r.json();if(x.ok){result.className='success';result.textContent='Thank you. Your enquiry has been prepared for Blackjew Consultants. We will contact you using your preferred method.';lead.reset()}else{throw Error()}}catch(e){result.className='error';result.textContent='We could not submit the enquiry right now. Please use WhatsApp or email below.'}};
/* Accessible responsive navigation */
const menuToggle = document.querySelector('#menuToggle');
const primaryNav = document.querySelector('#primaryNav');
if (menuToggle && primaryNav) {
  const closeMenu = () => {
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    primaryNav.classList.toggle('open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}
