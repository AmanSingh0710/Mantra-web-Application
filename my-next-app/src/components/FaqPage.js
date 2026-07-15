"use client";
import { useState, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import * as Icons from "react-icons/fa";
import { fetchFromAPI } from "@/utils/api";

export default function FAQPage() {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // FETCH DATA FROM API
  useEffect(() => {
    async function getFaqs() {
      try {
        // ✅ centralized API call
        const data = await fetchFromAPI("/faq");
        setFaqData(data || []);
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    }
    getFaqs();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FILTER LOGIC
  const filteredData = faqData.filter((section) =>
    section.questions.some((item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <div className="p-20 text-center font-bold">Loading Help Center...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Header */}
      <div className="bg-blue-600 py-12 px-6 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Help Center</h1>
        <div className="max-w-2xl mx-auto relative text-gray-800">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full py-4 pl-12 pr-4 rounded-xl outline-none shadow-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        {filteredData.map((section, sIdx) => {
          const IconComponent = Icons[section.icon] || Icons.FaQuestionCircle;

          return (
            <div key={sIdx} className="mb-10">
              <div className="flex items-center gap-3 mb-4 text-gray-800">
                <IconComponent className="text-blue-600 text-2xl" />
                <h2 className="text-xl font-bold">{section.category}</h2>
              </div>

              <div className="space-y-3">
                {section.questions.map((item, qIdx) => {
                  const globalIndex = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={qIdx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-left transition-colors"
                      >
                        <span className="font-semibold text-gray-700">{item.q}</span>
                        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="p-5 pt-0 text-gray-600 border-t border-gray-50 animate-fadeIn">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}