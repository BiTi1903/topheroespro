// app/admin/components/SubsectionEditor.tsx
"use client";

import { Trash2, Plus, X } from "lucide-react";
import { Section, SubSection } from "../types";
import { uploadImage } from "../utils";

interface SubSectionEditorProps {
  subSection: SubSection;
  sectionId: string;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export default function SubSectionEditor({
  subSection,
  sectionId,
  sections,
  setSections,
  uploading,
  setUploading
}: SubSectionEditorProps) {
  
  const updateSubSection = (field: keyof SubSection, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSection.id ? { ...sub, [field]: value } : sub
            )
          }
        : section
    ));
  };

  const removeSubSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, subSections: section.subSections.filter(sub => sub.id !== subSection.id) }
        : section
    ));
  };

  const updateSubSectionImage = (imageIndex: number, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSection.id 
                ? {
                    ...sub,
                    images: (sub.images || []).map((img, i) => i === imageIndex ? value : img)
                  }
                : sub
            )
          }
        : section
    ));
  };

  const removeSubSectionImage = (e: React.MouseEvent<HTMLButtonElement>, imageIndex: number) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSection.id 
                ? { ...sub, images: (sub.images || []).filter((_, i) => i !== imageIndex) }
                : sub
            )
          }
        : section
    ));
  };

  return (
    <div className="border border-gray-600 p-3 rounded bg-gray-800/50">
      <input 
        type="text" 
        placeholder="Tiêu đề subsection" 
        value={subSection.title} 
        onChange={(e) => updateSubSection("title", e.target.value)} 
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-2 text-sm" 
      />
      <textarea 
        placeholder="Nội dung" 
        value={subSection.content} 
        onChange={(e) => updateSubSection("content", e.target.value)} 
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-2 text-sm min-h-[60px]"
      />
      
      {/* SubSection Images Upload */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-gray-400">Ảnh subsection</label>
          <label className="bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded text-xs cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const url = await uploadImage(file, `guides/subsections/${subSection.id}`, setUploading);
                    updateSubSectionImage((subSection.images || []).length, url);
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
            />
            <Plus size={10}/> Upload
          </label>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(subSection.images || []).map((img, imgIndex) => (
            <div key={imgIndex} className="relative group">
              <img src={img} alt={`Sub ${imgIndex + 1}`} className="w-full h-16 object-cover rounded" />
              <button
                type="button"
                onClick={(e) => removeSubSectionImage(e, imgIndex)}
                className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={removeSubSection} 
        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex items-center space-x-1 text-xs"
      >
        <Trash2 size={12} /> <span>Xóa Sub</span>
      </button>
    </div>
  );
}