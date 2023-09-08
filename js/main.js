import { getComments } from "./api.js";
import { renderLogin } from "./loginPage.js";
import { renderComments } from "./renderComments.js";

// Код писать здесь



// COMMENTS нужно получать из хранилища данных
let comments = [];

// запрос GET
const fetchAndRenderTasks = () => {
	getComments().then((responseData) => {

		const appComments = responseData.comments.map((comment) => {
			return {
				name: comment.author.name,
				date: new Date(comment.date),
				likes: comment.likes,
				isLiked: false,
				text: comment.text,
			};
		});

		comments = appComments;
		renderComments({ comments, fetchAndRenderTasks });
	});
}


renderLogin({ fetchAndRenderTasks });


function delay(interval = 300) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, interval);
	});
}

export const initEventListeners = () => {

	const buttonElements = document.querySelectorAll('.like-button');

	for (const buttonElement of buttonElements) {
		buttonElement.addEventListener('click', (event) => {
			// тормозим цепочку распростронения событий 
			event.stopPropagation();
			// индекс = номер обьекта в массиве, получаем из дата атрибута кнопки на которую нажимаем
			const index = buttonElement.dataset.index;

			// Пример использования:
			delay(2000).then(() => {
				if (comments[index].isLiked) {
					comments[index].isLiked = false;
					comments[index].likes--;
				} else {
					comments[index].isLiked = true;
					comments[index].likes++;
				}
				renderComments({ comments, fetchAndRenderTasks });
			});

			renderComments({ comments, fetchAndRenderTasks });
		});
	}


	// создаю коллекцию коменнтариев
	const answerElements = document.querySelectorAll('.comment');

	for (const answer of answerElements) {
		answer.addEventListener('click', () => {

			const index = answer.dataset.index;
			// вариант со звездой
			nameTextAreaElement.value = `QUOTE_BEGIN${comments[index].name}:\n${comments[index].text}QUOTE_END`;
		});
	}
};


export function functionEdit() {
	const commentEditText = document.querySelector('.comment-edit-text');

	const editElements = document.querySelectorAll('.edits');

	for (const edit of editElements) {
		edit.addEventListener('click', () => {
			// event.stopPropagation();

			const index = edit.dataset.index;
			console.log(index);

			if (comments[index].isEdit) {
				comments[index].isEdit = false;
				comments[index].text = commentEditText.value;
			} else {
				comments[index].isEdit = true;
			}

			renderComments({ comments, fetchAndRenderTasks });
		});
	}
}

fetchAndRenderTasks();





