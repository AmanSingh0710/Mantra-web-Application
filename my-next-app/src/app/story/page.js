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

  // Elegant Rounded Card Skeleton Loading
  if (loading) {
    return (
      <div className="w-full bg-white py-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-5 overflow-x-auto px-4 pb-2 scrollbar-none">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex flex-col items-center gap-3 animate-pulse shrink-0">
              <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-2xl bg-gray-200" />
              <div className="w-24 h-4 bg-gray-200 rounded mt-1" />
              <div className="w-12 h-3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="w-full bg-white py-6 sm:py-8 border-b border-gray-100 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECTION TRADEMARK TITLE */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs sm:text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Trending Stories & Offers
          </h2>
          <span className="text-[10px] sm:text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
            View All <FaChevronRight size={8} />
          </span>
        </div>

        {/* RECTANGULAR CARD HORIZONTAL TRAY LAYOUT */}
        <div className="flex items-center gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((story) => {
            const isVideo = story.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

            return (
              <div 
                key={story._id} 
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center text-center shrink-0 cursor-pointer snap-start group w-[170px] sm:w-[220px]"
              >
                {/* Image/Video Rounded Container Frame */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-md">
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

                {/* Typography Labels Block mirroring the screenshot style */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-3 px-1 truncate w-full group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5 hover:text-gray-600">
                  Read More
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* IMMERSIVE 9:16 MOBILE STORY MODAL PLAYER */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 sm:bg-black/80 z-[100] flex items-center justify-center p-0 sm:p-4 backdrop-blur-md">
          
          {/* Card Engine Frame */}
          <div className="relative w-full h-full sm:h-auto sm:max-w-[400px] sm:aspect-[9/16] bg-black sm:rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between p-4 text-white">
            
            {/* Cinematic Shadow Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none z-10" />
            
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
              <div className="w-full h-[3px] bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white w-full animate-[loading_5s_linear_infinite] origin-left" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border border-white/20 overflow-hidden bg-slate-800 shrink-0">
                    <img src={getImageUrl(activeStory.imageUrl)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <div className="text-xs font-bold drop-shadow-md tracking-wide">{activeStory.title}</div>
                    <div className="text-[10px] text-gray-300 drop-shadow-sm font-medium">Limited Deal</div>
                  </div>
                </div>

                {/* Audio and Exit Controllers */}
                <div className="flex items-center gap-3">
                  {activeStory.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i) && (
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                    >
                      {isMuted ? <FaVolumeMute size={13} /> : <FaVolumeUp size={13} />}
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveStory(null)} 
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white font-bold hover:bg-black/60 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: MARKETPLACE PRODUCT CARD INSULATION AND CTA */}
            <div className="relative z-20 bg-black/40 p-3 sm:p-4 rounded-xl border border-white/10 backdrop-blur-md space-y-2 transform translate-y-0 transition-transform">
              <div>
                <span className="text-[9px] font-black tracking-widest uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded mr-2">
                  Mantra Exclusive
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5 truncate drop-shadow">
                  {activeStory.title}
                </h3>
              </div>
              
              <p className="text-[11px] sm:text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-95">
                {activeStory.description}
              </p>
              
              {/* Action Box */}
              <div className="pt-1">
                <div className="w-full bg-[#fb641b] hover:bg-[#e1530f] active:scale-[0.99] text-center text-xs font-bold py-2.5 rounded-lg text-white flex items-center justify-center gap-1 cursor-pointer transition shadow-lg shadow-orange-700/20 uppercase tracking-wide">
                  Shop Deal <FaChevronRight size={9} />
                </div>
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
      `}</style>
    </section>
  );
}