// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { User, signOut, onAuthStateChanged } from "firebase/auth";
import { Plus, LogOut, Settings } from "lucide-react";
import { Guide, Category, Section } from "./types"; // 👈 Thêm Section
import * as services from "./services";
import LoginForm from "./components/LoginForm";
import GuideTable from "./components/GuideTable";
import GuideModal from "./components/GuideModal";
import CategoryModal from "./components/CategoryModal";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Lấy user hiện tại
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Khi có user -> load data
  useEffect(() => {
    if (user) {
      loadGuides();
      loadCategories();
    }
  }, [user]);

  const loadGuides = async () => {
    const data = await services.fetchGuides();
    setGuides(data);
  };

  const loadCategories = async () => {
    const data = await services.fetchCategories();
    setCategories(data);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await signOut(auth);
    setUser(null);
  };

  const handleAddCategory = async (name: string) => {
    try {
      const newCategory = await services.addCategory(name);
      setCategories((prev) => [...prev, newCategory]);
      alert("Thêm danh mục thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm danh mục");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await services.deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      alert("Xóa danh mục thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa danh mục");
    }
  };

  const openModal = (guide?: Guide) => {
    setEditingGuide(guide || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuide(null);
  };

  // ✅ Chuẩn hóa kiểu dữ liệu đầu vào khi lưu bài viết
  const handleSaveGuide = async (data: {
    title: string;
    description: string;
    content: string;
    image: string;
    mainContentImages: string[];
    sections: Section[]; // 👈 Dùng Section từ types.ts
    category: string;
    game: string;
    pinned: boolean;
  }) => {
    try {
      await services.saveGuide(
        {
          ...data,
          sections: data.sections.map((s) => ({
            ...s,
            subSections: s.subSections || [], // 👈 đảm bảo có subSections nếu type yêu cầu
          })),
        },
        editingGuide?.id
      );

      alert(editingGuide ? "Cập nhật bài viết thành công!" : "Thêm bài viết thành công!");
      closeModal();
      loadGuides();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu bài viết");
    }
  };

  const handleDeleteGuide = async (id: string) => {
    try {
      await services.deleteGuide(id);
      alert("Xóa bài viết thành công!");
      loadGuides();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa bài viết");
    }
  };

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Overlay upload */}
      {uploading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg">Đang upload ảnh...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Bài Viết</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <Settings size={18} />
            <span>Quản lý Danh mục</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Nút thêm bài */}
      <button
        onClick={() => openModal()}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4"
      >
        <Plus size={18} />
        <span>Thêm Bài Mới</span>
      </button>

      {/* Bảng bài viết */}
      <GuideTable guides={guides} onEdit={openModal} onDelete={handleDeleteGuide} />

      {/* Modal bài viết */}
      {showModal && (
        <GuideModal
          guide={editingGuide}
          categories={categories}
          uploading={uploading}
          setUploading={setUploading}
          onClose={closeModal}
          onSave={handleSaveGuide}
        />
      )}

      {/* Modal danh mục */}
      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}
