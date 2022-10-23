export type News = {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: Date
}

export type UserDataNews = Omit<News, 'id' | 'createdAt' | 'comments'>;