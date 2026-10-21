
const chat = document.querySelector('#chat');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');

function add(t, c) {
  const d = document.createElement('div');
  d.className = 'msg ' + c;

  if (c !== 'bot') {
    d.textContent = t;
  } else {
    const content = document.createElement('div');
    content.className = 'bot-content';

    const escapeHtml = s => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const formatInline = s => escapeHtml(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>')
      .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');

    let list = null;
    let listType = '';
    let paragraph = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const p = document.createElement('p');
      p.innerHTML = formatInline(paragraph.join(' '));
      content.appendChild(p);
      paragraph = [];
    };

    const closeList = () => {
      list = null;
      listType = '';
    };

    String(t).split(/\r?\n/).forEach(raw => {
      const line = raw.trim();

      if (!line) {
        flushParagraph();
        closeList();
        return;
      }

      if (/^([-*_])\1{2,}$/.test(line)) {
        flushParagraph();
        closeList();
        const divider = document.createElement('hr');
        content.appendChild(divider);
        return;
      }

      const heading = /^(#{1,6})\s+(.+)$/.exec(line);
      if (heading) {
        flushParagraph();
        closeList();

        const level = Math.min(heading[1].length, 4);
        const h = document.createElement('h' + level);
        h.innerHTML = formatInline(heading[2].replace(/\s+#+$/, ''));
        content.appendChild(h);
        return;
      }

      const bullet = /^(?:[-•]|\*|\+)\s+(.+)$/.exec(line);
      const ordered = /^\d+[.)]\s+(.+)$/.exec(line);
      const match = ordered || bullet;

      if (match) {
        flushParagraph();

        const type = ordered ? 'ol' : 'ul';
        if (!list || listType !== type) {
          closeList();
          list = document.createElement(type);
          content.appendChild(list);
          listType = type;
        }

        const li = document.createElement('li');
        li.innerHTML = formatInline(match[1]);
        list.appendChild(li);
        return;
      }

      if (/^>\s?/.test(line)) {
        flushParagraph();
        closeList();

        const quote = document.createElement('blockquote');
        quote.innerHTML = formatInline(line.replace(/^>\s?/, ''));
        content.appendChild(quote);
        return;
      }

      closeList();
      paragraph.push(line);
    });

    flushParagraph();
    d.appendChild(content);
  }

  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

async function ask(q) {
  add(q, 'user');

  const t = document.createElement('div');
  t.className = 'msg bot';
  t.textContent = 'Thinking…';
  chat.appendChild(t);

  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q })
    });

    const x = await r.json();
    t.remove();
    add(x.reply || 'Please contact Blackjew Consultants directly.', 'bot');
  } catch (e) {
    t.textContent = 'AI connection unavailable. Please use WhatsApp or email.';
  }
}

chatForm.onsubmit = e => {
  e.preventDefault();
  const q = chatInput.value.trim();

  if (q) {
    chatInput.value = '';
    ask(q);
  }
};

document.querySelectorAll('.quick button').forEach(b => {
  b.onclick = () => ask(b.dataset.q);
});

document.querySelectorAll('.service').forEach(b => {
  b.onclick = () => {
    document.querySelector('#ai').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => ask(
      'I want to enquire about ' + b.dataset.service +
      '. Please explain what is included and what information you need from me.'
    ), 400);
  };
});

const lead = document.querySelector('#leadForm');
const result = document.querySelector('#leadResult');

lead.onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(lead));
  result.textContent = 'Submitting…';

  try {
    const r = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const x = await r.json();

    if (x.ok) {
      result.className = 'success';
      result.textContent =
        'Thank you. Your enquiry has been prepared for Blackjew Consultants. We will contact you using your preferred method.';
      lead.reset();
    } else {
      throw Error('Enquiry submission failed');
    }
  } catch (e) {
    result.className = 'error';
    result.textContent =
      'We could not submit the enquiry right now. Please use WhatsApp or email below.';
  }
};

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
    menuToggle.setAttribute(
      'aria-label',
      willOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  });

  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}
