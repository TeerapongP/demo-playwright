"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getConcerts, getSession, type Concert } from "@/lib/db";
import Navbar from "@/components/Navbar";

const STATUS_MAP = {
  available: { label: "มีที่นั่ง", color: "var(--green)", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  soldout:   { label: "Sold Out", color: "var(--red)",   bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  upcoming:  { label: "เร็วๆ นี้", color: "var(--gold)",  bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
};

const FILTERS = ["ทั้งหมด", "มีที่นั่ง", "Sold Out", "เร็วๆ นี้"];

export default function ConcertsPage() {
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [filter, setFilter] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setConcerts(getConcerts());
  }, []);

  const filtered = concerts.filter(c => {
    const matchFilter = filter === "ทั้งหมด"
      || (filter === "มีที่นั่ง" && c.status === "available")
      || (filter === "Sold Out" && c.status === "soldout")
      || (filter === "เร็วๆ นี้" && c.status === "upcoming");
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.artist.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleBook = (concert: Concert) => {
    const user = getSession();
    if (!user) { router.push("/login"); return; }
    router.push(`/booking?id=${concert.id}`);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 60, background: "var(--bg)" }}>

        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(to bottom, var(--bg-2), var(--bg))",
          padding: "80px 32px 60px", textAlign: "center",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ fontSize: 48, fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>
              คอนเสิร์ตที่กำลังมา
            </h1>
            <p style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6 }}>เลือกและจองตั๋วคอนเสิร์ตที่คุณชื่นชอบได้ง่ายๆ</p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <input
                data-testid="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาคอนเสิร์ต..."
                style={{
                  width: "100%", background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--ink)", padding: "10px 14px",
                  fontSize: 15, fontFamily: "'Inter', sans-serif", outline: "none",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  data-testid={`filter-${f}`}
                  onClick={() => setFilter(f)}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                    padding: "10px 16px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                    background: filter === f ? "var(--ink)" : "var(--bg-2)",
                    color: filter === f ? "#ffffff" : "var(--ink-2)",
                    border: "1px solid var(--border)",
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Concert grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }} data-testid="concert-list">
            {filtered.map(concert => {
              const st = STATUS_MAP[concert.status];
              const minPrice = Math.min(...concert.tiers.map(t => t.price));
              const totalRemaining = concert.tiers.reduce((a, t) => a + t.remaining, 0);

              return (
                <div
                  key={concert.id}
                  data-testid={`concert-card-${concert.id}`}
                  style={{
                    background: "var(--bg-2)", 
                    border: "1px solid var(--border)",
                    borderRadius: 16, 
                    overflow: "hidden", 
                    transition: "all 0.3s ease",
                    cursor: concert.status === "soldout" ? "default" : "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={e => { 
                    if (concert.status !== "soldout") { 
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                    } 
                  }}
                  onMouseLeave={e => { 
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{
                    height: 220, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    background: "var(--bg)",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <Image 
                      src={concert.image} 
                      alt={concert.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ 
                      position: "absolute", 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0,
                      background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))",
                      zIndex: 1,
                    }} />
                    <div style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
                      <span data-testid={`concert-status-${concert.id}`} style={{
                        fontSize: 11, 
                        fontWeight: 600,
                        color: st.color, 
                        background: "rgba(255,255,255,0.95)", 
                        backdropFilter: "blur(8px)",
                        padding: "6px 12px", 
                        borderRadius: 20,
                        border: `1px solid ${st.border}`,
                      }}>{st.label}</span>
                    </div>
                    <div style={{ 
                      position: "absolute", 
                      bottom: 16, 
                      left: 16, 
                      zIndex: 2,
                      color: "white",
                    }}>
                      <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 4 }}>{concert.genre}</div>
                      <h3 data-testid={`concert-title-${concert.id}`} style={{ 
                        fontSize: 20, 
                        fontWeight: 600, 
                        marginBottom: 4,
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}>
                        {concert.title}
                      </h3>
                      <p style={{ fontSize: 14, opacity: 0.95 }}>{concert.artist}</p>
                    </div>
                  </div>

                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 14, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span>📅</span>
                        <span>{new Date(concert.date).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })} · {concert.time} น.</span>
                      </div>
                      <div style={{ fontSize: 14, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span>📍</span>
                        <span>{concert.venue}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>เริ่มต้น</div>
                        <div style={{ fontSize: 28, fontWeight: 600, color: concert.status === "soldout" ? "var(--ink-3)" : "var(--ink)", letterSpacing: "-0.02em" }}>
                          ฿{minPrice.toLocaleString()}
                        </div>
                      </div>
                      <button
                        data-testid={`btn-book-${concert.id}`}
                        onClick={() => handleBook(concert)}
                        disabled={concert.status === "soldout" || concert.status === "upcoming"}
                        style={{
                          fontFamily: "'Inter', sans-serif", 
                          fontSize: 15, 
                          fontWeight: 500,
                          padding: "12px 24px", 
                          borderRadius: 8, 
                          cursor: concert.status === "soldout" || concert.status === "upcoming" ? "not-allowed" : "pointer",
                          background: concert.status === "soldout" || concert.status === "upcoming" ? "var(--bg)" : "var(--ink)",
                          color: concert.status === "soldout" || concert.status === "upcoming" ? "var(--ink-3)" : "#ffffff",
                          border: concert.status === "soldout" || concert.status === "upcoming" ? "1px solid var(--border)" : "none",
                          opacity: concert.status === "upcoming" ? 0.5 : 1,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                          if (concert.status === "available") {
                            (e.currentTarget as HTMLElement).style.background = "var(--accent-2)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (concert.status === "available") {
                            (e.currentTarget as HTMLElement).style.background = "var(--ink)";
                          }
                        }}
                      >
                        {concert.status === "soldout" ? "Sold Out" : concert.status === "upcoming" ? "เร็วๆ นี้" : "จองตั๋ว"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div data-testid="no-results" style={{ textAlign: "center", padding: "100px 0", color: "var(--ink-3)" }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>ไม่พบคอนเสิร์ตที่ค้นหา</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
