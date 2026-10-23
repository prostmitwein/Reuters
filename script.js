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
        "If the city breaks and turns to dust,",
        "Would you still keep your procedural trust?",
        "If the clinic falls and borders sway,",
        "Will you keep the Charter locked away?"
      ],
      [
        "Under the mural, delegates sit,",
        "Trading clauses, bit by bit,",
        "Article two and Article five,",
        "Drafting a paper where nothing can thrive.",
        "Forty two points to avoid a deed,",
        "Feeding the halls of bureaucratic greed."
      ],
      [
        "If peace falls down and burns today,",
        "Tell me would you keep it locked away?",
        "With a permanent veto, a nod and a grin,",
        "Locking the truth and slaughter in."
      ],
      [
        "Washington trades for a legal flaw,",
        "Beijing and Moscow enforce the law.",
        "Points of order across the floor,",
        "While the sirens wail outside the door.",
        "Resolution dead on a marble tray,",
        "All the courage is locked away."
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
  const chartStage = document.getElementById('chart-stage');
  const ttPeriod = document.getElementById('tt-period');
  const ttValue = document.getElementById('tt-value');
  const ttDetail = document.getElementById('tt-detail');
  const ttPeriodFloat = document.getElementById('tt-period-float');
  const ttValueFloat = document.getElementById('tt-value-float');
  const ttDetailFloat = document.getElementById('tt-detail-float');
  const dotsGroup = document.getElementById('data-points-group');
  const legendPrimaryLbl = document.getElementById('legend-primary-lbl');
  const yLbl4 = document.getElementById('y-lbl-4');
  const yLbl3 = document.getElementById('y-lbl-3');
  const yLbl2 = document.getElementById('y-lbl-2');
  const yLbl1 = document.getElementById('y-lbl-1');

  const badgeLine1 = document.getElementById('badge-line-1');
  const badgeLine2 = document.getElementById('badge-line-2');

  if (!metricTabs.length || !trendLine || !dotsGroup) return;

  // Accurate Dataset configurations matching Reuters Graphic & UNCTAD/EIA standards
  const datasets = {
    oil_flow: {
      legend: 'Observed Daily Petroleum Flow via Strait of Hormuz (Million b/d)',
      yScale: ['25M', '20M', '15M', '10M'],
      unit: 'Million b/d',
      trendPath: 'M 120,108 L 230,112 L 340,118 L 450,136 L 560,155 L 670,171 L 780,176',
      areaPath: 'M 120,108 L 230,112 L 340,118 L 450,136 L 560,155 L 670,171 L 780,176 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,110 L 230,110 L 340,110 L 450,110 L 560,110 L 670,110 L 780,110',
      badge1: 'HISTORIC DECLINE -29.5%',
      badge2: '14.6M b/d vs 20.7M b/d baseline',
      points: [
        { cx: 120, cy: 108, val: '20.7M b/d', period: 'Jan 2025', detail: 'Normal operating flow (25% global seaborne oil)' },
        { cx: 230, cy: 112, val: '20.4M b/d', period: 'May 2025', detail: 'Seasonal maintenance cycle' },
        { cx: 340, cy: 118, val: '19.8M b/d', period: 'Sep 2025', detail: 'Initial regional alert advisories' },
        { cx: 450, cy: 136, val: '18.2M b/d', period: 'Jan 2026', detail: 'Escort protocols initiated by western flags' },
        { cx: 560, cy: 155, val: '16.5M b/d', period: 'May 2026', detail: 'AIS transponder darkening surge (+140%)' },
        { cx: 670, cy: 171, val: '15.1M b/d', period: 'Sep 2026', detail: 'Major charterers pause unescorted spot runs' },
        { cx: 780, cy: 176, val: '14.6M b/d', period: 'Oct 2026', detail: 'Historical low: 6.1M b/d displaced or diverted' }
      ]
    },
    vessels: {
      legend: 'Daily Commercial Vessel Transits — Active AIS Tracked (Vessels/Day)',
      yScale: ['150', '112', '75', '37'],
      unit: 'vessels/day',
      trendPath: 'M 120,82 L 230,90 L 340,105 L 450,164 L 560,232 L 670,273 L 780,284',
      areaPath: 'M 120,82 L 230,90 L 340,105 L 450,164 L 560,232 L 670,273 L 780,284 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,82 L 230,82 L 340,82 L 450,82 L 560,82 L 670,82 L 780,82',
      badge1: 'CRITICAL PLUNGE -78.3%',
      badge2: '30 transits/day vs 138 peacetime',
      points: [
        { cx: 120, cy: 82,  val: '138 /day', period: 'Jan 2025', detail: 'Standard commercial AIS traffic baseline' },
        { cx: 230, cy: 90,  val: '134 /day', period: 'May 2025', detail: 'Regular container & bulk flow' },
        { cx: 340, cy: 105, val: '126 /day', period: 'Sep 2025', detail: 'UKMTO security risk advisories issued' },
        { cx: 450, cy: 164, val: '94 /day',  period: 'Jan 2026', detail: 'Container carriers begin Cape bypass' },
        { cx: 560, cy: 232, val: '58 /day',  period: 'May 2026', detail: 'Tankers switch off AIS or conduct STS off Fujairah' },
        { cx: 670, cy: 273, val: '36 /day',  period: 'Sep 2026', detail: 'Widespread unescorted commercial halts' },
        { cx: 780, cy: 284, val: '30 /day',  period: 'Oct 2026', detail: '78.3% plunge in tracked automatic beacons' }
      ]
    },
    emissions: {
      legend: 'Bunker Fuel Emissions from Cape of Good Hope Redirections (kt CO2e)',
      yScale: ['450kt', '335kt', '225kt', '110kt'],
      unit: 'kt CO2e',
      trendPath: 'M 120,300 L 230,298 L 340,270 L 450,217 L 560,162 L 670,121 L 780,94',
      areaPath: 'M 120,300 L 230,298 L 340,270 L 450,217 L 560,162 L 670,121 L 780,94 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,299 L 230,299 L 340,299 L 450,299 L 560,299 L 670,299 L 780,299',
      badge1: 'CARBON EMISSION SURGE +517%',
      badge2: '+4,160t CO2 per VLCC Cape detour',
      points: [
        { cx: 120, cy: 300, val: '64 kt', period: 'Jan 2025', detail: 'Direct Suez/Hormuz corridor benchmark' },
        { cx: 230, cy: 298, val: '68 kt', period: 'May 2025', detail: 'Baseline voyage bunker consumption' },
        { cx: 340, cy: 270, val: '112 kt', period: 'Sep 2025', detail: 'First wave of 4,000 nm southern diversions' },
        { cx: 450, cy: 217, val: '198 kt', period: 'Jan 2026', detail: 'Cape of Good Hope detour becomes standard' },
        { cx: 560, cy: 162, val: '286 kt', period: 'May 2026', detail: 'Fleet speeds raised to mitigate schedule slippage' },
        { cx: 670, cy: 121, val: '352 kt', period: 'Sep 2026', detail: 'Over 65% of Asia-Europe boxships rerouted' },
        { cx: 780, cy: 94,  val: '395 kt', period: 'Oct 2026', detail: 'All-time maritime carbon surge: +517%' }
      ]
    },
    insurance: {
      legend: 'Maritime War Risk Hull Insurance Premiums (% of Vessel Hull Value)',
      yScale: ['1.50%', '1.10%', '0.75%', '0.35%'],
      unit: '% Hull',
      trendPath: 'M 120,331 L 230,325 L 340,293 L 450,247 L 560,181 L 670,144 L 780,125',
      areaPath: 'M 120,331 L 230,325 L 340,293 L 450,247 L 560,181 L 670,144 L 780,125 L 780,340 L 120,340 Z',
      benchmarkPath: 'M 120,331 L 230,331 L 340,331 L 450,331 L 560,331 L 670,331 L 780,331',
      badge1: 'INSURANCE SPIKE 23x',
      badge2: '1.15% (~$1.15M/voyage for VLCC)',
      points: [
        { cx: 120, cy: 331, val: '0.05%', period: 'Jan 2025', detail: 'Peacetime baseline rate ($50k/voyage)' },
        { cx: 230, cy: 325, val: '0.08%', period: 'May 2025', detail: 'Routine Persian Gulf marine underwriting' },
        { cx: 340, cy: 293, val: '0.25%', period: 'Sep 2025', detail: 'Joint War Committee expands alert boundary' },
        { cx: 450, cy: 247, val: '0.50%', period: 'Jan 2026', detail: 'Underwriters enforce 7-day breach notices' },
        { cx: 560, cy: 181, val: '0.85%', period: 'May 2026', detail: 'Capacity withdrawn by several London syndicates' },
        { cx: 670, cy: 144, val: '1.05%', period: 'Sep 2026', detail: 'Premiums top $1,000,000 per tanker transit' },
        { cx: 780, cy: 125, val: '1.15%', period: 'Oct 2026', detail: 'Historic peak: 23-fold increase over base' }
      ]
    }
  };

  let currentMetric = 'oil_flow';

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

    // Update Graphic Badge Callout
    if (badgeLine1 && data.badge1) badgeLine1.textContent = data.badge1;
    if (badgeLine2 && data.badge2) badgeLine2.textContent = data.badge2;

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

        // 1. Update Live Non-overlapping Inspector Strip
        if (ttPeriod) ttPeriod.textContent = pt.period;
        if (ttValue) ttValue.textContent = pt.val;
        if (ttDetail) ttDetail.textContent = pt.detail;

        // 2. Dynamically position floating tooltip directly relative to hovered point
        if (tooltip && ttPeriodFloat && ttValueFloat && ttDetailFloat) {
          ttPeriodFloat.textContent = pt.period;
          ttValueFloat.textContent = pt.val;
          ttDetailFloat.textContent = pt.detail;

          // Compute exact percentage inside SVG viewBox (900 x 420)
          const leftPct = (pt.cx / 900) * 100;
          const topPct = (pt.cy / 420) * 100;

          tooltip.style.left = `${leftPct}%`;
          tooltip.style.top = `${topPct}%`;

          // Smart Quadrant Offsets:
          // If point is on right edge (cx > 650), flip tooltip to the left of the point
          // If point is near top (cy < 140), push tooltip below point to avoid clipping
          if (pt.cx > 650) {
            tooltip.style.transform = pt.cy < 140
              ? 'translate(calc(-100% - 16px), 12px)'
              : 'translate(calc(-100% - 16px), calc(-100% - 12px))';
          } else if (pt.cx < 250) {
            tooltip.style.transform = pt.cy < 140
              ? 'translate(16px, 12px)'
              : 'translate(16px, calc(-100% - 12px))';
          } else {
            tooltip.style.transform = pt.cy < 140
              ? 'translate(-50%, 18px)'
              : 'translate(-50%, calc(-100% - 18px))';
          }

          tooltip.classList.add('active-tooltip');
          tooltip.setAttribute('aria-hidden', 'false');
        }
      };

      const hideTooltip = () => {
        if (tooltip) {
          tooltip.classList.remove('active-tooltip');
          tooltip.setAttribute('aria-hidden', 'true');
        }
      };

      circle.addEventListener('mouseenter', showTooltip);
      circle.addEventListener('focus', showTooltip);
      circle.addEventListener('mouseleave', hideTooltip);
      circle.addEventListener('blur', hideTooltip);
      circle.addEventListener('click', showTooltip);

      dotsGroup.appendChild(circle);
    });

    // Default to showing latest peak point in Inspector Strip
    const lastPoint = data.points[data.points.length - 1];
    if (ttPeriod) ttPeriod.textContent = lastPoint.period;
    if (ttValue) ttValue.textContent = lastPoint.val;
    if (ttDetail) ttDetail.textContent = lastPoint.detail;
  }

  if (chartStage) {
    chartStage.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.remove('active-tooltip');
        tooltip.setAttribute('aria-hidden', 'true');
      }
      // Reset active dot to latest point
      const curData = datasets[currentMetric];
      if (curData) {
        const dots = dotsGroup.querySelectorAll('.interactive-dot');
        dots.forEach((d, i) => {
          d.classList.toggle('active-dot', i === dots.length - 1);
        });
        const lastPt = curData.points[curData.points.length - 1];
        if (ttPeriod) ttPeriod.textContent = lastPt.period;
        if (ttValue) ttValue.textContent = lastPt.val;
        if (ttDetail) ttDetail.textContent = lastPt.detail;
      }
    });
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
