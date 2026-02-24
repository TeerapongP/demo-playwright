# 🎵 StagePass — Concert Booking Demo

Demo app สำหรับ Playwright Training — ระบบจองตั๋วคอนเสิร์ต

## User Flow

```
/register → /login → /concerts → /booking?id=xxx → /payment → Modal ✅ → /tickets
```

## Pages & data-testid

### `/register`
- `input-name`, `input-email`, `input-phone`, `input-password`, `input-confirm-password`
- `btn-register`, `register-error`
- `error-name`, `error-email`, `error-phone`, `error-password`, `error-confirm-password`

### `/login`
- `input-email`, `input-password`, `btn-login`, `login-error`
- `btn-fill-demo` — คลิกเพื่อเติม test account อัตโนมัติ
- `register-success-msg` — หลัง register สำเร็จ

### `/concerts`
- `search-input`, `filter-ทั้งหมด`, `filter-มีที่นั่ง`, `filter-Sold Out`, `filter-เร็วๆ นี้`
- `concert-list`, `concert-card-{id}`, `concert-title-{id}`, `concert-status-{id}`
- `btn-book-{id}` — disabled ถ้า soldout/upcoming
- `no-results`

### `/booking`
- `booking-concert-title`
- `tier-selection`, `tier-vip`, `tier-gold`, `tier-silver`
- `qty-1`, `qty-2`, `qty-3`, `qty-4`
- `input-attendee-name`, `input-attendee-email`, `input-attendee-phone`
- `summary-tier`, `summary-quantity`, `summary-total`
- `btn-next-payment`

### `/payment`
- `input-card-name`, `input-card-number`, `input-expiry`, `input-cvv`
- `card-preview-number`, `card-preview-name`
- `error-card-name`, `error-card-number`, `error-expiry`, `error-cvv`
- `btn-pay`, `payment-total`
- `success-modal` — Dialog หลังจ่ายสำเร็จ
- `booking-id` — รหัสการจอง
- `btn-view-tickets`, `btn-book-more`

### `/tickets`
- `tickets-list`, `ticket-item-{i}`
- `ticket-id-{i}`, `ticket-concert-{i}`, `ticket-tier-{i}`, `ticket-total-{i}`
- `no-tickets` — ถ้ายังไม่เคยจอง

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Test Account

สมัครเองได้ หรือใช้ปุ่ม "Demo Account" ในหน้า Login
แล้วสมัครที่หน้า Register ก่อนได้เลย

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + PrimeReact (lara-dark-purple)
- localStorage เป็น database (users, concerts, bookings, session)
- Syne + JetBrains Mono + Inter
