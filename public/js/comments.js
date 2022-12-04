('use strict');
const e = React.createElement;
class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            message: '',
        };
        console.log('constructor');

        // Парсим строку, извлекаем id новости
        this.newsId = parseInt(window.location.href.split('/').reverse()[1]);
        this.userId = +this.getCookie('userId');

        this.socket = io('http://localhost:3000', {
            query: {
                // Устанавливаем id новости, он потребуется серверу для назначения комнаты пользователю
                newsId: this.newsId
            }
        });
    };

    componentDidMount() {
        // Вызываем метод получения всех комментариев
        this.getAllComments();
        this.socket.emit('create', this.newsId.toString());
        this.socket.on('newComment', (message) => {
            const comments = this.state.comments;
            comments.push(message);
            this.setState(comments);
        });
        this.socket.on('deleteComment', (payload) => {
            const { id } = payload;
            // Оставляем комментарии, которые не равны удалённому id комментария
            const comments = this.state.comments.filter((c) => c.id !== id);
            this.setState({ comments });
        });
        this.socket.on('updateComment', (payload) => {
            const { id, comment } = payload;
            // Обновляем комментарий
            const comments = [...this.state.comments];
            const idx = comments.findIndex((c) => c.id === id);
            console.log('update', idx)
            if (idx > -1) {
                comments[idx] = comment;
                this.setState({ comments });
            }
        });
    }

    getCookie = (name) => {
        const cookies = document.cookie;
        const a = cookies.split('; ').find((row) => row.startsWith(`${name}=`));
        //console.log('a = ', cookies, a);
        if (a)
            return a.split('=')[1]
        else
            return '0';
    };

    // Метод получения всех комментариев
    getAllComments = async () => {
        let response = await fetch(
            `http://localhost:3000/users/roles/${this.userId}`,
            {
                method: 'GET',
            },
        );
        if (response.ok) {
            console.log('aaa', response);
            const roles = await response.json();
            console.log('this.roles', roles);
            const a = roles.roles.split(',');
            console.log('this.roles', a);
            this.isAdmin = a.includes('admin');
            console.log('this.isAdmin', this.isAdmin);
        }

        response = await fetch(
            `http://localhost:3000/comments/all?newsId=${this.newsId}`,
            {
                method: 'GET',
            },
        );
        if (response.ok) {
            const comments = await response.json();
            this.setState({ comments });
        }
    };

    onChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };
    sendMessage = () => {

        this.socket.emit('addComment', {
            newsId: this.newsId,
            message: this.state.message,
        });
    };

    deleteComment = (id) => {
        console.log('delete comment ', id);
        fetch(
            `http://localhost:3000/comments/${id}?newsId=${this.newsId}`,
            {
                method: 'DELETE',
            },
        );
    };

    render() {
        console.log('render', this.userId, this.newsId);

        return (
            <div>
                {this.state.comments.map((comment, index) => {
                    return (
                        <div key={comment + index} className="card mb-1">
                            <div className="card-body">
                                <strong>{comment.user.firstName}</strong>
                                <div>{comment.message}</div>
                                <div> {comment.user && (comment.user.id === this.userId || this.isAdmin) && (
                                    <button onClick={() => this.deleteComment(comment.id)}>
                                        Удалить
                                    </button>
                                )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <hr />
                <div>
                    <h6 className="lh-1 mt-3">Форма добавления комментариев</h6>
                    <div className="form-floating mb-1">
                        <textarea
                            className="form-control"
                            placeholder="Leave a comment here"
                            value={this.state.message}
                            name="message"
                            onChange={this.onChange}
                        ></textarea>
                        <label htmlFor="floatingmessagearea2">Комментарий</label>
                    </div>
                    <button
                        onClick={this.sendMessage}
                        className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);