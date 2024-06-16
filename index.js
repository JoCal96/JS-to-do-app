//JavaScript for the functionality of the ToDo Web App

document.addEventListener('DOMContentLoaded', (event) => {
    loadTodos();
    registerEventListeners();
});

//Function to load the todos
function loadTodos() {
    json_data = JSON.parse(localStorage.getItem('json_data')) || [];
    json_completed_data = JSON.parse(localStorage.getItem('json_completed_data')) || [];

    $("#todo-list").empty();
    $("#completed-todo-list").empty();

    if (json_data.length > 0) {
        json_data.forEach(element => {
            if (element && !element.completed) {
                newTodo(element.title, element.id, element.notes, element.dateDue);
            }
        });
    }
    if (json_completed_data.length > 0) {
        json_completed_data.forEach(element => {
            if (element) {
                completedTodoHTML = '<li class="completedtodoli" data-id="' + element.id + '">' + element.title + '</li>';
                $("#completed-todo-list").append(completedTodoHTML);
            }
        });
    }
}

function registerEventListeners() {
    $(".delete").on("click", function() {
        todoID = $(this).parent().attr('data-id');
            deleteTodo(todoID);
    });

    $(".view").on("click", function(){
        todoID = $(this).parent().attr('data-id');
            viewTodo(todoID);
    });

    $(".edit").on("click", function(){
        todoID = $(this).parent().attr('data-id');
            editTodo(todoID);
    });
    $(".complete").on("click", function(){
        todoID = $(this).parent().attr('data-id');
            completeTodo(todoID);
    });
}

//Function to create a new todo with view and delete buttons
function newTodo(todoTitle, todoID, todoNote, todoDate) {
    if (!todoTitle && !todoID) {
        todoTitle = document.getElementById("todoTitle").value;
        todoNote = document.getElementById("todoNote").value;
        todoDate = document.getElementById("todoDate").value;

        if (todoTitle){
            todoID = storeTodoLocal(todoTitle, todoNote, todoDate);
        }
    }

    if(todoTitle){
        todoHTML = '<li class="todoli col-9" data-id="' + todoID + '">' + todoTitle;
        todoViewBtn = '<br><a href="#" class="col-2 btn btn-sm btn-view view">View</a>'
        todoDeleteBtn = '<a href="#" class="col-2 btn btn-sm btn-delete delete">Delete</a>'
        todoCompleteBtn = '<a href="#" class="col-2 btn btn-sm btn-comp complete">Complete</a></li>';

        $("#todo-list").append(todoHTML + todoViewBtn + todoDeleteBtn + todoCompleteBtn);
        $("li[data-id="+todoID+"]").fadeIn();

        registerEventListeners();
    } 
}
//Function to retrieve and parse existing json from localstorage, add a new todo object to the JSON, stringify it and store back in the localStorage
function storeTodoLocal(todoTitle, todoNote, todoDate) {
    
    json_temp = JSON.parse(localStorage.getItem('json_data'));
    if (!json_temp) {
        json_temp = [];
    }
    todoID = json_temp.length;

    json_temp.push({
        "id": todoID,
        "title": todoTitle,
        "notes": todoNote,
        "dateDue": todoDate,
        "completed": false
    });

    localStorage.setItem('json_data', JSON.stringify(json_temp));
    
    return todoID;
 }

//Function to delete an individual todo
function deleteTodo(todoID) {
    $("li[data-id="+todoID+"]").fadeOut();
    json_temp = JSON.parse(localStorage.getItem('json_data'));
    delete json_temp[todoID];
    localStorage.setItem('json_data',JSON.stringify(json_temp)
    );
    loadTodos();
}

//Function to delete all the todos in the list
function deleteAllTodo() {
    if (confirm("Are you sure you want to delete all your To Dos?")) {
    localStorage.removeItem('json_data');
    $("#todo-list").empty();
    }
    loadTodos();
}

//Function to view the todo in the list
function viewTodo(todoID){
    popout = document.getElementById("view-popout");
    close = document.getElementsByClassName("popout-close");
    
    json_temp = JSON.parse(localStorage.getItem('json_data'));
    selectedTodo = json_temp[todoID];

    $("#view-popout .modal-title").text(selectedTodo.title);
    $("#view-popout .modal-body").html('<p>Notes: ' + selectedTodo.notes + '</p>' + '<br>' + '<p> Due Date: ' + selectedTodo.dateDue + '</p>');
    
    $("#view-popout .edit-todo").remove();
    $("#view-popout .edit-delete").remove();
    $("#view-popout .modal-footer").append('<button class="btn btn-comp edit-todo" onclick="editTodo(' + todoID + ')">Edit</button>');
    $("#view-popout .modal-footer").append('<button type="button" class="btn btn-delete edit-delete" data-bs-dismiss="modal">Close</button>')

    $("#view-popout").modal('show');
    
    registerEventListeners();
}

//Function to edit the todo and resave it to ensure the updated todo now shows
function editTodo(todoID){
    json_temp = JSON.parse(localStorage.getItem('json_data'));
    selectedTodo = json_temp[todoID];

    $('#edit-popout #edit-title').val(selectedTodo.title);
    $('#edit-popout #edit-notes').val(selectedTodo.notes);
    $('#edit-popout #edit-date').val(selectedTodo.dateDue);
    $("#edit-popout #edit-id").val(todoID);

    $('#view-popout').modal('hide');
    $('#edit-popout').modal('show');
    registerEditListeners();
}

function saveTodo(todoID){
    todoID = $("#edit-id").val();
    json_temp = JSON.parse(localStorage.getItem('json_data'));
    selectedTodo = json_temp[todoID];

    selectedTodo.title = $("#edit-popout #edit-title").val();
    selectedTodo.notes = $("#edit-popout #edit-notes").val();
    selectedTodo.dateDue = $("#edit-popout #edit-date").val();

    json_temp[todoID] = selectedTodo;
    localStorage.setItem('json_data', JSON.stringify(json_temp));

    $("#view-popout .modal-title").text(selectedTodo.title);
    $("#view-popout .modal-body").html('<p>Notes: ' + selectedTodo.notes + '</p>' + '<br>' + '<p> Due Date: ' + selectedTodo.dateDue + '</p>');

    $("#edit-popout").modal('hide');
    $("#view-popout").modal('show');

    todoHTML = '<li class="todoli" style="display:none" data-id="' + selectedTodo.id + '">' + selectedTodo.title;
    todoViewBtn = '<br><a href="#" class="col-2 btn btn-sm btn-view view">View</a>'
    todoDeleteBtn = '<a href="#" class="col-2 btn btn-sm btn-delete delete">Delete</a>'
    todoCompleteBtn = '<a href="#" class="col-2 btn btn-sm btn-comp complete">Complete</a></li>';
    $("#todo-list").html(todoHTML + todoViewBtn + todoDeleteBtn + todoCompleteBtn);
    $("li[data-id="+todoID+"]").fadeIn();

    registerEventListeners();
    loadTodos();
}

//Function to complete the todo
function completeTodo(todoID) {
    $("li[data-id=" + todoID + "]").remove().fadeOut();
    json_data = JSON.parse(localStorage.getItem('json_data')) || [];
    json_completed_data = JSON.parse(localStorage.getItem('json_completed_data')) || [];

    json_data = json_data.filter(todo => todo !== null);
    todoIndex = json_data.findIndex(todo => todo.id == todoID);

    if (todoIndex !== -1) {
        completedTodo = json_data.splice(todoIndex, 1)[0];
        completedTodo.completed = true;
        json_completed_data.push(completedTodo);

        localStorage.setItem('json_data', JSON.stringify(json_data));
        localStorage.setItem('json_completed_data', JSON.stringify(json_completed_data));

        completedTodoHTML = '<li class="completedtodoli" style="display:none" data-id="' + completedTodo.id + '">' + completedTodo.title + '</li>';
        $("#completed-todo-list").append(completedTodoHTML);
        $("li[data-id=" + completedTodo.id + "]").fadeIn();

        registerEventListeners();
    }
    loadTodos();
}
//Function to delete completed todos from the list
function deleteCompletedTodo() {
    if (confirm("Are you sure you want to delete your completed To Dos?")) {
        localStorage.removeItem('json_completed_data');
        $("#completed-todo-list").empty();
    }
}