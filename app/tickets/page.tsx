"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getMyBookings, type Booking } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TicketsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getSession();
    if (!user) { router.push("/login"); return; }
    const b = getMyBookings(user.id);
    setBookings(b.sort((a, z) => new Date(z.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px" }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.02em" }}>
              🎫 ตั๋วของฉัน
            </h1>
            <p style={{ fontSize: 14, color: "var(--ink-3)" }}>ประวัติการจองตั๋วทั้งหมด</p>
          </div>

          {bookings.length === 0 ? (
            <div data-testid="no-tickets" style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🎫</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>ยังไม่มีตั๋ว</h2>
              <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>จองตั๋วคอนเสิร์ตแรกของคุณได้เลย!</p>
              <Link href="/concerts" style={{
                display: "inline-block", padding: "12px 28px", borderRadius: 10,
                background: "var(--accent)",
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                boxShadow: "0 0 20px rgba(192,132,252,0.3)",
                color: "white",
              }}>
                ดูคอนเสิร์ต →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} data-testid="tickets-list">
              {bookings.map((b, i) => (
                <div
                  key={b.id}
                  data-testid={`ticket-item-${i}`}
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 14, overflow: "hidden",
                    display: "grid", gridTemplateColumns: "8px 1fr",
                  }}
                >
                  {/* Color stripe */}
                  <div style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))" }} />

                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>
                          BOOKING ID
                        </div>
                        <div data-testid={`ticket-id-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
                          {b.id}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
                        padding: "4px 10px", borderRadius: 4,
                        background: b.status === "confirmed" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                        color: b.status === "confirmed" ? "var(--green)" : "var(--red)",
                        border: `1px solid ${b.status === "confirmed" ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                      }}>
                        {b.status === "confirmed" ? "✓ CONFIRMED" : "CANCELLED"}
                      </div>
                    </div>

                    <h3 data-testid={`ticket-concert-${i}`} style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                      {b.concertTitle}
                    </h3>

                    <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" as const }}>
                      <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                        📅 {new Date(b.concertDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--ink-2)" }}>📍 {b.concertVenue}</div>
                    </div>

                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Tier</div>
                        <div data-testid={`ticket-tier-${i}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{b.tierName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>จำนวน</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{b.quantity} ใบ</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>ยอดรวม</div>
                        <div data-testid={`ticket-total-${i}`} style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>฿{b.total.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>บัตรที่ใช้</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "var(--ink-2)" }}>•••• {b.cardLast4}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>วันที่จอง</div>
                        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                          {new Date(b.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
