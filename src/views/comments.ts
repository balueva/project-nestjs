import { Comment } from 'src/news/comments/comments.types';

export const commentsTemplate = (comments: Comment[]) => {
    if (comments?.length === 0)
        return `<p>Нет комментариев.</p>`;
    else {
        let html = '';
        comments.forEach(item => html += `<div><p>${item.text}</p><img src="http://localhost:3000/${item?.avatar}" class="card-img-bottom"></div>`)
        return html;
    }
};


