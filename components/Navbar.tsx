"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getSession, logoutUser } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getSession());
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: "1px solid var(--border)",
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/concerts" data-testid="nav-logo" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            background: "var(--ink)", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}>
            <span style={{ filter: "grayscale(1) brightness(10)" }}>🎵</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>
            StagePass
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <Link href="/tickets" data-testid="nav-tickets" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--ink-2)", textDecoration: "none",
                padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)",
                transition: "all 0.2s",
                background: "var(--bg-2)",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--ink-3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                ตั๋วของฉัน
              </Link>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--bg)",
              }}>
                <div style={{
                  width: 32, 
                  height: 32, 
                  borderRadius: "50%",
                  background: "var(--ink)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: "#ffffff",
                }}>
                  {user.name.charAt(0)}
                </div>
                <span data-testid="nav-username" style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{user.name}</span>
              </div>
              <button
                data-testid="btn-logout"
                onClick={handleLogout}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                  color: "var(--ink-2)", background: "transparent",
                  border: "1px solid var(--border)", borderRadius: 8,
                  padding: "10px 16px", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--red)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--red)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 14, color: "var(--ink-2)", textDecoration: "none", padding: "10px 16px", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
              >เข้าสู่ระบบ</Link>
              <Link href="/register" style={{
                fontSize: 14, fontWeight: 500, color: "#ffffff",
                background: "var(--ink)", textDecoration: "none",
                padding: "10px 20px", borderRadius: 8,
                transition: "background 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent-2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--ink)"; }}
              >สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
