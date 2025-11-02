import { useRouter } from "next/navigation";

export default function NotFoundState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h2>
        <p className="text-purple-500 dark:text-purple-300 mb-6">Bài viết này không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => router.back()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}