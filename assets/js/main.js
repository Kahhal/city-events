/* ==========================================================================
   City Events – Main JS (Project #2 structure)
   Works with:
   - assets/css/styles.css
   - assets/img/flag-ar.png, flag-en.png, logo1.png
   -------------------------------------------------------------------------- */

(() => {
  // ============================ I18N (Arabic / English) ============================
  const DICT = {
    ar: {
      'nav.brand': 'دليل الفعاليات',
      'nav.home': 'الرئيسية',
      'nav.events': 'كل الفعاليات',
      'nav.about': 'عن الدليل',
      'nav.contact': 'اتصل بنا',

      'page.index.title': 'الرئيسية',
      'page.events.title': 'كل الفعاليات',
      'page.about.title': 'عن الدليل',
      'page.contact.title': 'اتصل بنا',
      'page.event.title': 'تفاصيل الفعالية',

      'hero.title': 'فعاليات مدينتك بين يديك',
      'hero.subtitle': 'استكشف، صفِّ حسب التصنيف والتاريخ، وتابع أبرز الأحداث القادمة',
      'hero.cta': 'استكشاف الفعاليات',

      'filter.category': 'التصنيف',
      'filter.fromDate': 'ابتداءً من التاريخ',
      'filter.clear': 'مسح المرشحات',
      'filter.allCats': 'كل التصنيفات',

      'btn.details': 'التفاصيل',

      'cat.music': 'موسيقى',
      'cat.culture': 'ثقافة',
      'cat.sport': 'رياضة',
      'cat.family': 'عائلي',

      'footer.backTop': 'العودة للأعلى ↑',

      'form.ok': 'تم الإرسال بنجاح (تجريبي).',
      'form.err': 'رجاءً أدخل بيانات صحيحة.',
      'book.ok': 'تم حجزك مبدئيًا. سنراسلك عبر البريد.',
      'book.err': 'تحقق من الاسم والبريد وعدد المقاعد (1–10).',
      'newsletter.ok': 'تم الاشتراك بنجاح (تجريبي).',

      'ph.name': 'الاسم *',
      'ph.email': 'البريد الإلكتروني *',
      'ph.message': 'رسالتك *'
    },
    en: {
      'nav.brand': 'City Events',
      'nav.home': 'Home',
      'nav.events': 'All Events',
      'nav.about': 'About',
      'nav.contact': 'Contact',

      'page.index.title': 'Home',
      'page.events.title': 'All Events',
      'page.about.title': 'About',
      'page.contact.title': 'Contact',
      'page.event.title': 'Event Details',

      'hero.title': 'City events at your fingertips',
      'hero.subtitle': 'Explore, filter by category & date, and track upcoming highlights',
      'hero.cta': 'Browse Events',

      'filter.category': 'Category',
      'filter.fromDate': 'From Date',
      'filter.clear': 'Clear Filters',
      'filter.allCats': 'All categories',

      'btn.details': 'Details',

      'cat.music': 'Music',
      'cat.culture': 'Culture',
      'cat.sport': 'Sport',
      'cat.family': 'Family',

      'footer.backTop': 'Back to top ↑',

      'form.ok': 'Sent successfully (demo).',
      'form.err': 'Please enter valid information.',
      'book.ok': 'Your seat is tentatively reserved. We will email you.',
      'book.err': 'Check name, email, and seats (1–10).',
      'newsletter.ok': 'Subscribed successfully (demo).',

      'ph.name': 'Name *',
      'ph.email': 'Email *',
      'ph.message': 'Your message *'
    }
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const langBtn = {
    ar: $('#langAr'),
    en: $('#langEn')
  };

  function applyLang(lang) {
    const l = (lang === 'en') ? 'en' : 'ar';
    localStorage.setItem('lang', l);

    document.documentElement.lang = l;
    document.documentElement.dir = (l === 'ar') ? 'rtl' : 'ltr';

    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = DICT[l][key];
      if (val !== undefined) el.textContent = val;
    });

    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = DICT[l][key];
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    const titleEl = $('title[data-i18n]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n');
      const val = DICT[l][key];
      if (val !== undefined) titleEl.textContent = val;
    }

    langBtn.ar?.classList.toggle('active', l === 'ar');
    langBtn.en?.classList.toggle('active', l === 'en');
  }

  const currentLang = localStorage.getItem('lang') || 'ar';
  applyLang(currentLang);

  langBtn.ar?.addEventListener('click', () => applyLang('ar'));
  langBtn.en?.addEventListener('click', () => applyLang('en'));

  // ============================ Back to top ============================
  const toTop = $('#toTop');
  toTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================ Index Slider ============================
  (function initSlider() {
    const root = $('.slider');
    if (!root) return;

    const slides = $$('.slide', root);
    const prev = $('.prev', root);
    const next = $('.next', root);

    let i = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    let timer;

    const show = (idx) => slides.forEach((s, j) => s.classList.toggle('active', j === idx));
    const go = (dir) => { i = (i + dir + slides.length) % slides.length; show(i); restart(); };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(1), 4500); };

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    restart();
  })();

  // ============================ Events Filters ============================
  const cat = $('#cat');
  const date = $('#date');
  const resetFilters = $('#resetFilters');

  function applyFilters() {
    const c = cat?.value || '';
    const d = date?.value || '';
    $$('.event').forEach(card => {
      const okCat = !c || card.dataset.cat === c;         // values: music|culture|sport|family
      const okDate = !d || (card.dataset.date >= d);       // ISO yyyy-mm-dd
      card.style.display = (okCat && okDate) ? '' : 'none';
    });
    if (cat) localStorage.setItem('filter.cat', c);
    if (date) localStorage.setItem('filter.date', d);
  }
  cat?.addEventListener('change', applyFilters);
  date?.addEventListener('change', applyFilters);
  resetFilters?.addEventListener('click', () => { if (cat) cat.value = ''; if (date) date.value = ''; applyFilters(); });

  (function restoreFilters() {
    if (!cat || !date) return;
    const c = localStorage.getItem('filter.cat') || '';
    const d = localStorage.getItem('filter.date') || '';
    if (c) cat.value = c;
    if (d) date.value = d;
    applyFilters();
  })();

  // ============================ Contact Form ============================
  const contactForm = $('#contact-form');
  const contactAlert = $('#form-alert');
  const msg = (k) => (DICT[localStorage.getItem('lang') || 'ar'][k] || '');

  if (contactForm) {
    contactForm.name?.setAttribute('placeholder', msg('ph.name') || contactForm.name?.getAttribute('placeholder') || '');
    contactForm.email?.setAttribute('placeholder', msg('ph.email') || contactForm.email?.getAttribute('placeholder') || '');
    contactForm.message?.setAttribute('placeholder', msg('ph.message') || contactForm.message?.getAttribute('placeholder') || '');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name?.value.trim();
      const email = contactForm.email?.value.trim();
      const text = contactForm.message?.value.trim();
      const okEmail = /^[^@]+@[^@]+\.[^@]+$/.test(email || '');
      const ok = Boolean(name && text && okEmail);

      if (contactAlert) {
        contactAlert.className = 'alert ' + (ok ? 'alert-success' : 'alert-danger');
        contactAlert.textContent = ok ? msg('form.ok') : msg('form.err');
        contactAlert.hidden = false;
      }
      if (ok) contactForm.reset();
    });
  }

  // ============================ Booking Form (event page) ============================
  const bookForm = $('#bookForm');
  const bookAlert = $('#bookAlert');
  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookForm.name?.value.trim();
      const email = bookForm.email?.value.trim();
      const count = Number(bookForm.count?.value || 0);
      const okEmail = /^[^@]+@[^@]+\.[^@]+$/.test(email || '');
      const ok = Boolean(name && okEmail && count > 0 && count <= 10);

      if (bookAlert) {
        bookAlert.className = 'alert ' + (ok ? 'alert-success' : 'alert-danger');
        bookAlert.textContent = ok ? msg('book.ok') : msg('book.err');
        bookAlert.hidden = false;
      }
      if (ok) bookForm.reset();
    });
  }

  // ============================ Newsletter ============================
  const newsletter = $('#newsletter');
  const newsAlert = $('#newsAlert');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      newsAlert?.classList.remove('d-none');
      if (newsAlert) newsAlert.textContent = msg('newsletter.ok');
      newsletter.reset();
    });
  }
})();
