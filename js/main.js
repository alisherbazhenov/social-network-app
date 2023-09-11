import { getComments } from "./api.js";
import { renderComments } from "./renderComments.js";


// Код писать здесь


// COMMENTS нужно получать из хранилища данных
let comments = [];


const RUDate = Intl.DateTimeFormat();

// запрос GET
function fetchAndRenderTasks() {

	getComments().then((responseData) => {

		const appComments = responseData.comments.map((comment) => {
			return {
				name: comment.author.name,
				date: RUDate.format(new Date(comment.date)),
				likes: comment.likes,
				isLiked: false,
				text: comment.text,
			};
		});

		comments = appComments;

		renderComments({ comments, fetchAndRenderTasks, name: window.userName });


	});
}


fetchAndRenderTasks();






