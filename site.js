/* ============================================================
   cafe/site.js — merender seluruh konten dari content.json.
   Impor dari ../shared (SATU level naik dari folder cafe/).
   Tanpa console.*, tanpa foto orang, tanpa kunci rahasia.
   ============================================================ */
import {
  waLink,
  loadContent,
  initFaq,
  initMobileNav,
  initCopyButtons,
  setYear,
  esc,
} from "../shared/utils.js";
import { navbarHTML } from "../shared/components/navbar.js";
import { footerHTML } from "../shared/components/footer.js";
import { sectionHeadHTML } from "../shared/components/section-head.js";

/* Objek cadangan bila content.json gagal dimuat. */
const FALLBACK = {
  brand: { mark: "L", name: "Kopi Lento", tagline: "Ngopi pelan, kerja tenang." },
  nav: {
    cta: { href: "#reservasi", label: "Reservasi" },
    links: [
      { href: "#menu", label: "Menu" },
      { href: "#spot", label: "Spot" },
      { href: "#acara", label: "Acara" },
      { href: "#faq", label: "FAQ" },
      { href: "#kontak", label: "Kontak" },
    ],
  },
  hero: {
    eyebrow: "Cafe santai di Bandung",
    title: "Ngopi pelan, <em>kerja tenang</em>.",
    desc: "Cafe minimalis hangat untuk kamu yang butuh jeda: seduhan manual yang sabar, colokan di tiap meja, dan sudut tenang untuk baca atau kerja.",
    primaryCta: { href: "#menu", label: "Lihat Menu" },
    secondaryCta: { href: "#reservasi", label: "Reservasi Meja" },
    note: "Tanpa antre panjang di jam sibuk bila reservasi dulu.",
  },
  hours: {
    weekly: [
      { day: "Senin", open: "08.00", close: "22.00" },
      { day: "Selasa", open: "08.00", close: "22.00" },
      { day: "Rabu", open: "08.00", close: "22.00" },
      { day: "Kamis", open: "08.00", close: "22.00" },
      { day: "Jumat", open: "08.00", close: "22.00" },
      { day: "Sabtu", open: "08.00", close: "22.00" },
      { day: "Minggu", open: "08.00", close: "22.00" },
    ],
  },
  menu: {
    index: "01",
    eyebrow: "Menu",
    title: "Diseduh sabar, disajikan hangat",
    desc: "Harga sudah termasuk pajak.",
    categories: [
      {
        id: "kopi",
        label: "Kopi",
        items: [
          { name: "Espresso", desc: "Single shot pekat, crema tebal.", price: "Rp 22.000" },
          { name: "Americano", desc: "Panas atau dingin, ringan dan bersih.", price: "Rp 25.000" },
          { name: "Kopi Susu Lento", desc: "Andalan kami: espresso, susu segar, gula aren.", price: "Rp 28.000" },
        ],
      },
      {
        id: "non-kopi",
        label: "Non-Kopi",
        items: [
          { name: "Matcha Latte", desc: "Matcha premium, susu oat atau sapi.", price: "Rp 32.000" },
          { name: "Teh Melati", desc: "Diseduh dari daun teh utuh.", price: "Rp 18.000" },
        ],
      },
      {
        id: "makanan",
        label: "Makanan",
        items: [
          { name: "Nasi Goreng Kampung", desc: "Telur ceplok dan kerupuk.", price: "Rp 35.000" },
          { name: "Roti Bakar Cokelat Keju", desc: "Roti tebal panggang mentega.", price: "Rp 28.000" },
        ],
      },
      {
        id: "dessert",
        label: "Dessert",
        items: [
          { name: "Tiramisu Cup", desc: "Kopi, mascarpone, kakao.", price: "Rp 30.000" },
          { name: "Brownies Hangat", desc: "Disajikan hangat dengan es krim vanila.", price: "Rp 28.000" },
        ],
      },
    ],
  },
  spots: {
    index: "02",
    eyebrow: "Spot favorit",
    title: "Pilih sudutmu sendiri",
    desc: "Wi-Fi kencang dan colokan tersedia di seluruh ruangan.",
    items: [
      { title: "Ruang Dalam Tenang", desc: "Pencahayaan hangat dan musik pelan.", tags: ["Indoor", "AC"] },
      { title: "Teras Outdoor", desc: "Angin sepoi-sepoi di bawah kanopi tanaman.", tags: ["Outdoor", "Ramah hewan"] },
      { title: "Meja Kerja", desc: "Colokan di setiap kursi, Wi-Fi 100 Mbps.", tags: ["Colokan tiap meja", "Wi-Fi 100 Mbps"] },
      { title: "Pojok Baca", desc: "Rak buku bebas baca dan kursi malas.", tags: ["Buku gratis", "Sunyi"] },
    ],
  },
  events: {
    index: "03",
    eyebrow: "Acara mingguan",
    title: "Selalu ada alasan untuk mampir",
    desc: "Acara rutin tiap minggu, gratis dan terbuka untuk semua pengunjung.",
    items: [
      { day: "Senin", title: "Senin Tenang", desc: "Beli 1 gratis 1 manual brew, 08.00–11.00." },
      { day: "Jumat", title: "Akustik Senja", desc: "Musik akustik santai di teras, 19.00–21.00." },
    ],
  },
  reservation: {
    index: "04",
    eyebrow: "Reservasi",
    title: "Amankan mejamu",
    desc: "Isi formulir singkat ini, pesananmu terkirim langsung ke WhatsApp kami.",
    fields: { name: "Nama", date: "Tanggal", time: "Jam", guests: "Jumlah orang" },
    messageTemplate:
      "Halo Kopi Lento! Saya {nama} ingin reservasi meja.\nTanggal: {tanggal}\nJam: {jam}\nJumlah: {orang} orang.\nTerima kasih.",
    submitLabel: "Kirim Reservasi via WhatsApp",
  },
  faq: {
    index: "05",
    eyebrow: "FAQ",
    title: "Sering ditanyakan",
    items: [
      { q: "Apakah harus reservasi dulu?", a: "Tidak wajib untuk 1–4 orang. Untuk rombongan 5 orang ke atas, reservasi sangat disarankan." },
      { q: "Bolehkah kerja dari cafe (WFC)?", a: "Boleh. Wi-Fi 100 Mbps gratis dan colokan tersedia di tiap meja area kerja." },
      { q: "Metode pembayaran apa saja?", a: "QRIS, transfer bank, kartu debit/kredit, dan tunai." },
    ],
  },
  contact: {
    address: "Jl. Kenanga No. 12, Bandung (TODO: ganti alamat asli)",
    hoursText: "Setiap hari, 08.00–22.00",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jl.+Kenanga+No.+12+Bandung",
    phone: "+62 812-3456-7890 (TODO: ganti nomor WA asli)",
    wa: "6281234567890",
  },
  contactSection: {
    index: "06",
    eyebrow: "Kontak & lokasi",
    title: "Mampir, kami tunggu",
    desc: "Lima menit dari pusat kota.",
  },
  footer: {
    note: "Template demo — ganti seluruh konten dummy bertanda TODO sebelum dipakai produksi.",
    socials: [
      { href: "https://instagram.com/", label: "Instagram (TODO: ganti tautan asli)" },
      { href: "https://tiktok.com/", label: "TikTok (TODO: ganti tautan asli)" },
    ],
  },
};

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function todayName() {
  return DAYS_ID[new Date().getDay()];
}

function todayHoursText(hours) {
  const row = (hours.weekly || []).find((w) => w.day === todayName());
  if (!row || !row.open) return "Tutup hari ini";
  return `Buka hari ini ${esc(row.open)}–${esc(row.close)}`;
}

/* ---------- Navbar ---------- */
function renderNav(brand, nav) {
  document.getElementById("site-header").innerHTML = navbarHTML({
    brand,
    links: nav.links || [],
    cta: nav.cta || null,
  });
}

/* ---------- Hero ---------- */
function cupSVG() {
  return `
  <svg viewBox="0 0 200 200" role="img" aria-label="Ilustrasi cangkir kopi hangat" aria-hidden="true" focusable="false">
    <ellipse cx="100" cy="160" rx="62" ry="10" fill="#2e2117" opacity="0.12"/>
    <path d="M60 84 h80 v34 c0 24 -18 40 -40 40 s-40 -16 -40 -40 z" fill="#fffdf8" stroke="#2e2117" stroke-width="5"/>
    <path d="M140 92 c22 0 26 26 4 32 c-6 2 -12 2 -16 1" fill="none" stroke="#2e2117" stroke-width="5" stroke-linecap="round"/>
    <path d="M84 66 c-6 -8 4 -12 0 -22 M104 66 c-6 -8 4 -12 0 -22 M124 66 c-6 -8 4 -12 0 -22"
      fill="none" stroke="#9c5b27" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
    <ellipse cx="100" cy="84" rx="40" ry="8" fill="#9c5b27"/>
    <ellipse cx="100" cy="84" rx="30" ry="5.5" fill="#7c4519"/>
    <rect x="52" y="150" width="96" height="10" rx="5" fill="#2e2117" opacity="0.14"/>
  </svg>`;
}

function renderHero(hero, hours, brand) {
  document.getElementById("hero-copy").innerHTML = `
    <p class="hero-eyebrow">${esc(hero.eyebrow || brand.tagline || "")}</p>
    <h1 class="hero-title" id="hero-title">${hero.title || esc(brand.name)}</h1>
    <p class="hero-desc">${esc(hero.desc || "")}</p>
    <p class="hero-hours"><span class="dot" aria-hidden="true"></span>${todayHoursText(hours)} · ${esc(todayName())}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${esc(hero.primaryCta?.href || "#menu")}">${esc(hero.primaryCta?.label || "Lihat Menu")}</a>
      <a class="btn btn-outline" href="${esc(hero.secondaryCta?.href || "#reservasi")}">${esc(hero.secondaryCta?.label || "Reservasi")}</a>
    </div>
    ${hero.note ? `<p class="hero-note">${esc(hero.note)}</p>` : ""}`;
  document.getElementById("hero-art").innerHTML = `<div class="cup-scene">${cupSVG()}</div>`;
}

/* ---------- Menu + tab ---------- */
function renderMenu(menu) {
  const root = document.getElementById("menu-root");
  const cats = menu.categories || [];
  const tabs = cats
    .map(
      (c, i) => `<button class="menu-tab" role="tab" id="tab-${esc(c.id)}"
        aria-selected="${i === 0 ? "true" : "false"}"
        aria-controls="panel-${esc(c.id)}" tabindex="${i === 0 ? "0" : "-1"}">${esc(c.label)}</button>`
    )
    .join("");
  const panels = cats
    .map((c, i) => {
      const items = (c.items || [])
        .map(
          (it) => `<div class="menu-item">
            <div><p class="menu-item-name">${esc(it.name)}</p>
            ${it.desc ? `<p class="menu-item-desc">${esc(it.desc)}</p>` : ""}</div>
            <span class="menu-item-dots" aria-hidden="true"></span>
            <span class="menu-item-price">${esc(it.price)}</span>
          </div>`
        )
        .join("");
      return `<div class="menu-panel" role="tabpanel" id="panel-${esc(c.id)}"
        aria-labelledby="tab-${esc(c.id)}" ${i === 0 ? "" : "hidden"}>${items}</div>`;
    })
    .join("");
  root.innerHTML = `
    ${sectionHeadHTML({ index: menu.index, eyebrow: menu.eyebrow, title: menu.title, desc: menu.desc })}
    <div class="menu-tabs" role="tablist" aria-label="Kategori menu">${tabs}</div>
    ${panels}
    ${menu.footnote ? `<p class="menu-footnote">${esc(menu.footnote)}</p>` : ""}`;

  const tabEls = Array.from(root.querySelectorAll('[role="tab"]'));
  const panelsEls = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  function selectTab(next) {
    tabEls.forEach((t, i) => {
      const active = t === next;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      panelsEls[i].hidden = !active;
    });
    next.focus();
  }
  tabEls.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabEls.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabEls.length) % tabEls.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabEls.length - 1;
      if (j !== null) {
        e.preventDefault();
        selectTab(tabEls[j]);
      }
    });
  });
}

/* ---------- Spot ---------- */
function spotIcon(i) {
  const paths = [
    '<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M3 11h18a1 1 0 0 1 1 1v6H2v-6a1 1 0 0 1 1-1z"/><path d="M5 18v2M19 18v2"/>',
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
    '<rect x="3" y="5" width="13" height="9" rx="1.5"/><path d="M2 18h20M7 14v4M17 14v4"/><path d="M6.5 8.5h4"/>',
    '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h13"/><path d="M9 7h7"/>',
  ];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#9c5b27" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i % paths.length]}</svg>`;
}

function renderSpots(spots) {
  const cards = (spots.items || [])
    .map(
      (s, i) => `<article class="spot-card">
        <div class="spot-icon" aria-hidden="true">${spotIcon(i)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <ul class="spot-tags">${(s.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");
  document.getElementById("spot-root").innerHTML = `
    ${sectionHeadHTML({ index: spots.index, eyebrow: spots.eyebrow, title: spots.title, desc: spots.desc })}
    <div class="spot-grid">${cards}</div>`;
}

/* ---------- Acara ---------- */
function renderEvents(events) {
  const items = (events.items || [])
    .map(
      (e) => `<li class="event-item">
        <span class="event-day" aria-label="Hari ${esc(e.day)}">${esc(e.day)}</span>
        <div><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p></div>
      </li>`
    )
    .join("");
  document.getElementById("events-root").innerHTML = `
    ${sectionHeadHTML({ index: events.index, eyebrow: events.eyebrow, title: events.title, desc: events.desc })}
    <ul class="event-list">${items}</ul>`;
}

/* ---------- Reservasi ---------- */
function renderReservation(res, contact) {
  const f = res.fields || {};
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  document.getElementById("reserve-root").innerHTML = `
  <div class="reserve-card">
    <div class="reserve-grid">
      <div class="reserve-copy">
        ${sectionHeadHTML({ index: res.index, eyebrow: res.eyebrow, title: res.title, desc: res.desc })}
        <p class="section-desc">Atau hubungi langsung: <a href="${waLink(contact.wa, "Halo Kopi Lento! Saya ingin bertanya.")}" target="_blank" rel="noopener noreferrer">WhatsApp kami</a>.</p>
      </div>
      <form class="reserve-form" id="reserve-form" novalidate>
        <div class="field">
          <label for="r-nama">${esc(f.name || "Nama")}</label>
          <input id="r-nama" name="nama" type="text" autocomplete="name" required minlength="2" placeholder="Nama kamu">
        </div>
        <div class="field-row">
          <div class="field">
            <label for="r-tanggal">${esc(f.date || "Tanggal")}</label>
            <input id="r-tanggal" name="tanggal" type="date" required min="${iso}">
          </div>
          <div class="field">
            <label for="r-jam">${esc(f.time || "Jam")}</label>
            <input id="r-jam" name="jam" type="time" required>
          </div>
        </div>
        <div class="field">
          <label for="r-orang">${esc(f.guests || "Jumlah orang")}</label>
          <input id="r-orang" name="orang" type="number" required min="1" max="40" value="2" inputmode="numeric">
        </div>
        <button class="btn btn-primary" type="submit">${esc(res.submitLabel || "Kirim Reservasi via WhatsApp")}</button>
        <p class="form-note">Terkirim lewat WhatsApp — tanpa akun, tanpa antre.</p>
      </form>
    </div>
  </div>`;

  document.getElementById("reserve-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const nama = form.nama.value.trim();
    const tanggal = form.tanggal.value;
    const jam = form.jam.value;
    const orang = form.orang.value;
    const msg = (res.messageTemplate || "Halo {nama}, reservasi {tanggal} {jam} untuk {orang} orang.")
      .replace("{nama}", nama)
      .replace("{tanggal}", tanggal)
      .replace("{jam}", jam)
      .replace("{orang}", orang);
    window.location.href = waLink(contact.wa, msg);
  });
}

/* ---------- FAQ ---------- */
function renderFaq(faq) {
  const items = (faq.items || [])
    .map(
      (it, i) => `<div class="faq-item" data-faq-item>
        <button class="faq-q" data-faq-q aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
          <span>${esc(it.q)}</span><span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" data-faq-a id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">${esc(it.a)}</div>
      </div>`
    )
    .join("");
  const root = document.getElementById("faq-root");
  root.innerHTML = `
    ${sectionHeadHTML({ index: faq.index, eyebrow: faq.eyebrow, title: faq.title, desc: faq.desc })}
    <div class="faq-list" data-faq>${items}</div>`;
  initFaq(root);
}

/* ---------- Kontak ---------- */
function pinSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
}
function clockSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
}
function waSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-16.5 5L3 21l4.2-1.4A9 9 0 0 1 21 12z"/><path d="M9 9.5c.5 2.5 3 5 5.5 5.5l1-1.5 2 1c-.5 1.5-1.5 2-3 1.5-3-1-6-4-7-7-.5-1.5 0-2.5 1.5-3l1 2z"/></svg>`;
}

function renderContact(sec, contact, hours) {
  const rows = (hours.weekly || [])
    .map(
      (w) => `<tr class="${w.day === todayName() ? "is-today" : ""}">
        <td>${esc(w.day)}</td><td>${w.open ? `${esc(w.open)}–${esc(w.close)}` : "Tutup"}</td>
      </tr>`
    )
    .join("");
  document.getElementById("contact-root").innerHTML = `
    ${sectionHeadHTML({ index: sec.index, eyebrow: sec.eyebrow, title: sec.title, desc: sec.desc })}
    <div class="contact-grid">
      <div class="contact-card">
        <h3>Kunjungi kami</h3>
        <div class="contact-row">${pinSVG()}<span>${esc(contact.address)}</span></div>
        <div class="contact-row">${clockSVG()}<span>${esc(contact.hoursText)}</span></div>
        <div class="contact-row">${waSVG()}<span>${esc(contact.phone)}</span></div>
        <div class="contact-actions">
          <a class="btn btn-primary" href="${waLink(contact.wa, "Halo Kopi Lento!")}" target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>
          <a class="btn btn-outline" href="${esc(contact.mapsUrl)}" target="_blank" rel="noopener noreferrer">Buka di Google Maps</a>
        </div>
      </div>
      <div class="contact-card">
        <h3>Jam buka</h3>
        <table class="hours-table"><tbody>${rows}</tbody></table>
      </div>
    </div>`;
}

/* ---------- Footer + JSON-LD ---------- */
function renderFooter(brand, contact, footer) {
  document.getElementById("site-footer").innerHTML = footerHTML({
    brand,
    contact: { address: contact.address, hours: contact.hoursText, phone: contact.phone },
    socials: footer.socials || [],
    note: footer.note || "",
  });
}

function injectJsonLd(brand, contact, hours) {
  const specs = (hours.weekly || [])
    .filter((w) => w.open)
    .map((w) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: w.day,
      opens: w.open.replace(".", ":"),
      closes: w.close.replace(".", ":"),
    }));
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: brand.name,
    slogan: brand.tagline,
    telephone: contact.wa ? `+${String(contact.wa).replace(/\D/g, "")}` : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Bandung",
      addressCountry: "ID",
    },
    openingHoursSpecification: specs,
    servesCuisine: ["Kopi", "Makanan ringan", "Dessert"],
    priceRange: "Rp",
    acceptsReservations: "True",
  };
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

/* ---------- Mulai ---------- */
const content = await loadContent(
  "content.json",
  FALLBACK,
  document.getElementById("content-notice")
);

renderNav(content.brand, content.nav);
renderHero(content.hero, content.hours, content.brand);
renderMenu(content.menu);
renderSpots(content.spots);
renderEvents(content.events);
renderReservation(content.reservation, content.contact);
renderFaq(content.faq);
renderContact(content.contactSection, content.contact, content.hours);
renderFooter(content.brand, content.contact, content.footer);
injectJsonLd(content.brand, content.contact, content.hours);

initMobileNav();
initCopyButtons();
setYear();
