"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";
import { FaChevronRight, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function StoryPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Immersive Fullscreen Player Modal States
  const [activeStory, setActiveStory] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const loadPublicStories = async () => {
      try {
        const response = await fetchFromAPI("/stories");
        if (response?.status === "success") {
          const publicLiveStories = (response.data.stories || []).filter(
            (story) => story.isActive === true
          );
          const sortedStories = publicLiveStories.sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );
          setStories(sortedStories);
        }
      } catch (err) {
        console.error("Failed loading brand stories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPublicStories();
  }, []);

  // Flipkart/Amazon Elegant Skeleton Loading Tray
  if (loading) {
    return (
      <div className="w-full bg-white py-4 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 overflow-x-auto px-4 pb-2 scrollbar-none">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2 animate-pulse shrink-0 w-[76px] sm:w-[90px]">
              <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-gray-200" />
              <div className="w-14 h-3 bg-gray-200 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="w-full bg-white py-4 sm:py-6 border-b border-gray-200 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECTION HEADER: Clean Flipkart & Amazon Corporate Typography */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight">
              Trending Stories & Offers
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 hidden sm:block mt-0.5">
              Top curated deals live right now
            </p>
          </div>
          <span className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-0.5 whitespace-nowrap">
            View All <FaChevronRight size={8} className="mt-0.5" />
          </span>
        </div>

        {/* CIRCULAR TRAILING HORIZONTAL CAROUSEL LAYOUT */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((story) => {
            const isVideo = story.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

            return (
              <div 
                key={story._id} 
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center text-center shrink-0 cursor-pointer snap-start group w-[76px] sm:w-[92px]"
              >
                {/* Ultra Premium E-Commerce Gradient Outer Circle Frame */}
                <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-600 transition-transform duration-200 transform group-hover:scale-105 active:scale-95">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                      {isVideo ? (
                        <video 
                          src={getImageUrl(story.imageUrl)} 
                          className="w-full h-full object-cover pointer-events-none" 
                          muted 
                          playsInline 
                        />
                      ) : (
                        <img 
                          src={getImageUrl(story.imageUrl)} 
                          alt={story.title} 
                          className="w-full h-full object-cover pointer-events-none"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/220x220?text=Mantra";
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro Typography Layer */}
                <span className="text-[11px] sm:text-xs font-medium text-gray-800 mt-2 truncate w-full group-hover:text-[#2874f0] transition-colors px-0.5">
                  {story.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* IMMERSIVE 9:16 MOBILE STORY MODAL PLAYER */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 sm:bg-black/80 z-[100] flex items-center justify-center p-0 sm:p-4 backdrop-blur-md">
          
          {/* Card Engine Frame: Absolute Aspect Insulation */}
          <div className="relative w-full h-full sm:h-[85vh] sm:max-w-[400px] sm:aspect-[9/16] bg-black sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-4 text-white">
            
            {/* Cinematic Shadow Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70 pointer-events-none z-10" />
            
            {/* Active Asset Player Base */}
            {activeStory.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video 
                src={getImageUrl(activeStory.imageUrl)} 
                className="absolute inset-0 w-full h-full object-cover" 
                muted={isMuted} 
                playsInline 
                autoPlay 
                loop 
              />
            ) : (
              <img 
                src={getImageUrl(activeStory.imageUrl)} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            )}

            {/* TOP BAR: CONTINUOUS TIMELINE STATUS INDICATOR & META */}
            <div className="relative z-20 w-full space-y-3">
              <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-full animate-[loading_5s_linear_infinite] origin-left" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-amber-500 overflow-hidden bg-slate-800 shrink-0">
                    <img src={getImageUrl(activeStory.imageUrl)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <div className="text-xs font-bold drop-shadow-md tracking-wide truncate max-w-[180px]">{activeStory.title}</div>
                    <div className="text-[10px] text-amber-400 drop-shadow-sm font-semibold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE DEAL
                    </div>
                  </div>
                </div>

                {/* Audio and Exit Controllers */}
                <div className="flex items-center gap-2.5">
                  {activeStory.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i) && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                      className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition active:scale-90"
                    >
                      {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveStory(null)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white font-normal hover:bg-black/60 transition active:scale-90 text-base"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: MARKETPLACE PRODUCT CARD INSULATION AND CTA */}
            <div className="relative z-20 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-lg space-y-2 mb-safe-bottom">
              <div>
                <span className="text-[9px] font-black tracking-wider uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded-sm">
                  Exclusive Offer
                </span>
                <h3 className="text-sm font-bold text-white mt-2 truncate drop-shadow">
                  {activeStory.title}
                </h3>
              </div>
              
              <p className="text-[11px] sm:text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-95">
                {activeStory.description}
              </p>
              
              {/* Flipkart Action Button Block */}
              <div className="pt-1">
                <button 
                  className="w-full bg-[#ff9f00] hover:bg-[#f39200] active:scale-[0.98] text-center text-xs font-bold py-3 rounded-lg text-white flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg shadow-orange-950/40 uppercase tracking-wider"
                >
                  Shop Deal <FaChevronRight size={9} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Inject custom CSS keyframe animations natively inside code block boundaries securely */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .mb-safe-bottom {
          padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
        }
      `}</style>
    </section>
  );
}