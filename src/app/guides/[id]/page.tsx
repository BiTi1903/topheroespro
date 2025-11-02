"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Guide } from "./types/guide";
import LoadingState from "./components/LoadingState";
import NotFoundState from "./components/NotFoundState";
import TableOfContents from "./components/TableOfContents";
import HeroSection from "./components/HeroSection";
import GuideContent from "./components/GuideContent";
import ImageModal from "./components/ImageModal";

export default function GuideDetailPage() {
  const params = useParams();
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) return <LoadingState />;
  if (!guide) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Table of Contents */}
      {guide.sections && guide.sections.length > 0 && (
        <TableOfContents
  sections={guide.sections}
  onSectionClick={scrollToSection}
/>

      )}

      {/* Hero Section */}
      <HeroSection guide={guide} />

      {/* Guide Content */}
      <GuideContent guide={guide} onImageClick={setModalImage} />

      {/* Image Modal */}
      <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
}