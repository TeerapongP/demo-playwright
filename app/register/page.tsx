"use client";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/db";
import Navbar from "@/components/Navbar";

interface F { name: string; email: string; phone: string; password: string; confirm: string; }
interface E { name?: string; email?: string; phone?: string; password?: string; confirm?: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<F>({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<E>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const validate = (): boolean => {
    const e: E = {};
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.email.trim()) e.email = "กรุณากรอก Email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "รูปแบบ Email ไม่ถูกต้อง";
    if (!form.phone.trim()) e.phone = "กรุณากรอกเบอร์โทร";
    else if (!/^[0-9]{9,10}$/.test(form.phone.replace(/-/g, ""))) e.phone = "เบอร์โทรไม่ถูกต้อง";
    if (!form.password) e.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 8) e.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (!form.confirm) e.confirm = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirm) e.confirm = "รหัสผ่านไม่ตรงกัน";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true); setServerError("");
    await new Promise(r => setTimeout(r, 800));
    const result = registerUser(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (!result.ok) { setServerError(result.error || "เกิดข้อผิดพลาด"); return; }
    router.push("/login?registered=1");
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", background: "linear-gradient(to bottom, var(--bg), var(--bg-2))" }}>
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block",
              padding: "16px",
              background: "var(--ink)",
              borderRadius: 16,
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 32, filter: "grayscale(1) brightness(10)" }}>🎫</div>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>สร้างบัญชี</h1>
            <p style={{ fontSize: 15, color: "var(--ink-2)" }}>สมัครเพื่อจองตั๋วคอนเสิร์ต</p>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            {serverError && <div style={{ marginBottom: 20 }}><Message severity="error" text={` ${serverError}`} data-testid="register-error" /></div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>ชื่อ-นามสกุล</label>
                <InputText data-testid="input-name" value={form.name} onChange={set("name")} placeholder="ชื่อ นามสกุล" className={errors.name ? "p-invalid" : ""} />
                {errors.name && <small data-testid="error-name" style={{ fontSize: 13, color: "var(--red)" }}>{errors.name}</small>}
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>Email</label>
                <InputText data-testid="input-email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={errors.email ? "p-invalid" : ""} />
                {errors.email && <small data-testid="error-email" style={{ fontSize: 13, color: "var(--red)" }}>{errors.email}</small>}
              </div>

              {/* Phone */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>เบอร์โทรศัพท์</label>
                <InputText data-testid="input-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="0812345678" maxLength={10} className={errors.phone ? "p-invalid" : ""} />
                {errors.phone && <small data-testid="error-phone" style={{ fontSize: 13, color: "var(--red)" }}>{errors.phone}</small>}
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>รหัสผ่าน</label>
                <Password inputId="password" data-testid="input-password" value={form.password} onChange={set("password")} placeholder="อย่างน้อย 8 ตัวอักษร" feedback={false} toggleMask className={errors.password ? "p-invalid" : ""} />
                {errors.password && <small data-testid="error-password" style={{ fontSize: 13, color: "var(--red)" }}>{errors.password}</small>}
              </div>

              {/* Confirm */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>ยืนยันรหัสผ่าน</label>
                <Password inputId="confirm" data-testid="input-confirm-password" value={form.confirm} onChange={set("confirm")} placeholder="กรอกรหัสผ่านอีกครั้ง" feedback={false} toggleMask className={errors.confirm ? "p-invalid" : ""} />
                {errors.confirm && <small data-testid="error-confirm-password" style={{ fontSize: 13, color: "var(--red)" }}>{errors.confirm}</small>}
              </div>

              <Button label="สมัครสมาชิก" data-testid="btn-register" onClick={handleSubmit} loading={loading} style={{ width: "100%", marginTop: 8 }} />

              <div style={{ textAlign: "center", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
                  มีบัญชีแล้ว?{" "}
                  <Link href="/login" data-testid="link-login" style={{ color: "var(--ink)", textDecoration: "underline", fontWeight: 500 }}>เข้าสู่ระบบ</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
