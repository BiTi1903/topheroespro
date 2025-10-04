export default function Newsletter() {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-2">Đăng ký nhận tin</h3>
      <p className="text-purple-200 text-sm mb-4">
        Nhận thông báo về hướng dẫn mới và tips độc quyền
      </p>
      <input
        type="email"
        placeholder="Email của bạn"
        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 outline-none focus:border-purple-500 mb-3"
      />
      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
        Đăng ký
      </button>
    </div>
  );
}
