import { Comment } from 'src/news/comments/comments.types';

export const commentsTemplate = (comments: Comment[]) => {
    if (comments?.length === 0)
        return `<p>Нет комментариев.</p>`;
    else {
        let html = '';
        comments.forEach(item => html += `<p>${item.text}</p>`)
        return html;
    }
};


