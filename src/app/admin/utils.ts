// app/admin/utils.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "@/firebase";

export const uploadImage = async (
  file: File, 
  path: string,
  setUploading: (value: boolean) => void
): Promise<string> => {
  try {
    setUploading(true);
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${path}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, fileName);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: auth.currentUser?.email || 'unknown',
        uploadedAt: new Date().toISOString()
      }
    };
    
    const uploadResult = await uploadBytes(storageRef, file, metadata);
    console.log('Upload success:', uploadResult);
    
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error: unknown) {
    console.error("Upload error details:", error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string; message?: string };
      
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

export const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  callback: (url: string) => void,
  path: string,
  setUploading: (value: boolean) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file ảnh!');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('File quá lớn! Tối đa 5MB');
    return;
  }

  try {
    const url = await uploadImage(file, path, setUploading);
    callback(url);
  } catch (error) {
    console.error(error);
  }
};