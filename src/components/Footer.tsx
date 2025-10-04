import React from 'react';
import { Gamepad2, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import { FaDiscord, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-950/90 backdrop-blur-md border-t border-purple-500/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GameGuide
              </span>
            </div>
            <p className="text-white text-sm mb-2">
              Trang Web hướng dẫn game về Thời Đại Anh Hùng - Topheroes 
            </p>
            <p className="text-white text-sm">
              Fan made - BiTi
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-white hover:text-white transition-colors duration-200 text-sm">Về chúng tôi</a></li>
              <li><a href="/contact" className="text-white hover:text-white transition-colors duration-200 text-sm">Liên hệ</a></li>
              <li><a href="/privacy" className="text-white hover:text-white transition-colors duration-200 text-sm">Chính sách bảo mật</a></li>
              <li><a href="/terms" className="text-white hover:text-white transition-colors duration-200 text-sm">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Thể loại</h3>
            <ul className="space-y-2">
              <p className="text-white">RPG Games</p>
              <p className="text-white">MOBA Games</p>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Kết nối với Thời Đại Anh Hùng</h3>
            <div className="flex space-x-3">
              {/* <a
                href="https://www.facebook.com/iambiti"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a> */}
              {/* Facebook Group */}
              <a
                href="https://www.facebook.com/thoidaianhhungfanpage"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <FaFacebook className="w-5 h-5 text-white" />
              </a>
              {/* Discord */}
              <a
                href="https://discord.gg/dGwasGWE"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-xl hover:bg-purple-500 transition-colors duration-200"
              >
                <FaDiscord className="w-5 h-5 text-white" />
              </a>

              
            </div>

            <p className="text-white text-sm">Nhận tin tức mới nhất</p>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-3 py-2 text-white text-sm placeholder-purple-300 outline-none focus:border-purple-500 mb-4"
            />
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
              Đăng ký
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
          <p className="text-white text-sm">
            &copy; 2025 BiTi. Made with ❤️ for gamers in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
