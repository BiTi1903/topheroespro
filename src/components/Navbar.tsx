"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const menus = [
    {
      name: "Mùa giải",
      items: [
        { name: "S1", href: "/seasons/s1" },
        { name: "S2", href: "/seasons/s2" },
        { name: "S3", href: "/guides/76e9EiC8iwLG4M1DO0Ij" },
      ],
    },
    {
      name: "Anh Hùng",
      items: [
        { name: "Thức Tỉnh", href: "/guides/RJAJKLFTiN4KPds12YBx" },
        { name: "Thiên Phú", href: "/tuong/rpg" },
        { name: "Trang Bị", href: "/tuong/moba" },
        { name: "Chiến Thuật", href: "/tuong/strategy" },
      ],
    },
    {
      name: "Lỗi thường gặp",
      items: [
        { name: "Lỗi mất tài khoản", href: "/guides/Ik9Mi3LgfMN4USJITBY0" },
        { name: "Lỗi game", href: "/" },
      ],
    },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-500/30 shadow-lg shadow-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg shadow-purple-500/40 group-hover:scale-110 transition">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-shine">
                Topheroes Pro
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menus.map((menu) => (
              <div key={menu.name} className="relative group">
                <button className="flex items-center space-x-1 text-purple-300 hover:text-white font-medium transition cursor-pointer">
                  <span>{menu.name}</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-44 bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-md shadow-xl shadow-purple-900/30 z-50 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 origin-top">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block px-4 py-2 text-purple-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-pink-600/40 transition relative overflow-hidden group/item"
                    >
                      {/* Hiệu ứng blink line */}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 group-hover/item:w-full transition-all duration-500"></span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-purple-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-500/30 animate-fade-in">
          {menus.map((menu) => (
            <div key={menu.name} className="border-b border-purple-500/20">
              <button
                onClick={() => toggleDropdown(menu.name)}
                className="w-full text-left px-4 py-3 flex justify-between items-center text-purple-300 hover:text-white"
              >
                {menu.name}
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openDropdown === menu.name ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === menu.name && (
                <div className="pl-6 pb-2 animate-slide-down">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block px-2 py-2 text-sm text-purple-400 hover:text-white hover:bg-purple-600/30 rounded-md transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Extra CSS animations */}
      <style jsx>{`
        @keyframes text-shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: text-shine 3s linear infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease forwards;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease forwards;
        }
      `}</style>
    </nav>
  );
}
