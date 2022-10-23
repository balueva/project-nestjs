export type Comment = {
    id: string;
    text: string
}

export type UserComment = Omit<Comment, 'id'>;