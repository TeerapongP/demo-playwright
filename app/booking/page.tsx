"use client";
import { useState, useEffect, Suspense } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getConcert, getSession, type Concert, type Tier } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const concertId = params.get("id") || "";

  const [concert, setConcert] = useState<Concert | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = getSession();
    if (!user) { router.push("/login"); return; }
    const c = getConcert(concertId);
    if (!c) { router.push("/concerts"); return; }
    setConcert(c);
    // pre-fill from user session
    setForm({ name: user.name, email: user.email, phone: user.phone || "" });
    // auto-select first available tier
    const first = c.tiers.find(t => t.remaining > 0);
    if (first) setSelectedTier(first);
  }, [concertId, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedTier) e.tier = "กรุณาเลือก tier";
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อ";
    if (!form.email.trim()) e.email = "กรุณากรอก Email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email ไม่ถูกต้อง";
    if (!form.phone.trim()) e.phone = "กรุณากรอกเบอร์โทร";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    // Store booking draft in sessionStorage
    sessionStorage.setItem("booking_draft", JSON.stringify({
      concertId,
      tierId: selectedTier!.id,
      quantity,
      attendeeName: form.name,
      attendeeEmail: form.email,
      attendeePhone: form.phone,
    }));
    router.push("/payment");
  };

  if (!concert) return null;

  const total = selectedTier ? selectedTier.price * quantity : 0;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "var(--ink-3)" }}>
            <Link href="/concerts" style={{ color: "var(--ink-3)", textDecoration: "none" }}>คอนเสิร์ต</Link>
            <span>→</span>
            <span style={{ color: "var(--ink)" }}>จองตั๋ว</span>
          </div>

          {/* Concert summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px", marginBottom: 28, display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
              <Image 
                src={concert.image} 
                alt={concert.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-2)", marginBottom: 6 }}>{concert.genre}</div>
              <h1 data-testid="booking-concert-title" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{concert.title}</h1>
              <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                📅 {new Date(concert.date).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })} · {concert.time} น. &nbsp;·&nbsp; 📍 {concert.venue}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
            {/* Left: form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Tier selection */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--ink)" }}>เลือก Tier</h2>
                {errors.tier && <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{errors.tier}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }} data-testid="tier-selection">
                  {concert.tiers.map(tier => {
                    const isSelected = selectedTier?.id === tier.id;
                    const isSoldout = tier.remaining === 0;
                    return (
                      <div
                        key={tier.id}
                        data-testid={`tier-${tier.id}`}
                        onClick={() => !isSoldout && setSelectedTier(tier)}
                        style={{
                          padding: "16px 20px",
                          border: `1px solid ${isSelected ? tier.color + "80" : "var(--border)"}`,
                          borderRadius: 10,
                          background: isSelected ? tier.color + "0d" : "var(--bg-2)",
                          cursor: isSoldout ? "not-allowed" : "pointer",
                          opacity: isSoldout ? 0.5 : 1,
                          transition: "all 0.15s",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${isSelected ? tier.color : "var(--border-2)"}`, background: isSelected ? tier.color : "transparent", flexShrink: 0, transition: "all 0.15s" }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? tier.color : "var(--ink)" }}>{tier.name}</div>
                            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                              {isSoldout ? "หมดแล้ว" : `เหลือ ${tier.remaining} / ${tier.total} ที่นั่ง`}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: isSelected ? tier.color : "var(--ink-2)" }}>
                          ฿{tier.price.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity */}
                <div style={{ marginTop: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>จำนวนตั๋ว</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        data-testid={`qty-${n}`}
                        onClick={() => setQuantity(n)}
                        style={{
                          width: 44, height: 44, borderRadius: 8, border: `1px solid ${quantity === n ? "var(--accent)" : "var(--border)"}`,
                          background: quantity === n ? "rgba(192,132,252,0.15)" : "var(--bg-2)",
                          color: quantity === n ? "var(--accent)" : "var(--ink-2)",
                          fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendee info */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--ink)" }}>ข้อมูลผู้เข้าชม</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>ชื่อ-นามสกุล</label>
                    <InputText data-testid="input-attendee-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="กรอกชื่อ-นามสกุล" className={errors.name ? "p-invalid" : ""} />
                    {errors.name && <small data-testid="error-attendee-name" style={{ fontSize: 12, color: "var(--red)" }}>{errors.name}</small>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                      <InputText data-testid="input-attendee-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" className={errors.email ? "p-invalid" : ""} />
                      {errors.email && <small data-testid="error-attendee-email" style={{ fontSize: 12, color: "var(--red)" }}>{errors.email}</small>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>เบอร์โทร</label>
                      <InputText data-testid="input-attendee-phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0812345678" className={errors.phone ? "p-invalid" : ""} />
                      {errors.phone && <small data-testid="error-attendee-phone" style={{ fontSize: 12, color: "var(--red)" }}>{errors.phone}</small>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: summary */}
            <div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px", position: "sticky", top: 80 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--ink)" }}>สรุปการจอง</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--ink-2)" }}>Tier</span>
                    <span data-testid="summary-tier" style={{ color: "var(--ink)", fontWeight: 500 }}>{selectedTier?.name || "-"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--ink-2)" }}>ราคาต่อใบ</span>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>฿{selectedTier ? selectedTier.price.toLocaleString() : "-"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--ink-2)" }}>จำนวน</span>
                    <span data-testid="summary-quantity" style={{ color: "var(--ink)", fontWeight: 500 }}>{quantity} ใบ</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>รวม</span>
                  <span data-testid="summary-total" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
                    ฿{total.toLocaleString()}
                  </span>
                </div>

                <Button
                  label="ถัดไป: ชำระเงิน →"
                  data-testid="btn-next-payment"
                  onClick={handleNext}
                  style={{ width: "100%" }}
                />

                <p style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", marginTop: 12 }}>
                  🔒 ข้อมูลของคุณปลอดภัย
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function BookingPage() {
  return <Suspense><BookingForm /></Suspense>;
}
