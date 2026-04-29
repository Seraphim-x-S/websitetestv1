/* ============================================================
   script.js — Rachen Haircut
   แก้ไข Logic การทำงานได้ในไฟล์นี้
============================================================ */

/* ════════════════════════════════════════════
   SCROLL ANIMATION
════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


/* ════════════════════════════════════════════
   NAVBAR — shadow เมื่อ scroll
════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 20
    ? '0 4px 24px rgba(0,0,0,0.08)' : 'none';
});


/* ════════════════════════════════════════════
   BOOKING FORM
════════════════════════════════════════════ */

// ตั้งวันที่ขั้นต่ำเป็นวันนี้
const dateInput = document.getElementById('f-date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// ฟังก์ชัน: ตรวจสอบฟอร์มแล้วบันทึกส่งหลังบ้านทันที
function handleBooking() {
  const name    = document.getElementById('f-name').value.trim();
  const tel     = document.getElementById('f-tel').value.trim();
  const date    = document.getElementById('f-date').value;
  const time    = document.getElementById('f-time').value;
  const service = document.getElementById('f-service').value;
  const barber  = document.getElementById('f-barber').value || 'ช่างว่าง';
  const note    = document.getElementById('f-note').value.trim();

  if (!name || !tel || !date || !time || !service) {
    alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่อ, เบอร์โทร, วันที่, เวลา, บริการ)');
    return;
  }

  // ══ บันทึกลง localStorage → Admin รับทันที ══
  const existing = JSON.parse(localStorage.getItem('craft_bookings') || '[]');
  const newBooking = {
    id:        Date.now(),
    name, tel, date, time, service, barber, note,
    status:    'pending',               // แอดมินเห็น = รอยืนยัน
    createdAt: new Date().toISOString()
  };
  existing.push(newBooking);
  localStorage.setItem('craft_bookings', JSON.stringify(existing));

  // แจ้งแท็บอื่น (admin.html ที่เปิดอยู่) ให้รีเฟรชรายการทันที
  localStorage.setItem('craft_booking_ping', Date.now().toString());

  openModal();
}

function openModal() {
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  ['f-name','f-tel','f-date','f-note'].forEach(id => {
    document.getElementById(id).value = '';
  });
  ['f-time','f-barber','f-service'].forEach(id => {
    document.getElementById(id).selectedIndex = 0;
  });
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});


/* ════════════════════════════════════════════
   ADD TO CART
════════════════════════════════════════════ */
let cartCount = 0;

function addToCart(btn) {
  cartCount++;
  btn.textContent = '✓';
  btn.style.background = 'var(--gold)';
  setTimeout(() => {
    btn.textContent = '+';
    btn.style.background = 'var(--charcoal)';
  }, 1500);
}
