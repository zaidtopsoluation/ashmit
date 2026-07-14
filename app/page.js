"use client";

import React, { useState, useEffect, useRef } from "react";

// Rose transparent PNG image configurations
const ROSE_TYPES = [
  { src: "/rose-red.png", glow: "rgba(239, 68, 68, 0.4)", shadow: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))" },     // Red Rose
  { src: "/rose-pink.png", glow: "rgba(244, 114, 182, 0.4)", shadow: "drop-shadow(0 0 12px rgba(244, 114, 182, 0.5))" },  // Pink Rose
  { src: "/rose-yellow.png", glow: "rgba(250, 204, 21, 0.4)", shadow: "drop-shadow(0 0 12px rgba(250, 204, 21, 0.5))" }, // Yellow Rose
  { src: "/rose-purple.png", glow: "rgba(192, 132, 252, 0.4)", shadow: "drop-shadow(0 0 12px rgba(192, 132, 252, 0.5))" } // Purple Rose
];

// Polaroid Album Photos config (Now containing 8 couple memories)
const ALBUM_PHOTOS = [
  { 
    src: "/album-1.jpg", 
    caption: "Matching in traditional shades 💛💚", 
    rotate: "-rotate-2"
  },
  { 
    src: "/album-2.jpg", 
    caption: "Thrills & laughter at the park! 🎡", 
    rotate: "rotate-3"
  },
  { 
    src: "/album-3.jpg", 
    caption: "Under the glowing umbrella lights ✨☂", 
    rotate: "-rotate-1"
  },
  { 
    src: "/album-4.jpg", 
    caption: "Watching the sun rise in your arms 🌅", 
    rotate: "rotate-2"
  },
  { 
    src: "/album-5.png", 
    caption: "Spontaneous mirror selfie date 🛍", 
    rotate: "-rotate-3"
  },
  { 
    src: "/album-6.png", 
    caption: "Strike a pose in red & green 👔👗", 
    rotate: "rotate-1"
  },
  { 
    src: "/album-7.jpg", 
    caption: "Mirror tiles and sweet smiles 💖", 
    rotate: "-rotate-2"
  },
  { 
    src: "/album-8.jpg", 
    caption: "Sunsets, beach chairs, and you 🏖🌅", 
    rotate: "rotate-3"
  }
];

// Flirty Love Letter Paragraphs
const LETTER_PARAGRAPHS = [
  "If I could write our story in the stars, it still wouldn’t shine as bright as the spark you brought into my life.",
  "You are my favorite thought, my biggest smile, and the one person who makes my heart skip a beat (and occasionally forget how to function altogether!).",
  "I promise to love you, annoy you, hold your hand, make you laugh when you want to cry, and stand by you through every crazy chapter of our lives."
];

// Precompute absolute indices for word-by-word typewriter effect
let wordCounter = 0;
const PARAGRAPHS_WITH_INDICES = LETTER_PARAGRAPHS.map((p) => {
  const words = p.split(" ");
  return words.map((w) => ({
    text: w,
    absIdx: wordCounter++
  }));
});
const TOTAL_WORDS = wordCounter;

// Falling Hearts Animation Background
const FallingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const spawnedHearts = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      spawnedHearts.push({
        id: i,
        left: Math.random() * 90 + 5,
        size: Math.random() * 18 + 10,
        delay: Math.random() * 15,
        duration: Math.random() * 10 + 12,
        opacity: Math.random() * 0.2 + 0.15
      });
    }
    setHearts(spawnedHearts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="absolute text-rose-500 fill-current animate-float-heart"
          viewBox="0 0 24 24"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
            "--max-opacity": heart.opacity,
            top: "-30px",
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
};

export default function Home() {
  // Stages: 'idle', 'spinning', 'falling', 'story'
  const [stage, setStage] = useState("idle");
  const [roses, setRoses] = useState([]);
  
  // Photo Lightbox modal state
  const [activePhoto, setActivePhoto] = useState(null);
  
  // Letter typewriter states
  const letterRef = useRef(null);
  const [letterVisible, setLetterVisible] = useState(false);
  const [typedWordCount, setTypedWordCount] = useState(0);

  // Generate spiral roses coordinates
  const triggerAnimation = () => {
    if (stage !== "idle") return;
    setStage("spinning");
    setRoses([]);
    setTypedWordCount(0);
    setLetterVisible(false);
    setActivePhoto(null);

    const spawnedRoses = [];
    const totalRoses = 220;

    for (let i = 0; i < totalRoses; i++) {
      const theta = i * 0.14; 
      const r = 18 + (i / totalRoses) * 45; 
      
      const noiseX = (Math.random() - 0.5) * 4;
      const noiseY = (Math.random() - 0.5) * 4;
      
      const x = 50 + r * Math.cos(theta) + noiseX;
      const y = 50 + r * Math.sin(theta) + noiseY;
      
      const roseType = ROSE_TYPES[Math.floor(Math.random() * ROSE_TYPES.length)];
      const scale = 0.5 + (r / 63) * 1.5 + Math.random() * 0.4;
      const rotation = theta * (180 / Math.PI) + Math.random() * 90;
      const delay = i * 25;

      spawnedRoses.push({
        id: i,
        x,
        y,
        src: roseType.src,
        glow: roseType.glow,
        shadow: roseType.shadow,
        scale,
        rotation,
        delay,
      });
    }

    setRoses(spawnedRoses);

    // Spawning/Spinning ends at 220 * 25ms = 5500ms + 1800ms animation = 7300ms total
    setTimeout(() => {
      setStage("falling");
      
      // Transition to story stage
      setTimeout(() => {
        setStage("story");
      }, 1200);
    }, 7300);
  };

  // IntersectionObserver for Love Letter typing trigger
  useEffect(() => {
    if (stage !== "story") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLetterVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (letterRef.current) {
      observer.observe(letterRef.current);
    }

    return () => observer.disconnect();
  }, [stage]);

  // Word-by-word typing interval logic
  useEffect(() => {
    if (!letterVisible) return;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current <= TOTAL_WORDS) {
        setTypedWordCount(current);
      } else {
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [letterVisible]);

  const handleReset = () => {
    setStage("idle");
    setRoses([]);
    setTypedWordCount(0);
    setLetterVisible(false);
    setActivePhoto(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`relative min-h-screen w-screen font-sans select-none overflow-x-hidden transition-colors duration-[2500ms] ${
      stage === "story" 
        ? "bg-gradient-to-b from-rose-950 via-pink-900 to-rose-950 text-pink-100" 
        : "bg-gradient-to-tr from-slate-950 via-purple-950 to-rose-950 text-white"
    }`}>
      
      {/* Import calligraphy Google fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@1,600&family=Quicksand:wght@300;400;600&display=swap');

        .font-cursive {
          font-family: 'Great Vibes', cursive;
        }
        .font-romantic {
          font-family: 'Dancing Script', cursive;
        }
        .font-serif-title {
          font-family: 'Playfair Display', serif;
        }
        .font-body {
          font-family: 'Quicksand', sans-serif;
        }

        @keyframes spiralOut {
          0% {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(0deg) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            left: var(--target-x);
            top: var(--target-y);
            transform: translate(-50%, -50%) rotate(var(--target-rotation)) scale(var(--target-scale));
            opacity: 1;
          }
        }

        @keyframes fallDown {
          0% {
            left: var(--target-x);
            top: var(--target-y);
            transform: translate(-50%, -50%) rotate(var(--target-rotation)) scale(var(--target-scale));
            opacity: 1;
          }
          100% {
            left: var(--target-x);
            top: 160%;
            transform: translate(-50%, -50%) rotate(calc(var(--target-rotation) + 180deg)) scale(var(--target-scale));
            opacity: 0;
          }
        }

        @keyframes spinVortex {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes floatHeart {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: var(--max-opacity);
          }
          90% {
            opacity: var(--max-opacity);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes centralHeartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-spiral {
          animation: spiralOut 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .animate-fall {
          animation: fallDown 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .animate-vortex {
          animation: spinVortex 12s linear infinite;
        }

        .animate-float-heart {
          animation: floatHeart 15s linear infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-central-rose {
          animation: centralHeartbeat 2.5s infinite ease-in-out;
        }

        /* Polaroid Album styling */
        .polaroid-card {
          background: #ffffff;
          padding: 12px 12px 24px 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.45);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
        }
        
        .polaroid-card:hover {
          transform: scale(1.06) rotate(0deg) translateY(-10px) !important;
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.6);
          z-index: 30;
        }

        /* custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(244, 63, 94, 0.4);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 63, 94, 0.6);
        }
      `}</style>

      {/* Floating background glowing circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[130px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />
      </div>

      {/* Falling Hearts Layer for romantic story stage */}
      {stage === "story" && <FallingHearts />}

      {/* Vortex & Spiral Roses Container */}
      {stage !== "story" && roses.length > 0 && (
        <div 
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 origin-center ${
            stage === "spinning" || stage === "falling" ? "animate-vortex" : ""
          }`}
        >
          {roses.map((rose) => (
            <div
              key={rose.id}
              className={`absolute ${stage === "falling" ? "animate-fall" : "animate-spiral"}`}
              style={{
                "--target-x": `${rose.x}%`,
                "--target-y": `${rose.y}%`,
                "--target-rotation": `${rose.rotation}deg`,
                "--target-scale": rose.scale,
                animationDelay: stage === "falling" ? "0ms" : `${rose.delay}ms`,
                width: "120px",
                height: "120px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) scale(0)",
                opacity: 0,
              }}
            >
              <div 
                className="absolute inset-4 rounded-full blur-md opacity-40 scale-75 pointer-events-none"
                style={{ backgroundColor: rose.glow }}
              />
              <img
                src={rose.src}
                alt="Rose"
                className="w-full h-full object-contain relative z-10"
                style={{ filter: rose.shadow }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Phase 1 Landing State */}
      {stage === "idle" && (
        <div className="h-screen w-screen flex flex-col items-center justify-center text-center z-20 px-6 animate-fade-in relative">
          <div 
            onClick={triggerAnimation}
            className="w-48 h-48 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 ease-out relative group animate-central-rose"
          >
            <div className="absolute inset-4 bg-red-500/25 rounded-full blur-2xl scale-125 group-hover:bg-red-500/35 transition-all duration-300" />
            <img
              src="/rose-red.png"
              alt="Central Rose"
              className="w-full h-full object-contain relative z-10"
              style={{ filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 0.6))" }}
            />
          </div>
          
          <h1 className="mt-8 text-3xl md:text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200 drop-shadow-md">
            For My Special Someone
          </h1>
          <p className="mt-3 text-pink-200/60 font-light text-sm md:text-base tracking-widest uppercase animate-pulse">
            Click the rose to begin
          </p>
        </div>
      )}

      {/* Phase 1 Spinning Stage Message */}
      {stage === "spinning" && (
        <div className="h-screen w-screen flex items-center justify-center pointer-events-none z-20">
          <div className="text-center bg-black/40 backdrop-blur-md px-8 py-4 rounded-full border border-pink-500/20">
            <p className="text-pink-200 text-lg font-medium tracking-wide animate-pulse">
              Creating a swirling rose vortex... 🌹🌀
            </p>
          </div>
        </div>
      )}

      {/* Phase 2 Story Stage (Scrollable Content) */}
      {stage === "story" && (
        <div className="relative w-full z-10 flex flex-col items-center py-16 px-6 md:px-12 animate-fade-in font-body">
          
          {/* Section 1: Intro Greeting */}
          <section className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-2xl mt-8">
            <span className="text-pink-400 font-romantic text-5xl md:text-6xl drop-shadow">
              From Me to You
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-100 via-rose-200 to-pink-100">
              This is how much I love you
            </h2>
            <div className="w-16 h-16 mt-8 animate-bounce" style={{ animationDuration: '3s' }}>
              <img
                src="/rose-red.png"
                alt="Rose Icon"
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(244, 63, 94, 0.6))" }}
              />
            </div>
            <p className="mt-12 text-pink-200/60 text-xs tracking-widest uppercase animate-pulse">
              Scroll Down 💖
            </p>
          </section>

          {/* Section 2: Photo Album (Masonry/Scattered Grid Layout) */}
          <section className="min-h-screen w-full max-w-5xl flex flex-col items-center justify-center my-20">
            <h3 className="text-3xl md:text-5xl font-cursive text-center text-rose-300 mb-4">
              Our Digital Memory Book
            </h3>
            <p className="text-center text-pink-200/60 font-light text-sm md:text-base mb-12 tracking-wide">
              Click any photo to view in full size ✨
            </p>
            
            {/* Scrappy, organic scattered grid of Polaroids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full px-4">
              {ALBUM_PHOTOS.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setActivePhoto(index)}
                  className={`polaroid-card rounded-md flex flex-col items-center ${photo.rotate} self-center mx-auto max-w-[280px] sm:max-w-none w-full`}
                >
                  {/* Photo area */}
                  <div className="w-full aspect-[3/4] overflow-hidden bg-zinc-200 relative rounded">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>
                  {/* Polaroid caption */}
                  <p className="mt-4 text-center font-romantic text-xl text-slate-800 font-semibold px-2">
                    {photo.caption}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Flirty Love Letter with Word-by-Word Typewriter Effect */}
          <section ref={letterRef} className="min-h-screen w-full max-w-2xl flex flex-col items-center justify-center my-20">
            <div className="w-full relative rounded-3xl p-8 md:p-12 bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl text-pink-100 border-t-pink-500/30 overflow-hidden min-h-[400px]">
              
              {/* Wax seal detail */}
              <div className="absolute right-8 top-8 w-12 h-12 bg-rose-600/35 border border-rose-500/50 rounded-full flex items-center justify-center shadow-lg font-romantic text-lg text-rose-200">
                ❤
              </div>
              
              <h3 className="text-3xl font-romantic text-rose-300 border-b border-white/10 pb-4 mb-6">
                My Favorite Person,
              </h3>
              
              <div className="text-xl md:text-2xl font-romantic space-y-6 leading-loose text-pink-100/95 min-h-[220px]">
                {PARAGRAPHS_WITH_INDICES.map((paragraphWords, pIdx) => (
                  <p key={pIdx}>
                    {paragraphWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="transition-opacity duration-500 ease-out inline-block mr-1.5"
                        style={{
                          opacity: word.absIdx < typedWordCount ? 1 : 0,
                          transform: word.absIdx < typedWordCount ? "translateY(0)" : "translateY(4px)",
                          transitionProperty: "opacity, transform"
                        }}
                      >
                        {word.text}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              {/* Sign-off smoothly fades in only after all words are typed */}
              <div 
                className="mt-8 pt-4 border-t border-white/5 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: typedWordCount >= TOTAL_WORDS ? 1 : 0 }}
              >
                <p className="text-right text-2xl text-rose-300 font-romantic">
                  With all my love,
                </p>
                <p className="text-right text-rose-200 font-romantic">
                  Me xoxo
                </p>
              </div>

            </div>
          </section>

          {/* Section 4: End Closing */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center text-center max-w-2xl mt-12 mb-8">
            <div className="w-20 h-20 mb-6">
              <img
                src="/rose-red.png"
                alt="Final Rose"
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 0 14px rgba(244, 63, 94, 0.7))" }}
              />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-cursive text-rose-300 drop-shadow-md select-text tracking-wide leading-tight">
              I will always love you forever
            </h2>
            
            <p className="mt-6 text-pink-200/50 text-sm tracking-widest max-w-md">
              Every day with you is a new favorite memory. Thank you for being my love.
            </p>

            <button
              onClick={handleReset}
              className="mt-12 py-3 px-8 rounded-full border border-pink-500/40 text-pink-200 hover:bg-pink-500/10 active:bg-pink-500/20 transition-all font-semibold text-sm tracking-widest uppercase shadow-lg"
            >
              Replay Journey 🌹
            </button>
          </section>

        </div>
      )}

      {/* Polaroid Full-Screen Lightbox Modal */}
      {stage === "story" && activePhoto !== null && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center animate-scale-in"
          >
            <div className="w-full overflow-hidden bg-zinc-100 rounded-lg max-h-[72vh] flex items-center justify-center">
              <img 
                src={ALBUM_PHOTOS[activePhoto].src} 
                alt={ALBUM_PHOTOS[activePhoto].caption} 
                className="max-h-[70vh] object-contain rounded-md select-none pointer-events-none"
              />
            </div>
            <p className="mt-5 mb-2 text-slate-800 font-romantic text-2xl md:text-3xl text-center px-4 font-bold">
              {ALBUM_PHOTOS[activePhoto].caption}
            </p>
            <button 
              onClick={() => setActivePhoto(null)}
              className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-rose-700 transition-colors shadow-lg border-2 border-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
