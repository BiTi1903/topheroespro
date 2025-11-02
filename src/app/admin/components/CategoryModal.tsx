// app/admin/components/CategoryModal.tsx
"use client";

import { useState } from "react";
import { X, Tag, Plus, Trash2 } from "lucide-react";
import { Category } from "../types";

interface CategoryModalProps {
  categories: Category[];
  onClose: () => void;
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export default function CategoryModal({
  categories,
  onClose,
  onAddCategory,
  onDeleteCategory
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    await onAddCategory(newCategoryName);
    setNewCategoryName("");
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    await onDeleteCategory(categoryId);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Tag size={24} />
          <span>Quản lý Danh mục</span>
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Thêm</span>
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Danh sách danh mục</h3>
          {categories.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Chưa có danh mục nào</p>
          ) : (
            <div className="space-y-3">
              {categories.map(category => (
                <div  
                  key={category.id} 
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Tag size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{category.name}</h4>
                      <p className="text-sm text-gray-400">
                        Tạo lúc: {category.createdAt?.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, category.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}