const boxBloc = document.querySelector('.box-bloc');
const closeNewBloc = document.querySelectorAll('.close-new-bloc');
const form = document.querySelector('#form');
const formEdit = document.querySelector('#formEdit');
const listAppend = document.querySelector('.article-bloc-note');
const createNewBlocNote = document.querySelector('.create-new-bloc-note');
const addBloc = document.querySelector('.add-new-bloc');
const editBloc = document.querySelector('.edit-bloc');

function showBox() {
    boxBloc.classList.add('box-action');
    document.body.style = `overflow: hidden;`;
}
function hideBox() {
    boxBloc.classList.remove('box-action');
    document.body.style = `overflow-x: hidden;`;
}
function editBox() {
    boxBloc.classList.add('box-action');
    document.body.style = `overflow: hidden;`;
    addBloc.style.display = "none";
    editBloc.style.display = "block";
}

let blocs = JSON.parse(localStorage.getItem("notes")) || [];

let IdBloc = blocs.length > 0 ? Math.max(...blocs.map(bloc => bloc.id)) + 1 : 1;
// let IdTask = tasks.length > 0 ? Math.max(...tasks.map(u => u.id)) + 1 : 1;

function saveElementBlocs() {
    localStorage.setItem("notes", JSON.stringify(blocs));
}

function showAllBlocs(listes = blocs) {
    listAppend.innerHTML = "";
    listes.forEach(bloc => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3 class="title-bloc">${bloc.title}</h3>
            <p class="text-bloc">${bloc.text}</p>
            <div class="action-time">
                <small>${bloc.time}</small>
                <div class="management">
                    <button class="show-manager"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="more-action">
                        <button class="edit-btn">Modifier</button>
                        <button class="" onclick="del(${bloc.id})">Supprimer</button>
                    </div>
                </div>
            </div>
        `;

        li.querySelector('.show-manager').addEventListener('click', () => {
            li.querySelector('.more-action').classList.toggle('menu');
        });

        li.querySelector('.edit-btn').addEventListener('click', () => {
            edit(bloc.id, bloc.title, bloc.text);
        })

        listAppend.prepend(li);
    });
}

function addNewBloc(title, text, time) {
    if (blocs.some(bloc => bloc.title === title)) {
        alert("Un bloc existe déja sur ce titre !");
        return;
    } else if (blocs.some(bloc => bloc.text === text)) {
        alert("Ce texte a déja été ajouté !");
        return;
    } else {
        blocs.push({
            id: IdBloc,
            title,
            text,
            time
        });
    }

    hideBox();
    saveElementBlocs();
    showAllBlocs();
}

function edit(id, title, text) {
    editBox();
    let titleEdit = document.querySelector('#formEdit input');
    let textEdit = document.querySelector('#formEdit textarea');

    titleEdit.value = title;
    textEdit.value = text;

    formEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        let newTitleEdit = document.querySelector('#formEdit input').value;
        let newTextEdit = document.querySelector('#formEdit textarea').value;
        let dateTime = new Date();
        let y = dateTime.getFullYear(), m = String(dateTime.getMonth() + 1).padStart(2, '0'), d = String(dateTime.getDate()).padStart(2, '0'), min = String(dateTime.getMinutes()).padStart(2, '0'), h = String(dateTime.getHours()).padStart(2, '0');
        let time = `${d}/${m}/${y} - ${h}:${min}`;

        if (newTitleEdit.trim() == "" || newTextEdit.trim() == "") {
            hideBox();
            return;
        } else {

            let index = blocs.findIndex(bloc => bloc.id === id);

            if (index !== -1) {
                blocs.splice(index, 1);
                blocs.push ({
                    id: IdBloc,
                    title: titleEdit.value,
                    text: textEdit.value,
                    time
                });
            }

        }

        hideBox();
        saveElementBlocs();
        showAllBlocs();

        form.reset();
        location.reload();
    })
}

function del(id) {
    blocs = blocs.filter(bloc => bloc.id !== id);

    saveElementBlocs();
    showAllBlocs();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = document.querySelector('#form input').value;
    let text = document.querySelector('#form textarea').value;
    let dateTime = new Date();
    let y = dateTime.getFullYear(), m = String(dateTime.getMonth() + 1).padStart(2, '0'), d = String(dateTime.getDate()).padStart(2, '0'), min = String(dateTime.getMinutes()).padStart(2, '0'), h = String(dateTime.getHours()).padStart(2, '0');
    let time = `${d}/${m}/${y} - ${h}:${min}`;

    if (title.trim() == "" || text.trim() == "") {
        hideBox();
        return;
    } else {
        addNewBloc(title, text, time);
    }

    form.reset();
    location.reload();
});

createNewBlocNote.addEventListener('click', showBox);
closeNewBloc.forEach(closes => {
    closes.addEventListener('click', hideBox);
});

showAllBlocs();