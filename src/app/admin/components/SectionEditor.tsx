// app/admin/components/SectionEditor.tsx
"use client";

import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react";
import { Section, SubSection } from "../types";
import { uploadImage } from "../utils";
import SubSectionEditor from "./SubsectionEditor";

interface SectionEditorProps {
  section: Section;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  expandedSections: Set<string>;
  setExpandedSections: (sections: Set<string>) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export default function SectionEditor({
  section,
  sections,
  setSections,
  expandedSections,
  setExpandedSections,
  uploading,
  setUploading
}: SectionEditorProps) {
  
  const updateSection = (field: keyof Section, value: string) => {
    setSections(sections.map(s => 
      s.id === section.id ? { ...s, [field]: value } : s
    ));
  };

  const removeSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSections(sections.filter(s => s.id !== section.id));
    const newExpanded = new Set(expandedSections);
    newExpanded.delete(section.id);
    setExpandedSections(newExpanded);
  };

  const toggleSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section.id)) {
      newExpanded.delete(section.id);
    } else {
      newExpanded.add(section.id);
    }
    setExpandedSections(newExpanded);
  };

  const updateSectionImage = (imageIndex: number, value: string) => {
    setSections(sections.map(s => 
      s.id === section.id 
        ? {
            ...s,
            images: (s.images || []).map((img, i) => i === imageIndex ? value : img)
          }
        : s
    ));
  };

  const removeSectionImage = (e: React.MouseEvent<HTMLButtonElement>, imageIndex: number) => {
    e.stopPropagation();
    setSections(sections.map(s => 
      s.id === section.id 
        ? { ...s, images: (s.images || []).filter((_, i) => i !== imageIndex) }
        : s
    ));
  };

  const addSubSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newSubSection: SubSection = {
      id: Date.now().toString(),
      title: "",
      content: "",
      images: []
    };
    setSections(sections.map(s => 
      s.id === section.id 
        ? { ...s, subSections: [...s.subSections, newSubSection] }
        : s
    ));
  };

  return (
    <div className="mb-3 border border-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <input 
          type="text" 
          placeholder="Tiêu đề section" 
          value={section.title} 
          onChange={(e) => updateSection("title", e.target.value)} 
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700" 
        />
        <div className="flex space-x-1 ml-2">
          <button 
            type="button" 
            onClick={toggleSection} 
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            {expandedSections.has(section.id) ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          <button 
            type="button" 
            onClick={removeSection} 
            className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            <Trash2 size={16}/>
          </button>
        </div>
      </div>

      {expandedSections.has(section.id) && (
        <div className="space-y-3">
          <textarea 
            placeholder="Nội dung" 
            value={section.content} 
            onChange={(e) => updateSection("content", e.target.value)} 
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 min-h-[80px]"
          />
          
          {/* Section Images Upload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">Ảnh section</label>
              <label className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center space-x-1 text-xs cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await uploadImage(file, `guides/sections/${section.id}`, setUploading);
                        updateSectionImage((section.images || []).length, url);
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}
                />
                <Plus size={12}/> <span>Upload</span>
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(section.images || []).map((img, imgIndex) => (
                <div key={imgIndex} className="relative group">
                  <img src={img} alt={`Section ${imgIndex + 1}`} className="w-full h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={(e) => removeSectionImage(e, imgIndex)}
                    className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SubSections */}
          <div className="ml-4 mt-3 space-y-2">
            <h4 className="font-semibold text-sm">SubSections</h4>
            {section.subSections.map(sub => (
              <SubSectionEditor
                key={sub.id}
                subSection={sub}
                sectionId={section.id}
                sections={sections}
                setSections={setSections}
                uploading={uploading}
                setUploading={setUploading}
              />
            ))}
            <button 
              type="button" 
              onClick={addSubSection} 
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1 text-sm"
            >
              <Plus size={14}/> <span>Thêm Sub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}