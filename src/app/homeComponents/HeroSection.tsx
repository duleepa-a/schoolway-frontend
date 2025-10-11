
"use client";
import Link from "next/link";
import { useRef } from "react";

export default function HeroSection() {
  // For click animation
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Register button handler
  const handleRegister = () => {
    const btn = buttonRef.current;
    if (btn) {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 150);
    }
    // You can add your registration logic here
    // For now, navigate to /register
    window.location.href = "/register";
  };

  // Particle effect on mouse move
  // if (typeof window !== "undefined") {
  //   if (!document.querySelector(".cursor-trail")) {
  //     document.addEventListener("mousemove", (e) => {
  //       let trail = document.querySelector(".cursor-trail") as HTMLDivElement | null;
  //       if (!trail) {
  //         trail = document.createElement("div");
  //         trail.className = "cursor-trail";
  //         trail.style.cssText = `
  //           position: fixed;
  //           width: 10px;
  //           height: 10px;
  //           background: rgba(255, 255, 255, 0.6);
  //           border-radius: 50%;
  //           pointer-events: none;
  //           z-index: 9999;
  //           transition: all 0.1s ease;
  //         `;
  //         document.body.appendChild(trail);
  //       }
  //       if (trail) {
  //         trail.style.left = e.clientX - 5 + "px";
  //         trail.style.top = e.clientY - 5 + "px";
  //       }
  //     });
  //   }
  // }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white font-sans">
      {/* Wave background */}
      <div className="wave-background absolute bottom-0 left-0 w-full h-[38%] z-0" style={{ pointerEvents: 'none' }}>
        {/* Main curve SVG background */}
        <svg viewBox="0 0 1440 400" width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <defs>
            <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--green-shade-light)" />
              <stop offset="60%" stopColor="var(--blue-shade-light)" />
              <stop offset="100%" stopColor="var(--blue-shade-dark)" />
            </linearGradient>
          </defs>
          <path d="M0,120 Q360,210 720,120 T1440,120 L1440,400 L0,400 Z" fill="url(#heroGradient)" />
          <path d="M0,200 Q360,300 720,200 T1440,200 L1440,400 L0,400 Z" fill="rgba(255,255,255,0.10)" />
        </svg>
        {/* Floating elements */}
        <div className="floating-element" style={{width:80, height:80, top:"10%", left:"10%", position:"absolute", background:"rgba(255,255,255,0.1)", borderRadius:"50%", animation:"float 6s ease-in-out infinite", pointerEvents:"none", zIndex:2}} />
        <div className="floating-element" style={{width:120, height:120, top:"70%", right:"15%", position:"absolute", background:"rgba(255,255,255,0.1)", borderRadius:"50%", animation:"float 6s ease-in-out infinite", animationDelay:"2s", pointerEvents:"none", zIndex:2}} />
        <div className="floating-element" style={{width:60, height:60, bottom:"20%", left:"5%", position:"absolute", background:"rgba(255,255,255,0.1)", borderRadius:"50%", animation:"float 6s ease-in-out infinite", animationDelay:"4s", pointerEvents:"none", zIndex:2}} />
      </div>

      {/* Main content */}
      <div className="container absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center px-4 py-8 mb-36 w-full">
        <h1 className="font-extrabold text-gray-900 mb-6 leading-tight" style={{fontSize: "clamp(2.5rem, 8vw, 4.5rem)", textShadow: "0 2px 10px rgba(0,0,0,0.1)"}}>Welcome to SchoolWay
          !
        </h1>
        <p className="subtitle mb-12 max-w-xl mx-auto text-gray-700 font-normal" style={{fontSize: "clamp(1.1rem, 3vw, 1.4rem)", lineHeight: 1.4}}>We make School Transportation easier and safer than ever</p>
        <button
          ref={buttonRef}
          className="cta-button bg-black text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 relative overflow-hidden hover:bg-gray-800"
          style={{boxShadow: "0 4px 20px rgba(0,0,0,0.3)"}}
          onClick={handleRegister}
        >
          Register Now
        </button>
      </div>

      {/* Keyframes and extra styles */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-50px) scaleY(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .cta-button:hover::before {
          left: 100%;
        }
        .cta-button:active {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .container { padding: 1rem; }
          .subtitle { margin-bottom: 2rem; }
          .cta-button { padding: 0.8rem 2rem; font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}
