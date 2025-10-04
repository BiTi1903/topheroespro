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
  pinned?: boolean; // ✅ thêm pinned
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
  const [pinned, setPinned] = useState<boolean>(false); // ✅ trạng thái ghim

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
          createdAt: data.createdAt as Timestamp,
          pinned: data.pinned || false, // ✅ lấy pinned
        };
      });
      setGuides(guidesData.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt.seconds - a.createdAt.seconds; // mới nhất tiếp theo
      }));
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
      setPinned(guide.pinned || false); // ✅ set pinned khi sửa
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
      const filteredMainContentImages = mainContentImages.filter(img => img.trim() !== "");
      
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
        content: content.trim(),
        image: image.trim(),
        mainContentImages: filteredMainContentImages,
        sections: filteredSections,
        pinned, // ✅ lưu pinned
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
        <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
          <LogOut size={18} /> <span>Đăng xuất</span>
        </button>
      </div>

      <button onClick={(e) => openModal(e)} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4">
        <Plus size={18} /> <span>Thêm Bài Mới</span>
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">Tiêu đề</th>
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
                        <input type="text" placeholder="Link ảnh" value={section.image} onChange={(e) => updateSection(section.id, "image", e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />

                        <div className="ml-4">
                          <h4 className="font-semibold">SubSections</h4>
                          {section.subSections.map(sub => (
                            <div key={sub.id} className="mb-2 border border-gray-600 p-2 rounded">
                              <input type="text" placeholder="Tiêu đề" value={sub.title} onChange={(e) => updateSubSection(section.id, sub.id, "title", e.target.value)} className="w-full p-1 rounded bg-gray-800 border border-gray-700 mb-1" />
                              <textarea placeholder="Nội dung" value={sub.content} onChange={(e) => updateSubSection(section.id, sub.id, "content", e.target.value)} className="w-full p-1 rounded bg-gray-800 border border-gray-700 mb-1"></textarea>
                              <input type="text" placeholder="Link ảnh" value={sub.image} onChange={(e) => updateSubSection(section.id, sub.id, "image", e.target.value)} className="w-full p-1 rounded bg-gray-800 border border-gray-700 mb-1" />
                              <button type="button" onClick={(e) => removeSubSection(e, section.id, sub.id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex items-center space-x-1"><Trash2 size={16} /> Xóa Sub</button>
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
    </div>
  );
}
