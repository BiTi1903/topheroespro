"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "@/firebase";
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Plus, Edit2, Trash2, LogOut, X, Save, ChevronDown, ChevronUp, Tag, Settings, Upload, Image as ImageIcon } from "lucide-react";

interface SubSection {
  id: string;
  title: string;
  content: string;
  images?: string[];
}

interface Section {
  id: string;
  title: string;
  content: string;
  images?: string[];
  subSections: SubSection[];
}

interface Category {
  id: string;
  name: string;
  createdAt: Timestamp;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  mainContentImages?: string[];
  sections: Section[];
  category?: string;
  game?: string;
  createdAt: Timestamp;
  pinned?: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // Form states
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

  // Category management states
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Helper: Upload image to Firebase Storage
  // Sửa hàm uploadImage - thay any bằng unknown
const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    setUploading(true);
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${path}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file với metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: auth.currentUser?.email || 'unknown',
        uploadedAt: new Date().toISOString()
      }
    };
    
    const uploadResult = await uploadBytes(storageRef, file, metadata);
    console.log('Upload success:', uploadResult);
    
    // Lấy download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error: unknown) {  // Thay any bằng unknown
    console.error("Upload error details:", error);
    
    // Type guard để kiểm tra error có thuộc tính code
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string; message?: string };
      
      // Xử lý các loại lỗi cụ thể
      if (firebaseError.code === 'storage/unauthorized') {
        alert('Lỗi: Không có quyền upload. Vui lòng đăng nhập lại!');
      } else if (firebaseError.code === 'storage/canceled') {
        alert('Upload đã bị hủy');
      } else if (firebaseError.code === 'storage/unknown') {
        alert('Lỗi không xác định. Vui lòng kiểm tra kết nối internet!');
      } else {
        alert('Lỗi khi upload ảnh: ' + (firebaseError.message || 'Unknown error'));
      }
    } else {
      alert('Lỗi khi upload ảnh: ' + String(error));
    }
    
    throw error;
  } finally {
    setUploading(false);
  }
};

// Giải thích:
// 1. Thay `error: any` bằng `error: unknown` - best practice trong TypeScript
// 2. Sử dụng type guard để kiểm tra error có thuộc tính 'code'
// 3. Type assertion `as { code: string; message?: string }` khi đã chắc chắn là Firebase error
// 4. Xử lý trường h

  // Helper: Handle file input change
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    path: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Tối đa 5MB');
      return;
    }

    try {
      const url = await uploadImage(file, path);
      callback(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGuides();
      fetchCategories();
    }
  }, [user]);

  const fetchGuides = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "guides"));
      const guidesData: Guide[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          image: data.image || "",
          mainContentImages: data.mainContentImages || [],
          sections: data.sections || [],
          category: data.category || "",
          game: data.game || "",
          createdAt: data.createdAt as Timestamp,
          pinned: data.pinned || false,
        };
      });
      setGuides(guidesData.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt.seconds - a.createdAt.seconds;
      }));
    } catch (err) {
      console.error("Lỗi khi lấy bài báo:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "categories"), orderBy("name")));
      const categoriesData: Category[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          createdAt: data.createdAt as Timestamp,
        };
      });
      setCategories(categoriesData);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await signOut(auth);
    setUser(null);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        createdAt: serverTimestamp(),
      });
      
      setCategories(prev => [
        ...prev,
        {
          id: docRef.id,
          name: newCategoryName.trim(),
          createdAt: Timestamp.now(),
        } as Category
      ]);
      
      setNewCategoryName("");
      alert("Thêm danh mục thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm danh mục");
    }
  };

  const deleteCategory = async (e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      alert("Xóa danh mục thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa danh mục");
    }
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>, guide?: Guide) => {
    e.stopPropagation();
    if (guide) {
      setEditingGuide(guide);
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
      setEditingGuide(null);
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
    setShowModal(true);
  };

  const closeModal = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setShowModal(false);
    setEditingGuide(null);
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

  const updateSection = (sectionId: string, field: keyof Section, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.stopPropagation();
    setSections(sections.filter(section => section.id !== sectionId));
    const newExpanded = new Set(expandedSections);
    newExpanded.delete(sectionId);
    setExpandedSections(newExpanded);
  };

  const addImageToSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, images: [...(section.images || []), ""] }
        : section
    ));
  };

  const updateSectionImage = (sectionId: string, imageIndex: number, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            images: (section.images || []).map((img, i) => i === imageIndex ? value : img)
          }
        : section
    ));
  };

  const removeSectionImage = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string, imageIndex: number) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, images: (section.images || []).filter((_, i) => i !== imageIndex) }
        : section
    ));
  };

  const addSubSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.stopPropagation();
    const newSubSection: SubSection = {
      id: Date.now().toString(),
      title: "",
      content: "",
      images: []
    };
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, subSections: [...section.subSections, newSubSection] }
        : section
    ));
  };

  const updateSubSection = (sectionId: string, subSectionId: string, field: keyof SubSection, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSectionId ? { ...sub, [field]: value } : sub
            )
          }
        : section
    ));
  };

  const removeSubSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string, subSectionId: string) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, subSections: section.subSections.filter(sub => sub.id !== subSectionId) }
        : section
    ));
  };

  const addImageToSubSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string, subSectionId: string) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSectionId 
                ? { ...sub, images: [...(sub.images || []), ""] }
                : sub
            )
          }
        : section
    ));
  };

  const updateSubSectionImage = (sectionId: string, subSectionId: string, imageIndex: number, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSectionId 
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

  const removeSubSectionImage = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string, subSectionId: string, imageIndex: number) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            subSections: section.subSections.map(sub =>
              sub.id === subSectionId 
                ? { ...sub, images: (sub.images || []).filter((_, i) => i !== imageIndex) }
                : sub
            )
          }
        : section
    ));
  };

  const toggleSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const filteredMainContentImages = mainContentImages.filter(img => img.trim() !== "");
      
      const filteredSections = sections
        .filter(section => section.title.trim() !== "" || section.content.trim() !== "")
        .map(section => ({
          ...section,
          title: section.title.trim(),
          content: section.content.trim(),
          images: (section.images || []).filter(img => img.trim() !== ""),
          subSections: section.subSections
            .filter(sub => sub.title.trim() !== "" || sub.content.trim() !== "")
            .map(sub => ({
              ...sub,
              title: sub.title.trim(),
              content: sub.content.trim(),
              images: (sub.images || []).filter(img => img.trim() !== "")
            }))
        }));

      const guideData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        image: image.trim(),
        mainContentImages: filteredMainContentImages,
        sections: filteredSections,
        category: selectedCategory,
        game: game.trim(),
        pinned,
        updatedAt: serverTimestamp(),
      };

      if (editingGuide) {
        await updateDoc(doc(db, "guides", editingGuide.id), guideData);
        alert("Cập nhật bài báo thành công!");
      } else {
        await addDoc(collection(db, "guides"), {
          ...guideData,
          createdAt: serverTimestamp(),
        });
        alert("Thêm bài báo thành công!");
      }
      closeModal();
      fetchGuides();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu bài báo");
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa bài báo này?")) return;
    
    try {
      await deleteDoc(doc(db, "guides", id));
      alert("Xóa bài báo thành công!");
      fetchGuides();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa bài báo");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
        <div className="w-full max-w-md p-8">
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-md border border-purple-500/20 p-8 rounded-2xl space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
              <p className="text-purple-300 mt-2">Đăng nhập để quản lý</p>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold">Đăng nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {uploading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg">Đang upload ảnh...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Bài Viết</h1>
        <div className="flex space-x-3">
          <button onClick={() => setShowCategoryModal(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            <Settings size={18} /> <span>Quản lý Danh mục</span>
          </button>
          <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
            <LogOut size={18} /> <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <button onClick={(e) => openModal(e)} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4">
        <Plus size={18} /> <span>Thêm Bài Mới</span>
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">Tiêu đề</th>
              <th className="p-4">Game</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {guides.map(guide => (
              <tr key={guide.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                <td className="p-4 font-semibold">
                  {guide.title} {guide.pinned && <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs ml-2">GHIM</span>}
                </td>
                <td className="p-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    {guide.game || "Chưa có"}
                  </span>
                </td>
                <td className="p-4">
                  {guide.category ? (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                      {guide.category}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa có</span>
                  )}
                </td>
                <td className="p-4">{guide.description}</td>
                <td className="p-4">{guide.createdAt?.toDate().toLocaleString()}</td>
                <td className="p-4 flex space-x-2">
                  <button onClick={(e) => openModal(e, guide)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1"><Edit2 size={16} /><span>Sửa</span></button>
                  <button onClick={(e) => handleDelete(e, guide.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center space-x-1"><Trash2 size={16} /><span>Xóa</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-3xl my-8 mx-4 max-h-[90vh] overflow-y-auto relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white sticky top-0 z-10 bg-gray-900 p-2 rounded-lg">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{editingGuide ? "Sửa Bài" : "Thêm Bài Mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" required />
              <input type="text" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" required />
              <textarea placeholder="Nội dung chính" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 min-h-[100px]" required></textarea>
              
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Game</label>
                  <input 
                    type="text" 
                    placeholder="Tên game" 
                    value={game} 
                    onChange={(e) => setGame(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" 
                  />
                </div>
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
                            const url = await uploadImage(file, 'guides/content');
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
                <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-300 rounded focus:ring-purple-500" />
                <label className="text-purple-300 text-sm">Ghim bài viết</label>
              </div>

              {/* Sections */}
              <div>
                <h3 className="font-semibold mb-2">Sections</h3>
                {sections.map(section => (
                  <div key={section.id} className="mb-3 border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <input 
                        type="text" 
                        placeholder="Tiêu đề section" 
                        value={section.title} 
                        onChange={(e) => updateSection(section.id, "title", e.target.value)} 
                        className="flex-1 p-2 rounded bg-gray-800 border border-gray-700" 
                      />
                      <div className="flex space-x-1 ml-2">
                        <button type="button" onClick={(e) => toggleSection(e, section.id)} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
                          {expandedSections.has(section.id) ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </button>
                        <button type="button" onClick={(e) => removeSection(e, section.id)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="space-y-3">
                        <textarea 
                          placeholder="Nội dung" 
                          value={section.content} 
                          onChange={(e) => updateSection(section.id, "content", e.target.value)} 
                          className="w-full p-2 rounded bg-gray-800 border border-gray-700 min-h-[80px]"
                        ></textarea>
                        
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
                                      const url = await uploadImage(file, `guides/sections/${section.id}`);
                                      updateSectionImage(section.id, (section.images || []).length, url);
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
                                  onClick={(e) => removeSectionImage(e, section.id, imgIndex)}
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
                            <div key={sub.id} className="border border-gray-600 p-3 rounded bg-gray-800/50">
                              <input 
                                type="text" 
                                placeholder="Tiêu đề subsection" 
                                value={sub.title} 
                                onChange={(e) => updateSubSection(section.id, sub.id, "title", e.target.value)} 
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-2 text-sm" 
                              />
                              <textarea 
                                placeholder="Nội dung" 
                                value={sub.content} 
                                onChange={(e) => updateSubSection(section.id, sub.id, "content", e.target.value)} 
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-2 text-sm min-h-[60px]"
                              ></textarea>
                              
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
                                            const url = await uploadImage(file, `guides/subsections/${sub.id}`);
                                            updateSubSectionImage(section.id, sub.id, (sub.images || []).length, url);
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
                                  {(sub.images || []).map((img, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                      <img src={img} alt={`Sub ${imgIndex + 1}`} className="w-full h-16 object-cover rounded" />
                                      <button
                                        type="button"
                                        onClick={(e) => removeSubSectionImage(e, section.id, sub.id, imgIndex)}
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
                                onClick={(e) => removeSubSection(e, section.id, sub.id)} 
                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex items-center space-x-1 text-xs"
                              >
                                <Trash2 size={12} /> <span>Xóa Sub</span>
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={(e) => addSubSection(e, section.id)} 
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1 text-sm"
                          >
                            <Plus size={14}/> <span>Thêm Sub</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowCategoryModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Tag size={24} />
              <span>Quản lý Danh mục</span>
            </h2>

            {/* Add New Category */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
              <form onSubmit={addCategory} className="flex space-x-3">
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

            {/* Categories List */}
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
                        onClick={(e) => deleteCategory(e, category.id)}
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
      )}
    </div>
  );
}