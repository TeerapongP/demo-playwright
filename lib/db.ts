// ─── Types ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface Concert {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  image: string; // emoji or color
  genre: string;
  tiers: Tier[];
  status: "available" | "soldout" | "upcoming";
}

export interface Tier {
  id: string;
  name: string;
  price: number;
  total: number;
  remaining: number;
  color: string;
}

export interface Booking {
  id: string;
  userId: string;
  concertId: string;
  concertTitle: string;
  concertDate: string;
  concertVenue: string;
  tier: string;
  tierName: string;
  price: number;
  quantity: number;
  total: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  cardLast4: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

// ─── Seed Data ────────────────────────────────────────────────
const SEED_USERS: User[] = [
  {
    id: "U001",
    name: "Demo User",
    email: "demo@stagepass.dev",
    phone: "0812345678",
    password: "demo1234",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

const SEED_CONCERTS: Concert[] = [
  {
    id: "c001",
    title: "AESPA WORLD TOUR 2025",
    artist: "aespa",
    venue: "Impact Arena, Nonthaburi",
    date: "2025-08-15",
    time: "18:00",
    image: "/image/aespa.png",
    genre: "K-Pop",
    status: "available",
    tiers: [
      { id: "vip", name: "VIP", price: 4500, total: 200, remaining: 47, color: "#c084fc" },
      { id: "gold", name: "Gold", price: 2800, total: 500, remaining: 183, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 1500, total: 1000, remaining: 621, color: "#94a3b8" },
    ],
  },
  {
    id: "c002",
    title: "BABYMONSTER LIVE IN BANGKOK",
    artist: "BABYMONSTER",
    venue: "Thunder Dome, Bangkok",
    date: "2025-09-06",
    time: "19:30",
    image: "/image/babymonster.png",
    genre: "K-Pop",
    status: "available",
    tiers: [
      { id: "vip", name: "VIP", price: 3800, total: 150, remaining: 12, color: "#c084fc" },
      { id: "gold", name: "Gold", price: 2200, total: 400, remaining: 289, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 1200, total: 800, remaining: 754, color: "#94a3b8" },
    ],
  },
  {
    id: "c003",
    title: "IVE CONCERT IN BANGKOK",
    artist: "IVE",
    venue: "Rajamangala Stadium",
    date: "2025-09-20",
    time: "17:00",
    image: "/image/ive.png",
    genre: "K-Pop",
    status: "available",
    tiers: [
      { id: "vip", name: "VIP", price: 3200, total: 100, remaining: 0, color: "#c084fc" },
      { id: "gold", name: "Gold", price: 1900, total: 300, remaining: 94, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 990, total: 600, remaining: 412, color: "#94a3b8" },
    ],
  },
  {
    id: "c004",
    title: "TWICE 5TH WORLD TOUR",
    artist: "TWICE",
    venue: "Impact Arena, Nonthaburi",
    date: "2025-10-11",
    time: "18:00",
    image: "/image/twice.png",
    genre: "K-Pop",
    status: "soldout",
    tiers: [
      { id: "vip", name: "VIP", price: 6500, total: 300, remaining: 0, color: "#c084fc" },
      { id: "gold", name: "Gold", price: 3500, total: 700, remaining: 0, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 2000, total: 1500, remaining: 0, color: "#94a3b8" },
    ],
  },
  {
    id: "c005",
    title: "NMIXX SHOWCASE BANGKOK",
    artist: "NMIXX",
    venue: "Royal Paragon Hall",
    date: "2025-11-01",
    time: "19:00",
    image: "/image/nmix.png",
    genre: "K-Pop",
    status: "upcoming",
    tiers: [
      { id: "vip", name: "VIP", price: 2500, total: 80, remaining: 80, color: "#c084fc" },
      { id: "gold", name: "Gold", price: 1500, total: 250, remaining: 250, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 800, total: 500, remaining: 500, color: "#94a3b8" },
    ],
  },
  {
    id: "c006",
    title: "HEART2HEART FESTIVAL",
    artist: "Various Artists",
    venue: "Bitec Bangna Hall 8",
    date: "2025-11-22",
    time: "16:00",
    image: "/image/heart2heart.png",
    genre: "K-Pop Festival",
    status: "available",
    tiers: [
      { id: "vip", name: "VIP Standing", price: 4200, total: 250, remaining: 88, color: "#c084fc" },
      { id: "gold", name: "Gold Standing", price: 2600, total: 600, remaining: 342, color: "#fbbf24" },
      { id: "silver", name: "Silver", price: 1400, total: 1000, remaining: 887, color: "#94a3b8" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
function isBrowser() { return typeof window !== "undefined"; }
function genId() { return Math.random().toString(36).slice(2, 10).toUpperCase(); }

// ─── Users ────────────────────────────────────────────────────
export function getUsers(): User[] {
  if (!isBrowser()) return SEED_USERS;
  const stored = localStorage.getItem("cdb_users");
  if (!stored) {
    localStorage.setItem("cdb_users", JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  return JSON.parse(stored);
}
function saveUsers(users: User[]) {
  localStorage.setItem("cdb_users", JSON.stringify(users));
}
export function registerUser(name: string, email: string, phone: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, error: "Email นี้ถูกใช้งานแล้ว" };
  const user: User = { id: genId(), name, email, phone, password, createdAt: new Date().toISOString() };
  saveUsers([...users, user]);
  return { ok: true };
}
export function loginUser(email: string, password: string): User | null {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (user) localStorage.setItem("cdb_session", JSON.stringify(user));
  return user || null;
}
export function logoutUser() { localStorage.removeItem("cdb_session"); }
export function getSession(): User | null {
  if (!isBrowser()) return null;
  const d = localStorage.getItem("cdb_session");
  return d ? JSON.parse(d) : null;
}

// ─── Concerts ─────────────────────────────────────────────────
export function getConcerts(): Concert[] {
  if (!isBrowser()) return SEED_CONCERTS;
  const stored = localStorage.getItem("cdb_concerts");
  if (!stored) {
    localStorage.setItem("cdb_concerts", JSON.stringify(SEED_CONCERTS));
    return SEED_CONCERTS;
  }
  const concerts = JSON.parse(stored);
  // Check if concerts have old emoji format and update to new image paths
  const needsUpdate = concerts.some((c: Concert) => !c.image.startsWith('/'));
  if (needsUpdate) {
    localStorage.setItem("cdb_concerts", JSON.stringify(SEED_CONCERTS));
    return SEED_CONCERTS;
  }
  return concerts;
}
export function getConcert(id: string): Concert | null {
  return getConcerts().find(c => c.id === id) || null;
}
function saveConcerts(concerts: Concert[]) {
  localStorage.setItem("cdb_concerts", JSON.stringify(concerts));
}

// ─── Bookings ─────────────────────────────────────────────────
export function getBookings(): Booking[] {
  if (!isBrowser()) return [];
  return JSON.parse(localStorage.getItem("cdb_bookings") || "[]");
}
export function getMyBookings(userId: string): Booking[] {
  return getBookings().filter(b => b.userId === userId);
}

export interface BookingInput {
  userId: string;
  concertId: string;
  tierId: string;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  cardNumber: string;
}

export function createBooking(input: BookingInput): { ok: boolean; booking?: Booking; error?: string } {
  const concerts = getConcerts();
  const concert = concerts.find(c => c.id === input.concertId);
  if (!concert) return { ok: false, error: "ไม่พบ concert" };

  const tier = concert.tiers.find(t => t.id === input.tierId);
  if (!tier) return { ok: false, error: "ไม่พบ tier" };
  if (tier.remaining < input.quantity) return { ok: false, error: "ที่นั่งไม่เพียงพอ" };

  // deduct remaining
  tier.remaining -= input.quantity;
  if (concert.tiers.every(t => t.remaining === 0)) concert.status = "soldout";
  saveConcerts(concerts);

  const booking: Booking = {
    id: "BK" + genId(),
    userId: input.userId,
    concertId: input.concertId,
    concertTitle: concert.title,
    concertDate: concert.date,
    concertVenue: concert.venue,
    tier: input.tierId,
    tierName: tier.name,
    price: tier.price,
    quantity: input.quantity,
    total: tier.price * input.quantity,
    attendeeName: input.attendeeName,
    attendeeEmail: input.attendeeEmail,
    attendeePhone: input.attendeePhone,
    cardLast4: input.cardNumber.slice(-4),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const bookings = getBookings();
  localStorage.setItem("cdb_bookings", JSON.stringify([...bookings, booking]));
  return { ok: true, booking };
}

export function resetDB() {
  ["cdb_users", "cdb_concerts", "cdb_bookings", "cdb_session"].forEach(k => localStorage.removeItem(k));
}
