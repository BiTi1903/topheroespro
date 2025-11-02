import { SubSection } from "../types/guide";

interface SubSectionItemProps {
  subSection: SubSection;
  onImageClick: (img: string) => void;
}

export default function SubSectionItem({ subSection, onImageClick }: SubSectionItemProps) {
  return (
    <div id={subSection.id} className="relative group/sub">
      {/* SubSection Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover/sub:opacity-100 transition duration-500"></div>
      
      {/* SubSection Card */}
      <div className="relative bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-purple-400">
            {subSection.title}
          </h3>
        </div>
        
        {subSection.content && subSection.content.trim() !== "" && (
          <p className="text-gray-800 dark:text-purple-100 text-base leading-relaxed whitespace-pre-line mb-4">
            {subSection.content}
          </p>
        )}
        
        {/* Enhanced SubSection Images */}
        {subSection.images && subSection.images.length > 0 && (
          <div className={`${subSection.images.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {subSection.images.map((img, imgIdx) => (
              <div 
                key={imgIdx} 
                className={`relative group/subimg overflow-hidden rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[250px] cursor-pointer ${subSection.images!.length === 1 ? 'max-w-2xl w-full' : ''}`}
                onClick={() => onImageClick(img)}
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover/subimg:opacity-20 transition duration-500"></div>
                
                {/* Image Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                  <img
                    src={img}
                    alt={`${subSection.title} - Ảnh ${imgIdx + 1}`}
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
  );
}