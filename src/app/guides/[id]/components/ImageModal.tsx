interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-0 animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative w-screen h-screen flex items-center justify-center">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 backdrop-blur-xl"></div>
        
        {/* Image Container */}
        <div className="relative z-10 max-w-[95vw] max-h-[95vh] flex items-center justify-center">
          <img
            src={imageUrl}
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
            onClose();
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
            link.href = imageUrl;
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
  );
}