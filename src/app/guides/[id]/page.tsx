"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ChevronLeft, Eye, Clock } from "lucide-react";

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

  // Theo dõi scroll -> hiện sidebar khi cuộn qua banner
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-purple-300 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy bài viết</h2>
          <p className="text-purple-300 mb-6">Bài viết này không tồn tại hoặc đã bị xóa</p>
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

  // Hàm scroll đến section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = -100; // đẩy lên 100px để nhìn rõ hơn
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex flex-col">
      {/* Sidebar */}
      {guide.sections && showSidebar && (
        <div className="fixed top-1/4 left-2 hidden lg:block 
                        bg-black/30 backdrop-blur-md rounded-xl p-4 space-y-3 
                        border border-purple-500/30 shadow-lg 
                        animate-fadeIn transition-all duration-500 z-50">
          <h4 className="text-sm font-semibold text-purple-300 uppercase">Mục lục</h4>
          <ul className="space-y-2">
            {guide.sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="text-purple-200 hover:text-white hover:translate-x-1 hover:scale-105 
                             text-base font-medium transition"
                >
                  {section.title}
                </button>
                {section.subSections && (
                  <ul className="pl-3 mt-1 space-y-1 border-l border-purple-500/30">
                    {section.subSections.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => scrollToSection(sub.id)}
                          className="text-purple-400 hover:text-purple-200 hover:translate-x-1 hover:scale-105 
                                     text-sm transition"
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
          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Fallback image
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition group z-10"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Quay lại</span>
        </button>

        {/* Category Badge */}
        {guide.category && (
          <div className="absolute top-8 right-8 z-10">
            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
              {guide.category}
            </span>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-purple-400 mb-3 font-semibold uppercase tracking-wide">
              {guide.game}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {guide.title}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{guide.views || "0"} lượt xem</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{guide.time || "5 phút đọc"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
<div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
  {/* Description */}
  {guide.description && (
  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
    <p className="text-lg text-purple-100 leading-relaxed italic whitespace-pre-line">
      {`"${guide.description}"`}
    </p>
  </div>
)}


          {/* Main Content */}
  <article className="prose prose-invert prose-lg max-w-none">
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8 md:p-10">
      <div className="text-purple-50 space-y-6 leading-relaxed">
              {guide.content && (
                <div id="content" className="mb-8">
                  <p className="text-purple-100 whitespace-pre-line">
                    {guide.content}
                  </p>
                </div>
              )}

              {/* Sections */}
              {guide.sections && guide.sections.length > 0 && (
                <div className="mt-8 space-y-8">
                  {guide.sections.map((section) => (
                    <div
                      id={section.id}
                      key={section.id}
                      className="bg-gray-800/50 p-6 rounded-lg space-y-4"
                    >
                      <h2 className="text-2xl font-bold text-purple-300">
                        {section.title}
                      </h2>

                      {section.content && (
                        <p className="text-purple-100">{section.content}</p>
                      )}

                      {section.image && (
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-auto max-h-[600px] object-cover rounded-lg cursor-pointer mt-4"
                          onClick={() => setModalImage(section.image!)}
                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Fallback image
                        />
                      )}

                      {section.subSections && section.subSections.length > 0 && (
                        <div className="pl-4 border-l border-purple-500/30 mt-4 space-y-3">
                          {section.subSections.map((sub) => (
                            <div id={sub.id} key={sub.id}>
                              <h3 className="text-xl font-semibold text-purple-400">
                                {sub.title}
                              </h3>
                              {sub.content && (
                                <p className="text-purple-100">{sub.content}</p>
                              )}
                              {sub.image && (
                                <img
                                  src={sub.image}
                                  alt={sub.title}
                                  className="w-full h-auto max-h-[400px] object-cover rounded-lg cursor-pointer mt-4"
                                  onClick={() => setModalImage(sub.image!)}
                                  onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Fallback image
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Modal hiển thị hình full */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full Image"
            className="max-w-full max-h-full object-contain"
            onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Fallback image
          />
        </div>
      )}
    </div>
  );
}

/* CSS cho fadeIn (thêm trong globals.css hoặc tailwind config):
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
*/