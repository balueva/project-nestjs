import { News } from '../news/news.types';
import { Comment } from 'src/news/comments/comments.types';
import { commentsTemplate } from './comments';

export const newsTemplate = (news: News, comments: Comment[]) => {
    return `<div class="row">
             <div class="col-lg-10">
               <div class="card">
                 <div class="card-body">
                   <h5 class="card-title">${news.title}</h5>
                   <h6 class="card-subtitle mb-2 text-muted">
                     Автор: ${news.author}
                   </h6>
                   <h6 class="card-subtitle mb-2 text-muted">
                     Дата создания: ${news.createdAt.toLocaleString('ru-RU')}
                   </h6>
                   <p class="card-text">${news.description}</p>
                   <div>
                     ${commentsTemplate(comments)}
                   </div>
                 </div>                 
               </div>
             </div>             
           </div>`
};