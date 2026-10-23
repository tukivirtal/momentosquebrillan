(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const SVG = "http://www.w3.org/2000/svg";

  /* ---------- datos del proyecto (presupuesto y costos del documento) ---------- */

  const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const EVENTOS = [3, 3, 2, 4, 2, 3, 4, 3, 3, 3, 2, 4];
  const PRECIO_EVENTO = 30000;
  const COSTO_PRODUCCION = { 2: 11847, 3: 17771, 4: 23695 };
  const COSTOS_FIJOS = 30141; // alquiler, UTE, OSE, IVA mínimo, BPS y DGI
  const INVERSION = 278000;

  const MENSUAL = MESES.map((mes, i) => {
    const eventos = EVENTOS[i];
    const ingresos = eventos * PRECIO_EVENTO;
    const egresos = COSTO_PRODUCCION[eventos] + COSTOS_FIJOS;
    return { mes, eventos, ingresos, egresos, resultado: ingresos - egresos };
  });
  let acumulado = 0;
  MENSUAL.forEach((m) => {
    acumulado += m.resultado;
    m.acumulado = acumulado;
  });

  const PRODUCTOS = [
    { nombre: "Pizzas", cantidad: "6", costo: 239.56, precio: 479.11, recargo: 200 },
    { nombre: "Pebetes", cantidad: "44", costo: 769.2, precio: 1153.8, recargo: 150 },
    { nombre: "Empanadas", cantidad: "48", costo: 590, precio: 1180, recargo: 200 },
    { nombre: "Tartas", cantidad: "2", costo: 300.8, precio: 601.6, recargo: 200 },
    { nombre: "Alfajores", cantidad: "63", costo: 594.66, precio: 1189.32, recargo: 200 },
    { nombre: "Muffins", cantidad: "48", costo: 171.34, precio: 428.35, recargo: 250 },
    { nombre: "Pastafrola", cantidad: "2", costo: 371.17, precio: 742.34, recargo: 200 },
    { nombre: "Mini hamburguesas", cantidad: "40", costo: 1262, precio: 2524, recargo: 200 },
    { nombre: "Torta personalizada", cantidad: "1", costo: 1625, precio: 4062.5, recargo: 250 },
    { nombre: "Agua saborizada", cantidad: "20 litros", costo: 400, precio: 600, recargo: 150 }
  ];

  // [ingrediente, cantidad, costo unitario, costo]
  const CALCULO_COSTOS = [
    ["Pizza (6 unidades)", 39.93, [["Cebolla", "1,500", 20, 30], ["Morrón", "1,500", 35, 52.5], ["Salsa de tomate", "1,000", 75, 75], ["Sal", "0,150", 40, 6], ["Orégano", "0,008", 60, 0.48], ["Aceite", "0,150", 90, 13.5], ["Agua", "0,750", 0, 0], ["Harina", "1,000", 50, 50], ["Levadura", "0,075", 150, 11.25], ["Azúcar", "0,015", 55, 0.83]]],
    ["Pebetes (44 unidades)", 17.48, [["Harina", "1,000", 50, 50], ["Manteca", "0,120", 350, 42], ["Huevo", "4", 10, 40], ["Leche", "0,300", 80, 24], ["Azúcar", "0,120", 55, 6.6], ["Levadura", "0,040", 150, 6], ["Sal", "0,015", 40, 0.6], ["Jamón", "0,300", 700, 210], ["Queso muzzarella", "0,300", 1000, 300], ["Mayonesa", "0,500", 180, 90]]],
    ["Empanadas (48 unidades)", 12.29, [["Harina", "0,600", 50, 30], ["Aceite", "0,200", 90, 18], ["Agua", "0,250", 0, 0], ["Sal", "0,020", 40, 0.8], ["Carne picada", "1,000", 450, 450], ["Huevos", "2", 10, 20], ["Cebolla", "1,000", 35, 35], ["Morrón", "1,000", 35, 35], ["Orégano", "0,020", 60, 1.2]]],
    ["Tarta (2 unidades)", 150.4, [["Harina", "1,000", 50, 50], ["Aceite", "0,200", 90, 18], ["Agua", "0,250", 0, 0], ["Sal", "0,040", 40, 1.6], ["Espinaca", "0,400", 300, 120], ["Cebolla", "1,000", 35, 35], ["Morrón", "1,000", 35, 35], ["Orégano", "0,020", 60, 1.2], ["Huevos", "4", 10, 40]]],
    ["Alfajores (63 unidades)", 9.44, [["Manteca", "0,300", 350, 105], ["Harina", "0,300", 50, 15], ["Fécula", "0,450", 187, 84.15], ["Azúcar", "0,300", 55, 16.5], ["Huevos", "3", 10, 30], ["Polvo de hornear", "0,015", 134, 2.01], ["Dulce de leche", "1,000", 187, 187], ["Coco rallado", "0,500", 310, 155]]],
    ["Muffins (48 unidades)", 3.57, [["Huevos", "6", 10, 60], ["Aceite", "0,270", 90, 24.3], ["Azúcar", "0,300", 55, 16.5], ["Leche", "0,360", 80, 28.8], ["Harina", "0,550", 50, 27.5], ["Polvo de hornear", "0,090", 134, 12.06], ["Vainilla", "0,022", 99, 2.18]]],
    ["Pastafrola (2 unidades)", 185.59, [["Manteca", "0,300", 350, 105], ["Azúcar", "0,300", 55, 16.5], ["Huevo", "4", 10, 40], ["Harina", "0,640", 50, 32], ["Vainilla", "0,010", 99, 0.99], ["Polvo de hornear", "0,020", 134, 2.68], ["Dulce de membrillo", "1,000", 174, 174]]],
    ["Mini hamburguesas y tortugas (40 unidades)", 31.53, [["Harina", "2,000", 50, 100], ["Manteca", "0,240", 350, 84], ["Huevos", "8", 10, 80], ["Leche", "0,240", 55, 13.2], ["Azúcar", "0,024", 55, 1.32], ["Levadura", "0,080", 150, 12], ["Sal", "0,014", 40, 0.56], ["Carne picada", "2,000", 400, 800], ["Morrón", "2,000", 35, 70], ["Cebolla", "2,000", 35, 70], ["Huevos", "2", 10, 20], ["Orégano", "0,020", 60, 1.2], ["Avena", "0,100", 91, 9.1]]],
    ["Torta personalizada (1 unidad)", 1624.68, [["Huevos", "12", 10, 120], ["Azúcar", "0,600", 55, 33], ["Harina", "0,600", 50, 30], ["Polvo de hornear", "0,020", 134, 2.68], ["Crema", "2", 400, 800], ["Dulce de leche", "2", 187, 374], ["Colorante", "1", 135, 135], ["Duraznos", "1", 130, 130]]]
  ];

  /* ---------- formato ---------- */

  const entero = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pesos = (v) => `$${entero.format(Math.round(v))}`;
  const pesosDec = (v) => `$${decimal.format(v)}`;
  const miles = (v) => (v === 0 ? "$0" : v >= 1000 ? `$${entero.format(v / 1000)} mil` : `$${entero.format(v)}`);

  /* ---------- utilidades ---------- */

  function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.append(node);
    return node;
  }

  function texto(parent, x, y, contenido, attrs = {}) {
    const t = el("text", { x, y, ...attrs }, parent);
    t.textContent = contenido;
    return t;
  }

  // barra con extremo de dato redondeado (4px) y base recta
  function columna(x, y, w, h, r = 4) {
    r = Math.min(r, h, w / 2);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }

  function barraHorizontal(x, y, w, h, r = 4) {
    r = Math.min(r, w, h / 2);
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }

  function crearTooltip(figura) {
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("aria-hidden", "true");
    figura.append(tip);

    return {
      mostrar(titulo, filas, ancla) {
        tip.replaceChildren();
        const t = document.createElement("p");
        t.className = "tip__titulo";
        t.textContent = titulo;
        tip.append(t);
        filas.forEach(({ valor, nombre, color }) => {
          const fila = document.createElement("p");
          fila.className = "tip__fila";
          const llave = document.createElement("i");
          if (color) llave.style.setProperty("--c", color);
          const b = document.createElement("b");
          b.textContent = valor;
          const s = document.createElement("span");
          s.textContent = nombre;
          fila.append(llave, b, s);
          tip.append(fila);
        });
        tip.classList.add("is-visible");
        // ubicar arriba del elemento y dentro de la figura
        const rf = figura.getBoundingClientRect();
        const ra = ancla.getBoundingClientRect();
        const w = tip.offsetWidth;
        const h = tip.offsetHeight;
        let x = ra.left - rf.left + ra.width / 2 - w / 2;
        x = Math.max(8, Math.min(x, rf.width - w - 8));
        let y = ra.top - rf.top - h - 10;
        if (y < 8) y = ra.bottom - rf.top + 10;
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
      },
      ocultar() {
        tip.classList.remove("is-visible");
      }
    };
  }

  function alCambiarTamano(lienzo, dibujar) {
    let ancho = 0;
    let pendiente = 0;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w === ancho || w === 0) return;
      ancho = w;
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => dibujar(w));
    });
    ro.observe(lienzo);
  }

  /* ---------- gráfico 1: ingresos y egresos por mes ---------- */

  function graficoMensual(figura) {
    const lienzo = $("[data-lienzo]", figura);
    const tip = crearTooltip(figura);
    const estilos = getComputedStyle(document.documentElement);
    const c1 = estilos.getPropertyValue("--serie-1").trim();
    const c2 = estilos.getPropertyValue("--serie-2").trim();

    function dibujar(W) {
      const H = Math.round(Math.min(320, Math.max(240, W * 0.48)));
      const m = { t: 12, r: 6, b: 30, l: 66 };
      const iw = W - m.l - m.r;
      const ih = H - m.t - m.b;
      const yMax = 130000;
      const y = (v) => m.t + ih - (v / yMax) * ih;
      const banda = iw / MENSUAL.length;
      const barra = Math.max(6, Math.min(22, (banda - 10) / 2));
      const corto = iw < 520;

      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "group", "aria-label": "Ingresos y egresos por mes" });
      const grilla = el("g", { class: "grilla" }, svg);
      [0, 40000, 80000, 120000].forEach((v) => {
        el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }, grilla);
        texto(svg, m.l - 10, y(v) + 4, miles(v), { "text-anchor": "end" });
      });

      MENSUAL.forEach((d, i) => {
        const cx = m.l + banda * i + banda / 2;
        const x0 = cx - barra - 1;
        const g = el("g", {
          class: "grupo",
          tabindex: "0",
          role: "img",
          "aria-label": `${d.mes}: ${d.eventos} eventos, ingresos ${pesos(d.ingresos)}, egresos ${pesos(d.egresos)}, resultado ${pesos(d.resultado)}`
        }, svg);
        el("rect", { class: "foco", x: m.l + banda * i + 1, y: m.t, width: banda - 2, height: ih, rx: 6, fill: "transparent" }, g);
        el("path", { d: columna(x0, y(d.ingresos), barra, y(0) - y(d.ingresos)), fill: c1 }, g);
        el("path", { d: columna(x0 + barra + 2, y(d.egresos), barra, y(0) - y(d.egresos)), fill: c2 }, g);
        texto(svg, cx, H - 8, corto ? d.mes[0] : d.mes.slice(0, 3), { "text-anchor": "middle", class: "eje-mes" });

        const mostrar = () => {
          figura.classList.add("is-hover");
          $$(".grupo", svg).forEach((n) => n.classList.toggle("is-activo", n === g));
          tip.mostrar(`${d.mes}, ${d.eventos} eventos`, [
            { valor: pesos(d.ingresos), nombre: "Ingresos", color: c1 },
            { valor: pesos(d.egresos), nombre: "Egresos", color: c2 },
            { valor: pesos(d.resultado), nombre: "Resultado" }
          ], g.querySelector(".foco"));
        };
        const ocultar = () => {
          figura.classList.remove("is-hover");
          tip.ocultar();
        };
        g.addEventListener("pointerenter", mostrar);
        g.addEventListener("pointerleave", ocultar);
        g.addEventListener("focus", mostrar);
        g.addEventListener("blur", ocultar);
      });
      el("line", { class: "base", x1: m.l, x2: W - m.r, y1: y(0), y2: y(0) }, svg);
      lienzo.replaceChildren(svg);
    }

    alCambiarTamano(lienzo, dibujar);

    const cuerpo = $('[data-tabla="mensual"] tbody');
    MENSUAL.forEach((d) => {
      const tr = document.createElement("tr");
      [d.mes, String(d.eventos), pesos(d.ingresos), pesos(d.egresos), pesos(d.resultado)].forEach((v, i) => {
        const c = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) c.scope = "row";
        c.textContent = v;
        tr.append(c);
      });
      cuerpo.append(tr);
    });
  }

  /* ---------- gráfico 2: recupero de la inversión ---------- */

  function graficoRecupero(figura) {
    const lienzo = $("[data-lienzo]", figura);
    const tip = crearTooltip(figura);
    const c1 = getComputedStyle(document.documentElement).getPropertyValue("--serie-1").trim();
    const cruce = MENSUAL.findIndex((d) => d.acumulado >= INVERSION);
    let indice = MENSUAL.length - 1;

    function dibujar(W) {
      const H = Math.round(Math.min(330, Math.max(250, W * 0.5)));
      const m = { t: 22, r: 14, b: 30, l: 74 };
      const iw = W - m.l - m.r;
      const ih = H - m.t - m.b;
      const yMax = 560000;
      const y = (v) => m.t + ih - (v / yMax) * ih;
      const banda = iw / MENSUAL.length;
      const x = (i) => m.l + banda * i + banda / 2;
      const corto = iw < 520;

      const svg = el("svg", {
        viewBox: `0 0 ${W} ${H}`,
        width: W,
        height: H,
        tabindex: "0",
        role: "group",
        "aria-label": "Resultado acumulado frente a la inversión inicial. Usá las flechas izquierda y derecha para recorrer los meses."
      });
      const grilla = el("g", { class: "grilla" }, svg);
      [0, 100000, 200000, 300000, 400000, 500000].forEach((v) => {
        el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }, grilla);
        texto(svg, m.l - 10, y(v) + 4, miles(v), { "text-anchor": "end" });
      });
      MENSUAL.forEach((d, i) => texto(svg, x(i), H - 8, corto ? d.mes[0] : d.mes.slice(0, 3), { "text-anchor": "middle", class: "eje-mes" }));

      // inversión inicial (referencia); a la izquierda la curva todavía está por debajo
      el("line", { class: "referencia", x1: m.l, x2: W - m.r, y1: y(INVERSION), y2: y(INVERSION) }, svg);
      texto(svg, m.l + 6, y(INVERSION) - 8, corto ? "Inversión" : `Inversión inicial: ${pesos(INVERSION)}`, { class: "etiqueta-dato" });

      const puntos = MENSUAL.map((d, i) => [x(i), y(d.acumulado)]);
      const linea = puntos.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join("");
      el("path", { d: `${linea}L${x(MENSUAL.length - 1)},${y(0)}L${x(0)},${y(0)}Z`, fill: c1, "fill-opacity": "0.1" }, svg);
      el("path", { d: linea, fill: "none", stroke: c1, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      el("line", { class: "base", x1: m.l, x2: W - m.r, y1: y(0), y2: y(0) }, svg);

      // mes en que se recupera: la etiqueta va abajo a la derecha, bajo la curva que sigue subiendo
      const [cx, cy] = puntos[cruce];
      el("circle", { cx, cy, r: 5, fill: c1, stroke: "#fff", "stroke-width": 2 }, svg);
      texto(svg, cx + 10, cy + 20, corto ? MENSUAL[cruce].mes : `${MENSUAL[cruce].mes}: se recupera la inversión`, { class: "etiqueta-dato" });

      // valor final
      const [ex, ey] = puntos[puntos.length - 1];
      el("circle", { cx: ex, cy: ey, r: 5, fill: c1, stroke: "#fff", "stroke-width": 2 }, svg);
      texto(svg, ex, ey - 12, pesos(MENSUAL[MENSUAL.length - 1].acumulado), { "text-anchor": "end", class: "etiqueta-dato" });

      // cruz de lectura
      const cruz = el("g", { visibility: "hidden" }, svg);
      const vertical = el("line", { class: "cruz", y1: m.t, y2: y(0) }, cruz);
      const punto = el("circle", { r: 5, fill: c1, stroke: "#fff", "stroke-width": 2 }, cruz);
      const ancla = el("rect", { width: 1, height: 1, fill: "transparent" }, cruz);

      function marcar(i) {
        indice = i;
        const d = MENSUAL[i];
        const [px, py] = puntos[i];
        vertical.setAttribute("x1", px);
        vertical.setAttribute("x2", px);
        punto.setAttribute("cx", px);
        punto.setAttribute("cy", py);
        ancla.setAttribute("x", px);
        ancla.setAttribute("y", py);
        cruz.setAttribute("visibility", "visible");
        tip.mostrar(d.mes, [
          { valor: pesos(d.acumulado), nombre: "Acumulado", color: c1 },
          { valor: pesos(d.resultado), nombre: "Resultado del mes" }
        ], ancla);
      }
      function soltar() {
        cruz.setAttribute("visibility", "hidden");
        tip.ocultar();
      }

      // capa de lectura: todo el ancho, el puntero solo tiene que estar cerca del mes
      const capa = el("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent" }, svg);
      capa.addEventListener("pointermove", (e) => {
        const r = svg.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        marcar(Math.max(0, Math.min(MENSUAL.length - 1, Math.floor((px - m.l) / banda))));
      });
      capa.addEventListener("pointerleave", soltar);
      svg.addEventListener("focus", () => marcar(indice));
      svg.addEventListener("blur", soltar);
      svg.addEventListener("keydown", (e) => {
        const paso = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!paso) return;
        e.preventDefault();
        marcar(Math.max(0, Math.min(MENSUAL.length - 1, indice + paso)));
      });
      lienzo.replaceChildren(svg);
    }

    alCambiarTamano(lienzo, dibujar);

    const cuerpo = $('[data-tabla="recupero"] tbody');
    MENSUAL.forEach((d) => {
      const tr = document.createElement("tr");
      [d.mes, pesos(d.resultado), pesos(d.acumulado)].forEach((v, i) => {
        const c = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) c.scope = "row";
        c.textContent = v;
        tr.append(c);
      });
      cuerpo.append(tr);
    });
  }

  /* ---------- gráfico 3: costo y ganancia por producto ---------- */

  function graficoProductos(figura) {
    const lienzo = $("[data-lienzo]", figura);
    const tip = crearTooltip(figura);
    const estilos = getComputedStyle(document.documentElement);
    const c1 = estilos.getPropertyValue("--serie-1").trim();
    const c2 = estilos.getPropertyValue("--serie-2").trim();
    const filas = [...PRODUCTOS].sort((a, b) => b.precio - a.precio);

    function dibujar(W) {
      const lateral = W >= 560;
      const etiquetaW = lateral ? 150 : 0;
      const m = { t: 4, r: 78, b: 26, l: etiquetaW };
      const alto = 20;
      const fila = lateral ? 38 : 52;
      const H = m.t + filas.length * fila + m.b;
      const iw = W - m.l - m.r;
      const xMax = 4500;
      const x = (v) => m.l + (v / xMax) * iw;

      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "group", "aria-label": "Costo y ganancia por producto" });
      const grilla = el("g", { class: "grilla" }, svg);
      [0, 1000, 2000, 3000, 4000].forEach((v) => {
        el("line", { x1: x(v), x2: x(v), y1: m.t, y2: H - m.b }, grilla);
        texto(svg, x(v), H - 6, v ? `$${entero.format(v)}` : "$0", { "text-anchor": "middle" });
      });

      filas.forEach((p, i) => {
        const top = m.t + i * fila;
        const by = lateral ? top + (fila - alto) / 2 : top + 22;
        const g = el("g", {
          class: "fila",
          tabindex: "0",
          role: "img",
          "aria-label": `${p.nombre}: costo ${pesosDec(p.costo)}, ganancia ${pesosDec(p.precio - p.costo)}, precio de venta ${pesosDec(p.precio)}`
        }, svg);
        el("rect", { class: "foco", x: 1, y: top + 1, width: W - 2, height: fila - 2, rx: 8, fill: "transparent" }, g);
        texto(g, 0, lateral ? by + alto / 2 + 5 : top + 14, p.nombre, { class: "eje-mes", "font-size": "13" });
        const xc = x(p.costo);
        el("path", { d: `M${x(0)},${by}H${xc}V${by + alto}H${x(0)}Z`, fill: c1 }, g);
        el("path", { d: barraHorizontal(xc + 2, by, x(p.precio) - xc - 2, alto), fill: c2 }, g);
        texto(g, x(p.precio) + 8, by + alto / 2 + 5, pesos(p.precio), { class: "etiqueta-dato" });

        const mostrar = () => {
          figura.classList.add("is-hover");
          $$(".fila", svg).forEach((n) => n.classList.toggle("is-activo", n === g));
          tip.mostrar(`${p.nombre} (${p.cantidad})`, [
            { valor: pesosDec(p.costo), nombre: "Costo", color: c1 },
            { valor: pesosDec(p.precio - p.costo), nombre: "Ganancia", color: c2 },
            { valor: pesosDec(p.precio), nombre: "Precio de venta" },
            { valor: `${p.recargo} %`, nombre: "Precio sobre costo" }
          ], g.querySelectorAll("path")[1]);
        };
        const ocultar = () => {
          figura.classList.remove("is-hover");
          tip.ocultar();
        };
        g.addEventListener("pointerenter", mostrar);
        g.addEventListener("pointerleave", ocultar);
        g.addEventListener("focus", mostrar);
        g.addEventListener("blur", ocultar);
      });
      el("line", { class: "base", x1: x(0), x2: x(0), y1: m.t, y2: H - m.b }, svg);
      lienzo.replaceChildren(svg);
    }

    alCambiarTamano(lienzo, dibujar);

    const tabla = $('[data-tabla="productos"]');
    const cuerpo = $("tbody", tabla);
    PRODUCTOS.forEach((p) => {
      const tr = document.createElement("tr");
      [p.nombre, p.cantidad, pesosDec(p.costo), pesosDec(p.precio), `${p.recargo} %`].forEach((v, i) => {
        const c = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) c.scope = "row";
        c.textContent = v;
        tr.append(c);
      });
      cuerpo.append(tr);
    });
    const totalCosto = PRODUCTOS.reduce((s, p) => s + p.costo, 0);
    const totalPrecio = PRODUCTOS.reduce((s, p) => s + p.precio, 0);
    const pie = document.createElement("tr");
    ["Total", "", pesosDec(totalCosto), pesosDec(totalPrecio), ""].forEach((v, i) => {
      const c = document.createElement(i === 0 ? "th" : "td");
      if (i === 0) c.scope = "row";
      c.textContent = v;
      pie.append(c);
    });
    $("tfoot", tabla).append(pie);
  }

  /* ---------- cálculo de costos por producto ---------- */

  function calculoCostos() {
    const destino = $("[data-recetas-costo]");
    if (!destino) return;
    CALCULO_COSTOS.forEach(([titulo, unitario, filas]) => {
      const bloque = document.createElement("div");
      const h = document.createElement("h4");
      h.textContent = titulo;
      const scroll = document.createElement("div");
      scroll.className = "tabla-scroll";
      scroll.tabIndex = 0;
      scroll.setAttribute("role", "region");
      scroll.setAttribute("aria-label", `Costos de ${titulo}`);
      const tabla = document.createElement("table");
      tabla.className = "tabla";
      tabla.innerHTML = '<thead><tr><th scope="col">Ingrediente</th><th scope="col">Cantidad</th><th scope="col">Costo unitario</th><th scope="col">Costo</th></tr></thead><tbody></tbody><tfoot></tfoot>';
      const cuerpo = $("tbody", tabla);
      let total = 0;
      filas.forEach(([ing, cant, cu, costo]) => {
        total += costo;
        const tr = document.createElement("tr");
        [ing, cant, pesosDec(cu), pesosDec(costo)].forEach((v, i) => {
          const c = document.createElement(i === 0 ? "th" : "td");
          if (i === 0) c.scope = "row";
          c.textContent = v;
          tr.append(c);
        });
        cuerpo.append(tr);
      });
      const pie = document.createElement("tr");
      ["Total", "", `${pesosDec(unitario)} c/u`, pesosDec(total)].forEach((v, i) => {
        const c = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) c.scope = "row";
        c.textContent = v;
        pie.append(c);
      });
      $("tfoot", tabla).append(pie);
      scroll.append(tabla);
      bloque.append(h, scroll);
      destino.append(bloque);
    });
  }

  /* ---------- resumen en dos idiomas ---------- */

  function idioma() {
    const grupo = $("[data-idioma]");
    if (!grupo) return;
    const botones = $$("button", grupo);
    const textos = $$("[data-abstract]");
    grupo.hidden = false;
    const elegir = (lang) => {
      botones.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
      textos.forEach((t) => (t.hidden = t.dataset.abstract !== lang));
    };
    botones.forEach((b) => b.addEventListener("click", () => elegir(b.dataset.lang)));
    elegir("es");
  }

  /* ---------- índice que sigue la lectura ---------- */

  function indice() {
    const toc = $("[data-toc]");
    if (!toc || !("IntersectionObserver" in window)) return;
    const enlaces = $$("a", toc);
    const secciones = enlaces.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const activar = (id) => {
      enlaces.forEach((a) => {
        const activo = a.hash === `#${id}`;
        if (activo) {
          a.setAttribute("aria-current", "true");
          if (toc.scrollWidth > toc.clientWidth) {
            toc.scrollTo({ left: a.offsetLeft - toc.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
          }
        } else {
          a.removeAttribute("aria-current");
        }
      });
    };
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) activar(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    secciones.forEach((s) => io.observe(s));
  }

  idioma();
  indice();
  calculoCostos();
  const graficos = { mensual: graficoMensual, recupero: graficoRecupero, productos: graficoProductos };
  $$("[data-grafico]").forEach((figura) => graficos[figura.dataset.grafico]?.(figura));
})();
