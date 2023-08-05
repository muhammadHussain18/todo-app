import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { collection, addDoc, getFirestore, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVKs23cvmRB4iQwxAbpQKmfIvI1nqwBMU",
    authDomain: "todo-app-smit.firebaseapp.com",
    projectId: "todo-app-smit",
    storageBucket: "todo-app-smit.appspot.com",
    messagingSenderId: "550064345972",
    appId: "1:550064345972:web:9dadab32a2c20421cb5221",
    measurementId: "G-FDVY4M5VBP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ids = []
const gettodos = () => {
    onSnapshot(collection(db, "todos"), (data) => {
        data.docChanges().forEach((todo) => {
            console.log(todo)
            ids.push(todo.doc.id)
            if (todo.type === "removed") {
                let dtodo = document.getElementById(todo.doc.id)
                if(dtodo){

                    dtodo.remove()
                }
            } else if (todo.type === "added") {

                var list = document.getElementById("list");
                list.innerHTML += `
                <li id = '${todo.doc.id}'>
                <input class='todo-input' type='text' value='${todo.doc.data().value}' disabled/>
                ${todo.doc.data().time}
                <button onclick='delTodo("${todo.doc.id}")'>Delete</button> 
                <button onclick='editTodo(this,"${todo.doc.id}")'>Edit</button>
                </li>
                `
            }

        });

    });

}

gettodos()

const addTodo = async () => {
    try {

        var todo = document.getElementById("todo");
        var date = new Date()
        const docRef = await addDoc(collection(db, "todos"), {
            value: todo.value,
            time: date.toLocaleString(),
        });
        todo.value = ""
    }
    catch (err) {
        console.log(err)
    }



}

const delTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    console.log("todo delete")

    // event.target.parentNode.remove()

}

var edit = false;
const editTodo = async (e, id) => {
    var date = new Date()

    if (edit) {
        await updateDoc(doc(db, "todos", id), {
            value: e.parentNode.childNodes[1].value,
            time: date.toLocaleString(),


        });
        e.parentNode.childNodes[1].disabled = true;
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[5].innerHTML = "Edit"
        edit = false;
    } else {
        e.parentNode.childNodes[1].disabled = false;
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[5].innerHTML = "Update"
        edit = true;
    }
}


const deleteAll = async () => {
        var list = document.getElementById("list");
        list.innerHTML = ""
    let arr = []
    for (var i = 0; i < ids.length; i++) {
        arr.push(await deleteDoc(doc(db, "todos", ids[i])))
    }
    Promise.all(arr)
        .then((res) => {

            console.log("All data has been deleted! ")

        }).catch(err =>{
            console.log(err)
        })
}




console.log(moment(new Date("Thu May 25 2023 21:45:23 GMT+0500 (Pakistan Standard Time)"), "YYYYMMDD").fromNow())


window.addTodo = addTodo;
window.delTodo = delTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;
