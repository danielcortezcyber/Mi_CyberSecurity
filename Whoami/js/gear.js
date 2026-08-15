// js/gear.js (COMPLETO)
(function() {
  "use strict";

  var RECOMMENDATIONS = [
    { name: "Disco SSD Samsung 870 EVO 1TB", cat: "homelab", price: 80, blurb: "Donde viven tus máquinas virtuales." },
    { name: "Mini PC Lenovo M900 (i5, 16GB)", cat: "homelab", price: 180, blurb: "Nodo de virtualización silencioso y barato." },
    { name: "Switch Cisco SG250-24 (Administrable)", cat: "homelab", price: 220, blurb: "VLAN, QoS y spanning tree reales." },
    { name: "Synology DS224+ (NAS 2-bahías)", cat: "homelab", price: 300, blurb: "Backups, Docker y almacenamiento central." },
    { name: "HP EliteDesk 800 G3 (i7, 32GB)", cat: "homelab", price: 320, blurb: "Corre Proxmox + varias VMs sin sudar." },
    { name: "Servidor Dell PowerEdge T30 (Xeon)", cat: "homelab", price: 450, blurb: "Almacenamiento NAS y laboratorio 24/7." },
    { name: "Rack 19'' 12U", cat: "homelab", price: 150, blurb: "Organiza tu equipo profesionalmente." },
    { name: "Cableado Cat6 UTP 305m", cat: "homelab", price: 85, blurb: "Cableado de red de alto rendimiento para tu lab." },
    { name: "TP-Link Archer AX55 (Wi-Fi 6)", cat: "router", price: 110, blurb: "Cobertura sólida para casa y home lab." },
    { name: "MikroTik hAP ax3 (Wi-Fi 6)", cat: "router", price: 160, blurb: "Control total con RouterOS." },
    { name: "Ubiquiti Dream Machine (UDM)", cat: "router", price: 240, blurb: "Red empresarial de nivel proconsumer." },
    { name: "Router Cisco RV340 (Dual WAN)", cat: "router", price: 280, blurb: "VPN, failover y firewall empresarial." },
    { name: "GL.iNet Beryl AX (Travel)", cat: "router", price: 75, blurb: "Router de viaje con VPN integrada." },
    { name: "MikroTik hAP ac3", cat: "router", price: 130, blurb: "Rendimiento sólido y bajo costo." },
    { name: "Kit Destornilladores iFixit Pro", cat: "kit", price: 60, blurb: "El estándar para abrir cualquier equipo." },
    { name: "Muñeca antiestática + Brazalete", cat: "kit", price: 15, blurb: "Protege componentes de ESD." },
    { name: "Multímetro digital Klein Tools", cat: "kit", price: 45, blurb: "Para diagnosticar fuentes y continuidad." },
    { name: "Pinzas + Espátulas + Kit apertura", cat: "kit", price: 25, blurb: "Set de precisión para laptops y móviles." },
    { name: "Tester de fuente ATX", cat: "kit", price: 20, blurb: "Confirma PSU buena/mala en segundos." },
    { name: "Estación de soldadura Pinecil", cat: "kit", price: 50, blurb: "Mini soldador inteligente para reparaciones." },
    { name: "Lupa de aumento con LED", cat: "kit", price: 30, blurb: "Para inspeccionar componentes pequeños." }
  ];

  var TABS = [
    { id: "homelab", label: "Home Labs" },
    { id: "router", label: "Routers" },
    { id: "kit", label: "Kits de Reparación" }
  ];

  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var state = { tab: "homelab", budget: 1200 };

  var icons = {
    homelab: { 'Disco SSD': '💿', 'Mini PC': '🖥️', 'Switch': '🔀', 'Synology': '💾', 'HP EliteDesk': '⚡', 'Servidor Dell': '🖧', 'Rack': '🗄️', 'Cableado': '🔌' },
    router: { 'TP-Link': '📶', 'MikroTik': '📶', 'Ubiquiti': '📶', 'Cisco': '📶', 'GL.iNet': '📶' },
    kit: { 'Kit Destornilladores': '🛠️', 'Muñeca': '🔌', 'Multímetro': '📟', 'Pinzas': '🔧', 'Tester': '🔋', 'Estación': '🪛', 'Lupa': '🔍' }
  };

  function getIcon(name) {
    for (var cat in icons) {
      for (var key in icons[cat]) {
        if (name.includes(key)) return icons[cat][key];
      }
    }
    return '📦';
  }

  function renderTabs() {
    var box = $("#recoTabs");
    if (!box) { console.warn('⚠️ #recoTabs no encontrado'); return; }
    box.innerHTML = TABS.map(function(t) {
      return '<button class="reco__tab" role="tab" data-tab="' + esc(t.id) + '">' + esc(t.label) + '</button>';
    }).join("");
    $$(".reco__tab", box).forEach(function(b) {
      b.addEventListener("click", function() {
        $$(".reco__tab", box).forEach(function(x) { x.classList.remove("active"); });
        this.classList.add("active");
        state.tab = this.dataset.tab;
        renderGrid();
      });
    });
    var first = $(".reco__tab", box);
    if (first) first.classList.add("active");
  }

  function renderGrid() {
    var grid = $("#gearGrid");
    if (!grid) { console.warn('⚠️ #gearGrid no encontrado'); return; }
    var list = RECOMMENDATIONS.filter(function(r) { return r.cat === state.tab; });
    list.sort(function(a, b) { return a.price - b.price; });
    var maxPrice = list.length ? list[list.length - 1].price : state.budget;

    var html = list.map(function(r) {
      var pct = Math.min(100, Math.round((r.price / maxPrice) * 100));
      var over = r.price > state.budget;
      var icon = getIcon(r.name);
      return '<div class="gear-item' + (over ? " over" : "") + '">' +
        '<div style="font-size:2.5rem;">' + icon + '</div>' +
        '<h4>' + esc(r.name) + '</h4>' +
        '<div class="price">$' + r.price + '</div>' +
        '<div class="category">' + esc(TABS.find(function(t) { return t.id === r.cat; }).label) + '</div>' +
        '<p style="font-size:0.8rem;color:#666;margin:0.3rem 0;">' + esc(r.blurb) + '</p>' +
        '<div class="reco-card__bar"><span style="width:' + pct + '%;"></span></div>' +
      '</div>';
    }).join("");
    grid.innerHTML = html;

    var affordable = list.filter(function(r) { return r.price <= state.budget; });
    var total = affordable.reduce(function(s, r) { return s + r.price; }, 0);
    var totalEl = $("#buildTotal");
    if (totalEl) totalEl.textContent = "$" + total;
    var budgetEl = $("#recoBudget");
    if (budgetEl) budgetEl.textContent = "$" + state.budget;
    var rangeVal = $("#rangeVal");
    if (rangeVal) rangeVal.textContent = "$" + state.budget;
  }

  function initSlider() {
    var slider = $("#budgetSlider");
    if (!slider) { console.warn('⚠️ #budgetSlider no encontrado'); return; }
    var fill = function() {
      var min = +slider.min, max = +slider.max, val = +slider.value;
      var pct = ((val - min) / (max - min)) * 100;
      slider.style.background = "linear-gradient(90deg, var(--primary, #6c63ff) 0%, var(--primary, #6c63ff) " + pct + "%, #ddd " + pct + "%, #ddd 100%)";
    };
    var raf = null;
    slider.addEventListener("input", function() {
      state.budget = +this.value;
      fill();
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function() {
        renderGrid();
        raf = null;
      });
    });
    fill();
    renderGrid();
  }

  function init() {
    console.log('⚙️ Inicializando Gear...');
    renderTabs();
    initSlider();
  }

  document.addEventListener('secciones-cargadas', init);
})();