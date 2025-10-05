"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ChevronLeft, Eye, Clock, Quote, BookOpen, Star, Share2, Bookmark } from "lucide-react";
import RelatedGuidesSidebar from "../../../components/RelatedGuidesSidebar ";


interface SubSection {
  id: string;
  title: string;
  content?: string;
  images?: string[];
}

interface Section {
  id: string;
  title: string;
  content?: string;
  images?: string[];
  subSections?: SubSection[];
}

interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  mainContentImages?: string[];
  views?: string;
  time?: string;
  category?: string;
  description?: string;
  content?: string;
  sections?: Section[];
}

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      try {
        const docRef = doc(db, "guides", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() } as Guide);
        } else {
          setGuide(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-purple-500 dark:text-purple-300 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h2>
          <p className="text-purple-500 dark:text-purple-300 mb-6">Bài viết này không tồn tại hoặc đã bị xóa</p>
          <button
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Enhanced Sidebar */}
      {guide.sections && guide.sections.length > 0 && showSidebar && (
  <div className="fixed top-1/4 left-4 hidden lg:block z-50">
  <div className="relative group">
    {/* Hiệu ứng glow */}
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

    {/* Sidebar */}
    <div
      className="
        relative 
        bg-white/90 dark:bg-gray-900/90 
        backdrop-blur-2xl rounded-xl 
        border border-purple-500/20 shadow-2xl 
        transition-all duration-500 hover:shadow-purple-500/20
        overflow-hidden
        w-28 h-10 group-hover:w-64 group-hover:h-auto
        cursor-pointer
      "
    >
      {/* Header (luôn hiển thị) */}
      <div className="flex items-center justify-center lg:justify-start space-x-2 p-2 border-b border-purple-500/20">
        <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-300" />
        <h4 className="text-sm font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
          Mục lục
        </h4>
      </div>

      {/* Navigation List (ẩn khi thu nhỏ) */}
      <ul className="space-y-3 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {guide.sections?.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-purple-700 dark:text-purple-200 text-sm font-semibold">
                  {section.title}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


)}


      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover transform scale-105 animate-pulse-slow"
            onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
          />
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 dark:from-gray-950/90 via-transparent to-transparent"></div>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8 z-20">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="group bg-white/20 dark:bg-black/20 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/30 text-gray-900 dark:text-white px-6 py-3 rounded-2xl flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Quay lại</span>
            </button>

            
          </div>
        </div>

        {/* Category Badge */}
        {guide.category && (
          <div className="absolute top-6 right-6 z-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <span className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
                {guide.category}
              </span>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {/* Game Title */}
              

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent animate-text-shimmer">
                  {guide.title}
                </span>
              </h1>

              {/* Stats */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3 bg-white/20 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-600 dark:text-purple-300 font-semibold">
                    {guide.views || "0"} lượt xem
                  </span>
                </div>
                {/* <div className="flex items-center space-x-3 bg-white/20 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-600 dark:text-yellow-300 font-semibold">
                    4.8/5
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Description Card */}
        {guide.description && guide.description.trim() !== "" && (
          <div className="flex justify-center mb-12">
            <div className="relative group max-w-4xl w-full">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
                
                <p className="text-gray-800 dark:text-purple-100 text-lg leading-relaxed font-medium whitespace-pre-line">
                  {guide.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        {guide.content && guide.content.trim() !== "" && (
          <div className="mb-16">
            <div className="relative group max-w-5xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-gray-900/90 dark:to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-300">Nội dung</h3>
                </div>
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-gray-800 dark:text-purple-100 text-lg leading-relaxed whitespace-pre-line">
                    {guide.content}
                  </p>
                </div>
              </div>
            </div>
            {guide && guide.category && (
  <RelatedGuidesSidebar 
    currentGuideId={guide.id} 
    category={guide.category} 
  />
)}
          </div>
        )}

        {/* Enhanced Main Content Images */}
        {guide.mainContentImages && guide.mainContentImages.length > 0 && (
          <div className="mb-16">
            
            
            <div className={`${guide.mainContentImages.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}`}>
              {guide.mainContentImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative group overflow-hidden rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[400px] cursor-pointer ${guide.mainContentImages!.length === 1 ? 'max-w-4xl w-full' : ''}`}
                  onClick={() => setModalImage(img)}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  {/* Image Container */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <img
                      src={img}
                      alt={`${guide.title} - Ảnh ${index + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      <p className="font-semibold text-sm">Click để xem toàn màn hình</p>
                    </div>
                  </div>
                  
                  {/* Image Number Badge */}
                  
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Sections */}
        {guide.sections && guide.sections.length > 0 && (
          <div className="space-y-16 mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-4">Chi tiết</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
            </div>
            
            {guide.sections.map((section, idx) => (
              <div
                id={section.id}
                key={section.id}
                className="relative group"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                {/* Main Section Card */}
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl space-y-8 border border-purple-500/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  {/* Section Header */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl">
                        {idx + 1}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-purple-300 mb-2">
                        {section.title}
                      </h2>
                      <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {section.content && section.content.trim() !== "" && (
                    <div className="prose max-w-none dark:prose-invert">
                      <p className="text-gray-800 dark:text-purple-100 text-lg leading-relaxed whitespace-pre-line pl-20">
                        {section.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Enhanced Section Images */}
                  {section.images && section.images.length > 0 && (
                    <div className="mt-8">
                      
                      
                      <div className={`${section.images.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}>
                        {section.images.map((img, imgIdx) => (
                          <div 
                            key={imgIdx} 
                            className={`relative group/img overflow-hidden rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[300px] cursor-pointer ${section.images!.length === 1 ? 'max-w-3xl w-full' : ''}`}
                            onClick={() => setModalImage(img)}
                          >
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover/img:opacity-20 transition duration-500"></div>
                            
                            {/* Image Container */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                              <img
                                src={img}
                                alt={`${section.title} - Ảnh ${imgIdx + 1}`}
                                className="w-full h-auto max-h-[400px] object-contain transform group-hover/img:scale-110 transition-transform duration-700 ease-out"
                                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                              />
                            </div>
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 z-20"></div>
                            
                            {/* Hover Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover/img:translate-y-0 transition-transform duration-1000 z-30">
                              <div className="text-center">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                                <p className="font-semibold text-xs">Click để xem toàn màn hình</p>
                              </div>
                            </div>
                            
                            
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced SubSections */}
                  {section.subSections && section.subSections.length > 0 && (
                    <div className="mt-12 space-y-8">
                      <div className="text-center mb-8">
                        <h4 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-2">Chi tiết bổ sung</h4>
                        <div className="w-20 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="space-y-6">
                        {section.subSections.map((sub, subIdx) => (
                          <div id={sub.id} key={sub.id} className="relative group/sub">
                            {/* SubSection Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover/sub:opacity-100 transition duration-500"></div>
                            
                            {/* SubSection Card */}
                            <div className="relative bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-purple-400">
                                  {sub.title}
                                </h3>
                              </div>
                              
                              {sub.content && sub.content.trim() !== "" && (
                                <p className="text-gray-800 dark:text-purple-100 text-base leading-relaxed whitespace-pre-line mb-4">
                                  {sub.content}
                                </p>
                              )}
                              
                              {/* Enhanced SubSection Images */}
                              {sub.images && sub.images.length > 0 && (
                                <div className={`${sub.images.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                                  {sub.images.map((img, imgIdx) => (
                                    <div 
                                      key={imgIdx} 
                                      className={`relative group/subimg overflow-hidden rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[250px] cursor-pointer ${sub.images!.length === 1 ? 'max-w-2xl w-full' : ''}`}
                                      onClick={() => setModalImage(img)}
                                    >
                                      {/* Glow Effect */}
                                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover/subimg:opacity-20 transition duration-500"></div>
                                      
                                      {/* Image Container */}
                                      <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                                        <img
                                          src={img}
                                          alt={`${sub.title} - Ảnh ${imgIdx + 1}`}
                                          className="w-full h-auto max-h-[300px] object-contain transform group-hover/subimg:scale-110 transition-transform duration-700 ease-out"
                                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                                        />
                                      </div>
                                      
                                      {/* Overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/subimg:opacity-100 transition-opacity duration-500 z-20"></div>
                                      
                                      {/* Hover Content */}
                                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover/subimg:translate-y-0 transition-transform duration-500 z-30">
                                        <div className="text-center">
                                          <div className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                          </div>
                                          <p className="font-semibold text-xs">Click để xem</p>
                                        </div>
                                      </div>
                                      
                                      {/* Image Number Badge */}
                                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-bold shadow-lg z-30">
                                        {imgIdx + 1}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-0 animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div className="relative w-screen h-screen flex items-center justify-center">
            {/* Background Blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 backdrop-blur-xl"></div>
            
            {/* Image Container */}
            <div className="relative z-10 max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              <img
                src={modalImage}
                alt="Full Image"
                className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-2xl shadow-2xl transform scale-95 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
              />
            </div>
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalImage(null);
              }}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = modalImage;
                link.download = `guide-image-${Date.now()}.jpg`;
                link.click();
              }}
              className="absolute top-6 right-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-2xl transition-all duration-300 hover:scale-110 z-20 group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            
          </div>
        </div>
      )}
    </div>
  );
}