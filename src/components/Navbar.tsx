"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ChevronDown } from "lucide-react";

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
        { name: "", href: "/tuong/fps" },
        { name: "Strategy", href: "/tuong/strategy" },
      ],
    },
    {
      name: "Shop",
      items: [
        { name: "Trang chủ Shop", href: "/shop" },
        { name: "Ưu đãi", href: "/shop/offer" },
      ],
    },
    {
      name: "Tech",
      items: [
        { name: "Hướng dẫn", href: "/tech" },
        { name: "Tips", href: "/tech/tips" },
      ],
    },
    {
      name: "Others",
      items: [
        { name: "Tin tức", href: "/news" },
        { name: "Cộng đồng", href: "/community" },
      ],
    },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
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
      {/* Menu button */}
      <button
        className="flex items-center space-x-1 text-purple-300 hover:text-white font-medium transition cursor-pointer"
      >
        <span>{menu.name}</span>
        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Dropdown */}
      <div
        className="absolute top-full left-0 mt-2 w-40 bg-black/90 backdrop-blur-sm border border-purple-500/30 rounded-md shadow-lg z-50 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 origin-top"
      >
        {menu.items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="block px-4 py-2 text-purple-300 hover:text-white hover:bg-purple-700/30 transition cursor-pointer"
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
