interface ImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (img: string) => void;
}

export default function ImageGallery({ images, title, onImageClick }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className={`${images.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}`}>
      {images.map((img, index) => (
        <div 
          key={index} 
          className={`relative group overflow-hidden rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center min-h-[400px] cursor-pointer ${images.length === 1 ? 'max-w-4xl w-full' : ''}`}
          onClick={() => onImageClick(img)}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          {/* Image Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
            <img
              src={img}
              alt={`${title} - Ảnh ${index + 1}`}
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
        </div>
      ))}
    </div>
  );
}