/* SGCB Brasil - loja Tray 689882. Ajustes de layout que o CSS sozinho nao faz.
   Arquivo em ASCII (acentos como \uXXXX): a loja e Latin-1. Editar so aqui (repo lojas-assets). */
(function () {
  if (window.__sgcbLoja) return; window.__sgcbLoja = 1;
  var SITE = 'https://sgcbbrasil.com.br';
  var UTM = 'utm_source=loja-sgcb&utm_medium=loja&utm_campaign=institucional';
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function link(path, content) { return SITE + path + (path.indexOf('?') < 0 ? '?' : '&') + UTM + '&utm_content=' + content; }

  /* a loja so tem a categoria SGCB; o menu mostra direto as linhas (subcategorias), como no site */
  function flatten(list, sel, mk) {
    var root = $('li[data-id="105"]', list) || list.children[0];
    if (!root || root.getAttribute('data-sg')) return;
    var subs = $$(sel, root);
    if (!subs.length) return;
    root.setAttribute('data-sg', '1');
    subs.forEach(function (a) {
      var t = a.textContent.trim(); if (/^Ver categoria$/i.test(t)) t = 'Todos os produtos';
      list.insertBefore(mk(a.getAttribute('href'), t), root);
    });
    root.style.display = 'none';
  }

  function nav() {
    var list = $('.nav .list');
    if (list) flatten(list, '.second-nivel', function (href, txt) {
      var li = document.createElement('li'); li.className = 'sg-nav-cat';
      li.innerHTML = '<a href="' + href + '"><div class="name">' + txt + '</div></a>'; return li;
    });
    var ml = $('.nav-mobile .list-nav');
    if (ml) flatten(ml, 'ul a', function (href, txt) {
      var li = document.createElement('li'); li.className = 'sg-nav-cat';
      li.innerHTML = '<a href="' + href + '"><span class="text">' + txt + '</span></a>'; return li;
    });
    if (list && !$('.sg-nav-site', list)) {
      [['Sobre a SGCB', '/', 'nav-sobre'], ['Quer revender?', '/revenda.html', 'nav-revenda']].forEach(function (x) {
        var li = document.createElement('li'); li.className = 'sg-nav-site';
        li.innerHTML = '<a href="' + link(x[1], x[2]) + '"><div class="name">' + x[0] + '</div></a>';
        list.appendChild(li);
      });
    }
    var mob = $('.nav-mobile .list-nav');
    if (mob && !$('.sg-nav-site', mob)) {
      var li = document.createElement('li'); li.className = 'sg-nav-site';
      li.innerHTML = '<a href="' + link('/', 'menu-mobile') + '"><span class="text">Sobre a SGCB</span></a>';
      mob.appendChild(li);
    }
  }

  function footer() {
    var logo = $('.footer .logo-box');
    if (logo && !$('.sg-foot-site', logo)) {
      var p = document.createElement('p'); p.className = 'sg-foot-txt';
      p.textContent = 'Ferramentas e equipamentos profissionais para detalhamento automotivo.';
      var a = document.createElement('a'); a.className = 'sg-foot-site'; a.href = link('/', 'rodape');
      a.textContent = 'Conheca a SGCB Brasil -';
      logo.appendChild(p); logo.appendChild(a);
    }
  }

  function a11y() {
    $$('.header .menu').forEach(function (m) { m.setAttribute('role', 'button'); m.setAttribute('aria-label', 'Abrir menu'); });
    $$('.banner-full img:not([alt]), .banner-full img[alt=""]').forEach(function (i) { i.alt = 'SGCB Brasil'; });
  }

  /* descricao em secoes recolhiveis no celular (resumo e destaques continuam abertos) */
  function desc() {
    var d = $('.sgcb-desc');
    if (!d || d.getAttribute('data-acc') || window.innerWidth > 767) return;
    d.setAttribute('data-acc', '1');
    $$(':scope > h2', d).forEach(function (h) {
      var det = document.createElement('details'); det.className = 'sg-acc';
      var sum = document.createElement('summary'); sum.textContent = h.textContent; det.appendChild(sum);
      var n = h.nextElementSibling;
      while (n && n.tagName !== 'H2') { var nx = n.nextElementSibling; det.appendChild(n); n = nx; }
      h.parentNode.replaceChild(det, h);
    });
  }

  function run() { nav(); footer(); a11y(); desc(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
