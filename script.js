/**
 * Reuters Editorial Interactive System
 * Handles typography controls, Reuters Graphic SVG interactivity, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initNavScrollSpy();
  initPoemInteractions();
  initGraphicInteractivity();
});

/* ==========================================================================
   Dynamic Date and Time Clock
   ========================================================================== */
function initLiveClock() {
  const timestampEl = document.getElementById('current-timestamp');
  if (!timestampEl) return;

  function updateClock() {
    const now = new Date();

    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const dateStr = now.toLocaleDateString(undefined, dateOptions);

    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = now.toLocaleTimeString(undefined, timeOptions);

    timestampEl.setAttribute('datetime', now.toISOString());
    timestampEl.innerHTML = `${dateStr} &bull; <span class="live-clock-time">${timeStr}</span>`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   W3C Scroll Snap Synchronization & Navigation State
   ========================================================================== */
function initNavScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.editorial-nav .nav-link');
  const railDots = document.querySelectorAll('.rail-dot-btn');
  const navList = document.querySelector('.nav-list');
  const header = document.querySelector('.masthead-container');

  // Synchronize CSS custom property for header height across devices & orientations
  function syncHeaderHeight() {
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
  }

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
  window.addEventListener('orientationchange', syncHeaderHeight, { passive: true });

  if (!sections.length) return;

  // Native smooth navigation respecting container scroll-padding-top
  function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Intercept nav links for smooth snapping
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    });
  });

  // Intercept rail dots for slide snapping
  railDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      if (targetId) scrollToSection(targetId);
    });
  });

  // Update active state across top nav and side rail without interfering with page scroll
  let activeSectionId = '';
  function setActiveSection(id) {
    if (!id || id === activeSectionId) return;
    activeSectionId = id;

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
        // Smoothly center the active tab horizontally inside the mobile nav container only
        if (navList) {
          const linkLeft = link.offsetLeft;
          const linkWidth = link.offsetWidth;
          const navWidth = navList.offsetWidth;
          navList.scrollTo({
            left: linkLeft - (navWidth / 2) + (linkWidth / 2),
            behavior: 'smooth'
          });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });

    railDots.forEach((dot) => {
      const isMatch = dot.getAttribute('data-target') === id;
      dot.classList.toggle('active', isMatch);
    });
  }

  // Modern Native Scroll Snap Change Event (Chrome 129+, Edge 129+)
  if ('onscrollsnapchange' in window) {
    window.addEventListener('scrollsnapchange', (e) => {
      const snapTarget = e.snapTargetBlock;
      if (snapTarget && snapTarget.id) {
        setActiveSection(snapTarget.id);
      }
    }, { passive: true });
  }

  // Robust IntersectionObserver for seamless cross-browser tracking (Safari, Firefox, Chrome)
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.getAttribute('id'));
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   Section 1: Poem Reading Controls
   ========================================================================== */
function initPoemInteractions() {
  const fontToggleBtn = document.getElementById('font-toggle-btn');
  const stanzaToggleBtn = document.getElementById('stanza-toggle-btn');
  const poemWrapper = document.getElementById('poem-text-target');

  if (fontToggleBtn && poemWrapper) {
    let isLarge = false;
    fontToggleBtn.addEventListener('click', () => {
      isLarge = !isLarge;
      poemWrapper.classList.toggle('large-type', isLarge);
      fontToggleBtn.setAttribute('aria-pressed', String(isLarge));
      fontToggleBtn.textContent = isLarge ? 'Standard text size' : 'Increase text size';
    });
  }

  if (stanzaToggleBtn && poemWrapper) {
    let isBilingual = false;
    const englishStanzas = [
      [
        "Dawn gathers along the breakwater's jagged edge,",
        "Salt-scratched iron and the turning of the buoys,",
        "Where trade once measured fortunes by the barrel,",
        "Only the tide now returns its silver promissory."
      ],
      [
        "We stood beside the dry-dock under telegraph wires,",
        "Listening to the cables humming through the mist,",
        "Each syllable a cargo bound for foreign ports,",
        "Each silence heavy with names the manifest forgot."
      ],
      [
        "The lantern keeper does not speak of storms to come;",
        "He measures the horizon with an inked brass rule,",
        "Watching the gulls fold their wings into the grey,",
        "As evening settles on the granite coast like coal."
      ],
      [
        "What remains when the ships have cleared the roads?",
        "A sudden stillness in the rigging, a spark upon the foam,",
        "And words laid out like markers along the shoal,",
        "Guiding the vessel of our memory safely home."
      ]
    ];

    const bilingualStanzas = [
      [
        "Dawn gathers along the breakwater's jagged edge, / El alba se junta en el filo del rompeolas,",
        "Salt-scratched iron and the turning of the buoys, / Hierro marcado por la sal y el giro de las boyas,",
        "Where trade once measured fortunes by the barrel, / Donde el comercio medía fortunas por barriles,",
        "Only the tide now returns its silver promissory. / Solo la marea devuelve hoy su promesa de plata."
      ],
      [
        "We stood beside the dry-dock under telegraph wires, / Frente al dique seco bajo el tendido del telégrafo,",
        "Listening to the cables humming through the mist, / Oyendo zumbar los cables en la bruma,",
        "Each syllable a cargo bound for foreign ports, / Cada sílaba un flete rumbo a puertos lejanos,",
        "Each silence heavy with names the manifest forgot. / Cada silencio cargado con nombres que el manifiesto olvidó."
      ],
      [
        "The lantern keeper does not speak of storms to come; / El farero no habla de las tempestades que vienen;",
        "He measures the horizon with an inked brass rule, / Mide el horizonte con una regla de latón entintada,",
        "Watching the gulls fold their wings into the grey, / Viendo a las gaviotas plegar sus alas en lo gris,",
        "As evening settles on the granite coast like coal. / Mientras la tarde cae sobre la costa como carbón."
      ],
      [
        "What remains when the ships have cleared the roads? / ¿Qué queda cuando los barcos despejan la rada?",
        "A sudden stillness in the rigging, a spark upon the foam, / Un silencio súbito en las jarcias, una chispa en la espuma,",
        "And words laid out like markers along the shoal, / Y palabras puestas como balizas en el bajo,",
        "Guiding the vessel of our memory safely home. / Guiando la nave del recuerdo hacia el hogar."
      ]
    ];

    stanzaToggleBtn.addEventListener('click', () => {
      isBilingual = !isBilingual;
      stanzaToggleBtn.textContent = isBilingual ? 'Switch to English only' : 'Toggle bilingual view';
      renderStanzas(isBilingual ? bilingualStanzas : englishStanzas);
    });

    function renderStanzas(data) {
      poemWrapper.innerHTML = '';
      data.forEach((st) => {
        const div = document.createElement('div');
        div.className = 'poem-stanza';
        st.forEach((line) => {
          const p = document.createElement('p');
          p.className = 'poem-line';
          p.textContent = line;
          div.appendChild(p);
        });
        poemWrapper.appendChild(div);
      });
    }
  }
}

/* ==========================================================================
   Section 2: Reuters Graphic Interactive Visualization
   ========================================================================== */
function initGraphicInteractivity() {
  const metricTabs = document.querySelectorAll('.chart-tab');
  const trendLine = document.getElementById('chart-trend-line');
  const chartArea = document.getElementById('chart-area');
  const benchmarkLine = document.getElementById('benchmark-line');
  const tooltip = document.getElementById('chart-tooltip');
  const ttPeriod = document.getElementById('tt-period');
  const ttValue = document.getElementById('tt-value');
  const ttDetail = document.getElementById('tt-detail');
  const dotsGroup = document.getElementById('data-points-group');
  const legendPrimaryLbl = document.getElementById('legend-primary-lbl');
  const yLbl4 = document.getElementById('y-lbl-4');
  const yLbl3 = document.getElementById('y-lbl-3');
  const yLbl2 = document.getElementById('y-lbl-2');
  const yLbl1 = document.getElementById('y-lbl-1');

  if (!metricTabs.length || !trendLine || !dotsGroup) return;

  // Dataset configurations matching Reuters Graphic standards
  const datasets = {
    transit: {
      legend: 'Observed Monthly Transit Volume',
      yScale: ['100k', '75k', '50k', '25k'],
      unit: 'TEU',
      trendPath: 'M 120,290 L 230,250 L 340,210 L 450,260 L 560,170 L 670,120 L 780,95',
      areaPath: 'M 120,290 L 230,250 L 340,210 L 450,260 L 560,170 L 670,120 L 780,95 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,310 L 230,295 L 340,270 L 450,250 L 560,240 L 670,225 L 780,210',
      points: [
        { cx: 120, cy: 290, val: '18,400 TEU', period: 'Jan 2025', detail: 'Seasonal baseline start' },
        { cx: 230, cy: 250, val: '32,100 TEU', period: 'May 2025', detail: '+12.5% trade uptick' },
        { cx: 340, cy: 210, val: '46,800 TEU', period: 'Sep 2025', detail: 'Pre-holiday stock buildup' },
        { cx: 450, cy: 260, val: '28,500 TEU', period: 'Jan 2026', detail: 'Weather restriction dip' },
        { cx: 560, cy: 170, val: '61,200 TEU', period: 'May 2026', detail: 'Cape bypass surge begins' },
        { cx: 670, cy: 120, val: '78,900 TEU', period: 'Sep 2026', detail: '+31% YoY redirection' },
        { cx: 780, cy: 95,  val: '89,450 TEU', period: 'Oct 2026', detail: 'Peak throughput recorded' }
      ]
    },
    energy: {
      legend: 'Bunker Fuel Emissions (Kilotonnes CO2e)',
      yScale: ['400kt', '300kt', '200kt', '100kt'],
      unit: 'kt CO2',
      trendPath: 'M 120,300 L 230,285 L 340,240 L 450,210 L 560,150 L 670,110 L 780,75',
      areaPath: 'M 120,300 L 230,285 L 340,240 L 450,210 L 560,150 L 670,110 L 780,75 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,290 L 230,280 L 340,265 L 450,260 L 560,250 L 670,240 L 780,230',
      points: [
        { cx: 120, cy: 300, val: '64 kt', period: 'Jan 2025', detail: 'Direct route baseline' },
        { cx: 230, cy: 285, val: '82 kt', period: 'May 2025', detail: 'Fleet engine upgrades' },
        { cx: 340, cy: 240, val: '148 kt', period: 'Sep 2025', detail: 'Extended passage starts' },
        { cx: 450, cy: 210, val: '190 kt', period: 'Jan 2026', detail: 'Rough weather detour' },
        { cx: 560, cy: 150, val: '280 kt', period: 'May 2026', detail: '+68% route elongation' },
        { cx: 670, cy: 110, val: '345 kt', period: 'Sep 2026', detail: 'Sustained southern detour' },
        { cx: 780, cy: 75,  val: '392 kt', period: 'Oct 2026', detail: 'All-time emissions high' }
      ]
    },
    delay: {
      legend: 'Average Chokepoint Transit Delay (Hours)',
      yScale: ['120h', '90h', '60h', '30h'],
      unit: 'Hours',
      trendPath: 'M 120,320 L 230,305 L 340,260 L 450,180 L 560,130 L 670,165 L 780,140',
      areaPath: 'M 120,320 L 230,305 L 340,260 L 450,180 L 560,130 L 670,165 L 780,140 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,315 L 230,310 L 340,305 L 450,300 L 560,295 L 670,290 L 780,285',
      points: [
        { cx: 120, cy: 320, val: '8.4 hrs', period: 'Jan 2025', detail: 'Normal maritime queue' },
        { cx: 230, cy: 305, val: '14.2 hrs', period: 'May 2025', detail: 'Slight congestion at locks' },
        { cx: 340, cy: 260, val: '34.5 hrs', period: 'Sep 2025', detail: 'Bunker refueling wait' },
        { cx: 450, cy: 180, val: '72.1 hrs', period: 'Jan 2026', detail: 'Severe anchorage backlog' },
        { cx: 560, cy: 130, val: '98.6 hrs', period: 'May 2026', detail: 'Peak channel bottleneck' },
        { cx: 670, cy: 165, val: '79.2 hrs', period: 'Sep 2026', detail: 'Partial diversion relief' },
        { cx: 780, cy: 140, val: '92.0 hrs', period: 'Oct 2026', detail: 'Ongoing terminal friction' }
      ]
    }
  };

  let currentMetric = 'transit';

  function renderMetric(key) {
    const data = datasets[key];
    if (!data) return;

    currentMetric = key;
    legendPrimaryLbl.textContent = data.legend;

    // Update Y Axis
    yLbl4.textContent = data.yScale[0];
    yLbl3.textContent = data.yScale[1];
    yLbl2.textContent = data.yScale[2];
    yLbl1.textContent = data.yScale[3];

    // Update SVG Paths
    trendLine.setAttribute('d', data.trendPath);
    chartArea.setAttribute('d', data.areaPath);
    benchmarkLine.setAttribute('d', data.benchmarkPath);

    // Re-render data points
    dotsGroup.innerHTML = '';
    data.points.forEach((pt, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', `interactive-dot ${idx === data.points.length - 1 ? 'active-dot' : ''}`);
      circle.setAttribute('cx', String(pt.cx));
      circle.setAttribute('cy', String(pt.cy));
      circle.setAttribute('r', idx === data.points.length - 1 ? '7' : '5.5');
      circle.setAttribute('tabindex', '0');
      circle.setAttribute('role', 'button');
      circle.setAttribute('aria-label', `${pt.period}: ${pt.val}`);

      const showTooltip = () => {
        dotsGroup.querySelectorAll('.interactive-dot').forEach(d => d.classList.remove('active-dot'));
        circle.classList.add('active-dot');
        ttPeriod.textContent = pt.period;
        ttValue.textContent = pt.val;
        ttDetail.textContent = pt.detail;
        tooltip.style.opacity = '1';
      };

      circle.addEventListener('mouseenter', showTooltip);
      circle.addEventListener('focus', showTooltip);
      circle.addEventListener('click', showTooltip);

      dotsGroup.appendChild(circle);
    });

    // Default to showing latest peak point
    const lastPoint = data.points[data.points.length - 1];
    ttPeriod.textContent = lastPoint.period;
    ttValue.textContent = lastPoint.val;
    ttDetail.textContent = lastPoint.detail;
  }

  metricTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      metricTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const metric = tab.getAttribute('data-metric');
      renderMetric(metric);
    });
  });
}
