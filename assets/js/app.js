/* =========================================================================
   UNAERP - Aluno Online : comportamento da interface
   ========================================================================= */
(function () {
  'use strict';

  var D = window.DADOS;
  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  var MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  /* ---------------------------------------------------------------- utils */
  function esc(txt) {
    return String(txt).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  /* =============================== LOADER =============================== */
  var loader = $('#loader');

  function carregar(callback, ms) {
    loader.hidden = false;
    window.setTimeout(function () {
      loader.hidden = true;
      if (callback) callback();
    }, ms || 620);
  }

  /* ============================ MENU LATERAL ============================ */
  var drawer   = $('#menuLateral');
  var overlay  = $('#drawerOverlay');
  var btnMenu  = $('#btnMenu');

  function abrirMenu() {
    overlay.hidden = false;
    /* força um frame antes da transição de opacidade */
    window.requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    btnMenu.setAttribute('aria-expanded', 'true');
    btnMenu.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('is-locked');
  }

  function fecharMenu() {
    overlay.classList.remove('is-visible');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    btnMenu.setAttribute('aria-expanded', 'false');
    btnMenu.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () { overlay.hidden = true; }, 240);
  }

  function menuAberto() { return drawer.classList.contains('is-open'); }

  btnMenu.addEventListener('click', function () {
    if (menuAberto()) { fecharMenu(); } else { abrirMenu(); }
  });
  overlay.addEventListener('click', fecharMenu);

  /* Acordeão do menu: apenas uma seção aberta por vez, como no portal. */
  $$('[data-submenu]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nome  = btn.getAttribute('data-submenu');
      var alvo  = $('[data-sub="' + nome + '"]');
      var aberto = btn.getAttribute('aria-expanded') === 'true';

      $$('[data-submenu]').forEach(function (outro) {
        outro.setAttribute('aria-expanded', 'false');
      });
      $$('.drawer__sub').forEach(function (ul) { ul.hidden = true; });

      if (!aberto) {
        btn.setAttribute('aria-expanded', 'true');
        alvo.hidden = false;
      }
    });
  });

  /* ============================== NAVEGAÇÃO ============================= */
  var TITULOS = { apresentacao: 'Apresentação', boletim: 'Boletim' };

  function irPara(nome) {
    if (!TITULOS[nome]) return;
    fecharMenu();

    carregar(function () {
      $$('.view').forEach(function (v) {
        var ativo = v.id === 'view-' + nome;
        v.classList.toggle('is-active', ativo);
        v.hidden = !ativo;
      });
      $('#tituloPagina').textContent = TITULOS[nome];
      document.title = 'UNAERP | ' + TITULOS[nome];
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  $$('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      irPara(el.getAttribute('data-goto'));
    });
  });

  /* ========================== PAINEL DO ALUNO ========================== */
  var btnAluno = $('#btnAluno');
  var painel   = $('#alunoPainel');

  btnAluno.addEventListener('click', function () {
    var aberto = btnAluno.getAttribute('aria-expanded') === 'true';
    btnAluno.setAttribute('aria-expanded', String(!aberto));
    painel.hidden = aberto;
  });

  /* ========================= MODAL "ALTERAR" =========================== */
  var modal = $('#modalAlterar');
  var ultimoFoco = null;

  function abrirModal() {
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    $('#selCurso').focus();
  }

  function fecharModal() {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    if (ultimoFoco) ultimoFoco.focus();
  }

  $('#btnAlterar').addEventListener('click', abrirModal);
  $$('[data-fechar]', modal).forEach(function (el) {
    el.addEventListener('click', fecharModal);
  });

  $('#btnConfirmar').addEventListener('click', function () {
    var periodo = $('#selPeriodo').value;
    var campus  = $('#selCampus').value;
    fecharModal();
    carregar(function () {
      $('#dadoAnoSem').textContent  = periodo;
      $('#dadoCampus').textContent  = campus;
      $$('.minitable__vazio').forEach(function (td) {
        td.textContent = td.textContent.replace(/\d{4}\/\d/, periodo);
      });
    }, 900);
  });

  /* Mantém o foco dentro do diálogo enquanto ele estiver aberto. */
  modal.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Tab') return;
    var focaveis = $$('button, select, input, a[href]', modal).filter(function (el) {
      return el.offsetParent !== null;
    });
    if (!focaveis.length) return;
    var primeiro = focaveis[0];
    var ultimo   = focaveis[focaveis.length - 1];

    if (ev.shiftKey && document.activeElement === primeiro) {
      ev.preventDefault(); ultimo.focus();
    } else if (!ev.shiftKey && document.activeElement === ultimo) {
      ev.preventDefault(); primeiro.focus();
    }
  });

  /* Esc fecha o que estiver aberto, na ordem de prioridade visual. */
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (!modal.hidden)                { fecharModal(); return; }
    if (!$('#a11yPainel').hidden)     { fecharA11y();  return; }
    if (menuAberto())                 { fecharMenu(); }
  });

  /* ======================= CARROSSEL DE AVISOS ========================= */
  var track  = $('#carrosselTrack');
  var dots   = $('#carrosselDots');
  var indice = 0;
  var timer  = null;

  function montarAvisos() {
    track.innerHTML = D.avisos.map(function (a, i) {
      return '' +
        '<article class="aviso' + (i === 0 ? ' is-active' : '') + '" role="tabpanel" id="aviso-' + i + '">' +
          '<p class="aviso__meta">' +
            (a.novo ? '<span class="aviso__novo">NOVO</span>' : '') +
            '<span class="aviso__data">' + esc(a.data) + '</span>' +
          '</p>' +
          '<div class="aviso__box">' +
            '<h3 class="aviso__titulo">' + esc(a.titulo) + '</h3>' +
            '<p class="aviso__texto">' + esc(a.texto) + '</p>' +
          '</div>' +
          '<button class="aviso__leia" type="button">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 1 1-4.6 13.4l-3.2 3.2-1.4-1.4 3.2-3.2A7.5 7.5 0 0 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="currentColor"/></svg>' +
            'Leia mais' +
          '</button>' +
        '</article>';
    }).join('');

    dots.innerHTML = D.avisos.map(function (a, i) {
      return '<button class="carousel__dot" type="button" role="tab" ' +
             'aria-controls="aviso-' + i + '" aria-selected="' + (i === 0) + '" ' +
             'aria-label="Aviso ' + (i + 1) + ' de ' + D.avisos.length + '"></button>';
    }).join('');

    $$('.carousel__dot', dots).forEach(function (dot, i) {
      dot.addEventListener('click', function () { mostrarAviso(i); reiniciarAuto(); });
    });
  }

  function mostrarAviso(i) {
    indice = (i + D.avisos.length) % D.avisos.length;
    $$('.aviso', track).forEach(function (el, k) {
      el.classList.toggle('is-active', k === indice);
    });
    $$('.carousel__dot', dots).forEach(function (el, k) {
      el.setAttribute('aria-selected', String(k === indice));
    });
  }

  function reiniciarAuto() {
    window.clearInterval(timer);
    timer = window.setInterval(function () { mostrarAviso(indice + 1); }, 6000);
  }

  /* Gesto de arrastar: no iPad passar o aviso com o dedo é o esperado. */
  function ativarSwipe() {
    var x0 = null, y0 = null;
    var area = $('#carrossel');

    area.addEventListener('touchstart', function (ev) {
      x0 = ev.changedTouches[0].clientX;
      y0 = ev.changedTouches[0].clientY;
    }, { passive: true });

    area.addEventListener('touchend', function (ev) {
      if (x0 === null) return;
      var dx = ev.changedTouches[0].clientX - x0;
      var dy = ev.changedTouches[0].clientY - y0;
      /* só reage a gestos claramente horizontais, para não roubar a rolagem */
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        mostrarAviso(indice + (dx < 0 ? 1 : -1));
        reiniciarAuto();
      }
      x0 = y0 = null;
    }, { passive: true });
  }

  /* ========================== AULAS DE HOJE =========================== */
  function montarAulas() {
    $('#tbodyAulas').innerHTML = D.aulas.map(function (a) {
      return '<tr>' +
        '<td class="aulas__sala">' + esc(a.sala) + '</td>' +
        '<td class="aulas__disc">' + esc(a.disciplina) +
          '<span class="aulas__prof">' + esc(a.prof) + '</span></td>' +
        '<td class="aulas__hora">' + esc(a.hora) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ============================= BOLETIM ============================== */
  /* Cada código de status tem o seu próprio ícone e cor no portal. */
  var ICONES_STATUS = {
    REP: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3H7.2a2 2 0 0 0-1.9 1.3l-2.2 5.9a2 2 0 0 0 1.9 2.7h4.3l-.7 3.3a1.9 1.9 0 0 0 3.4 1.5l3.5-5.2V3Zm2 0v9h3.2V3h-3.2Z" fill="currentColor"/></svg>',
    CUR: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5.2l3.2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function statusHTML(codigo) {
    var icone = ICONES_STATUS[codigo] || ICONES_STATUS.CUR;
    return '<span class="boletim__status boletim__status--' + esc(codigo).toLowerCase() + '">' +
           icone + '<span>' + esc(codigo) + '</span></span>';
  }

  function montarBoletim(filtro) {
    var termo = (filtro || '').trim().toLowerCase();
    var linhas = D.boletim.filter(function (d) {
      return !termo || d.disciplina.toLowerCase().indexOf(termo) !== -1;
    });

    if (!linhas.length) {
      $('#tbodyBoletim').innerHTML =
        '<tr><td class="boletim__semdados" colspan="8">Nenhuma disciplina encontrada para "' +
        esc(filtro) + '".</td></tr>';
      return;
    }

    $('#tbodyBoletim').innerHTML = linhas.map(function (d) {
      return '<tr>' +
        '<td class="boletim__disc">' + esc(d.disciplina) + '</td>' +
        '<td>' + esc(d.parcial) + '</td>' +
        '<td>' + esc(d.final) + '</td>' +
        '<td>' + esc(d.media) + '</td>' +
        '<td>' + esc(d.faltas) + '</td>' +
        '<td>' + esc(d.perc) + '</td>' +
        '<td>' + esc(d.atualizacao) + '</td>' +
        '<td>' + statusHTML(d.status) + '</td>' +
      '</tr>';
    }).join('');
  }

  $('#filtroBoletim').addEventListener('input', function (ev) {
    montarBoletim(ev.target.value);
  });

  /* ====================== CALENDÁRIO DE PROVAS ======================== */
  var calAno = D.hoje.ano;
  var calMes = D.hoje.mes;   /* 1-12 */

  function montarCalendario() {
    $('#calMes').textContent = MESES[calMes - 1] + ' ' + calAno;

    var primeiro   = new Date(calAno, calMes - 1, 1).getDay();       /* 0=Dom */
    var diasNoMes  = new Date(calAno, calMes, 0).getDate();
    var diasAntes  = new Date(calAno, calMes - 1, 0).getDate();

    var celulas = [];

    for (var a = primeiro - 1; a >= 0; a--) {
      celulas.push({ dia: diasAntes - a, fora: true });
    }
    for (var d = 1; d <= diasNoMes; d++) {
      celulas.push({ dia: d, fora: false });
    }
    while (celulas.length % 7 !== 0) {
      celulas.push({ dia: celulas.length - diasNoMes - primeiro + 1, fora: true });
    }

    var html = '';
    for (var i = 0; i < celulas.length; i += 7) {
      html += '<tr>' + celulas.slice(i, i + 7).map(function (c) {
        if (c.fora) return '<td class="fora">' + c.dia + '</td>';

        var chave  = calAno + '-' + calMes + '-' + c.dia;
        var eHoje  = calAno === D.hoje.ano && calMes === D.hoje.mes && c.dia === D.hoje.dia;
        var eProva = D.provas.indexOf(chave) !== -1;

        if (eProva) return '<td><span class="prova" title="Prova marcada">' + c.dia + '</span></td>';
        if (eHoje)  return '<td><span class="hoje" title="Hoje">' + c.dia + '</span></td>';
        return '<td>' + c.dia + '</td>';
      }).join('') + '</tr>';
    }
    $('#calBody').innerHTML = html;
  }

  $('#calPrev').addEventListener('click', function () {
    calMes--; if (calMes < 1) { calMes = 12; calAno--; }
    montarCalendario();
  });
  $('#calNext').addEventListener('click', function () {
    calMes++; if (calMes > 12) { calMes = 1; calAno++; }
    montarCalendario();
  });

  /* ========================= ACESSIBILIDADE ========================== */
  var btnA11y   = $('#btnAcessivel');
  var painelA11y = $('#a11yPainel');
  var escala    = 1;

  function fecharA11y() {
    painelA11y.hidden = true;
    btnA11y.setAttribute('aria-expanded', 'false');
  }

  btnA11y.addEventListener('click', function () {
    var aberto = !painelA11y.hidden;
    painelA11y.hidden = aberto;
    btnA11y.setAttribute('aria-expanded', String(!aberto));
  });

  function aplicarEscala() {
    document.documentElement.style.setProperty('--fs-base', (15 * escala).toFixed(1) + 'px');
  }

  $$('[data-a11y]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switch (btn.getAttribute('data-a11y')) {
        case 'fonte-mais':  escala = Math.min(escala + 0.1, 1.6); aplicarEscala(); break;
        case 'fonte-menos': escala = Math.max(escala - 0.1, 0.8); aplicarEscala(); break;
        case 'contraste':   document.body.classList.toggle('alto-contraste'); break;
        case 'reset':
          escala = 1; aplicarEscala();
          document.body.classList.remove('alto-contraste');
          break;
      }
    });
  });

  document.addEventListener('click', function (ev) {
    if (painelA11y.hidden) return;
    if (!painelA11y.contains(ev.target) && !btnA11y.contains(ev.target)) fecharA11y();
  });

  /* ============================== SAIR =============================== */
  $('#btnSair').addEventListener('click', function () {
    if (window.confirm('Deseja realmente sair do Aluno Online?')) {
      fecharMenu();
      carregar(null, 900);
    }
  });

  /* ============================= INÍCIO ============================== */
  montarAvisos();
  ativarSwipe();
  reiniciarAuto();
  montarAulas();
  montarBoletim('');
  montarCalendario();
})();
