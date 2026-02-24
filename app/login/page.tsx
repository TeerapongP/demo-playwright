"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = params.get("registered") === "1";

  const handleLogin = async () => {
    if (!email || !password) { setError("กรุณากรอก Email และรหัสผ่าน"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 700));
    const user = loginUser(email, password);
    setLoading(false);
    if (user) router.push("/concerts");
    else setError("Email หรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", background: "linear-gradient(to bottom, var(--bg), var(--bg-2))" }}>
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ 
              display: "inline-block",
              padding: "16px",
              background: "var(--ink)",
              borderRadius: 16,
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 32, filter: "grayscale(1) brightness(10)" }}>🎵</div>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>ยินดีต้อนรับกลับ</h1>
            <p style={{ fontSize: 15, color: "var(--ink-2)" }}>เข้าสู่ระบบเพื่อจองตั๋วคอนเสิร์ต</p>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            {registered && (
              <div style={{ marginBottom: 20 }}>
                <Message severity="success" text="✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ" data-testid="register-success-msg" />
              </div>
            )}
            {error && (
              <div style={{ marginBottom: 20 }}>
                <Message severity="error" text={error} data-testid="login-error" />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>Email</label>
                <InputText data-testid="input-email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="your@email.com" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>รหัสผ่าน</label>
                <Password inputId="password" data-testid="input-password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" feedback={false} toggleMask />
              </div>

              <Button label="เข้าสู่ระบบ" data-testid="btn-login" onClick={handleLogin} loading={loading} style={{ width: "100%", marginTop: 8 }} />

              <div style={{ padding: "16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Demo Account</div>
                <button
                  data-testid="btn-fill-demo"
                  onClick={() => { setEmail("demo@stagepass.dev"); setPassword("demo1234"); }}
                  style={{ 
                    fontSize: 13, 
                    color: "var(--ink)", 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    padding: 0, 
                    textAlign: "left" as const, 
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "underline",
                  }}
                >
                  คลิกเพื่อใช้บัญชีทดสอบ
                </button>
              </div>

              <div style={{ textAlign: "center", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
                  ยังไม่มีบัญชี?{" "}
                  <Link href="/register" data-testid="link-register" style={{ color: "var(--ink)", textDecoration: "underline", fontWeight: 500 }}>สมัครสมาชิก</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
