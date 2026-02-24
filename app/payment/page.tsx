"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/navigation";
import { getConcert, getSession, createBooking, type Concert, type Tier } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

interface Draft {
  concertId: string; tierId: string; quantity: number;
  attendeeName: string; attendeeEmail: string; attendeePhone: string;
}

function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 4);
  return v.length >= 3 ? v.slice(0, 2) + "/" + v.slice(2) : v;
}

export default function PaymentPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [concert, setConcert] = useState<Concert | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [form, setForm] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = getSession();
    if (!user) { router.push("/login"); return; }
    const raw = sessionStorage.getItem("booking_draft");
    if (!raw) { router.push("/concerts"); return; }
    const d: Draft = JSON.parse(raw);
    setDraft(d);
    const c = getConcert(d.concertId);
    if (!c) { router.push("/concerts"); return; }
    setConcert(c);
    setTier(c.tiers.find(t => t.id === d.tierId) || null);
  }, [router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cardName.trim()) e.cardName = "กรุณากรอกชื่อบนบัตร";
    const cardClean = form.cardNumber.replace(/\s/g, "");
    if (!cardClean) e.cardNumber = "กรุณากรอกหมายเลขบัตร";
    else if (cardClean.length !== 16) e.cardNumber = "หมายเลขบัตรต้องมี 16 หลัก";
    if (!form.expiry) e.expiry = "กรุณากรอกวันหมดอายุ";
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "รูปแบบไม่ถูกต้อง (MM/YY)";
    if (!form.cvv) e.cvv = "กรุณากรอก CVV";
    else if (form.cvv.length < 3) e.cvv = "CVV ต้องมี 3-4 หลัก";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate() || !draft) return;
    const user = getSession();
    if (!user) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate payment processing

    const result = createBooking({
      userId: user.id,
      concertId: draft.concertId,
      tierId: draft.tierId,
      quantity: draft.quantity,
      attendeeName: draft.attendeeName,
      attendeeEmail: draft.attendeeEmail,
      attendeePhone: draft.attendeePhone,
      cardNumber: form.cardNumber.replace(/\s/g, ""),
    });

    setLoading(false);
    if (result.ok && result.booking) {
      setBookingId(result.booking.id);
      sessionStorage.removeItem("booking_draft");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/tickets");
  };

  if (!concert || !tier || !draft) return null;
  const total = tier.price * draft.quantity;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "var(--ink-3)" }}>
            <Link href="/concerts" style={{ color: "var(--ink-3)", textDecoration: "none" }}>คอนเสิร์ต</Link>
            <span>→</span>
            <span style={{ color: "var(--ink-2)" }}>จองตั๋ว</span>
            <span>→</span>
            <span style={{ color: "var(--ink)" }}>ชำระเงิน</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
            {/* Left: payment form */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>ข้อมูลการชำระเงิน</h2>
              <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 28 }}>🔒 ข้อมูลถูกเข้ารหัสและปลอดภัย</p>

              {/* Card visual */}
              <div style={{
                background: "linear-gradient(135deg, #1a0a2e, #0d1a3a)",
                border: "1px solid var(--border-2)",
                borderRadius: 14, padding: "24px 28px", marginBottom: 28,
                position: "relative", overflow: "hidden", minHeight: 160,
              }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,132,252,0.15), transparent 70%)" }} />
                <div style={{ position: "absolute", bottom: -20, left: 20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.1), transparent 70%)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>STAGEPASS CARD</div>
                    <div style={{ fontSize: 22 }}>💳</div>
                  </div>
                  <div data-testid="card-preview-number" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: "rgba(255,255,255,0.85)", letterSpacing: "0.12em", marginBottom: 16 }}>
                    {form.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 2 }}>CARDHOLDER</div>
                      <div data-testid="card-preview-name" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>
                        {form.cardName || "YOUR NAME"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 2 }}>EXPIRES</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                        {form.expiry || "MM/YY"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Cardholder Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>ชื่อบนบัตร</label>
                  <InputText data-testid="input-card-name" value={form.cardName} onChange={e => setForm(p => ({ ...p, cardName: e.target.value.toUpperCase() }))} placeholder="FIRSTNAME LASTNAME" className={errors.cardName ? "p-invalid" : ""} style={{ fontFamily: "'JetBrains Mono', monospace" }} />
                  {errors.cardName && <small data-testid="error-card-name" style={{ fontSize: 12, color: "var(--red)" }}>{errors.cardName}</small>}
                </div>

                {/* Card Number */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>หมายเลขบัตร</label>
                  <InputText
                    data-testid="input-card-number"
                    value={form.cardNumber}
                    onChange={e => setForm(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={errors.cardNumber ? "p-invalid" : ""}
                    style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}
                  />
                  {errors.cardNumber && <small data-testid="error-card-number" style={{ fontSize: 12, color: "var(--red)" }}>{errors.cardNumber}</small>}
                </div>

                {/* Expiry + CVV */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>วันหมดอายุ</label>
                    <InputText
                      data-testid="input-expiry"
                      value={form.expiry}
                      onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={errors.expiry ? "p-invalid" : ""}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    />
                    {errors.expiry && <small data-testid="error-expiry" style={{ fontSize: 12, color: "var(--red)" }}>{errors.expiry}</small>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>CVV</label>
                    <InputText
                      data-testid="input-cvv"
                      value={form.cvv}
                      onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                      className={errors.cvv ? "p-invalid" : ""}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    />
                    {errors.cvv && <small data-testid="error-cvv" style={{ fontSize: 12, color: "var(--red)" }}>{errors.cvv}</small>}
                  </div>
                </div>

                <Button
                  label={loading ? "กำลังดำเนินการ..." : `ชำระเงิน ฿${total.toLocaleString()}`}
                  data-testid="btn-pay"
                  onClick={handlePay}
                  loading={loading}
                  style={{ width: "100%", marginTop: 8 }}
                />
              </div>
            </div>

            {/* Right: order summary */}
            <div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px", position: "sticky", top: 80 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, color: "var(--ink)" }}>สรุปคำสั่งซื้อ</h3>

                <div style={{ padding: "16px", background: "var(--bg)", borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ position: "relative", width: "100%", height: 100, marginBottom: 12, borderRadius: 8, overflow: "hidden" }}>
                    <Image 
                      src={concert.image} 
                      alt={concert.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{concert.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
                    {new Date(concert.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })} · {concert.venue}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                  {[
                    ["Tier", tier.name],
                    ["จำนวน", `${draft.quantity} ใบ`],
                    ["ราคาต่อใบ", `฿${tier.price.toLocaleString()}`],
                    ["ผู้เข้าชม", draft.attendeeName],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--ink-2)" }}>{k}</span>
                      <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>ยอดรวม</span>
                  <span data-testid="payment-total" style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── SUCCESS MODAL ── */}
      <Dialog
        visible={showModal}
        onHide={handleCloseModal}
        header="การจองสำเร็จ! 🎉"
        style={{ width: "480px" }}
        data-testid="success-modal"
        closable={false}
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button
              label="ดูตั๋วของฉัน"
              data-testid="btn-view-tickets"
              onClick={handleCloseModal}
              style={{ minWidth: 140 }}
            />
            <Button
              label="จองเพิ่ม"
              data-testid="btn-book-more"
              className="p-button-outlined"
              onClick={() => { setShowModal(false); router.push("/concerts"); }}
            />
          </div>
        }
      >
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎫</div>
          <div data-testid="booking-id" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700,
            color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 8,
          }}>
            {bookingId}
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 20 }}>หมายเลขการจองของคุณ</p>

          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>{concert.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["Tier", tier.name],
                ["จำนวน", `${draft.quantity} ใบ`],
                ["รวม", `฿${total.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>{k}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 16 }}>
            ✉️ ส่งยืนยันไปที่ {draft.attendeeEmail} แล้ว
          </p>
        </div>
      </Dialog>
    </>
  );
}
