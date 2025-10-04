"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { Plus, Edit2, Trash2, Eye, LogOut, X, Save, ChevronDown, ChevronUp } from "lucide-react";

interface SubSection {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  image?: string;
  subSections: SubSection[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  mainContentImages?: string[];
  sections: Section[];
  createdAt: Timestamp;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGuides();
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
          createdAt: data.createdAt as Timestamp
        };
      });
      setGuides(guidesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    } catch (err) {
      console.error("Lỗi khi lấy bài báo:", err);
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
    } else {
      setEditingGuide(null);
      setTitle("");
      setDescription("");
      setContent("");
      setImage("");
      setMainContentImages([]);
      setSections([]);
      setExpandedSections(new Set());
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
  };

  const addSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      content: "",
      image: "",
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

  const addSubSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.stopPropagation();
    const newSubSection: SubSection = {
      id: Date.now().toString(),
      title: "",
      content: "",
      image: ""
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

  const removeSubSection = (e: React.MouseEvent, sectionId: string, subSectionId: string) => {
    e.stopPropagation();
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, subSections: section.subSections.filter(sub => sub.id !== subSectionId) }
        : section
    ));
  };

  const toggleSection = (e: React.MouseEvent, sectionId: string) => {
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
      // ✅ FIXED: Lưu tất cả các trường, kể cả khi rỗng
      // Lọc bỏ ảnh rỗng trong mainContentImages
      const filteredMainContentImages = mainContentImages.filter(img => img.trim() !== "");
      
      // Lọc bỏ sections rỗng và subsections rỗng
      const filteredSections = sections
        .filter(section => section.title.trim() !== "" || section.content.trim() !== "")
        .map(section => ({
          ...section,
          title: section.title.trim(),
          content: section.content.trim(),
          image: section.image?.trim() || "",
          subSections: section.subSections
            .filter(sub => sub.title.trim() !== "" || sub.content.trim() !== "")
            .map(sub => ({
              ...sub,
              title: sub.title.trim(),
              content: sub.content.trim(),
              image: sub.image?.trim() || ""
            }))
        }));

      const guideData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(), // ✅ Luôn lưu, kể cả khi rỗng
        image: image.trim(),
        mainContentImages: filteredMainContentImages,
        sections: filteredSections,
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
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
              <p className="text-purple-300 mt-2">Đăng nhập để quản lý bài viết</p>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
            
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
            
            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-purple-500/30"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-purple-300 text-sm mt-1">Quản lý bài viết</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => openModal(e)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-lg shadow-purple-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm bài báo</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Tổng bài viết</p>
                <p className="text-3xl font-bold text-white mt-1">{guides.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Guides List */}
        <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-bold text-white">Danh sách bài viết</h2>
          </div>
          
          {guides.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-purple-300 text-lg">Chưa có bài viết nào</p>
              <button
                onClick={(e) => openModal(e)}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
              >
                Thêm bài viết đầu tiên
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40">
                  <tr>
                    <th className="text-left p-4 text-purple-300 font-semibold">Ảnh</th>
                    <th className="text-left p-4 text-purple-300 font-semibold">Tiêu đề</th>
                    <th className="text-left p-4 text-purple-300 font-semibold">Mô tả</th>
                    <th className="text-center p-4 text-purple-300 font-semibold">Sections</th>
                    <th className="text-right p-4 text-purple-300 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.map((guide) => (
                    <tr key={guide.id} className="border-t border-purple-500/10 hover:bg-white/5 transition">
                      <td className="p-4">
                        <img
                          src={guide.image}
                          alt={guide.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                        />
                      </td>
                      <td className="p-4">
                        <p className="text-white font-semibold line-clamp-1">{guide.title}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-purple-300 text-sm line-clamp-2">{guide.description}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                          {guide.sections?.length || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => openModal(e, guide)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 p-2 rounded-lg transition"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, guide.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 p-2 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-purple-300 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">
              {editingGuide ? "Sửa bài viết" : "Thêm bài viết"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tiêu đề */}
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-semibold">Tiêu đề</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-semibold">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                  rows={2}
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-semibold">Ảnh đại diện</label>
                <input
                  type="text"
                  placeholder="https://example.com/hero.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Main Content Images */}
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-semibold">Ảnh nội dung chính</label>
                <div className="flex flex-col space-y-2">
                  {mainContentImages.map((img, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...mainContentImages];
                          newImages[index] = e.target.value;
                          setMainContentImages(newImages);
                        }}
                        className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setMainContentImages(mainContentImages.filter((_, i) => i !== index))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setMainContentImages([...mainContentImages, ""])}
                    className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm ảnh</span>
                  </button>
                </div>
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-semibold">Nội dung</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                  rows={4}
                />
              </div>

              {/* Sections */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-purple-300 font-semibold">Sections</label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center space-x-1 text-sm text-green-300 hover:text-green-400 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm section</span>
                  </button>
                </div>

                {sections.map(section => (
                  <div key={section.id} className="border border-purple-500/30 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Tiêu đề section"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, "title", e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                      />
                      <div className="flex items-center space-x-1">
                        <button type="button" onClick={(e) => toggleSection(e, section.id)} className="text-purple-300 hover:text-white">
                          {expandedSections.has(section.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button type="button" onClick={(e) => removeSection(e, section.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="pl-2 space-y-2">
                        <textarea
                          placeholder="Nội dung section"
                          value={section.content}
                          onChange={(e) => updateSection(section.id, "content", e.target.value)}
                          className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                          rows={2}
                        />
                        <input
                          type="text"
                          placeholder="Ảnh section"
                          value={section.image}
                          onChange={(e) => updateSection(section.id, "image", e.target.value)}
                          className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                        />

                        {/* Subsections */}
                        <div className="pl-2">
                          {section.subSections.map(sub => (
                            <div key={sub.id} className="flex items-center space-x-2 mb-1">
                              <input
                                type="text"
                                placeholder="Tiêu đề subsection"
                                value={sub.title}
                                onChange={(e) => updateSubSection(section.id, sub.id, "title", e.target.value)}
                                className="flex-1 p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                              />
                              <button type="button" onClick={(e) => removeSubSection(e, section.id, sub.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={(e) => addSubSection(e, section.id)}
                            className="flex items-center space-x-1 text-sm text-green-300 hover:text-green-400 transition"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Thêm subsection</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-purple-500/30 flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Lưu bài viết</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}