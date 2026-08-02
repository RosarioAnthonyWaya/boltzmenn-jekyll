// =====================================================================
// Boltzmenn navbar JS -- Jekyll asset.
// Include before </body>:
// <script src="{{ '/assets/js/navbar.js' | relative_url }}"></script>
//
// Toggles the mobile panel via inline style set directly, not a CSS
// class -- a class-based approach can be silently defeated by a
// transformed ancestor (smooth-scroll libraries like Lenis sometimes
// apply transforms), which creates a new containing block that traps
// position:fixed children. Inline styles set by JS always win
// regardless of that.
// =====================================================================
(function(){
  var btn = document.getElementById('bmMenuButton');
  var panel = document.getElementById('bmMobileMenu');
  if(!btn || !panel) return;
  panel.style.position = 'fixed';
  panel.style.top = '64px';
  panel.style.left = '0';
  panel.style.right = '0';
  panel.style.bottom = '0';
  panel.style.background = '#fff';
  panel.style.zIndex = '9999';
  panel.style.overflowY = 'auto';
  panel.style.display = 'none';
  function close(){ panel.style.display = 'none'; btn.setAttribute('aria-expanded','false'); btn.classList.remove('open'); }
  btn.addEventListener('click', function(){
    var willOpen = panel.style.display === 'none';
    panel.style.display = willOpen ? 'flex' : 'none';
    panel.style.flexDirection = 'column';
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    btn.classList.toggle('open', willOpen);
  });
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 991) close(); });
})();
