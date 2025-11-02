"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsSidebarProps {
  sections: Section[];
  onSectionClick: (id: string) => void;
}

export default function TableOfContentsSidebar({
  sections,
  onSectionClick,
}: TableOfContentsSidebarProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [hovered, setHovered] = useState(false);

  // 🔹 Mở khi cuộn, tự thu lại khi ngừng
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setShowSidebar(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!hovered) setShowSidebar(false);
      }, 1000);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [hovered]);

  const expanded = showSidebar || hovered;

  return (
    <div className="fixed top-1/4 left-4 hidden lg:block z-50">
      <div
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hiệu ứng sáng viền */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

        {/* Thân sidebar */}
        <div
          className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-xl border border-purple-500/20 shadow-2xl transition-all duration-300 overflow-hidden ${
            expanded ? "w-50" : "w-[150px]"
          }`}
        >
          {/* Tiêu đề */}
          <div className="flex items-center justify-center space-x-2 p-3 cursor-pointer">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-300 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-wide">
              Mục lục
            </h4>
          </div>

          {/* Divider */}
          <div
            className={`${expanded ? "h-px" : "h-0"} bg-purple-500/20 transition-all duration-300`}
          ></div>

          {/* Danh sách mục */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expanded ? "max-h-[500px]" : "max-h-[100px]"
            }`}
          >
            <ul className="p-2 space-y-1.5">
              {sections
                .slice(0, expanded ? sections.length : 3)
                .map((section, index) => (
                  <li key={section.id} className="list-none">
                    <button
                      onClick={() => onSectionClick(section.id)}
                      className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-purple-700 dark:text-purple-200 text-[14px] font-medium transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span
                        className="text-left leading-snug"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: expanded ? "180px" : "90px",
                        }}
                        title={section.title}
                      >
                        {section.title}
                      </span>
                    </button>
                  </li>
                ))}

              {!expanded && sections.length > 3 && (
                <li className="text-xs text-gray-500 text-center select-none">...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
