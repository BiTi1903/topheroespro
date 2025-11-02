// app/admin/components/GuideModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, Plus, Upload } from "lucide-react";
import { Guide, Category, Section } from "../types";
import { handleFileChange as utilHandleFileChange, uploadImage } from "../utils";
import SectionEditor from "./SectionEditor";

interface GuideModalProps {
  guide: Guide | null;
  categories: Category[];
  uploading: boolean;
  setUploading: (value: boolean) => void;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    content: string;
    image: string;
    mainContentImages: string[];
    sections: Section[];
    category: string;
    game: string;
    pinned: boolean;
  }) => Promise<void>;
}

export default function GuideModal({
  guide,
  categories,
  uploading,
  setUploading,
  onClose,
  onSave
}: GuideModalProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [mainContentImages, setMainContentImages] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [pinned, setPinned] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [game, setGame] = useState<string>("");

  useEffect(() => {
    if (guide) {
      setTitle(guide.title);
      setDescription(guide.description);
      setContent(guide.content);
      setImage(guide.image);
      setMainContentImages(guide.mainContentImages || []);
      setSections(guide.sections || []);
      setExpandedSections(new Set(guide.sections?.map(s => s.id) || []));
      setPinned(guide.pinned || false);
      setSelectedCategory(guide.category || "");
      setGame(guide.game || "");
    } else {
      setTitle("");
      setDescription("");
      setContent("");
      setImage("");
      setMainContentImages([]);
      setSections([]);
      setExpandedSections(new Set());
      setPinned(false);
      setSelectedCategory("");
      setGame("");
    }
  }, [guide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      description,
      content,
      image,
      mainContentImages,
      sections,
      category: selectedCategory,
      game,
      pinned
    });
  };

  const addSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      content: "",
      images: [],
      subSections: []
    };
    setSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    path: string
  ) => {
    utilHandleFileChange(e, callback, path, setUploading);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-3xl my-8 mx-4 max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white sticky top-0 z-10 bg-gray-900 p-2 rounded-lg"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">
          {guide ? "Sửa Bài" : "Thêm Bài Mới"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Tiêu đề" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" 
            required 
          />
          
          <input 
            type="text" 
            placeholder="Mô tả" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" 
            required 
          />
          
          <textarea 
            placeholder="Nội dung chính" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 min-h-[100px]" 
            required
          />
          
          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ảnh đại diện</label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setImage, 'guides/main')}
                />
                <Upload className="w-5 h-5 mr-2" />
                <span>{image ? 'Thay ảnh' : 'Upload ảnh'}</span>
              </label>
              {image && (
                <div className="relative w-20 h-20">
                  <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Game và Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Danh mục</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content Images Upload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Ảnh nội dung chính</h3>
              <label className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1 text-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await uploadImage(file, 'guides/content', setUploading);
                        setMainContentImages([...mainContentImages, url]);
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}
                />
                <Plus size={14}/> <span>Upload ảnh</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mainContentImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Content ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setMainContentImages(mainContentImages.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={pinned} 
              onChange={(e) => setPinned(e.target.checked)} 
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-300 rounded focus:ring-purple-500" 
            />
            <label className="text-purple-300 text-sm">Ghim bài viết</label>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-semibold mb-2">Sections</h3>
            {sections.map(section => (
              <SectionEditor
                key={section.id}
                section={section}
                sections={sections}
                setSections={setSections}
                expandedSections={expandedSections}
                setExpandedSections={setExpandedSections}
                uploading={uploading}
                setUploading={setUploading}
              />
            ))}
            <button 
              type="button" 
              onClick={addSection} 
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded flex items-center space-x-1"
            >
              <Plus size={16}/> <span>Thêm Section</span>
            </button>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded mt-4 flex items-center space-x-2 w-full justify-center"
          >
            <Save size={18}/> <span>{uploading ? 'Đang xử lý...' : 'Lưu Bài'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}