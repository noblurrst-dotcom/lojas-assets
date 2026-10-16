/* IGL Coatings Brasil · loja Tray: avisos, busca, carrosséis e vídeo da home */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* faixa de avisos */
  var ann = $('[data-igl-announce]');
  if (ann) {
    var items = $$('.igl-announce__track > *', ann), cur = 0, timer;
    var go = function (d) {
      var prev = items[cur]; cur = (cur + d + items.length) % items.length;
      prev.classList.remove('is-on'); prev.classList.add('is-out');
      setTimeout(function () { prev.classList.remove('is-out'); }, 600);
      items[cur].classList.add('is-on');
    };
    var loop = function () { clearInterval(timer); timer = setInterval(function () { go(1); }, 4500); };
    $$('.igl-announce__nav', ann).forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.dir); loop(); }); });
    loop();
  }

  /* conta: clicar no ícone leva pro login (ou pra central, se já entrou); a caixa do hover continua */
  $$('.igl-tools .account-icon').forEach(function (ic) {
    ic.addEventListener('click', function () {
      var logado = $('.igl-tools .account [data-logged-user="true"]:not(.tray-hide)');
      location.href = logado ? '/central-do-cliente' : '/my-account/login';
    });
  });

  /* busca pelo ícone */
  var head = $('.igl-header'), tg = $('[data-igl-search]');
  if (head && tg) {
    tg.addEventListener('click', function () {
      head.classList.toggle('is-search');
      if (head.classList.contains('is-search')) { var i = $('.igl-search-panel .input-search', head); if (i) setTimeout(function () { i.focus(); }, 200); }
    });
  }

  /* cabeçalho da home vira branco ao rolar (além do .fixed da Tray) */
  if (document.documentElement.classList.contains('page-home') && head) {
    var onScroll = function () { if (window.innerWidth > 1024) head.classList.toggle('igl-solid', window.scrollY > 80); else head.classList.remove('igl-solid'); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* setas dos carrosséis */
  $$('[data-igl-carousel]').forEach(function (sec) {
    var track = $('.igl-track', sec);
    $$('.igl-arrow', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        var it = $('.item', track); var w = it ? it.getBoundingClientRect().width : 300;
        track.scrollBy({ left: +b.dataset.dir * w * (window.innerWidth > 768 ? 2 : 1), behavior: 'smooth' });
      });
    });
  });

  /* vídeo da home: versão do celular ou do computador */
  var v = $('.igl-video video');
  if (v) {
    v.src = window.matchMedia('(max-width: 768px)').matches ? v.dataset.srcM : v.dataset.srcD;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.removeAttribute('autoplay'); else v.play().catch(function () {});
  }
})();

/* ---------- página de produto ---------- */
(function () {
  if (!document.documentElement.classList.contains('page-product')) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* visualizados: tira o produto aberto, usa foto maior e some quando vazio */
  var here = location.pathname.replace(/\/$/, '');
  var hist = $('.products-history');
  var fixHist = function () {
    if (!hist) return;
    var lis = hist.querySelectorAll('.productList li');
    var left = 0;
    Array.prototype.forEach.call(lis, function (li) {
      var a = li.querySelector('a');
      var path = a ? a.pathname.replace(/\/$/, '') : '';
      if (path === here) { li.style.display = 'none'; return; }
      var img = li.querySelector('img');
      if (img && /\/90_/.test(img.src)) img.src = img.src.replace('/90_', '/');
      left++;
    });
    hist.classList.toggle('igl-empty', left === 0);
  };
  if (hist) {
    hist.classList.add('igl-empty');
    new MutationObserver(fixHist).observe(hist, { childList: true, subtree: true });
    setTimeout(fixHist, 1500);
  }

  /* conteúdo do site institucional (ficha técnica, passo a passo, vídeo, FAQ, PDFs) */
  var box = $('#igl-extra');
  if (!box || !box.dataset.id) return;
  fetch('https://www.iglcoatings.com.br/assets/loja/produtos/' + box.dataset.id + '.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      var h = '';
      /* a descrição cadastrada (.igl-desc) já traz ficha, passo a passo e FAQ: aqui entra só o vídeo */
      if (document.querySelector('.igl-desc')) {
        if (!d.video) { box.remove(); return; }
        d = { video: d.video, url: d.url, name: d.name };
      }
      if (d.keyspecs && d.keyspecs.length) h += '<div class="igl-extra__keys">' + d.keyspecs.map(function (k) { return '<div class="igl-extra__key"><b>' + esc(k.value) + '</b><span>' + esc(k.label) + '</span></div>'; }).join('') + '</div>';
      var left = '', right = '';
      if (d.tech && d.tech.length) left += '<h3>Ficha técnica</h3><table><tbody>' + d.tech.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
      if (d.docs && d.docs.length) left += '<div class="igl-extra__docs">' + d.docs.map(function (x) { return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.kind) + ' (PDF)<small>' + esc(x.label) + '</small></a>'; }).join('') + '</div>';
      if (d.steps && d.steps.length) right += '<h3>Como aplicar</h3><ol>' + d.steps.map(function (s) { return '<li><div><b>' + esc(s[0]) + '</b><p>' + esc(s[1]) + '</p></div></li>'; }).join('') + '</ol>' + (d.note ? '<p class="igl-extra__note">' + esc(d.note) + '</p>' : '');
      if (left || right) h += '<div class="igl-extra__grid"><div>' + left + '</div><div>' + right + '</div></div>';
      if (d.features && d.features.length) h += '<div class="igl-extra__feats">' + d.features.map(function (f) { return '<div class="igl-extra__feat"><img loading="lazy" src="' + esc(f.icon) + '" alt=""><b>' + esc(f.title) + '</b><p>' + esc(f.text) + '</p></div>'; }).join('') + '</div>';
      if (d.video) h += '<div class="igl-extra__video" data-v="' + esc(d.video) + '"><img loading="lazy" src="https://i.ytimg.com/vi/' + esc(d.video) + '/hqdefault.jpg" alt="Vídeo do produto"><button type="button" aria-label="Assistir ao vídeo">&#9658;</button></div>';
      if (d.faq && d.faq.length) h += '<div class="igl-extra__faq" style="margin-top:40px"><h3>Perguntas frequentes</h3>' + d.faq.map(function (q) { return '<details><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1]) + '</p></details>'; }).join('') + '</div>';
      if (d.tech || d.keyspecs) h += '<a class="igl-extra__more" href="' + esc(d.url) + '" target="_blank" rel="noopener">Ver tudo sobre o ' + esc(d.name) + ' no site da IGL &rarr;</a>';
      box.innerHTML = h;
      var v = box.querySelector('.igl-extra__video');
      if (v) v.querySelector('button').addEventListener('click', function () {
        v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.dataset.v + '?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
      });
    })
    .catch(function () { box.remove(); });
})();

/* ---------- preço da página de produto: selo com o desconto do Pix (refaz quando a variação muda o preço) ---------- */
(function () {
  var box = document.querySelector('.product-form #preco');
  if (!box) return;
  var num = function (t) { return parseFloat(String(t).replace(/[^\d,]/g, '').replace(',', '.')) || 0; };
  var busy = false;
  var paint = function () {
    if (busy) return; busy = true;
    var pix = box.querySelector('.preco-avista'), atual = box.querySelector('#preco_atual');
    var old = box.querySelector('.igl-pix-badge'); if (old) old.remove();
    var br = box.querySelector('.igl-pix-break'); if (br) br.remove();
    if (pix && atual) {
      var a = num(pix.textContent), p = parseFloat(atual.value) || 0, pct = p > 0 && a > 0 ? Math.round((1 - a / p) * 100) : 0;
      var b = document.createElement('span'); b.className = 'igl-pix-badge'; b.textContent = pct > 0 ? pct + '% off no Pix' : 'no Pix';
      var k = document.createElement('span'); k.className = 'igl-pix-break';
      pix.after(b); b.after(k);
    }
    setTimeout(function () { busy = false; }, 0);
  };
  paint();
  new MutationObserver(function () { if (!busy) paint(); }).observe(box, { childList: true, subtree: true });
})();

/* ---------- página de produto no celular (11/10/2026): preço na primeira tela, resumo + 3 benefícios,
   descrição aberta em seções recolhíveis e barra fixa com preço e botão de comprar ---------- */
(function () {
  if (!document.documentElement.classList.contains('page-product')) return;
  if (!window.matchMedia('(max-width: 767px)').matches) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  document.documentElement.classList.add('igl-pdp-m');
  var form = $('.product-form'), name = $('.product-form .product-name'), desc = $('.igl-desc');

  // resumo (1ª frase da abertura da descrição) e 3 benefícios (números-chave)
  if (name && desc && !$('.igl-sub')) {
    var lead = $('.igl-desc__lead', desc);
    if (lead) {
      var t = lead.textContent.replace(/\s+/g, ' ').trim(), cut = t.search(/\.(\s|$)/);
      if (cut > 40) t = t.slice(0, cut + 1);
      if (t.length > 170) t = t.slice(0, 165).replace(/\s\S*$/, '') + '\u2026';
      var p = document.createElement('p'); p.className = 'igl-sub'; p.textContent = t;
      name.after(p);
    }
    var keys = $$('.igl-desc__keys li', desc).slice(0, 3);
    if (keys.length) {
      var ul = document.createElement('ul'); ul.className = 'igl-benefits';
      ul.innerHTML = keys.map(function (k) {
        var b = $('strong', k), s = $('span', k);
        return '<li><b>' + esc(b ? b.textContent.trim() : '') + '</b><span>' + esc(s ? s.textContent.trim() : '') + '</span></li>';
      }).join('');
      (lead ? $('.igl-sub') : name).after(ul);
    }
  }

  // descrição: aba aberta, cada título vira uma seção recolhível (resumo e números continuam visíveis)
  var tab = $('#descricao'), tl = $('.tab-link-mobile.description-link-tab');
  // a Tray monta as abas depois e fecha tudo: reabre a descrição quando a página termina de carregar
  var openDesc = function () { if (tab && tl && !tl.dataset.iglUser) { tab.classList.add('active'); tl.classList.add('active'); } };
  if (tl) tl.addEventListener('click', function () { tl.dataset.iglUser = 1; }, true);
  openDesc(); window.addEventListener('load', function () { openDesc(); setTimeout(openDesc, 600); });
  if (desc && !desc.dataset.acc) {
    desc.dataset.acc = 1;
    $$(':scope > h2', desc).forEach(function (h) {
      var det = document.createElement('details'); det.className = 'igl-acc';
      var sum = document.createElement('summary'); sum.textContent = h.textContent; det.appendChild(sum);
      var n = h.nextElementSibling;
      while (n && n.tagName !== 'H2') { var nx = n.nextElementSibling; det.appendChild(n); n = nx; }
      h.replaceWith(det);
    });
  }

  // barra fixa: foto, preço, Pix e comprar (aparece quando o botão da página sai da tela)
  var btn = $('#button-buy');
  if (btn && !$('.igl-fbar')) {
    var img = $('.product-gallery img');
    var bar = document.createElement('div'); bar.className = 'igl-fbar'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = (img ? '<img src="' + esc(img.src) + '" alt="">' : '') + '<div class="igl-fbar__p"></div><button type="button" class="igl-fbar__b" tabindex="-1">Comprar</button>';
    document.body.appendChild(bar);
    var pr = $('.igl-fbar__p', bar);
    var upd = function () {
      var main = $('#variacaoPreco'), pix = $('#info_preco .preco-avista');
      var v = main ? main.textContent.trim() : '', px = pix ? pix.textContent.replace(/\s+/g, '').replace('R$', 'R$ ') : '';
      pr.innerHTML = v ? '<b>R$ ' + esc(v) + '</b>' + (px ? '<span>' + esc(px) + ' no Pix</span>' : '') : '';
    };
    upd();
    var box = $('.product-form #preco');
    if (box) new MutationObserver(function () { clearTimeout(upd.t); upd.t = setTimeout(upd, 150); }).observe(box, { subtree: true, childList: true, characterData: true });
    $('.igl-fbar__b', bar).addEventListener('click', function () {
      // com variação sem escolher, leva até o formulário; senão compra direto
      var sel = $$('#form_comprar select').filter(function (s) { return !s.value; });
      if (sel.length) { form.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      btn.click();
    });
    new IntersectionObserver(function (es) {
      var on = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      bar.classList.toggle('is-on', on); document.documentElement.classList.toggle('igl-fbar-on', on);
      bar.setAttribute('aria-hidden', !on);
    }).observe(btn);
  }
})();
