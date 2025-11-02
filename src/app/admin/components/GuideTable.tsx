// app/admin/components/GuideTable.tsx
"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Guide } from "../types";

interface GuideTableProps {
  guides: Guide[];
  onEdit: (guide: Guide) => void;
  onDelete: (id: string) => void;
}

export default function GuideTable({ guides, onEdit, onDelete }: GuideTableProps) {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa bài báo này?")) return;
    onDelete(id);
  };

  return (
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
                {guide.title} 
                {guide.pinned && (
                  <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs ml-2">
                    GHIM
                  </span>
                )}
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
                <button 
                  onClick={() => onEdit(guide)} 
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center space-x-1"
                >
                  <Edit2 size={16} />
                  <span>Sửa</span>
                </button>
                <button 
                  onClick={(e) => handleDelete(e, guide.id)} 
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center space-x-1"
                >
                  <Trash2 size={16} />
                  <span>Xóa</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}