"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ChevronLeft, Eye, Clock, Quote } from "lucide-react";

interface SubSection {
  id: string;
  title: string;
  content?: string;
  image?: string;
}

interface Section {
  id: string;
  title: string;
  content?: string;
  image?: string;
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
      {/* Sidebar */}
      {guide.sections && guide.sections.length > 0 && showSidebar && (
        <div className="fixed top-1/4 left-2 hidden lg:block bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl p-4 space-y-3 border border-purple-500/20 shadow-lg animate-fadeIn transition-all duration-500 z-50 max-w-xs">
          <h4 className="text-sm font-semibold text-purple-500 dark:text-purple-300 uppercase">Mục lục</h4>
          <ul className="space-y-2">
            {guide.sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="text-purple-600 dark:text-purple-200 hover:text-purple-700 dark:hover:text-white hover:translate-x-1 hover:scale-105 text-sm font-medium transition text-left"
                >
                  {section.title}
                </button>
                {section.subSections && section.subSections.length > 0 && (
                  <ul className="pl-3 mt-1 space-y-1 border-l border-purple-500/30">
                    {section.subSections.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => scrollToSection(sub.id)}
                          className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-200 hover:translate-x-1 hover:scale-105 text-xs transition text-left"
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 dark:via-gray-950/50 to-gray-50 dark:to-gray-950"></div>

        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 bg-white/50 dark:bg-black/50 backdrop-blur-md hover:bg-white/70 dark:hover:bg-black/70 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition group z-10"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Quay lại</span>
        </button>

        {guide.category && (
          <div className="absolute top-8 right-8 z-10">
            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
              {guide.category}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-purple-500 dark:text-purple-300 mb-3 font-semibold uppercase tracking-wide">
              {guide.game}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {guide.title}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-purple-500 dark:text-purple-300">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{guide.views || "0"} lượt xem</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Description - Đóng khung đẹp */}
        {guide.description && guide.description.trim() !== "" && (
          <div className="flex justify-center mb-6">
  <div className="relative group inline-block">
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl px-6 py-3 border border-purple-500/30 shadow">
      <p className="text-gray-800 dark:text-purple-100 text-base md:text-lg leading-relaxed text-center font-medium whitespace-pre-line">
        {guide.description}
      </p>
    </div>
  </div>
</div>

        )}

        {/* Main Content */}
        {guide.content && guide.content.trim() !== "" && (
          <div className="mb-10 prose max-w-none dark:prose-invert">
            <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-6 border-l-4 border-purple-500">
              <p className="text-gray-800 dark:text-purple-100 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {guide.content}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Images - Với hiệu ứng hover đẹp */}
        {guide.mainContentImages && guide.mainContentImages.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.mainContentImages.map((img, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={img}
                  alt={`${guide.title} - Ảnh ${index + 1}`}
                  className="w-full h-full min-h-[400px] object-cover cursor-pointer transform group-hover:scale-110 transition-transform duration-500"
                  onClick={() => setModalImage(img)}
                  onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                />
                
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        {guide.sections && guide.sections.length > 0 && (
          <div className="space-y-10 mt-12">
            {guide.sections.map((section, idx) => (
              <div
                id={section.id}
                key={section.id}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/50 p-8 rounded-2xl space-y-6 border border-purple-500/20 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {idx + 1}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-purple-300">
                      {section.title}
                    </h2>
                  </div>
                  
                  {section.content && section.content.trim() !== "" && (
                    <p className="text-gray-800 dark:text-purple-100 text-base md:text-lg leading-relaxed whitespace-pre-line pl-13">
                      {section.content}
                    </p>
                  )}
                  
                  {section.image && section.image.trim() !== "" && (
                    <div className="relative group/img overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-6 flex justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-auto h-auto max-w-full max-h-[800px] object-contain cursor-pointer transform group-hover/img:scale-105 transition-transform duration-500"
                        onClick={() => setModalImage(section.image!)}
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                      />
                      
                    </div>
                  )}
                  
                  {/* SubSections */}
                  {section.subSections && section.subSections.length > 0 && (
                    <div className="pl-6 border-l-2 border-purple-500/40 mt-8 space-y-6">
                      {section.subSections.map((sub) => (
                        <div id={sub.id} key={sub.id} className="space-y-3 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent p-4 rounded-lg">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-purple-400 flex items-center space-x-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>{sub.title}</span>
                          </h3>
                          
                          {sub.content && sub.content.trim() !== "" && (
                            <p className="text-gray-800 dark:text-purple-100 text-base leading-relaxed whitespace-pre-line">
                              {sub.content}
                            </p>
                          )}
                          
                          {sub.image && sub.image.trim() !== "" && (
                            <div className="relative group/subimg overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 mt-4 flex justify-center">
                              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover/subimg:opacity-100 transition-opacity duration-300 z-10"></div>
                              <img
                                src={sub.image}
                                alt={sub.title}
                                className="w-auto h-auto max-w-full max-h-[700px] object-contain cursor-pointer transform group-hover/subimg:scale-105 transition-transform duration-500"
                                onClick={() => setModalImage(sub.image!)}
                                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-semibold text-xs opacity-0 group-hover/subimg:opacity-100 transition-opacity duration-300 z-20 text-center bg-gradient-to-t from-black/60 to-transparent">
                                Click để xem toàn màn hình
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Image - Enhanced */}
      {modalImage && (
  <div
    className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
    onClick={() => setModalImage(null)}
  >
    <div className="relative flex items-center justify-center w-full h-full">
      <img
        src={modalImage}
        alt="Full Image"
        className="max-w-screen max-h-screen w-auto h-auto object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
      />
      <button
        onClick={() => setModalImage(null)}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}

    </div>
  );
}