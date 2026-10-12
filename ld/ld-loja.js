/* Loja do Detalhamento \u00b7 loja Tray: faixa de avisos, cabe\u00e7alho ao rolar, pre\u00e7o no Pix, varia\u00e7\u00f5es em bot\u00f5es,
   garantias e anima\u00e7\u00f5es de entrada. Sem depend\u00eancia: roda depois do jQuery do tema, mas n\u00e3o usa. */
(function () {
  'use strict';
  if (window.__ldLoja) return; // carregado pelo campo JS Personalizado e, em temas antigos, tamb\u00e9m pelo footer-scripts
  window.__ldLoja = true;
  var d = document, $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/5519995304482';

  function brl(v) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function num(t) { var m = String(t || '').replace(/\s/g, '').match(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})/); return m ? parseFloat(m[1].replace(/\./g, '') + '.' + m[2]) : 0; }

  /* ---------- faixa de avisos ---------- */
  function announce() {
    var h = $('.header'); if (!h || $('.ld-announce')) return;
    var bar = d.createElement('div');
    bar.className = 'ld-announce';
    bar.innerHTML = '<div class="ld-announce__track">' +
      '<span class="is-on"><b>3% de desconto</b> pagando no Pix</span>' +
      '<span>Envio para <b>todo o Brasil</b></span>' +
      '<span>Parcele em at\u00e9 <b>12x</b> no cart\u00e3o</span>' +
      '<a href="' + WA + '" target="_blank" rel="noopener">D\u00favida sobre o produto certo? <b>Fale com um especialista</b></a>' +
      '<span>Loja f\u00edsica no <b>Taquaral, Campinas</b></span>' +
      '</div>';
    h.insertBefore(bar, h.firstChild);
    var items = $$('.ld-announce__track > *', bar), i = 0;
    if (items.length < 2 || reduce) return;
    setInterval(function () {
      if (d.hidden) return;
      var cur = items[i]; i = (i + 1) % items.length;
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      items[i].classList.remove('is-out'); items[i].classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 700);
    }, 4200);
  }

  /* ---------- cabe\u00e7alho compacto ao rolar ---------- */
  function header() {
    var h = $('.header'), bw = $('.body-wrapper--padded'); if (!h) return;
    var on = function () { h.classList.toggle('ld-scrolled', window.scrollY > 60); };
    addEventListener('scroll', on, { passive: true }); on();
    // o tema calcula o recuo do conte\u00fado com a linha 1 (que escondemos); recalcula pela altura real, sem o encolhimento
    if (bw && window.ResizeObserver) {
      var fit = function () { if (!h.classList.contains('ld-scrolled')) bw.style.setProperty('padding-top', h.offsetHeight + 'px', 'important'); };
      new ResizeObserver(fit).observe(h); fit();
    }
  }

  /* ---------- p\u00e1gina de produto ---------- */
  function product() {
    var form = $('#form_comprar'); if (!form) return;
    var right = $('.product-details__right');

    // marca acima do nome
    var brand = $$('.product-details__details a, .product-details__details span').filter(function (a) { return /marca/i.test((a.previousElementSibling || {}).textContent || a.parentNode.textContent.slice(0, 8)); })[0];
    var name = $('.product-details__name');
    if (name && !$('.ld-brand-chip')) {
      var b = (brand && brand.textContent.trim()) || (name.textContent.split(' - ').pop() || '').trim();
      if (b && b.length < 30) { var chip = d.createElement(brand && brand.href ? 'a' : 'span'); chip.className = 'ld-brand-chip'; chip.textContent = b; if (brand && brand.href) chip.href = brand.href; name.parentNode.insertBefore(chip, name); }
    }

    // destaque do Pix: l\u00ea o valor \u00e0 vista que a pr\u00f3pria Tray calcula (muda com a varia\u00e7\u00e3o)
    function pix() {
      var box = $('.ld-pix-badge'), info = $('#info_preco');
      var av = info && $('.precoAvista', info), main = $('#variacaoPreco') || $('#preco_atual');
      var forma = info && $('.txt-forma-pagamento', info);
      var v = av ? num(av.textContent) : 0, p = main ? (num(main.textContent) || parseFloat(main.value) || 0) : 0;
      if (!v || (forma && !/pix/i.test(forma.textContent)) || (p && v >= p)) { if (box) box.remove(); return; }
      var pct = p > v ? Math.round((1 - v / p) * 100) : 0;
      if (!box) { box = d.createElement('div'); box.className = 'ld-pix-badge'; info.parentNode.insertBefore(box, info); }
      var html = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.7 3.3a1 1 0 0 0-1.4 0L8.4 6.2h.4c.8 0 1.5.3 2 .8l1.2 1.2 1.2-1.2c.5-.5 1.3-.8 2-.8h.4l-2.9-2.9Zm3.6 4.3c-.4 0-.8.2-1.1.5L13.1 10a1.5 1.5 0 0 1-2.2 0L8.8 8.1c-.3-.3-.7-.5-1.1-.5H6.4L3.3 10.7a1.9 1.9 0 0 0 0 2.6l3.1 3.1h1.3c.4 0 .8-.2 1.1-.5l2.1-2.1a1.5 1.5 0 0 1 2.2 0l2.1 2.1c.3.3.7.5 1.1.5h1.3l3.1-3.1a1.9 1.9 0 0 0 0-2.6l-3.1-3.1h-1.3ZM8.4 17.8l2.9 2.9a1 1 0 0 0 1.4 0l2.9-2.9h-.4c-.8 0-1.5-.3-2-.8L12 15.8 10.8 17c-.5.5-1.3.8-2 .8h-.4Z"/></svg>' +
        '<span><b>' + brl(v) + '</b> no Pix' + (pct ? ' <em>' + pct + '% off</em>' : '') + '</span>';
      if (box.innerHTML !== html) box.innerHTML = html;
    }
    pix();
    var mo = new MutationObserver(function () { clearTimeout(mo.t); mo.t = setTimeout(pix, 120); });
    mo.observe($('#product-priceBox') || form, { subtree: true, childList: true, characterData: true });

    // garantias abaixo do bot\u00e3o de comprar
    if (right && !$('.ld-trust')) {
      var t = d.createElement('div'); t.className = 'ld-trust';
      t.innerHTML =
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/></svg><span><b>Envio para todo o Brasil</b>Calcule o frete acima</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M8.5 12l2.5 2.5 4.5-5"/></svg><span><b>Compra segura</b>Produto original, com nota</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 10h16v10H4zM3 6h18v4H3z"/></svg><span><b>Retire na loja</b>Taquaral, Campinas</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M20 12a8 8 0 1 1-3.3-6.5L20 4v5h-5"/></svg><span><b>D\u00favida no uso?</b><a href="' + WA + '" target="_blank" rel="noopener">Fale com um especialista</a></span></div>';
      var anchor = $('.product-details__social', right) || null;
      right.insertBefore(t, anchor && anchor.parentNode === right ? anchor : null);
    }
  }

  /* ---------- p\u00e1gina de produto no celular: benef\u00edcios, CEP \u00fanico, se\u00e7\u00f5es recolh\u00edveis, barra fixa com pre\u00e7o ---------- */
  function productExtras() {
    var form = $('#form_comprar'); if (!form) return;
    var mobile = window.matchMedia('(max-width: 767px)').matches;

    // 3 selos de benef\u00edcio abaixo do resumo, tirados dos destaques da descri\u00e7\u00e3o
    var hl = $$('.ld-desc__hl li strong').slice(0, 3);
    var after = $('.ld-sub') || $('.product-details__name');
    if (hl.length && after && !$('.ld-benefits')) {
      var ul = d.createElement('ul'); ul.className = 'ld-benefits';
      ul.innerHTML = hl.map(function (s) { return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.2 4.2L19 7"/></svg><span>' + s.textContent.trim() + '</span></li>'; }).join('');
      after.parentNode.insertBefore(ul, after.nextSibling);
    }

    // CEP num campo s\u00f3 (preenche os dois campos da Tray por baixo)
    var c1 = $('#cep1'), c2 = $('#cep2'), calc = $('#shippingSimulatorButton');
    if (c1 && c2 && calc && !$('.ld-cep')) {
      var box = d.createElement('div'); box.className = 'ld-cep';
      box.innerHTML = '<input type="tel" inputmode="numeric" autocomplete="postal-code" maxlength="9" placeholder="Digite seu CEP" aria-label="CEP">';
      var inp = box.firstChild;
      inp.value = (c1.value || '') + (c2.value ? '-' + c2.value : '');
      inp.addEventListener('input', function () {
        var v = inp.value.replace(/\D/g, '').slice(0, 8);
        inp.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v;
        c1.value = v.slice(0, 5); c2.value = v.slice(5);
      });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); calc.click(); } });
      calc.parentNode.insertBefore(box, calc);
      box.appendChild(calc);
      $('.cepbox') && $('.cepbox').classList.add('ld-cep-on');
    }

    // descri\u00e7\u00e3o em se\u00e7\u00f5es recolh\u00edveis no celular (resumo e destaques continuam abertos)
    var desc = $('.ld-desc');
    if (mobile && desc && !desc.dataset.acc) {
      desc.dataset.acc = 1;
      $$(':scope > h2', desc).forEach(function (h) {
        var det = d.createElement('details'); det.className = 'ld-acc';
        var sum = d.createElement('summary'); sum.textContent = h.textContent; det.appendChild(sum);
        var n = h.nextElementSibling;
        while (n && n.tagName !== 'H2') { var nx = n.nextElementSibling; det.appendChild(n); n = nx; }
        h.replaceWith(det);
      });
    }

    // barra fixa: pre\u00e7o e Pix ao lado do bot\u00e3o
    var bar = $('#floating_buy_container');
    if (bar && !$('.ld-fb-price', bar)) {
      var pr = d.createElement('div'); pr.className = 'ld-fb-price';
      var name = $('.product-details__floating-buy__name', bar);
      bar.insertBefore(pr, name ? name.nextSibling : $('#floating_buy_button'));
      var upd = function () {
        var main = $('#variacaoPreco'), px = $('.ld-pix-badge b');
        var v = main ? main.textContent.trim() : '';
        pr.innerHTML = v ? '<b>R$ ' + v + '</b>' + (px ? '<span>' + px.textContent + ' no Pix</span>' : '') : '';
      };
      upd();
      new MutationObserver(function () { clearTimeout(upd.t); upd.t = setTimeout(upd, 150); }).observe($('#product-priceBox') || form, { subtree: true, childList: true, characterData: true });
    }
  }

  /* ---------- cards: "R$ x no Pix" mais curto ---------- */
  function cards() {
    $$('.product__payment').forEach(function (p) {
      if (p.dataset.ld) return; p.dataset.ld = 1;
      var av = $('.txt-avista', p), cd = $('.txt-com-desconto', p);
      if (av) av.textContent = ' no Pix'; if (cd) cd.remove();
      // com pre\u00e7o promocional a Tray calcula o Pix sobre o pre\u00e7o cheio: se o "Pix" sair maior que o pre\u00e7o do card, esconde
      var offer = p.closest('.product__offer'), pix = $('.precoAvista', p);
      var vals = offer ? $$('.product__price__value, .product__price--offer, .product__price--promotional', offer).map(function (e) { return num(e.textContent); }).filter(Boolean) : [];
      var menor = vals.length ? Math.min.apply(null, vals) : 0;
      if (pix && menor && num(pix.textContent) >= menor) [pix, av, $('.txt-forma-pagamento', p)].forEach(function (e) { if (e) e.style.display = 'none'; });
    });
  }

  /* ---------- anima\u00e7\u00e3o de entrada ---------- */
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.showcase__inner, .featured-categories, .features, .banner__group, .site-brands, .catalog .product').forEach(function (el, i) {
      if (el.getBoundingClientRect().top < innerHeight) return; // j\u00e1 vis\u00edvel: n\u00e3o esconde
      el.classList.add('ld-reveal'); el.style.transitionDelay = (el.classList.contains('product') ? (i % 4) * 70 : 0) + 'ms'; io.observe(el);
    });
  }


  /* =====================================================================
     Configura\u00e7\u00e3o comercial (11/10/2026): o que depende de decis\u00e3o fica aqui, desligado.
     Quando o Nat\u00e3 aprovar, basta preencher e publicar.
     ===================================================================== */
  var CFG = {
    loja: '1315288',
    parcelasSemJuros: null,      // ex.: 6  -> "Parcele em at\u00e9 6x sem juros" (hoje: s\u00f3 "Parcele no cart\u00e3o")
    freteGratisAcima: null,      // ex.: 299 -> "Frete gr\u00e1tis acima de R$ 299" na faixa e nas vantagens
    microfibrasUrl: '/microfibras', // categoria 39 exibida em 11/10/2026
    calculadoraUrl: '/calculadora-de-diluicao',
    dados: window.LD_DADOS || 'https://noblurrst-dotcom.github.io/lojas-assets/ld/'
  };
  // campe\u00f5es de venda: ids pela quantidade vendida (painel Tray, 10/10/2026), s\u00f3 com estoque; atualizar de tempos em tempos
  var CAMPEOES = [117, 361, 65, 319, 59, 137, 177, 895, 75, 289, 1231, 343];
  var ICON = {
    truck: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/></svg>',
    store: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 10h16v10H4zM3 6h18v4H3zM9 20v-5h6v5"/></svg>',
    pix: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.7 3.3a1 1 0 0 0-1.4 0L8.4 6.2h.4c.8 0 1.5.3 2 .8l1.2 1.2 1.2-1.2c.5-.5 1.3-.8 2-.8h.4l-2.9-2.9Zm3.6 4.3c-.4 0-.8.2-1.1.5L13.1 10a1.5 1.5 0 0 1-2.2 0L8.8 8.1c-.3-.3-.7-.5-1.1-.5H6.4L3.3 10.7a1.9 1.9 0 0 0 0 2.6l3.1 3.1h1.3c.4 0 .8-.2 1.1-.5l2.1-2.1a1.5 1.5 0 0 1 2.2 0l2.1 2.1c.3.3.7.5 1.1.5h1.3l3.1-3.1a1.9 1.9 0 0 0 0-2.6l-3.1-3.1h-1.3ZM8.4 17.8l2.9 2.9a1 1 0 0 0 1.4 0l2.9-2.9h-.4c-.8 0-1.5-.3-2-.8L12 15.8 10.8 17c-.5.5-1.3.8-2 .8h-.4Z"/></svg>',
    card: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" stroke-width="1.8" d="M3 10h18M7 15h4"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 16l4.5 4.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
    flask: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M9 3h6M10 3v6L4.5 18.5A1.6 1.6 0 0 0 5.9 21h12.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3"/><path fill="currentColor" d="M7 16h10l1.4 2.5H5.6z" opacity=".35"/></svg>'
  };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var isHome = function () { return d.documentElement.classList.contains('page--home') || location.pathname === '/' ; };
  var isMobile = function () { return matchMedia('(max-width: 767px)').matches; };

  /* ---------- links para /microfibras (categoria 39 oculta) v\u00e3o para a busca enquanto ela n\u00e3o for exibida ---------- */
  function linksQuebrados() {
    if (CFG.microfibrasUrl === '/microfibras') return;
    $$('a[href$="/microfibras"], a[href$="/microfibras/"]').forEach(function (a) { a.href = CFG.microfibrasUrl; });
  }

  /* ---------- \u00edcones nos t\u00edtulos do menu principal (pela URL de cada categoria) ---------- */
  var MENU_ICONS = {
    marcas: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    lavagem: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    polimento: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    interior: '<path d="M8 3h5a2 2 0 0 1 2 2v7H8z"/><path d="M6 12h11l1 4H6z"/><path d="M8 16v5M16 16v5"/>',
    microfibras: '<path d="M4 6h16v4H4z"/><path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/><path d="M9 14h6"/>',
    equipamentos: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    kits: '<path d="M4 9h16v4H4z"/><path d="M5 13v7h14v-7"/><path d="M12 9v11"/><path d="M12 9c-2-4-6-4-6-1.5S9 9 12 9zM12 9c2-4 6-4 6-1.5S15 9 12 9z"/>',
    eventos: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>'
  };
  function menuIcons() {
    $$('.main-menu__level-1 > li > a.main-menu__level-1__link').forEach(function (a) {
      if (a.dataset.ldIcon || a.closest('.ld-menu-calc')) return;
      var slug = (a.getAttribute('href') || '').replace(/^https?:\/\/[^/]+/, '').split('/')[1] || '';
      var paths = MENU_ICONS[slug]; if (!paths) return;
      a.dataset.ldIcon = 1;
      var ic = d.createElement('span'); ic.className = 'ld-micon'; ic.setAttribute('aria-hidden', 'true');
      ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
      a.insertBefore(ic, a.firstChild); a.classList.add('ld-has-icon');
    });
  }

  /* ---------- item "Calculadora" no menu principal (computador e celular) ---------- */
  function menuCalc() {
    var ul = $('.main-menu__level-1'); if (!ul || $('.ld-menu-calc', ul)) return;
    var li = d.createElement('li'); li.className = 'main-menu__level-1__item ld-menu-calc';
    li.innerHTML = '<a class="main-menu__level-1__link ld-has-icon" href="' + CFG.calculadoraUrl + '"><span class="ld-micon" aria-hidden="true">' + ICON.flask + '</span><span class="main-menu__level-1__text">Calculadora</span></a>';
    ul.appendChild(li);
  }

  /* ---------- vantagens: grade pr\u00f3pria (troca o carrossel do tema, que tinha texto de "importadores") ---------- */
  function vantagens() {
    var f = $('section.features'); if (!f || $('.ld-vant')) return;
    var parc = CFG.parcelasSemJuros ? ['At\u00e9 ' + CFG.parcelasSemJuros + 'x sem juros', 'No cart\u00e3o de cr\u00e9dito'] : ['Parcele no cart\u00e3o', 'Pagamento seguro'];
    var frete = CFG.freteGratisAcima ? ['Frete gr\u00e1tis', 'Acima de ' + brl(CFG.freteGratisAcima)] : ['Envio para todo o Brasil', 'Frete no produto'];
    var items = [[ICON.truck, frete[0], frete[1]], [ICON.store, 'Retire na loja', 'Taquaral, Campinas'], [ICON.pix, '3% off no Pix', 'Desconto na hora'], [ICON.card, parc[0], parc[1]]];
    var g = d.createElement('section'); g.className = 'ld-vant'; g.setAttribute('aria-label', 'Vantagens');
    g.innerHTML = items.map(function (x) { return '<div class="ld-vant__i">' + x[0] + '<span><b>' + x[1] + '</b>' + x[2] + '</span></div>'; }).join('');
    f.parentNode.insertBefore(g, f); f.classList.add('ld-hide'); d.documentElement.classList.add('ld-vant-ok');
  }

  /* ---------- home no celular: busca vis\u00edvel + atalhos "mais procurados" ---------- */
  function homeTop() {
    if (!isHome() || $('.ld-mtop')) return;
    var h = $('.header'); if (!h) return;
    var chips = [['Polimento', '/polimento'], ['Lavagem', '/lavagem'], ['Microfibras', CFG.microfibrasUrl], ['Kits', '/kits'], ['Interior', '/interior'],
      ['SGCB', '/marcas/sgcb'], ['IGL Coatings', '/marcas/igl-coatings'], ['Cursos', '/eventos'], ['Calculadora de dilui\u00e7\u00e3o', CFG.calculadoraUrl, 1]];
    var box = d.createElement('div'); box.className = 'ld-mtop';
    box.innerHTML = '<form class="ld-msearch" action="/loja/busca.php" method="get" role="search"><input type="hidden" name="loja" value="' + CFG.loja + '">' +
      '<input type="search" name="palavra_busca" placeholder="O que voc\u00ea procura?" aria-label="Buscar produtos" autocomplete="off"><button aria-label="Buscar">' + ICON.search + '</button></form>' +
      '<div class="ld-chips" aria-label="Mais procurados">' + chips.map(function (c) { return '<a href="' + c[1] + '"' + (c[2] ? ' class="is-tool"' : '') + '>' + (c[2] ? ICON.flask : '') + c[0] + '</a>'; }).join('') + '</div>';
    var main = $('.banner--home__container') || $('.banner__container');
    if (main && main.parentNode) main.parentNode.insertBefore(box, main); else h.parentNode.insertBefore(box, h.nextSibling);
    d.documentElement.classList.add('ld-top-ok');
  }

  /* ---------- home: categorias em grade e vitrines na horizontal no celular ---------- */
  function homeLayout() {
    if (!isHome() || !isMobile()) return;
    var fc = $('.featured-categories');
    if (fc && window.jQuery && jQuery(fc).hasClass('slick-initialized')) { try { jQuery(fc).slick('unslick'); } catch (e) {} }
    if (fc) fc.classList.add('ld-grid');
    $$('.showcase-2 .showcase__slider, .showcase-3 .showcase__slider').forEach(function (sl) { if (!sl.classList.contains('slick-initialized')) sl.classList.add('ld-hscroll'); });
  }

  /* ---------- campe\u00f5es de venda (lista acima; pre\u00e7o e foto v\u00eam ao vivo da loja) ---------- */
  function campeoes() {
    if (!isHome() || $('.ld-champ') || !CAMPEOES.length) return;
    var anchor = $('.showcase-2') || $('.showcase-1'); if (!anchor) return;
    var sec = d.createElement('section'); sec.className = 'ld-champ';
    sec.innerHTML = '<div class="ld-champ__head"><h2>Campe\u00f5es de venda</h2><p>Os produtos que os profissionais mais levam</p></div><div class="ld-champ__track"></div>';
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    var track = $('.ld-champ__track', sec);
    var go = function () {
    Promise.all(CAMPEOES.map(function (id) {
      return fetch('/web_api/products/' + id).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    })).then(function (list) {
      var html = list.map(function (j) {
        var p = j && j.Product; if (!p || String(p.available) !== '1' || +p.stock === 0) return '';
        var img = (p.ProductImage && p.ProductImage[0] && (p.ProductImage[0].https || p.ProductImage[0].http)) || '';
        var url = (p.url && (p.url.https || p.url.http)) || '#';
        var pr = parseFloat(p.promotional_price) > 0 && parseFloat(p.promotional_price) < parseFloat(p.price) ? parseFloat(p.promotional_price) : parseFloat(p.price);
        var name = String(p.name).replace(/\s+-\s+[A-Z\u00c7\u00c30-9 ]{3,}$/, '');
        return '<a class="ld-champ__card" href="' + esc(url) + '"><span class="ld-champ__img"><img loading="lazy" src="' + esc(img) + '" alt=""></span><span class="ld-champ__name">' + esc(name) + '</span><span class="ld-champ__brand">' + esc(p.brand || '') + '</span><b>' + brl(pr) + '</b></a>';
      }).join('');
      if (!html) { sec.remove(); return; }
      track.innerHTML = html;
    });
    };
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '600px 0px' }); io.observe(sec); } else go();
  }

  /* ---------- loja f\u00edsica + cursos (antes do Instagram) ---------- */
  function lojaFisica() {
    if (!isHome() || $('.ld-loja')) return;
    var ig = $('section.instagram'), foot = $('footer.footer'); var ref = ig || foot; if (!ref) return;
    var s = d.createElement('section'); s.className = 'ld-loja';
    s.innerHTML = '<div class="ld-loja__card"><span class="ld-loja__eye">' + ICON.pin + 'Loja f\u00edsica</span><h2>Taquaral, Campinas</h2>' +
      '<p>Av. Dr. Armando Sales de Oliveira, 205 \u00b7 Taquaral, Campinas/SP</p><p class="ld-loja__h">Segunda a sexta 8h30 \u00e0s 17h30 \u00b7 S\u00e1bado 8h30 \u00e0s 12h</p>' +
      '<div class="ld-loja__btns"><a class="ld-btn" href="https://maps.app.goo.gl/jFKhwCPbCjpuskFQ6" target="_blank" rel="noopener">Como chegar</a><a class="ld-btn ld-btn--ghost" href="' + WA + '" target="_blank" rel="noopener">Falar com especialista</a></div></div>' +
      '<a class="ld-loja__card ld-loja__card--alt" href="/eventos"><span class="ld-loja__eye">Cursos e workshops</span><h2>Aprenda com quem faz</h2><p>Cursos presenciais de lavagem, polimento e prote\u00e7\u00e3o em Campinas.</p><span class="ld-btn">Ver agenda</span></a>';
    ref.parentNode.insertBefore(s, ref);
  }

  /* ---------- rodap\u00e9 e Instagram no celular ---------- */
  function footerMobile() {
    if (!isMobile()) return;
    var ig = $('section.instagram'); if (ig) ig.classList.add('ld-ig-compact');
    var pm = $('footer .pages-menu');
    if (pm && !pm.closest('details')) {
      var det = d.createElement('details'); det.className = 'ld-facc';
      det.innerHTML = '<summary>Institucional</summary>';
      pm.parentNode.insertBefore(det, pm); det.appendChild(pm);
    }
  }

  /* ---------- selo de desconto nos cards (aparece sozinho quando houver promo\u00e7\u00e3o vigente) ---------- */
  function badges() {
    $$('.product').forEach(function (p) {
      if (p.dataset.ldOff) return;
      var old = $('.product__price--old, .product__price__old, .product__old-price, del', p), now = $('.product__price__value, .product__price--offer, .product__price--promotional', p);
      if (!old || !now) return;
      var a = num(old.textContent), b = num(now.textContent); if (!a || !b || b >= a) return;
      p.dataset.ldOff = 1;
      var pct = Math.round((1 - b / a) * 100); if (pct < 3) return;
      var tag = d.createElement('span'); tag.className = 'ld-off'; tag.textContent = '-' + pct + '%';
      var box = $('.product__image-outline', p) || p; box.style.position = 'relative'; box.appendChild(tag);
    });
  }

  /* ---------- calculadora de dilui\u00e7\u00e3o (monta em qualquer p\u00e1gina que tenha <div id="ld-calc"></div>) ---------- */
  function calculadora() {
    var root = $('#ld-calc') || $('.ld-calc-mount'); if (!root || root.dataset.on) return; root.dataset.on = 1;
    root.classList.add('ld-calc');
    root.innerHTML = '<div class="ld-calc__head"><span class="ld-calc__eye">' + ICON.flask + 'Ferramenta</span><h1>Calculadora de dilui\u00e7\u00e3o</h1>' +
      '<p>Escolha o produto e o uso, diga quanto quer preparar e veja quanto vai de produto e quanto de \u00e1gua.</p></div>' +
      '<div class="ld-calc__grid"><div class="ld-calc__form">' +
      '<label class="ld-calc__lbl">1. Produto</label><input class="ld-calc__find" type="search" placeholder="Busque pelo nome ou marca" aria-label="Buscar produto"><div class="ld-calc__list" role="listbox"></div>' +
      '<label class="ld-calc__lbl">2. Uso / propor\u00e7\u00e3o</label><div class="ld-calc__uses"><p class="ld-calc__hint">Escolha um produto acima ou digite a propor\u00e7\u00e3o.</p></div>' +
      '<div class="ld-calc__ratio"><span>1 :</span><input type="number" min="1" max="2000" step="1" inputmode="numeric" aria-label="Partes de \u00e1gua para 1 de produto" value="10"></div>' +
      '<label class="ld-calc__lbl">3. Quanto quer preparar?</label><div class="ld-calc__vol"><input type="number" min="1" step="any" inputmode="decimal" value="1" aria-label="Volume final"><select aria-label="Unidade"><option value="1">litros</option><option value="0.001">ml</option></select></div>' +
      '<div class="ld-calc__presets">' + [['500 ml', .5], ['1 L', 1], ['1,5 L', 1.5], ['5 L', 5], ['20 L', 20]].map(function (x) { return '<button type="button" data-l="' + x[1] + '">' + x[0] + '</button>'; }).join('') + '</div>' +
      '</div><div class="ld-calc__out" aria-live="polite"></div></div>' +
      '<p class="ld-calc__note">1:10 = 1 parte de produto para 10 partes de \u00e1gua. As propor\u00e7\u00f5es v\u00eam das orienta\u00e7\u00f5es de uso de cada produto; confira sempre o r\u00f3tulo do fabricante.</p>';
    var data = [], sel = null;
    var find = $('.ld-calc__find', root), list = $('.ld-calc__list', root), uses = $('.ld-calc__uses', root), ratio = $('.ld-calc__ratio input', root), vol = $('.ld-calc__vol input', root), unit = $('.ld-calc__vol select', root), out = $('.ld-calc__out', root);
    function fmt(ml) { return ml >= 1000 ? (ml / 1000).toFixed(ml % 1000 ? 2 : 0).replace('.', ',') + ' L' : (ml < 10 ? ml.toFixed(1).replace('.', ',') : Math.round(ml)) + ' ml'; }
    function calc() {
      var n = parseFloat(ratio.value), v = parseFloat(String(vol.value).replace(',', '.')) * parseFloat(unit.value) * 1000;
      if (!(n > 0) || !(v > 0)) { out.innerHTML = ''; return; }
      var prod = v / (n + 1), agua = v - prod, pct = Math.max(2, Math.min(98, prod / v * 100));
      out.innerHTML = '<div class="ld-calc__res"><span class="ld-calc__tag">Para ' + fmt(v) + ' de solu\u00e7\u00e3o a 1:' + n + '</span>' +
        '<div class="ld-calc__nums"><div><small>Produto</small><b>' + fmt(prod) + '</b></div><div><small>\u00c1gua</small><b>' + fmt(agua) + '</b></div></div>' +
        '<div class="ld-calc__bar"><i style="width:' + pct + '%"></i></div>' +
        (sel ? '<a class="ld-btn" href="' + esc(sel.url) + '">Ver ' + esc(sel.nome) + '</a>' : '') + '</div>';
    }
    function pickUse(u, b) { $$('.ld-calc__use', uses).forEach(function (x) { x.classList.toggle('is-on', x === b); }); ratio.value = u; calc(); }
    function choose(p) {
      sel = p; find.value = p.nome; list.innerHTML = '';
      if (p.pronto_uso && !(p.usos || []).length) { uses.innerHTML = '<p class="ld-calc__hint">Este produto \u00e9 pronto para uso: n\u00e3o precisa diluir.</p>'; out.innerHTML = ''; return; }
      var bts = [];
      (p.usos || []).forEach(function (u) {
        var vals = u.min === u.max ? [u.min] : [u.min, u.max];
        vals.forEach(function (n, i) { bts.push('<button type="button" class="ld-calc__use" data-n="' + n + '"><b>1:' + n + '</b>' + esc(u.uso) + (vals.length > 1 ? (i ? ' (mais suave)' : ' (mais forte)') : '') + '</button>'); });
      });
      uses.innerHTML = bts.join('') || '<p class="ld-calc__hint">Sem propor\u00e7\u00e3o informada.</p>';
      $$('.ld-calc__use', uses).forEach(function (b) { b.addEventListener('click', function () { pickUse(+b.dataset.n, b); }); });
      var first = $('.ld-calc__use', uses); if (first) pickUse(+first.dataset.n, first);
    }
    function render(q) {
      q = (q || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!q) { list.innerHTML = ''; return; }
      var hits = data.filter(function (p) { return p._k.indexOf(q) > -1; }).slice(0, 8);
      list.innerHTML = hits.map(function (p, i) { return '<button type="button" role="option" data-i="' + data.indexOf(p) + '"><img src="' + esc(p.img) + '" alt="" loading="lazy"><span>' + esc(p.nome) + '<small>' + esc(p.marca) + '</small></span></button>'; }).join('') || '<p class="ld-calc__hint">Nenhum produto com dilui\u00e7\u00e3o encontrado.</p>';
      $$('button', list).forEach(function (b) { b.addEventListener('click', function () { choose(data[+b.dataset.i]); }); });
    }
    find.addEventListener('input', function () { sel = null; render(find.value); });
    [ratio, vol, unit].forEach(function (e) { e.addEventListener('input', function () { if (e === ratio) $$('.ld-calc__use', uses).forEach(function (x) { x.classList.toggle('is-on', +x.dataset.n === +ratio.value); }); calc(); }); });
    $$('.ld-calc__presets button', root).forEach(function (b) { b.addEventListener('click', function () { unit.value = '1'; vol.value = b.dataset.l; calc(); }); });
    calc();
    fetch(CFG.dados + 'diluicoes.json').then(function (r) { return r.json(); }).then(function (j) {
      data = (j.produtos || []).filter(function (p) { return (p.usos || []).length; }).map(function (p) { p._k = (p.nome + ' ' + p.marca).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return p; });
      find.placeholder = 'Busque entre ' + data.length + ' produtos (nome ou marca)';
      var m = location.hash.match(/p=(\d+)/); if (m) { var p = data.filter(function (x) { return String(x.id) === m[1]; })[0]; if (p) choose(p); }
    }).catch(function () { find.placeholder = 'Lista de produtos indispon\u00edvel agora: use a propor\u00e7\u00e3o'; });
  }

  /* ---------- acessibilidade: corrige o que o tema da Tray deixa de fora ---------- */
  function a11y() {
    var nomes = { tracking__toggle: 'Rastrear pedido', 'user-account__toggle': 'Minha conta', 'main-menu__toggle': 'Abrir menu', 'cart-toggle': 'Carrinho' };
    $$('button').forEach(function (b) {
      if (b.getAttribute('aria-label')) return;
      for (var c in nomes) if (b.classList.contains(c)) { b.setAttribute('aria-label', nomes[c]); return; }
      if ((b.textContent || '').trim()) return;
      var t = b.getAttribute('title'); if (t) b.setAttribute('aria-label', t);
    });
    $$('a[tabindex]').forEach(function (a) { if (+a.getAttribute('tabindex') > 0) a.setAttribute('tabindex', '0'); });
    $$('.footer h4.visuallyhidden, .footer h5.payment-methods__type').forEach(function (h) { var n = d.createElement(h.tagName === 'H5' ? 'h3' : 'h2'); n.className = h.className; n.innerHTML = h.innerHTML; h.parentNode.replaceChild(n, h); });
    slickA11y();
    if (!a11y.mo && window.MutationObserver) {
      // o slick recoloca role/aria-hidden a cada troca de slide
      a11y.mo = new MutationObserver(function (ms) {
        ms.forEach(function (m) { var e = m.target; if (e.classList && (e.classList.contains('slick-slide') || e.classList.contains('slick-track') || e.classList.contains('featured-category'))) { if (e.hasAttribute('aria-hidden')) e.removeAttribute('aria-hidden'); if (e.hasAttribute('role')) e.removeAttribute('role'); } });
      });
      a11y.mo.observe(d.body, { attributes: true, subtree: true, attributeFilter: ['aria-hidden', 'role'] });
    }
  }
  function slickA11y() {
    $$('.slick-track[role], .slick-slide[role], .featured-category[role]').forEach(function (e) { e.removeAttribute('role'); e.removeAttribute('aria-describedby'); });
    $$('.slick-slide[aria-hidden]').forEach(function (e) { e.removeAttribute('aria-hidden'); });
  }

  function init() {
    d.documentElement.classList.add('ld');
    announce(); header(); linksQuebrados(); menuCalc(); menuIcons(); vantagens(); homeTop(); homeLayout(); campeoes(); lojaFisica(); footerMobile(); calculadora(); a11y(); product(); productExtras(); cards(); badges(); reveal();
    // se\u00e7\u00f5es da home que ficam s\u00f3 com o t\u00edtulo quando n\u00e3o h\u00e1 conte\u00fado (not\u00edcias, depoimentos)
    setTimeout(function () {
      $$('.latest-news, .customer-reviews').forEach(function (s) {
        if (!$$('article, .news-item, .dep_item, .review, li, .slick-slide', s).length) s.style.display = 'none';
      });
    }, 3500);
    // vitrines carregam pre\u00e7o por ajax: reaplica nos cards novos
    var mo = new MutationObserver(function () { clearTimeout(mo.t); mo.t = setTimeout(function () { cards(); badges(); }, 150); });
    mo.observe(d.body, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
  // o tema monta os carross\u00e9is (slick) no load: refaz o layout da home depois disso
  addEventListener('load', function () { setTimeout(homeLayout, 300); setTimeout(a11y, 800); });
})();
