let TodoesArr = JSON.parse(sessionStorage.getItem('TodoesArr')) || [];
let filterOption = "";
let keyWord;

const setSessionStorage = () => {
	sessionStorage.setItem('TodoesArr', JSON.stringify(TodoesArr))
}
const getSessionStorage = () => {
	let TodoesArr = JSON.parse(sessionStorage.getItem('TodoesArr'))
	useFilter(filterOption, TodoesArr, keyWord);
	return TodoesArr
}
function Todo(todoText) {
	this.text = todoText;
	this.isDone = false;
	this.id = String(Date.now());
}
// ! ЭЛЕМЕНТЫ ПОИСКА ПО СЛОВУ
const searchInput = document.querySelector(".search__todoes");
const setKeyWord = () => {
	keyWord = searchInput.value.toLowerCase();
	useFilter(filterOption, TodoesArr, keyWord);
};
searchInput.addEventListener("keyup", setKeyWord);
// ! ЭЛЕМЕНТЫ ФИЛЬТРА
const filter = document.querySelector(".filter");
const filterArr = document.querySelectorAll(".filter__item");
//  ! ЭЛЕМЕНТЫ ПОЛЯ ВЫВОДА ТУДУШЕК
const todoesContent = document.querySelector(".todoes__content");
// ! ЭЛЕМЕНТЫ ВВОДА ТУДУШЕК
const todoesInput = document.querySelector(".todoes__input");
const todoesButton = document.querySelector(".todoes__button");
const createElWithClass = (element, elClass) => {
	const newElement = document.createElement(element);
	newElement.classList.add(elClass);
	return newElement;
};
const createToolsIMG = (element, elClass, src, alt) => {
	const newElement = createElWithClass(element, elClass);
	newElement.src = src;
	newElement.alt = alt;
	return newElement;
};
const renderTodoes = (todo) => {
	let ul = document.querySelector(".todoes__list");
	// ! основные элементы
	if (todoesContent.children[0] == ul) {
		ul.remove();
	}
	let todoesList = createElWithClass("ul", "todoes__list");
	todoesContent.appendChild(todoesList);
	for (let i = 0; i < todo.length; i++) {
		let todoItem = createElWithClass("li", "todoes__items");
		todoItem.id = todo[i].id;
		todo[i].isDone && todoItem.classList.add("done");
		let todoesText = createElWithClass("span", "todoes__text");
		todoesText.textContent = `${i + 1}) ${todo[i].text}`;
		let todoesChangeField = createElWithClass("input", "todoes__changeField");
		todoesChangeField.type = "text";
		todoesChangeField.classList.add("hidden");
		let todoesTools = createElWithClass("span", "todoes__tools");
		// ! Кнопки внути спана для изменения или удаления Айтема
		let todoesChanger = createElWithClass("button", "todoes__change");
		todoesChanger.classList.add("tools");
		let todoesDelete = createElWithClass("button", "todoes__delete");
		todoesDelete.classList.add("tools");
		let todoesCheckbox = document.createElement("input");
		todoesCheckbox.type = "checkbox";
		todoesCheckbox.checked = todo[i].isDone;
		// ! картинки внутри тулзов
		let changerImg = createToolsIMG(
			"img",
			"change__img",
			"./pencil.png",
			"редактировать"
		);
		let deleteImg = createToolsIMG(
			"img",
			"delete__img",
			"./trashBin.png",
			"редактировать"
		);
		// ! Запихиваем Элементы друг в друга ))
		todoesChanger.appendChild(changerImg);
		todoesDelete.appendChild(deleteImg);
		todoesTools.appendChild(todoesChanger);
		todoesTools.appendChild(todoesDelete);
		todoesTools.appendChild(todoesCheckbox);
		todoItem.appendChild(todoesText);
		todoItem.appendChild(todoesChangeField);
		todoItem.appendChild(todoesTools);
		todoesList.appendChild(todoItem);
		// ! ДОБАВЛЯЕМ АКТИВНОСТЬ
		// ! УДАЛЕНИЕ ЭЛЕМЕНТОВ
		const deleteTodoes = () => {
			for (let item of TodoesArr) {
				if (todoItem.id === item.id) {
					TodoesArr.splice(TodoesArr.indexOf(item), 1);
					setKeyWord(filterOption, TodoesArr, keyWord);
					setSessionStorage(TodoesArr)
					console.log('удаление')
				}
			}
		};
		todoesDelete.addEventListener("click", deleteTodoes);
		// ! ОТМЕЧАЕМ ВЫПОЛНЕННЫЕ ЗАДАНИЯ
		const toggleDoneTodoes = () => {
			for (let item of TodoesArr) {
				if (todoItem.id === item.id) {
					item.isDone = !item.isDone;
					setKeyWord(filterOption, TodoesArr, keyWord);
				}
			}
		};
		todoesCheckbox.addEventListener("change", toggleDoneTodoes);
		// ! РЕДАКТИРОВАНИЕ ТЕКСТА
		const changeTodoesText = () => {
			for (let item of TodoesArr) {
				if (todoItem.id === item.id) {
					todoesText.classList.add("hidden");
					todoesChangeField.classList.remove("hidden");
					todoesChangeField.value = item.text;
					todoesChangeField.focus()
				}
			}
		};
		todoesChanger.addEventListener("click", changeTodoesText);
		// ! СОХРАНЕНИЕ РЕДАКТИРОВАНИЯ
		const saveChanges = () => {
			for (let item of TodoesArr) {
				if (todoItem.id === item.id) {
					item.text = todoesChangeField.value;
					todoesChangeField.classList.add("hidden");
					todoesText.classList.remove("hidden");
				}
			}
			setKeyWord(filterOption, TodoesArr, keyWord);
		};
		todoesChangeField.addEventListener("blur", saveChanges);
		todoesChangeField.addEventListener("keyup", (event) => {
			if (event.keyCode === 13 && todoesChangeField.focus) {
				saveChanges()
			}
		});
		setSessionStorage()
	}
};
renderTodoes(TodoesArr)
//! СОЗДАНИЕ ЭЛЕМЕНТА СПИСКА
const addTask = () => {
	if (!todoesInput.value) {
		return alert("Введите текст задачи");
	}
	const todo = new Todo(todoesInput.value);
	TodoesArr = [...TodoesArr, todo]
	setKeyWord(filterOption, TodoesArr, keyWord);;
	todoesInput.value = "";
}

todoesButton.addEventListener("click", addTask);
// ! ДОБАВЛЯЕМ ТАСКУ ПРИ НАЖАТИИ ENTER
todoesInput.addEventListener("keyup", (event) => {
	if (event.keyCode === 13 && todoesInput.focus) {
		addTask()
	}
});
//! ИЗМЕНЕНИЕ АКТИВНОГО ФИЛЬТРА
const changeFilter = (event) => {

	for (let i = 0; i < filterArr.length; i++) {
		if (filterArr[i].classList.contains("active") && event.target !== filter) {
			filterArr[i].classList.remove("active");
		}
	}

	for (let i = 0; i < filterArr.length; i++) {
		if (event.target === filterArr[i]) {
			filterArr[i].classList.add("active");
			filterOption = filterArr[i].textContent;
		}
	}
	setKeyWord(filterOption, TodoesArr, keyWord);
};
// ! ПРИМЕНЕНИЕ ФИЛЬТРА
const useFilter = (filterOption, TodoesArr, keyWord) => {
	switch (filterOption) {
		case "Выполненные":
			let filteredDoneArr = TodoesArr.filter(
				(item) => item.isDone && item.text.toLowerCase().includes(keyWord)
			);
			renderTodoes(filteredDoneArr);
			break;
		case "Не выполненные":
			let filteredNotDoneArr = TodoesArr.filter(
				(item) => !item.isDone && item.text.toLowerCase().includes(keyWord)
			);
			renderTodoes(filteredNotDoneArr);
			break;
		default:
			let folterByKeyWord = TodoesArr.filter(
				(item) =>
					(item.isDone || !item.isDone) && item.text.toLowerCase().includes(keyWord)
			);
			renderTodoes(folterByKeyWord);
			break;
	}
};
filter.addEventListener("click", (event) => changeFilter(event));