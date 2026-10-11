/* Loja do Detalhamento · loja Tray: faixa de avisos, cabeçalho ao rolar, preço no Pix, variações em botões,
   garantias e animações de entrada. Sem dependência: roda depois do jQuery do tema, mas não usa. */
(function () {
  'use strict';
  if (window.__ldLoja) return; // carregado pelo campo JS Personalizado e, em temas antigos, também pelo footer-scripts
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
      '<span>Parcele em até <b>12x</b> no cartão</span>' +
      '<a href="' + WA + '" target="_blank" rel="noopener">Dúvida sobre o produto certo? <b>Fale com um especialista</b></a>' +
      '<span>Loja física no <b>Taquaral, Campinas</b></span>' +
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

  /* ---------- cabeçalho compacto ao rolar ---------- */
  function header() {
    var h = $('.header'), bw = $('.body-wrapper--padded'); if (!h) return;
    var on = function () { h.classList.toggle('ld-scrolled', window.scrollY > 60); };
    addEventListener('scroll', on, { passive: true }); on();
    // o tema calcula o recuo do conteúdo com a linha 1 (que escondemos); recalcula pela altura real, sem o encolhimento
    if (bw && window.ResizeObserver) {
      var fit = function () { if (!h.classList.contains('ld-scrolled')) bw.style.setProperty('padding-top', h.offsetHeight + 'px', 'important'); };
      new ResizeObserver(fit).observe(h); fit();
    }
  }

  /* ---------- página de produto ---------- */
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

    // destaque do Pix: lê o valor à vista que a própria Tray calcula (muda com a variação)
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

    // garantias abaixo do botão de comprar
    if (right && !$('.ld-trust')) {
      var t = d.createElement('div'); t.className = 'ld-trust';
      t.innerHTML =
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.6"/></svg><span><b>Envio para todo o Brasil</b>Calcule o frete acima</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M8.5 12l2.5 2.5 4.5-5"/></svg><span><b>Compra segura</b>Produto original, com nota</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 10h16v10H4zM3 6h18v4H3z"/></svg><span><b>Retire na loja</b>Taquaral, Campinas</span></div>' +
        '<div><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M20 12a8 8 0 1 1-3.3-6.5L20 4v5h-5"/></svg><span><b>Dúvida no uso?</b><a href="' + WA + '" target="_blank" rel="noopener">Fale com um especialista</a></span></div>';
      var anchor = $('.product-details__social', right) || null;
      right.insertBefore(t, anchor && anchor.parentNode === right ? anchor : null);
    }
  }

  /* ---------- página de produto no celular: benefícios, CEP único, seções recolhíveis, barra fixa com preço ---------- */
  function productExtras() {
    var form = $('#form_comprar'); if (!form) return;
    var mobile = window.matchMedia('(max-width: 767px)').matches;

    // 3 selos de benefício abaixo do resumo, tirados dos destaques da descrição
    var hl = $$('.ld-desc__hl li strong').slice(0, 3);
    var after = $('.ld-sub') || $('.product-details__name');
    if (hl.length && after && !$('.ld-benefits')) {
      var ul = d.createElement('ul'); ul.className = 'ld-benefits';
      ul.innerHTML = hl.map(function (s) { return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.2 4.2L19 7"/></svg><span>' + s.textContent.trim() + '</span></li>'; }).join('');
      after.parentNode.insertBefore(ul, after.nextSibling);
    }

    // CEP num campo só (preenche os dois campos da Tray por baixo)
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

    // descrição em seções recolhíveis no celular (resumo e destaques continuam abertos)
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

    // barra fixa: preço e Pix ao lado do botão
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
      // com preço promocional a Tray calcula o Pix sobre o preço cheio: se o "Pix" sair maior que o preço do card, esconde
      var offer = p.closest('.product__offer'), pix = $('.precoAvista', p);
      var vals = offer ? $$('.product__price__value, .product__price--offer, .product__price--promotional', offer).map(function (e) { return num(e.textContent); }).filter(Boolean) : [];
      var menor = vals.length ? Math.min.apply(null, vals) : 0;
      if (pix && menor && num(pix.textContent) >= menor) [pix, av, $('.txt-forma-pagamento', p)].forEach(function (e) { if (e) e.style.display = 'none'; });
    });
  }

  /* ---------- animação de entrada ---------- */
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.showcase__inner, .featured-categories, .features, .banner__group, .site-brands, .catalog .product').forEach(function (el, i) {
      if (el.getBoundingClientRect().top < innerHeight) return; // já visível: não esconde
      el.classList.add('ld-reveal'); el.style.transitionDelay = (el.classList.contains('product') ? (i % 4) * 70 : 0) + 'ms'; io.observe(el);
    });
  }

  function init() {
    d.documentElement.classList.add('ld');
    announce(); header(); product(); productExtras(); cards(); reveal();
    // seções da home que ficam só com o título quando não há conteúdo (notícias, depoimentos)
    setTimeout(function () {
      $$('.latest-news, .customer-reviews').forEach(function (s) {
        if (!$$('article, .news-item, .dep_item, .review, li, .slick-slide', s).length) s.style.display = 'none';
      });
    }, 3500);
    // vitrines carregam preço por ajax: reaplica nos cards novos
    var mo = new MutationObserver(function () { clearTimeout(mo.t); mo.t = setTimeout(cards, 150); });
    mo.observe(d.body, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
