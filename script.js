// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('burger').classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('burger').classList.remove('active');
  });
});

// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.anim').forEach(el => observer.observe(el));

// ============ FAQ ============
function toggleFaq(el) {
  el.classList.toggle('open');
}

// ============ BOOKING MODAL ============
const BOT_TOKEN = '8601188994:AAH8wjic-4ETEZq9ZwcHrjn2ZqRroiN4t1I';
const CHAT_ID = '409624055';

const SERVICES = [
  { value: 'student_consultation', label: 'Разовая консультация (Абитуриенты) — 10 000 ₸' },
  { value: 'student_orientation', label: 'Профориентация (Абитуриенты)' },
  { value: 'student_full', label: 'Полное сопровождение до поступления' },
  { value: 'doctor_consultation', label: 'Консультация по резидентуре — 15 000 ₸' },
  { value: 'doctor_specialty', label: 'Подбор специальности (Врачи)' },
  { value: 'doctor_strategy', label: 'Индивидуальная стратегия (Врачи)' },
  { value: 'telegram_subscription', label: 'Подписка на Telegram-канал — 3 000 ₸' },
];

const TIME_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

let bookingState = { step: 1, service: '', date: '', time: '', currentMonth: new Date() };

function openBooking(type) {
  bookingState = { step: 1, service: type || '', date: '', time: '', currentMonth: new Date() };
  document.getElementById('bookingModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderStep();
}

function closeBooking(e) {
  if (e.target === e.currentTarget) closeBookingForce();
}

function closeBookingForce() {
  document.getElementById('bookingModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderStep() {
  const content = document.getElementById('modalContent');
  const title = document.getElementById('modalTitle');
  const fills = document.querySelectorAll('.progress-fill');

  // Update progress
  const progressHTML = [1,2,3,4].map(s =>
    `<div class="progress-fill" style="background:${s <= bookingState.step ? '#1a56db' : '#e2e8f0'}"></div>`
  ).join('');
  document.querySelector('.progress-bar').innerHTML = progressHTML;

  if (bookingState.step === 1) {
    title.textContent = 'Выберите услугу';
    content.innerHTML = SERVICES.map(s =>
      `<button class="service-option" onclick="selectService('${s.value}')">${s.label}</button>`
    ).join('');
  } else if (bookingState.step === 2) {
    title.textContent = 'Выберите дату';
    renderCalendar(content);
  } else if (bookingState.step === 3) {
    title.textContent = 'Выберите время';
    content.innerHTML = `<p class="text-muted text-sm" style="margin-bottom:16px">Дата: <strong>${bookingState.date}</strong></p>
      <div class="time-grid">${TIME_SLOTS.map(t =>
        `<button class="time-btn" onclick="selectTime('${t}')">${t}</button>`
      ).join('')}</div>
      <button class="back-link" onclick="goBack()">← Назад</button>`;
  } else if (bookingState.step === 4) {
    title.textContent = 'Ваши данные';
    const svc = SERVICES.find(s => s.value === bookingState.service);
    content.innerHTML = `
      <div class="booking-summary">
        <p><strong>Дата:</strong> ${bookingState.date}</p>
        <p><strong>Время:</strong> ${bookingState.time}</p>
        <p><strong>Услуга:</strong> ${svc ? svc.label : bookingState.service}</p>
      </div>
      <div class="form-group"><label>Ваше имя *</label><input type="text" class="form-input" id="bName" placeholder="Как к вам обращаться?"></div>
      <div class="form-group"><label>Телефон *</label><input type="tel" class="form-input" id="bPhone" placeholder="+7 (___) ___-__-__"></div>
      <div class="form-group"><label>Сообщение (необязательно)</label><textarea class="form-input" id="bMsg" rows="3" placeholder="Опишите ваш вопрос..."></textarea></div>
      <button class="submit-btn" id="submitBtn" onclick="submitBooking()">Записаться</button>
      <button class="back-link" onclick="goBack()">← Назад</button>`;
  }
}

function selectService(val) {
  bookingState.service = val;
  bookingState.step = 2;
  renderStep();
}

function selectTime(val) {
  bookingState.time = val;
  bookingState.step = 4;
  renderStep();
}

function goBack() {
  bookingState.step--;
  renderStep();
}

// ============ CALENDAR ============
function renderCalendar(container) {
  const d = bookingState.currentMonth;
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  let daysHTML = Array.from({length: adjustedFirst}, () => '<div></div>').join('');
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const available = date >= today && date.getDay() !== 0;
    const formatted = date.toLocaleDateString('ru-RU', {day:'numeric',month:'long',year:'numeric'});
    daysHTML += available
      ? `<button class="day-btn" onclick="selectDate('${formatted}')">${i}</button>`
      : `<button class="day-btn" disabled>${i}</button>`;
  }

  container.innerHTML = `
    <div class="calendar-nav">
      <button onclick="changeMonth(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
      <span>${MONTHS[month]} ${year}</span>
      <button onclick="changeMonth(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
    </div>
    <div class="weekdays"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div>
    <div class="days">${daysHTML}</div>
    <button class="back-link" onclick="goBack()">← Назад</button>`;
}

function changeMonth(dir) {
  const d = bookingState.currentMonth;
  bookingState.currentMonth = new Date(d.getFullYear(), d.getMonth() + dir);
  renderStep();
}

function selectDate(formatted) {
  bookingState.date = formatted;
  bookingState.step = 3;
  renderStep();
}

// ============ SUBMIT ============
async function submitBooking() {
  const name = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const msg = document.getElementById('bMsg').value.trim();
  const btn = document.getElementById('submitBtn');

  if (!name || !phone) return;

  btn.disabled = true;
  btn.textContent = 'Отправка...';

  const svc = SERVICES.find(s => s.value === bookingState.service);
  const text = [
    '📋 *НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ*',
    '',
    `👤 *Имя:* ${name}`,
    `📱 *Телефон:* ${phone}`,
    `📅 *Дата:* ${bookingState.date}`,
    `🕐 *Время:* ${bookingState.time}`,
    `🏷 *Услуга:* ${svc ? svc.label : bookingState.service}`,
    msg ? `💬 *Сообщение:* ${msg}` : '',
    '',
    `⏰ _Заявка получена: ${new Date().toLocaleString('ru-RU', {timeZone:'Asia/Almaty'})}_`
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    });
    const data = await res.json();
    showResult(data.ok);
  } catch {
    showResult(false);
  }
}

function showResult(success) {
  const content = document.getElementById('modalContent');
  const title = document.getElementById('modalTitle');
  document.querySelector('.progress-bar').innerHTML = '';
  title.textContent = success ? 'Успешно!' : 'Ошибка';
  content.innerHTML = `
    <div class="result-message">
      <div class="result-circle ${success ? 'success' : 'error'}">${success ? '✓' : '✕'}</div>
      <p style="font-size:1.125rem;font-weight:500;margin-bottom:24px">${
        success ? 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.' : 'Ошибка отправки. Попробуйте позже.'
      }</p>
      <button class="btn btn-primary" onclick="closeBookingForce()">Закрыть</button>
    </div>`;
}
