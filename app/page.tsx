"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import TypedText from "@/components/TypedText";
import TitleAnimator from "@/components/TitleAnimator";
import Icons from "@/components/Icons";
import OuterSpace, { type TargetInfo, SECTION_START } from "@/components/OuterSpace";

const sociaLinks = [
  { href: "https://discord.com/users/385617865820209172", tooltip: "discord/fvcified", src: "/images/discord.svg", alt: "Discord" },
  { href: "https://github.com/fvcified",                  tooltip: "github/fvcified",  src: "/images/github.svg",  alt: "GitHub"  },
  { href: "https://open.spotify.com/user/31gupde4ngfbbksvy5q6pb6b2474", tooltip: "Spotify", src: "/images/spotify.svg", alt: "Spotify" },
  { href: "https://gitlab.com/fvcified",                  tooltip: "gitlab/fvcified",  src: "/images/gitlab.svg",  alt: "GitLab"  },
  { href: "mailto:fvskid@gmail.com",                      tooltip: "fvskid@gmail.com", src: "/images/email.svg",   alt: "Email"   },
];

const links = [
  { href: "https://dontasktoask.com/",      label: "dontasktoask"   },
  { href: "https://fvkid.xyz/",             label: "{fvkid.site}"   },
  { href: "https://itsmy.gitbook.io/user/", label: "README"         },
  { href: "https://rizzedpage.vercel.app/", label: "{rizzedpage}"   },
  { href: "https://noskid.today/",          label: "no fvskid"      },
];

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef    = useRef<number>(0);
  const [, setPlanetInfo] = useState<TargetInfo>({ x: 0, y: 0, r: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      targetRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      scrollRef.current += (targetRef.current - scrollRef.current) * 0.07;
      setScrollProgress(scrollRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleTargetInfo = useCallback((info: TargetInfo) => setPlanetInfo(info), []);
  const sectionPhase = Math.max(0, Math.min(1,
    (scrollProgress - SECTION_START) / (1 - SECTION_START)
  ));

  const stagger = (idx: number) => Math.max(0, Math.min(1, sectionPhase * 4 - idx * 0.18));
  const hintOpacity = Math.max(0, 1 - scrollProgress * 6);

  return (
    <>
      <TitleAnimator />
      <OuterSpace scrollProgress={scrollProgress} onTargetInfo={handleTargetInfo} />
      <div style={{ height: "500vh" }} />

      {sectionPhase > 0 && (
        <div
          className="fixed"
          style={{
            left:          "50%",
            top:           "50%",
            transform:     "translate(-50%, -50%)",
            width:         "min(520px, 90vw)",
            zIndex:        10,
            pointerEvents: sectionPhase > 0.85 ? "auto" : "none",
          }}
        >
          <div style={{ opacity: stagger(0), transform: `translateY(${(1-stagger(0))*18}px)`, textAlign: "center", marginBottom: "12px" }}>
            <h1
              className="font-outfit font-bold leading-none break-words"
              style={{ fontSize: "clamp(36px,7vw,64px)", letterSpacing: "-0.025em", color: "#ffffff", textShadow: "0 2px 24px rgba(0,0,0,0.8)" }}
            >
              <TypedText />
              <span className="animate-cursor" style={{ color: "#ffffff" }}>_</span>
            </h1>
          </div>
          <div style={{ opacity: stagger(1), transform: `translateY(${(1-stagger(1))*18}px)`, textAlign: "center", marginBottom: "14px" }}>
            <p
              className="font-inter font-semibold leading-relaxed"
              style={{ fontSize: "clamp(11px,1.3vw,13px)", color: "rgba(200,200,200,0.85)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              Informatics Engineering Student ; Developer &amp; Builder<br />
              Tech &amp; Cybersecurity Enthusiast ; Research
            </p>
          </div>
          <div style={{ opacity: stagger(2), transform: `translateY(${(1-stagger(2))*18}px)`, textAlign: "center", marginBottom: "40px" }}>
            <div className="font-outfit" style={{ fontSize: "clamp(11px,1.1vw,12px)", lineHeight: 2.2, color: "rgba(220,220,220,0.72)" }}>
              {links.map((link, i, arr) => (
                <span key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.textDecoration = "underline";
                      e.currentTarget.style.textDecorationColor = "rgba(255,255,255,0.50)";
                      e.currentTarget.style.textUnderlineOffset = "3px";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "inherit";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {link.label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.28)" }}>;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div style={{ opacity: stagger(3), transform: `translateY(${(1-stagger(3))*18}px)` }}>
            <div className="flex items-center justify-center flex-wrap" style={{ gap: "18px" }}>
              {sociaLinks.map(link => (
                <Icons key={link.alt} href={link.href} tooltip={link.tooltip} src={link.src} alt={link.alt} />
              ))}
            </div>
          </div>
        </div>
      )}
      {hintOpacity > 0.01 && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none"
          style={{ zIndex: 5, opacity: hintOpacity, gap: "3px" }}
        >
          <style>{`
            @keyframes hint-drop {
              0%   { transform: translateY(-6px); opacity: 0; }
              40%  { opacity: 1; }
              100% { transform: translateY(6px);  opacity: 0; }
            }
          `}</style>
          {[0, 1, 2].map(i => (
            <svg key={i} width="14" height="9" viewBox="0 0 14 9" fill="none"
              style={{ animation: `hint-drop 0.9s ease-in ${i * 0.18}s infinite` }}
            >
              <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      )}
    </>
  );
}