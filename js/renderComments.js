import { postComment, token } from "./api.js";
import { initEventListeners, functionEdit } from "./main.js";

const listElement = document.getElementById('list');

export const renderComments = ({ comments, fetchAndRenderTasks }) => {
	const commentsHtml = comments.map((comment, index) => {
		return `<li class="comment" data-index='${index}'>
					<div class="comment-header">
						<div>${comment.name}</div>
						<div>${comment.date}</div>
					</div>
					<div class="comment-body">
						${comment.isEdit ? `<textarea class='add-form-text comment-edit-text'>${comment.text}</textarea>` : `<div class="comment-text" style="white-space:pre-line">
							${comment.text}
						</div>`}
					</div>
					<button class="add-form-button edits" data-index='${index}'>${comment.isEdit ? 'Сохранить' : 'Редактировать'}</button>
					<div class="comment-footer">
						<div class="likes">
							<span class="likes-counter">${comment.likes}</span>
							<button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index='${index}'>
							</button>
						</div>
					</div>
				</li>`;
	}).join('');

	const appElement = document.getElementById("app");
	const appHtml = `
		<div class="container">
		<div id="container-preloader">Пожалуйста подождите, загружаю комментарии..</div>
		<ul class="comments" id="list">${commentsHtml}
		</ul>
		<div id="container-preloader-post"></div>
		${token ? `<div class="add-form">
			<input type="text" class="add-form-name" placeholder="Введите ваше имя" value="" />
			<textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
			<div class="add-form-row">
				<button class="add-form-button" id="add-button">Написать</button>
			</div>
		</div>` : `<div class="authorization">Чтобы добавить комментарий, <a class="authorization-link" href="login.html">авторизуйтесь</a></div>`}
	</div> 
	`;

	appElement.innerHTML = appHtml;


	const btnElement = document.getElementById('add-button');
	const nameInputElement = document.querySelector('.add-form-name');
	const nameTextAreaElement = document.querySelector('.add-form-text');
	// const myDate = new Date().toLocaleDateString().slice(0, 6) + new Date().toLocaleDateString().slice(-2);
	// const nowDate = myDate + ' ' + new Date().toLocaleTimeString().slice(0, -3);


	const containerPreloaderPost = document.getElementById('container-preloader-post');
	const addFormElement = document.querySelector('.add-form');
	const likeBtnElement = document.querySelectorAll('.like-button');

	initEventListeners();
	functionEdit();
	btnElementInit(btnElement, nameInputElement, nameTextAreaElement, addFormElement, fetchAndRenderTasks);


}

function btnElementInit(btnElement, nameInputElement, nameTextAreaElement, addFormElement, fetchAndRenderTasks) {
	console.log(btnElement);
	btnElement.addEventListener('click', () => {
		console.log('a');
		nameInputElement.classList.remove('error');
		nameTextAreaElement.classList.remove('error');


		if (nameInputElement.value === '') {
			nameInputElement.classList.add('error');
			return;
		}
		if (nameTextAreaElement.value === '') {
			nameTextAreaElement.classList.add('error');
			return;
		}
		// скрываем форму отправки
		addFormElement.classList.add('form-none');


		// подписываемся на успешное завершение запроса с помощью then
		const addTodo = () => {
			// containerPreloaderPost.textContent = 'Добавляется комментарий...';

			postComment({
				text: nameTextAreaElement.value,
				name: nameInputElement.value,
			}).then((responseData) => {
				return fetchAndRenderTasks();
			})
				.then((data) => {
					// containerPreloaderPost.textContent = '';
					addFormElement.classList.remove('form-none');
					nameInputElement.value = '';
					nameTextAreaElement.value = '';
				})
				.catch((error) => {
					// containerPreloaderPost.textContent = '';
					addFormElement.classList.remove('form-none');

					if (error.message === 'Неверный запрос!') {
						alert('Имя и комментарий должны быть не короче 3 символов');
					} else if (error.message === "Ошибка сервера") {
						alert('Сервер сломался, попробуй позже');
						addTodo();
					} else {
						console.error(error);
					}
				})
		}

		addTodo();

	});
}
