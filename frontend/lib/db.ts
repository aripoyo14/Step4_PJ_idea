// Mock database for demonstration purposes
// In a real application, this would be replaced with actual database queries

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  bio?: string;
  skills?: string[];
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  authorId: string;
  likes: string[]; // User IDs who liked
  joinRequests: string[]; // User IDs who requested to join
  tags: string[];
  createdAt: Date;
  status: 'open' | 'in-progress' | 'completed';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  ideaId: string;
  teamMemberIds: string[]; // User IDs of team members
  images: string[];
  createdAt: Date;
}

// Mock data
export const users: User[] = [
  {
    id: '1',
    name: '田中 太郎',
    email: 'tanaka@example.com',
    password: 'password123',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'UI/UXデザイナーとして5年の経験があります。ユーザー中心のデザインを心がけています。',
    skills: ['UIデザイン', 'プロトタイピング', 'ユーザーリサーチ'],
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato@example.com',
    password: 'password123',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'フルスタックエンジニアとしてReactとNode.jsを専門としています。',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    createdAt: new Date('2023-02-10')
  },
  {
    id: '3',
    name: '山田 一郎',
    email: 'yamada@example.com',
    password: 'password123',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'プロダクトマネージャーとしてソフトウェア製品の市場投入を担当しています。',
    skills: ['プロダクト戦略', 'アジャイル', '分析'],
    createdAt: new Date('2023-03-05')
  }
];

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'AI搭載の語学学習アプリ',
    description: 'ユーザーの興味や学習スタイルに基づいて、AIが個別の学習パスを作成する革新的な語学学習アプリケーションを開発します。',
    category: '教育',
    authorId: '1',
    likes: ['2', '3'],
    joinRequests: ['2'],
    tags: ['AI', '教育', 'モバイルアプリ'],
    createdAt: new Date('2023-06-15'),
    status: 'open'
  },
  {
    id: '2',
    title: 'サステナブルファッションマーケットプレイス',
    description: 'エコフレンドリーなファッションデザイナーと環境意識の高い消費者をつなぐプラットフォームを構築します。',
    category: 'Eコマース',
    authorId: '2',
    likes: ['1', '3'],
    joinRequests: ['3'],
    tags: ['サステナビリティ', 'Eコマース', 'ファッション'],
    createdAt: new Date('2023-07-20'),
    status: 'in-progress'
  },
  {
    id: '3',
    title: '地域密着型高齢者ケアサービス',
    description: '高齢者と地域のボランティア、各種サービスを結びつけるアプリケーションを開発します。',
    category: '医療・健康',
    authorId: '3',
    likes: ['1'],
    joinRequests: ['1'],
    tags: ['医療', 'コミュニティ', '社会貢献'],
    createdAt: new Date('2023-08-05'),
    status: 'open'
  },
  {
    id: '4',
    title: 'AR歴史ガイドツアー',
    description: '文化遺産を訪れる際に、ARを通じて歴史的な文脈やストーリーを提供するアプリケーションです。',
    category: '観光',
    authorId: '1',
    likes: ['2'],
    joinRequests: [],
    tags: ['AR', '観光', '歴史', 'モバイルアプリ'],
    createdAt: new Date('2023-09-10'),
    status: 'open'
  },
  {
    id: '5',
    title: 'スマートホームエネルギー管理システム',
    description: '家庭のエネルギー使用パターンを学習し、再生可能エネルギーと連携して最適化を行うシステムを開発します。',
    category: 'テクノロジー',
    authorId: '2',
    likes: ['3'],
    joinRequests: ['3'],
    tags: ['IoT', 'エネルギー', 'スマートホーム'],
    createdAt: new Date('2023-10-15'),
    status: 'completed'
  }
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'エコファッションマーケットプレイス立ち上げ',
    description: '50名のデザイナーと500以上の商品を揃えた、サステナブルファッションのマーケットプレイスを成功裏にローンチしました。',
    ideaId: '2',
    teamMemberIds: ['2', '3'],
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    title: 'スマートホームエネルギーシステムベータ版',
    description: '20世帯でベータテストを実施し、平均30%のエネルギー削減を達成したスマートホームエネルギー管理システムを完成させました。',
    ideaId: '5',
    teamMemberIds: ['2', '3', '1'],
    images: [
      'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4792731/pexels-photo-4792731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: new Date('2024-02-20')
  }
];

// Helper functions for data operations
export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function getIdeaById(id: string): Idea | undefined {
  return ideas.find(idea => idea.id === id);
}

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(achievement => achievement.id === id);
}

export function getIdeasByAuthor(authorId: string): Idea[] {
  return ideas.filter(idea => idea.authorId === authorId);
}

export function getAchievementsByTeamMember(userId: string): Achievement[] {
  return achievements.filter(achievement => achievement.teamMemberIds.includes(userId));
}