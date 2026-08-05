// =====================================================================
// Boltzmenn navbar JS -- Jekyll asset.
// Include before </body>:
// <script src="{{ '/assets/js/navbar.js' | relative_url }}"></script>
//
// The panel starts inside the navbar in the shared include, then moves
// to <body> at runtime. The navbar uses backdrop-filter, which creates a
// containing block for fixed descendants in modern browsers; leaving
// the panel inside it can collapse the panel to the navbar's height.
// Moving it to <body> makes position:fixed reliably viewport-relative.
// =====================================================================
(function(){
  var btn = document.getElementById('bmMenuButton');
  var panel = document.getElementById('bmMobileMenu');
  if(!btn || !panel) return;

  document.body.appendChild(panel);

  panel.style.position = 'fixed';
  panel.style.left = '0';
  panel.style.right = '0';
  panel.style.bottom = '0';
  panel.style.background = '#fff';
  panel.style.zIndex = '9999';
  panel.style.overflowY = 'auto';
  panel.style.display = 'none';

  function setPanelTop(){
    var navbar = document.querySelector('.bm-navbar-solid');
    panel.style.top = (navbar ? Math.ceil(navbar.getBoundingClientRect().bottom) : 64) + 'px';
  }

  function close(){
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded','false');
    btn.classList.remove('open');
    document.body.classList.remove('bm-menu-open');
  }

  function open(){
    setPanelTop();
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded','true');
    btn.classList.add('open');
    document.body.classList.add('bm-menu-open');
  }

  panel.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-controls', 'bmMobileMenu');

  btn.addEventListener('click', function(){
    if(btn.getAttribute('aria-expanded') === 'true') close();
    else open();
  });

  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){
      close();
      btn.focus();
    }
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 991) close();
    else if(btn.getAttribute('aria-expanded') === 'true') setPanelTop();
  });
})();
