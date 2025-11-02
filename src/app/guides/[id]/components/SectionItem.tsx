import { Section } from "../types/guide";
import SubSectionItem from "./SubSectionItem";

interface SectionItemProps {
  section: Section;
  index: number;
  onImageClick: (img: string) => void;
}

export default function SectionItem({ section, index, onImageClick }: SectionItemProps) {
  return (
    <div id={section.id} className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      
      {/* Main Section Card */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl space-y-8 border border-purple-500/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
        {/* Section Header */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl">
              {index + 1}
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
                  onClick={() => onImageClick(img)}
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
                <SubSectionItem 
                  key={sub.id} 
                  subSection={sub} 
                  onImageClick={onImageClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}