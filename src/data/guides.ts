export interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  views: string;
  time: string;
  category: string;
  description: string;
  content: string;
}

export const  guides: Guide[] = [
  {
    id: '1',
    title: 'Hướng dẫn build nhân vật mạnh nhất cho người mới',
    game: 'Genshin Impact',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    views: '15.2K',
    time: '10 phút đọc',
    category: 'RPG',
    description: 'Mẹo cơ bản để build nhân vật mạnh nhất.',
    content: 'Nội dung chi tiết về cách build nhân vật mạnh nhất...'
  },
  {
    id: '2',
    title: 'Top 10 combo skill đánh team fight hiệu quả',
    game: 'League of Legends',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop',
    views: '8.7K',
    time: '8 phút đọc',
    category: 'MOBA',
    description: 'Combo skill hiệu quả khi giao tranh team.',
    content: 'Chi tiết về combo skill và cách sử dụng trong trận đấu...'
  },
];
