const tasksContainer = document.getElementById("tasks");  
const myInput = document.getElementById("myInput");  
const myButton = document.getElementById("myButton");  
const exportButton = document.getElementById("exportButton"); 

const tasks = [];  
let editingTaskId = null;  
 
myButton.addEventListener("click", function() {  
 
    const inputValue = myInput.value;  
 
    if (editingTaskId === null) {  
 
        tasks.push({  
            id: tasks.length + 1,  
            title: inputValue,  
            completed: false,
            status: "To do"
        });  
 
    } else {  
 
        const task = tasks.find(function(item) {  
            return item.id === editingTaskId;  
        });  
 
        task.title = inputValue; 
        editingTaskId = null; 
    }  
 
    renderTasks();  
    myInput.value = "";  
 
});  
 
 
function renderTasks() {  
 
    tasksContainer.innerHTML = "";  
 
    tasks.forEach(function(task) {  
 
        const paragraph = document.createElement("p");  
        paragraph.textContent = task.title; 

        if (task.completed === true) {  
            paragraph.classList.add("completed"); 
        } 
 
        const editButton = document.createElement("button");  
        editButton.textContent = "Edit";  
 
        editButton.addEventListener("click", function() {  
            editingTaskId = task.id;  
            myInput.value = task.title;  
        });  
 
 
        const deleteButton = document.createElement("button");  
        deleteButton.textContent = "Delete";  
 
        deleteButton.addEventListener("click", function() { 
 
            const index = tasks.findIndex(function(item) {  
                return item.id === task.id;  
            }); 
 
            tasks.splice(index, 1); 
 
            renderTasks();  
        });  
 
 
        const completedCheckbox = document.createElement("button");  
        completedCheckbox.classList.add("completed-checkbox"); 

        if (task.completed === true) { 
            completedCheckbox.classList.add("completed"); 
        } 

        completedCheckbox.addEventListener("click", function() {  
 
            task.completed = !task.completed;  

            if (task.completed === true) {
                task.status = "Done";
            } else {
                task.status = "To do";
            }
 
            renderTasks();  
        });  


        // Status Dropdown
        const statusSelect = document.createElement("select");

        const todoOption = document.createElement("option");
        todoOption.value = "To do";
        todoOption.textContent = "To do";

        const workingOption = document.createElement("option");
        workingOption.value = "Working on";
        workingOption.textContent = "Working on";

        const doneOption = document.createElement("option");
        doneOption.value = "Done";
        doneOption.textContent = "Done";

        statusSelect.appendChild(todoOption);
        statusSelect.appendChild(workingOption);
        statusSelect.appendChild(doneOption);

        statusSelect.value = task.status;

        statusSelect.addEventListener("change", function() {
            task.status = statusSelect.value;

            if (task.status === "Done") {
                task.completed = true;
            } else {
                task.completed = false;
            }

            renderTasks();
        });
 
 
        tasksContainer.appendChild(paragraph);  
        tasksContainer.appendChild(statusSelect);
        tasksContainer.appendChild(editButton);  
        tasksContainer.appendChild(deleteButton);  
        tasksContainer.appendChild(completedCheckbox);  
 
    });  
} 


exportButton.addEventListener("click", function() { 
 
    const jsonData = JSON.stringify(tasks); 
 
    const blob = new Blob([jsonData], { 
        type: "application/json" 
    }); 
 
    const url = URL.createObjectURL(blob); 
 
    const link = document.createElement("a"); 
 
    link.href = url; 
    link.download = "tasks.json"; 
 
    link.click(); 
 
    URL.revokeObjectURL(url); 
});