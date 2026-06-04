"use client";
import React from 'react';

// 1. Clean JavaScript Version of Sub-components
const StatItem = ({ label, value }) => (
  <div className="text-center p-4">
    <div className="text-2xl md:text-4xl font-bold text-white">{value}</div>
    <div className="text-xs md:text-sm uppercase tracking-widest text-blue-100 opacity-80">{label}</div>
  </div>
);

const TimelineNode = ({ year, event, desc }) => (
  <div className="min-w-[280px] snap-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <span className="text-blue-600 font-bold text-lg">{year}</span>
    <h3 className="font-bold text-gray-800 mt-2">{event}</h3>
    <p className="text-gray-500 text-sm mt-2 leading-relaxed">{desc}</p>
  </div>
);

// 2. The Main Component
export default function OurStory({ data }) {
  // Fallback data in case admin hasn't added anything yet
  const storyData = data || {
    heroTitle: "Our Story",
    heroSubtitle: "Revolutionizing the journey.",
    mainImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
    historyText: ["We started with a vision to change the world."],
    stats: [{ label: "Users", value: "10k+" }],
    milestones: [{ year: "2024", event: "Launch", desc: "Started our journey." }]
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          {storyData.heroTitle}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {storyData.heroSubtitle}
        </p>
      </section>

      {/* Stats - Responsive Grid */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
          {storyData.stats.map((item, index) => (
            <StatItem key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      {/* Content - Image & Text Stacking */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <img 
              src={storyData.mainImage} 
              alt="Story" 
              className="rounded-3xl shadow-xl w-full aspect-video object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6 text-gray-600 text-lg">
            {storyData.historyText.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Swipable on Mobile */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-center text-3xl font-bold mb-10">Milestones</h2>
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar md:justify-center">
          {storyData.milestones.map((m, i) => (
            <TimelineNode key={i} year={m.year} event={m.event} desc={m.desc} />
          ))}
        </div>
      </section>
    </div>
  );
}