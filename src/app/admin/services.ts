// app/admin/services.ts
import { db } from "@/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  Timestamp,
  query,
  orderBy 
} from "firebase/firestore";
import { Guide, Category, Section } from "./types";

export const fetchGuides = async (): Promise<Guide[]> => {
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
    return guidesData.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt.seconds - a.createdAt.seconds;
    });
  } catch (err) {
    console.error("Lỗi khi lấy bài báo:", err);
    return [];
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
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
    return categoriesData;
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    return [];
  }
};

export const addCategory = async (name: string): Promise<{ id: string; name: string; createdAt: Timestamp }> => {
  const docRef = await addDoc(collection(db, "categories"), {
    name: name.trim(),
    createdAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    name: name.trim(),
    createdAt: Timestamp.now(),
  };
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await deleteDoc(doc(db, "categories", categoryId));
};

export const saveGuide = async (
  guideData: {
    title: string;
    description: string;
    content: string;
    image: string;
    mainContentImages: string[];
    sections: Section[];
    category: string;
    game: string;
    pinned: boolean;
  },
  editingGuideId?: string
): Promise<void> => {
  const filteredMainContentImages = guideData.mainContentImages.filter(img => img.trim() !== "");
  
  const filteredSections = guideData.sections
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

  const data = {
    title: guideData.title.trim(),
    description: guideData.description.trim(),
    content: guideData.content.trim(),
    image: guideData.image.trim(),
    mainContentImages: filteredMainContentImages,
    sections: filteredSections,
    category: guideData.category,
    game: guideData.game.trim(),
    pinned: guideData.pinned,
    updatedAt: serverTimestamp(),
  };

  if (editingGuideId) {
    await updateDoc(doc(db, "guides", editingGuideId), data);
  } else {
    await addDoc(collection(db, "guides"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
};

export const deleteGuide = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "guides", id));
};