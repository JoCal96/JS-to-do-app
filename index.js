var json_data = JSON.parse(localStorage.getItem('json_data'));

if (json_data) {
    json_data.forEach(element => {
        if (element) {
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
}

function deleteTodo(todoID) {
    $("li[data-id="+todoID+"]").fadeOut();
    var json_temp = JSON.parse(localStorage.getItem('json_data'));
    delete json_temp[todoID];
    localStorage.setItem('json_data',
    JSON.stringify(json_temp)
    );
}

function newTodo(todoTitle, todoID) {
    if (!todoTitle && !todoID) {
        todoTitle = document.getElementById("todoTitle").value;
        if (todoTitle){
            var todoID = storeTodoLocal(todoTitle);
        }
    }
    if(todoTitle){
        var todoHTML = '<li class="todoli" style="display:none" data-id="' + todoID + '">' + todoTitle + '<a href="#" class="btn btn-sm btn-delete delete">Delete</a></li>';
    $("#todo-list").append(todoHTML);
    $("li[data-id="+todoID+"]").fadeIn();

    registerEventListeners();
    console.log("new todo added");
    console.log(listItem);
    } 
}

function storeTodoLocal(todoTitle) {
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
        "completed": false
    });

    //log updated JSON to console
    console.log(json_temp);

    //stringify updated JSON and store back in localStorage
    localStorage.setItem('json_data',
    JSON.stringify(json_temp)
    );
    
    //return ID of new todo
    return todoID;
 }

function deleteAllTodo() {
    if (confirm("Are you sure you want to delete all your To Dos?")) {
    localStorage.removeItem('json_data');
    $("#todo-list").empty();
    }
}