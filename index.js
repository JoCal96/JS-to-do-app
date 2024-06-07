
var json_data = JSON.parse(localStorage.getItem('json_data'));
var json_completed_data = JSON.parse(localStorage.getItem('json_completed_data'));

if (json_data.length > 0) {
    json_data.forEach(element => {
        if (element && element.completed) {
            newTodo(element.title, element.id);
        }
    });
}

registerEventListeners();

function registerEventListeners() {
    $(".delete").on("click", function() {
        var todoID = $(this).parent().attr('data-id');
            deleteTodo(todoID);
    });

    $(".view").on("click", function(){
        var todoID = $(this).parent().attr('data-id');
            viewTodo(todoID);
    });

    $(".edit").on("click", function(){
        var todoID = $(this).parent().attr('data-id');
            editTodo(todoID);
    });
    $(".complete").on("click", function(){
        var todoID = $(this).parent().attr('data-id');
            completeTodo(todoID);
    });
}
        

//Function to delete an individual todo
function deleteTodo(todoID) {
    $("li[data-id="+todoID+"]").fadeOut();
    var json_temp = JSON.parse(localStorage.getItem('json_data'));
    delete json_temp[todoID];
    localStorage.setItem('json_data',JSON.stringify(json_temp)
    );
}

// create a new todo with view and delete buttons
function newTodo(todoTitle, todoID, todoNote, todoDate) {
    if (!todoTitle && !todoID) {
        todoTitle = document.getElementById("todoTitle").value;
        todoNote = document.getElementById("todoNote").value;
        todoDate = document.getElementById("todoDate").value;

        if (todoTitle){
            var todoID = storeTodoLocal(todoTitle, todoNote, todoDate);
        }
    }

    if(todoTitle){
        var todoHTML = '<li class="todoli col-9" data-id="' + todoID + '">' + todoTitle;
        todoViewBtn = '<br><a href="#" class="col-2 btn btn-sm btn-add view">View</a>'
        todoDeleteBtn = '<a href="#" class="col-2 btn btn-sm btn-delete delete">Delete</a>'
        todoCompleteBtn = '<a href="#" class="col-2 btn btn-sm btn-add complete">Complete</a></li>';

        $("#todo-list").append(todoHTML + todoViewBtn + todoDeleteBtn + todoCompleteBtn);
        $("li[data-id="+todoID+"]").fadeIn();

        registerEventListeners();
    } 
}

function storeTodoLocal(todoTitle, todoNote, todoDate) {
    //retrieve and parse existing json from localstorage
    var json_temp = JSON.parse(localStorage.getItem('json_data'));
    if (!json_temp) {
        json_temp = [];
    }
    var todoID = json_temp.length;

    //add new todo object to JSON
    json_temp.push({
        "id": todoID,
        "title": todoTitle,
        "notes": todoNote,
        "dateDue": todoDate,
        "completed": false
    });

    //log updated JSON to console
    console.log(json_temp);

    //stringify updated JSON and store back in localStorage
    localStorage.setItem('json_data', JSON.stringify(json_temp));
    
    //return ID of new todo
    return todoID;
 }

 //Button to delete all the todos in the list
function deleteAllTodo() {
    if (confirm("Are you sure you want to delete all your To Dos?")) {
    localStorage.removeItem('json_data');
    $("#todo-list").empty();
    }
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
    $("#view-popout .modal-footer").append('<button class="btn btn-add edit-todo" onclick="editTodo(' + todoID + ')">Edit</button>');
    $("#view-popout .modal-footer").append('<button type="button" class="btn btn-delete edit-delete" data-bs-dismiss="modal">Close</button>')

    $("#view-popout").modal('show');
    
    registerEventListeners();
}

//Function to edit the todo
function editTodo(todoID){
    var json_temp = JSON.parse(localStorage.getItem('json_data'));
    var selectedTodo = json_temp[todoID];

    $('#edit-popout #edit-title').val(selectedTodo.title);
    $('#edit-popout #edit-notes').val(selectedTodo.notes);
    $('#edit-popout #edit-date').val(selectedTodo.dateDue);
    $("#edit-popout #edit-id").val(todoID);

    $('#view-popout').modal('hide');
    $('#edit-popout').modal('show');
    registerEditListeners();
}

function saveTodo(todoID){
    var todoID = $("#edit-id").val();
    var json_temp = JSON.parse(localStorage.getItem('json_data'));
    var selectedTodo = json_temp[todoID];

    selectedTodo.title = $("#edit-popout #edit-title").val();
    selectedTodo.notes = $("#edit-popout #edit-notes").val();
    selectedTodo.dateDue = $("#edit-popout #edit-date").val();

    json_temp[todoID] = selectedTodo;
    console.log(json_temp);
    localStorage.setItem('json_data', JSON.stringify(json_temp));

    $("#view-popout .modal-title").text(selectedTodo.title);
    $("#view-popout .modal-body").html('<p>Notes: ' + selectedTodo.notes + '</p>' + '<br>' + '<p> Due Date: ' + selectedTodo.dateDue + '</p>');

    $("#edit-popout").modal('hide');
    $("#view-popout").modal('show');

    var todoHTML = '<li class="todoli" style="display:none" data-id="' + selectedTodo.id + '">' + selectedTodo.title;
    todoViewBtn = '<br><a href="#" class="btn btn-sm btn-add view">View</a>'
    todoDeleteBtn = '<a href="#" class="btn btn-sm btn-delete delete" >Delete</a>'
    todoCompleteBtn = '<a href="#" class="col-2 btn btn-sm btn-add complete">Complete</a></li>';
    $("#todo-list").html(todoHTML + todoViewBtn + todoDeleteBtn + todoCompleteBtn);
    $("li[data-id="+todoID+"]").fadeIn();

    registerEventListeners();
}

function completeTodo(todoID) {
    $("li[data-id="+todoID+"]").fadeOut();
    var json_data = JSON.parse(localStorage.getItem('json_data'))
    var json_completed_data = JSON.parse(localStorage.getItem('json_completed_data'));
    var todoIndex = json_data.findIndex(todo => todo.id == todoID)

    if (todoIndex !== -1) {
        var completedTodo = json_data.splice(todoIndex, 1)[0];
        completedTodo.completed = true;
        json_completed_data.push(completedTodo);
        localStorage.setItem('json_data', JSON.stringify(json_data));
        localStorage.setItem('json_completed_data', JSON.stringify(json_completed_data));
        console.log(json_completed_data);
    }
    registerEditListeners();
}

