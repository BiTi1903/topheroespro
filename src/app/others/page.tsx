export default function OthersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Các mục khác</h1>
      <p className="mt-4 text-gray-700">
        {`Đây là trang tổng hợp cho chuyên mục "Others".`}
      </p>

      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>
          <a href="/others/guide" className="text-blue-600 hover:underline">
            Hướng dẫn đặc biệt
          </a>
        </li>
        <li>
          <a href="/others/tips" className="text-blue-600 hover:underline">
            Tips nhỏ hữu ích
          </a>
        </li>
      </ul>
    </div>
  );
}
