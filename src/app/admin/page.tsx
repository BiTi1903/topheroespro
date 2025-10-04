"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { Plus, Edit2, Trash2, Eye, LogOut, X, Save, ChevronDown, ChevronUp, Tag, Settings } from "lucide-react";

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
      await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        createdAt: serverTimestamp(),
      });
      setNewCategoryName("");
      fetchCategories();
      alert("Thêm danh mục thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm danh mục");
    }
  };

  const deleteCategory = async (e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa danh mục này? Tất cả bài viết trong danh mục này sẽ không còn danh mục.")) return;
    
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      fetchCategories();
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

  const addImageToMainContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMainContentImages([...mainContentImages, ""]);
  };

  const updateMainContentImage = (index: number, value: string) => {
    const newImages = [...mainContentImages];
    newImages[index] = value;
    setMainContentImages(newImages);
  };

  const removeMainContentImage = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.stopPropagation();
    setMainContentImages(mainContentImages.filter((_, i) => i !== index));
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{editingGuide ? "Sửa Bài" : "Thêm Bài Mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
              <input type="text" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
              <textarea placeholder="Nội dung chính" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"></textarea>
              <input type="text" placeholder="Link ảnh đại diện" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
              
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

              {/* Main Content Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Ảnh nội dung chính</h3>
                  <button type="button" onClick={addImageToMainContent} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1 text-sm">
                    <Plus size={14}/> Thêm ảnh
                  </button>
                </div>
                <div className="space-y-2">
                  {mainContentImages.map((img, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder={`Link ảnh ${index + 1}`} 
                        value={img} 
                        onChange={(e) => updateMainContentImage(index, e.target.value)} 
                        className="flex-1 p-2 rounded bg-gray-800 border border-gray-700" 
                      />
                      <button type="button" onClick={(e) => removeMainContentImage(e, index)} className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded">
                        <Trash2 size={16}/>
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
                  <div key={section.id} className="mb-2 border border-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <input type="text" placeholder="Tiêu đề section" value={section.title} onChange={(e) => updateSection(section.id, "title", e.target.value)} className="flex-1 p-2 rounded bg-gray-800 border border-gray-700" />
                      <div className="flex space-x-1 ml-2">
                        <button type="button" onClick={(e) => toggleSection(e, section.id)} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
                          {expandedSections.has(section.id) ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </button>
                        <button type="button" onClick={(e) => removeSection(e, section.id)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"><Trash2 size={16}/></button>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="space-y-2">
                        <textarea placeholder="Nội dung" value={section.content} onChange={(e) => updateSection(section.id, "content", e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700"></textarea>
                        
                        {/* Section Images */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm text-gray-400">Ảnh section</label>
                            <button type="button" onClick={(e) => addImageToSection(e, section.id)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center space-x-1 text-xs">
                              <Plus size={12}/> Thêm ảnh
                            </button>
                          </div>
                          {(section.images || []).map((img, imgIndex) => (
                            <div key={imgIndex} className="flex items-center space-x-2 mb-1">
                              <input 
                                type="text" 
                                placeholder={`Link ảnh ${imgIndex + 1}`}
                                value={img} 
                                onChange={(e) => updateSectionImage(section.id, imgIndex, e.target.value)} 
                                className="flex-1 p-1 rounded bg-gray-800 border border-gray-700 text-sm" 
                              />
                              <button type="button" onClick={(e) => removeSectionImage(e, section.id, imgIndex)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="ml-4">
                          <h4 className="font-semibold">SubSections</h4>
                          {section.subSections.map(sub => (
                            <div key={sub.id} className="mb-2 border border-gray-600 p-2 rounded">
                              <input type="text" placeholder="Tiêu đề" value={sub.title} onChange={(e) => updateSubSection(section.id, sub.id, "title", e.target.value)} className="w-full p-1 rounded bg-gray-800 border border-gray-700 mb-1" />
                              <textarea placeholder="Nội dung" value={sub.content} onChange={(e) => updateSubSection(section.id, sub.id, "content", e.target.value)} className="w-full p-1 rounded bg-gray-800 border border-gray-700 mb-1"></textarea>
                              
                              {/* SubSection Images */}
                              <div className="mb-1">
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs text-gray-400">Ảnh subsection</label>
                                  <button type="button" onClick={(e) => addImageToSubSection(e, section.id, sub.id)} className="bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded text-xs">
                                    <Plus size={10}/> Ảnh
                                  </button>
                                </div>
                                {(sub.images || []).map((img, imgIndex) => (
                                  <div key={imgIndex} className="flex items-center space-x-1 mb-1">
                                    <input 
                                      type="text" 
                                      placeholder={`Link ảnh ${imgIndex + 1}`}
                                      value={img} 
                                      onChange={(e) => updateSubSectionImage(section.id, sub.id, imgIndex, e.target.value)} 
                                      className="flex-1 p-1 rounded bg-gray-800 border border-gray-700 text-xs" 
                                    />
                                    <button type="button" onClick={(e) => removeSubSectionImage(e, section.id, sub.id, imgIndex)} className="bg-red-600 hover:bg-red-700 px-1 py-1 rounded">
                                      <Trash2 size={12}/>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              <button type="button" onClick={(e) => removeSubSection(e, section.id, sub.id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex items-center space-x-1 text-xs"><Trash2 size={14} /> Xóa Sub</button>
                            </div>
                          ))}
                          <button type="button" onClick={(e) => addSubSection(e, section.id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1"><Plus size={16}/> Thêm Sub</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addSection} className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded flex items-center space-x-1"><Plus size={16}/> Thêm Section</button>
              </div>

              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-4 flex items-center space-x-2"><Save size={18}/> Lưu Bài</button>
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newCategoryName.trim()) return;

            try {
              // Thêm category lên Firestore
              const docRef = await addDoc(collection(db, "categories"), {
                name: newCategoryName.trim(),
                createdAt: serverTimestamp(), // Firestore Timestamp
              });

              // Cập nhật state local với Timestamp tương thích
              setCategories(prev => [
                ...prev,
                {
                  id: docRef.id,
                  name: newCategoryName.trim(),
                  createdAt: Timestamp.now(), // Timestamp cho local state
                } as Category
              ]);

              setNewCategoryName("");
            } catch (error) {
              console.error("Lỗi khi thêm category:", error);
            }
          }}
          className="flex space-x-3"
        >
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