(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- header: transparente sobre el hero, sólido después ---------- */
  function initHeader() {
    const header = $("[data-header]");
    const hero = $(".hero, [data-hero]");
    if (!header) return;
    if (!hero || !("IntersectionObserver" in window)) {
      header.classList.add("is-solid");
      return;
    }
    const io = new IntersectionObserver(
      ([entrada]) => header.classList.toggle("is-solid", !entrada.isIntersecting),
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` }
    );
    io.observe(hero);
  }

  /* ---------- menú en celular ---------- */
  function initMenuMovil() {
    const header = $("[data-header]");
    const boton = $("[data-menu-toggle]");
    const menu = $("#menu-movil");
    if (!header || !boton || !menu) return;

    const cerrar = (devolverFoco) => {
      menu.hidden = true;
      boton.setAttribute("aria-expanded", "false");
      header.classList.remove("is-open");
      document.body.style.overflow = "";
      if (devolverFoco) boton.focus();
    };
    const abrir = () => {
      menu.hidden = false;
      boton.setAttribute("aria-expanded", "true");
      header.classList.add("is-open");
      document.body.style.overflow = "hidden";
      const primero = $("a", menu);
      if (primero) primero.focus();
    };

    boton.addEventListener("click", () => (menu.hidden ? abrir() : cerrar(false)));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) cerrar(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) cerrar(true);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => {
      if (e.matches) cerrar(false);
    });
  }

  /* ---------- chispas: salen de las bengalas reales de la foto ---------- */
  function initChispas() {
    const hero = $(".hero");
    const canvas = $(".hero__sparks");
    const foto = $(".hero__media img");
    if (!hero || !canvas || !foto || menosMovimiento.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // posición de cada bengala en la foto, como fracción del ancho y del alto
    const BENGALAS = [
      [0.5759, 0.2317],
      [0.6779, 0.2157]
    ];
    const COLORES = ["255,246,220", "255,224,150", "255,196,92", "255,166,64"];
    const POR_SEGUNDO = 46;

    let ancho = 0;
    let alto = 0;
    let emisores = [];
    let chispas = [];
    let pendiente = 0;
    let anterior = 0;
    let raf = 0;
    let visible = false;

    function medir() {
      const rh = hero.getBoundingClientRect();
      const rf = foto.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = rh.width;
      alto = rh.height;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // reproduce el cálculo de object-fit: cover + object-position
      const nw = foto.naturalWidth || 2400;
      const nh = foto.naturalHeight || 1350;
      const escala = Math.max(rf.width / nw, rf.height / nh);
      const w = nw * escala;
      const h = nh * escala;
      const [px, py] = getComputedStyle(foto)
        .objectPosition.split(" ")
        .map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
      const ox = rf.left - rh.left + (rf.width - w) * px;
      const oy = rf.top - rh.top + (rf.height - h) * py;
      const s = Math.max(0.55, w / 1700);
      emisores = BENGALAS.map(([fx, fy]) => ({ x: ox + fx * w, y: oy + fy * h, s }));
    }

    function nacer(e) {
      const estrella = Math.random() < 0.07;
      const angulo = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.8;
      const velocidad = (estrella ? 30 + Math.random() * 50 : 70 + Math.random() * 190) * e.s;
      chispas.push({
        x: e.x + (Math.random() - 0.5) * 8 * e.s,
        y: e.y + (Math.random() - 0.5) * 8 * e.s,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        vida: 0,
        max: estrella ? 1.2 + Math.random() * 0.9 : 0.3 + Math.random() * 0.55,
        grosor: (estrella ? 5 + Math.random() * 4 : 0.9 + Math.random() * 1.3) * e.s,
        color: COLORES[(Math.random() * COLORES.length) | 0],
        estrella
      });
    }

    function destello(x, y, r, a) {
      ctx.fillStyle = `rgba(255,232,170,${a})`;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    }

    function cuadro(ahora) {
      const dt = Math.min(0.05, anterior ? (ahora - anterior) / 1000 : 0.016);
      anterior = ahora;
      ctx.clearRect(0, 0, ancho, alto);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      pendiente += dt * POR_SEGUNDO;
      while (pendiente >= 1) {
        emisores.forEach(nacer);
        pendiente -= 1;
      }

      for (let i = chispas.length - 1; i >= 0; i--) {
        const p = chispas[i];
        p.vida += dt;
        if (p.vida >= p.max) {
          chispas.splice(i, 1);
          continue;
        }
        p.vy += (p.estrella ? 14 : 170) * dt;
        p.vx *= 0.986;
        p.vy *= 0.986;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = Math.pow(1 - p.vida / p.max, 1.4);
        if (p.estrella) {
          destello(p.x, p.y, p.grosor * (0.65 + 0.35 * Math.sin(p.vida * 14)), a * 0.9);
        } else {
          ctx.strokeStyle = `rgba(${p.color},${a})`;
          ctx.lineWidth = p.grosor;
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(cuadro);
    }

    function iniciar() {
      if (raf || !visible || document.hidden) return;
      anterior = 0;
      raf = requestAnimationFrame(cuadro);
    }

    function detener() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const preparar = () => {
      medir();
      new ResizeObserver(medir).observe(hero);
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        visible ? iniciar() : detener();
      }).observe(hero);
      document.addEventListener("visibilitychange", () => (document.hidden ? detener() : iniciar()));
      menosMovimiento.addEventListener("change", (e) => {
        if (e.matches) {
          detener();
          chispas = [];
          ctx.clearRect(0, 0, ancho, alto);
        } else {
          iniciar();
        }
      });
    };

    if (foto.complete && foto.naturalWidth) preparar();
    else foto.addEventListener("load", preparar, { once: true });
  }

  /* ---------- la carta: banderines como pestañas ---------- */
  function initCarta() {
    const carta = $("[data-carta]");
    const lista = $("[data-tablist]");
    if (!carta || !lista) return;
    const pestanas = $$('[role="tab"]', lista);
    const paneles = pestanas.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    lista.hidden = false;

    function elegir(i, foco) {
      pestanas.forEach((t, j) => {
        const activa = i === j;
        t.setAttribute("aria-selected", String(activa));
        t.tabIndex = activa ? 0 : -1;
        paneles[j].hidden = !activa;
      });
      carta.style.setProperty("--cat", pestanas[i].dataset.color);
      if (foco) pestanas[i].focus();
    }

    pestanas.forEach((t, i) => {
      t.addEventListener("click", () => elegir(i, false));
      t.addEventListener("keydown", (e) => {
        const ultimo = pestanas.length - 1;
        const destino = {
          ArrowRight: i === ultimo ? 0 : i + 1,
          ArrowLeft: i === 0 ? ultimo : i - 1,
          Home: 0,
          End: ultimo
        }[e.key];
        if (destino === undefined) return;
        e.preventDefault();
        elegir(destino, true);
      });
    });
    elegir(0, false);

    // al acercarse a la carta, precarga las fotos de las otras pestañas
    const fotos = $$(".carta__panel img", carta);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          fotos.forEach((img) => (img.loading = "eager"));
          io.disconnect();
        },
        { rootMargin: "600px 0px" }
      );
      io.observe(carta);
    }
  }

  /* ---------- Menú Estándar: cantidades según invitados ---------- */
  function initPlanificador() {
    const raiz = $("[data-planner]");
    if (!raiz) return;
    const BASE = 40;
    const PRECIO_BASE = "$30.000";
    const contacto = window.MB_CONTACTO || {};

    const control = $("#n-invitados", raiz);
    const salida = $("[data-n]", raiz);
    const titulo = $("[data-n-texto]", raiz);
    const precio = $("[data-precio]", raiz);
    const precioLabel = $("[data-precio-label]", raiz);
    const copiar = $("[data-copiar]", raiz);
    const aviso = $("[data-copiado]", raiz);
    const whatsapp = $("[data-whatsapp]", raiz);
    const items = $$(".cantidades li", raiz);
    const numero = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 1 });

    $("[data-invitados]", raiz).hidden = false;
    if (navigator.clipboard) copiar.hidden = false;
    const telefono = String(contacto.whatsapp || "").replace(/\D/g, "");
    if (whatsapp && telefono) whatsapp.hidden = false;

    function cantidad(li, n) {
      const base = parseFloat(li.dataset.base);
      const paso = parseFloat(li.dataset.pasoRedondeo || "1");
      const minimo = parseFloat(li.dataset.min || paso);
      return Math.max(minimo, Math.round((base * n) / BASE / paso) * paso);
    }

    function textoLista(n) {
      const lineas = items.map((li) => `- ${$("b", li).textContent} ${$("span", li).textContent}`);
      const cierre = n === BASE ? `Precio: ${PRECIO_BASE}` : "Precio: a medida";
      return [`Menú Estándar para ${n} invitados (Momentos que Brillan)`, ...lineas, cierre].join("\n");
    }

    function actualizar(n) {
      n = Math.min(100, Math.max(10, Number.isFinite(n) ? n : BASE));
      control.value = n;
      control.setAttribute("aria-valuetext", `${n} invitados`);
      salida.textContent = n;
      titulo.textContent = n;
      items.forEach((li) => {
        const q = cantidad(li, n);
        $("b", li).textContent = numero.format(q);
        $("span", li).textContent = q === 1 ? li.dataset.singular : li.dataset.plural;
      });
      precioLabel.textContent = `Precio para ${n} invitados`;
      precio.textContent = n === BASE ? PRECIO_BASE : "A medida";
      aviso.textContent = "";
      if (whatsapp && telefono) {
        whatsapp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(`Hola! Quiero consultar por este menú:\n${textoLista(n)}`)}`;
      }
    }

    control.addEventListener("input", () => actualizar(parseInt(control.value, 10)));
    $$("[data-paso]", raiz).forEach((b) =>
      b.addEventListener("click", () => actualizar(parseInt(control.value, 10) + parseInt(b.dataset.paso, 10)))
    );
    copiar.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(textoLista(parseInt(control.value, 10)));
        aviso.textContent = "Lista copiada. Pegala donde quieras.";
      } catch {
        // sin permiso de portapapeles: dejamos la lista seleccionada para copiarla a mano
        window.getSelection()?.selectAllChildren($(".cantidades", raiz));
        aviso.textContent = "No se pudo copiar automáticamente. La lista quedó seleccionada: copiala desde el menú del navegador.";
      }
    });
    actualizar(BASE);
  }

  /* ---------- galería con visor ---------- */
  function initGaleria() {
    const grilla = $("[data-galeria]");
    const visor = $("[data-lightbox]");
    if (!grilla || !visor || typeof visor.showModal !== "function") return;
    const items = $$(".galeria__item", grilla);
    const img = $("[data-lightbox-img]", visor);
    const pie = $("[data-lightbox-caption]", visor);
    let actual = 0;

    function mostrar(i) {
      actual = (i + items.length) % items.length;
      const miniatura = $("img", items[actual]);
      img.src = items[actual].dataset.full;
      img.alt = miniatura.alt;
      pie.textContent = miniatura.alt;
    }

    items.forEach((boton, i) =>
      boton.addEventListener("click", () => {
        mostrar(i);
        visor.showModal();
      })
    );
    $("[data-lightbox-prev]", visor).addEventListener("click", () => mostrar(actual - 1));
    $("[data-lightbox-next]", visor).addEventListener("click", () => mostrar(actual + 1));
    $("[data-lightbox-close]", visor).addEventListener("click", () => visor.close());
    visor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mostrar(actual - 1);
      if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    visor.addEventListener("click", (e) => {
      if (e.target === visor) visor.close();
    });
    visor.addEventListener("close", () => items[actual].focus());
  }

  /* ---------- contacto (solo si hay datos en config.js) ---------- */
  function initContacto() {
    const c = window.MB_CONTACTO || {};
    const bloque = $("[data-contacto-wrap]");
    const lista = $("[data-contacto-lista]");
    if (!bloque || !lista) return;
    const enlaces = [];
    const telefono = String(c.whatsapp || "").replace(/\D/g, "");
    if (telefono) enlaces.push([`https://wa.me/${telefono}`, "WhatsApp"]);
    if (c.instagram) enlaces.push([`https://instagram.com/${String(c.instagram).replace(/^@/, "")}`, "Instagram"]);
    if (c.email) enlaces.push([`mailto:${c.email}`, c.email]);
    if (!enlaces.length) return;
    enlaces.forEach(([href, texto]) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = texto;
      if (href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      li.append(a);
      lista.append(li);
    });
    bloque.hidden = false;
  }

  initHeader();
  initMenuMovil();
  initChispas();
  initCarta();
  initPlanificador();
  initGaleria();
  initContacto();
})();
