"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menus = [
    { name: "Mùa giải", items: [
        { name: "S1", href: "/seasons/s1" },
        { name: "S2", href: "/seasons/s2" },
        { name: "S3", href: "/seasons/s3" },
      ] 
    },
    { name: "Tướng", items: [
        { name: "Tất cả", href: "/tuong" },
        { name: "RPG", href: "/tuong/rpg" },
        { name: "MOBA", href: "/tuong/moba" },
        { name: "FPS", href: "/tuong/fps" },
        { name: "Strategy", href: "/tuong/strategy" },
      ] 
    },
    { name: "Shop", items: [
        { name: "Trang chủ Shop", href: "/shop" },
        { name: "Ưu đãi", href: "/shop/offer" },
      ] 
    },
    { name: "Tech", items: [
        { name: "Hướng dẫn", href: "/tech" },
        { name: "Tips", href: "/tech/tips" },
      ] 
    },
    { name: "Others", items: [
        { name: "Tin tức", href: "/news" },
        { name: "Cộng đồng", href: "/community" },
      ] 
    },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
  <Link href="/" className="flex items-center space-x-3">
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
      <Gamepad2 className="w-6 h-6 text-white" />
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Topheroes - Pro
    </span>
  </Link>
</div>


          {/* Menu */}
          <div className="hidden md:flex items-center space-x-6">
  {menus.map((menu) => (
    <div key={menu.name} className="relative group">
      <button className="flex items-center space-x-1 text-purple-300 hover:text-white font-medium transition">
        <span>{menu.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-2 w-40 bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {menu.items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="block px-4 py-2 text-purple-300 hover:text-white hover:bg-purple-700/30 transition"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </nav>
  );
}
