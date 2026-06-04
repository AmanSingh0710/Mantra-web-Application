"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";

export default function StoryPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublicStories = async () => {
      try {
        const response = await fetchFromAPI("/stories");
        if (response?.status === "success") {
          // 🎯 FILTER: Admin dashboard se sirf active items humare shop par live honge
          const publicLiveStories = (response.data.stories || []).filter(
            (story) => story.isActive === true
          );

          // 🎯 SORT: Sequence sorting array handle karna
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

  // Professional Skeleton Loading (Matches your 4-column rectangular design frame)
  if (loading) {
    return (
      <div className="w-full bg-white py-12 px-4 max-w-7xl mx-auto">
        <div className="w-32 h-6 bg-gray-200 rounded mx-auto mb-10 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="space-y-3 animate-pulse">
              <div className="w-full aspect-[3/4] sm:aspect-[9/16] bg-gray-200 rounded-2xl" />
              <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto" />
              <div className="w-1/2 h-3 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="w-full bg-white pt-10 pb-6 px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-center text-lg sm:text-xl font-bold text-black tracking-[0.2em] uppercase mb-8 sm:mb-12">
          OUR STORY
        </h2>

        <div className="flex xs:grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto xs:overflow-x-visible pb-4 xs:pb-0 scrollbar-none snap-x touch-pan-x">
          
          {stories.map((story) => {
            const isVideo = story.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

            return (
              <div 
                key={story._id} 
                className="flex-shrink-0 w-[70vw] xs:w-auto snap-center flex flex-col items-center text-center group cursor-pointer max-w-sm mx-auto w-full"
              >
                <div className="w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 relative shadow-sm transition-transform duration-300 group-hover:scale-[1.01] group-hover:shadow-md">
                  {isVideo ? (
                    <video 
                      src={getImageUrl(story.imageUrl)} 
                      className="w-full h-full object-cover" 
                      muted 
                      playsInline 
                      loop
                      autoPlay
                    />
                  ) : (
                    <img 
                      src={getImageUrl(story.imageUrl)} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x800?text=Mantra+Collection";
                      }}
                    />
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#111e38] mt-3 sm:mt-4 px-2 line-clamp-1 group-hover:text-amber-700 transition-colors w-full">
                  {story.title}
                </h3>
                
                <span className="text-[10px] sm:text-xs font-medium text-gray-400 tracking-wider uppercase mt-1 border-b border-transparent group-hover:border-gray-400 transition-all">
                  READ MORE
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}