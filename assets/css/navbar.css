/* =====================================================================
   Boltzmenn navbar styles — Jekyll asset.
   Only rules actually referenced by _includes/header.html live here.

   The real .navbar is transparent by default (--neutral-dark-0 in
   boltzmenn-brand.css resolves to a 0%-opacity color-mix, confirmed
   by reading the token directly -- it's not black). That only reads
   correctly over a dark photo hero, which this site doesn't have, so
   it's forced solid white here.

   The CTA stays teal/green per Boltzmenn's brand guide (which rules
   out black as primary) -- the raw template's own default button
   color is actually black/neutral-dark-100, also checked directly.
===================================================================== */
:root{
  --bm-teal:#0b8c88; --bm-teal-d:#076e6b; --bm-teal-e:#1eb085;
  --bm-nb:#1A1A1A; --bm-grey:#6B6B6B; --bm-border:#E4EEEE;
}

.bm-navbar-solid{position:fixed;top:0;left:0;right:0;z-index:900;
  background:rgba(14,13,12,.55)!important;
  backdrop-filter:blur(14px) saturate(160%);
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  border-bottom:1px solid rgba(255,255,255,.08);}
.bm-navbar-solid .nav-link,.bm-navbar-solid .brand-navbar .logo-nav{color:#fff!important;}
.bm-navbar-solid .icon-menu{color:#fff!important;}
.bm-navbar-solid .nav-link.w--current{color:var(--bm-teal-e)!important;font-weight:700;}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .bm-navbar-solid{background:rgba(14,13,12,.92)!important;}
}

/* .right-nav isn't a defined class in boltzmenn-brand.css -- no flex
   rule at all by default, which without this causes its children
   (language button, CTA, hamburger) to stack vertically instead of
   sitting in a row. */
.right-nav{display:flex;align-items:center;gap:12px;}

.bm-lang{position:relative;}
.bm-lang-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.38);background:rgba(255,255,255,.08);
  display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;font-weight:700;
  color:#fff;padding:0;line-height:1;}
.bm-lang-btn:hover{border-color:var(--bm-teal);color:var(--bm-teal);}
.bm-lang-panel{position:absolute;top:44px;right:0;background:#fff;border:1px solid var(--bm-border);
  border-radius:10px;padding:8px;min-width:140px;box-shadow:0 10px 30px rgba(0,0,0,.12);
  opacity:0;pointer-events:none;transform:translateY(6px);transition:opacity .2s,transform .2s;z-index:20;}
.bm-lang.open .bm-lang-panel{opacity:1;pointer-events:auto;transform:none;}
.bm-lang-panel[hidden]{display:none;}
.bm-lang-panel a{display:block;padding:8px 10px;border-radius:7px;font-size:12px;color:var(--bm-grey);text-decoration:none;}
.bm-lang-panel a:hover{background:#F5F5F5;color:var(--bm-nb);}
.bm-lang-panel a.active{background:#EAF7F4;color:var(--bm-teal-d);font-weight:700;}

.bm-cta-solid{background:linear-gradient(135deg,#0b8c88,#1eb085)!important;}
.bm-cta-solid .button-bg{display:none;}
.bm-cta-solid .button-text{color:#fff!important;padding:0 6px;}

/* Services dropdown: the real .dropdown-list/.content-dropdown classes
   in boltzmenn-brand.css are built for a full multi-column mega-menu
   (max-width: 1800px, width: 100%) -- without that exact grid
   structure they render oversized and misplaced. This is a small,
   self-contained panel instead. */
.dropdown{position:relative;}
.dropdown-list{position:absolute!important;top:38px;left:0;width:auto!important;min-width:230px;
  background:#fff;border:1px solid var(--bm-border);border-radius:12px;padding:10px;
  box-shadow:0 14px 36px rgba(0,0,0,.12);opacity:0;pointer-events:none;transform:translateY(8px);
  transition:opacity .2s,transform .2s;z-index:30;}
.dropdown:hover .dropdown-list,.dropdown:focus-within .dropdown-list{opacity:1;pointer-events:auto;transform:none;}
.nav-column-item{display:block;padding:9px 10px;border-radius:8px;text-decoration:none;color:var(--bm-nb);}
.nav-column-item:hover{background:#F5F5F5;}
.nav-column-item .text-small{color:var(--bm-grey);font-size:11px;margin-top:2px;}

/* Custom hamburger -- deliberately NOT built on Webflow's
   .menu-button/.w-nav-button classes. Their default (pre-JS-init)
   visible/clickable state depends on Webflow's own runtime, which
   doesn't exist outside their platform, and caused two separate
   "button does nothing" bugs during development. This button's
   entire state lives in this file and navbar.js -- nothing invisible. */
.bm-hamburger-btn{display:none;width:36px;height:36px;border:1px solid var(--bm-border);border-radius:50%;
  background:#fff;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:4px;padding:0;}
.bm-hamburger-btn span{display:block;width:16px;height:1.5px;background:var(--bm-nb);transition:.25s;}
.bm-hamburger-btn.open span:nth-child(1){transform:translateY(5.5px) rotate(45deg);}
.bm-hamburger-btn.open span:nth-child(2){opacity:0;}
.bm-hamburger-btn.open span:nth-child(3){transform:translateY(-5.5px) rotate(-45deg);}
@media(max-width:991px){.bm-hamburger-btn{display:flex;}}

/* Mobile menu -- navbar.js moves it to <body> so its fixed positioning
   is viewport-relative and cannot be trapped by the blurred navbar. */
#bmMobileMenu{display:none;box-sizing:border-box;}
body.bm-menu-open{overflow:hidden;}

/* Body needs no padding-top override here -- .hero-home-a-section (or
   whatever section leads each page) should carry its own
   padding-top: var(--section-padding--medium) from boltzmenn-brand.css
   as built-in nav clearance. If a page's hero doesn't have that class,
   give its first section top padding of at least 76px directly rather
   than adding a global body override -- a global one stacks with any
   section that already has its own clearance, producing a double gap
   (this exact bug shipped once already). */
