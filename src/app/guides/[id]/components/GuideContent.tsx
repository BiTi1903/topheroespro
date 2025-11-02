import { BookOpen } from "lucide-react";
import { Guide } from "../types/guide";
import ImageGallery from "./ImageGallery";
import SectionItem from "./SectionItem";
import RelatedGuidesSidebar from "./RelatedGuidesSidebar ";

interface GuideContentProps {
  guide: Guide;
  onImageClick: (img: string) => void;
}

export default function GuideContent({ guide, onImageClick }: GuideContentProps) {
  return (
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
        <div className="mb-6">
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
        <div className="mb-6">
          <ImageGallery 
            images={guide.mainContentImages} 
            title={guide.title}
            onImageClick={onImageClick}
          />
        </div>
      )}

      {/* Enhanced Sections */}
      {guide.sections && guide.sections.length > 0 && (
        <div className="space-y-16 mt-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-4">Chi tiết</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
          </div>
          
          {guide.sections.map((section, idx) => (
            <SectionItem
              key={section.id}
              section={section}
              index={idx}
              onImageClick={onImageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}