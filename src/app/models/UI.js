import { LocalStorage } from "./LocalStorage";
import { Project } from "./Project";
import {Task} from "./Task";
import {compareAsc,toDate,format} from "date-fns"

export class UI{
 
    static loadHomePage(){

        const heading = document.querySelector("#heading")
        heading.innerHTML = "<h2>All Tasks</h2>"


        UI.renderTasks(undefined,"all")
        UI.renderProjects()
        UI.handleEventListeners()

    }

    static handleEventListeners(){

        document.querySelector("#all-tasks").addEventListener("click",()=>{
            UI.renderProjects("default")
        })


        document.querySelector("#today-tasks").addEventListener("click",()=>{
            UI.renderTasks("default","today");
        })

        document.querySelector("#week-tasks").addEventListener("click",()=>{
            UI.renderTasks("default","week");
        })

        const addPro = document.querySelector("#addpro");

        addPro.onclick = UI.addProject;

        const taskDelete = document.querySelectorAll(".task-delete")

        taskDelete.forEach((ele)=>{
            ele.addEventListener("click",()=>{
                UI.deleteTask(ele.getAttribute("data-pro-name").replaceAll("-"," "),ele.getAttribute("data-name").replaceAll("-"," "))
            })
        })

        const showtask = document.querySelector("#addTask")

        showtask.onclick = UI.showTaskDialog;
        

        const projectList = document.querySelectorAll(".project-item")
        projectList.forEach((p)=> {
           p.addEventListener("click",()=>{
            UI.projectView(p.id);
           })
        })
      
    }

 
    
    
    static addProject(){

        const dialog = document.querySelector("#projectDialog")
        dialog.showModal();

        const cancelBtn = document.querySelector("#cancelBtn")

        cancelBtn.onclick = ()=>{dialog.close()}

        const saveBtn = document.querySelector("#saveBtn")

        saveBtn.onclick = () => {
            const projectName = document.querySelector("#projectNameInput").value
            LocalStorage.saveProject(new Project(projectName));  
            dialog.close()
            UI.loadHomePage();
        }


    }

    static renderProjects(name){

        if(name === "default"){
            UI.loadHomePage()
            return;
        }

        const projects = JSON.parse(localStorage.getItem("projects")) || []
        const projectList = document.querySelector("#pro-items-list")

        projectList.innerHTML = ""

        projects.forEach(element => {
            const li = document.createElement("li")
            li.setAttribute("class","project-item")
            li.setAttribute("id",`${element.name}`)
            li.innerHTML = `<div>${element.name}</div`

           projectList.prepend(li);
        });
    }

    static projectView(name){

       const mainHeader = document.querySelector("#heading")
       console.log("Clicked",name);
       mainHeader.innerHTML = `<h2>${name}</h2>`
       UI.renderTasks(name,"all")
       
    }

    static taskUpdate(name,project){

        UI.cleanTaskDialog()

        const task = LocalStorage.getTask(project,name)

        const dialogTask = document.querySelector("#taskDialog")
        dialogTask.showModal()

        document.querySelector("#project-name").value = project
        document.querySelector("#project-name").disabled = true

        document.querySelector("#task-name").value = task.name
        document.querySelector("#task-name").disabled = true

        document.querySelector("#description").value = task.description

        let color = UI.gerPriorityColor(task.priority)

        const priorities = document.querySelectorAll(".priority")
        let priority = task.priority


        priorities.forEach((button)=>{

            if(button.id == task.priority){
                priorities.forEach(btn => { btn.classList.remove("active")
                })
                button.classList.add("active")
            }
            button.addEventListener("click",()=>{
                priorities.forEach(btn => { btn.classList.remove("active") 
                button.checked = false;})        
                button.classList.add("active")
                button.checked = true;
                priority = button.id;
                console.log(priority);

            })
        })

        document.querySelector("#due-date").value = task.dueDate

        document.querySelector("#taskSave").addEventListener("click",()=>{
            UI.addTask(priority)
            dialogTask.close();
        })

 

    }

    static cleanTaskDialog(){
        document.querySelector("#project-name").value = ""
        document.querySelector("#project-name").disabled = false

        document.querySelector("#task-name").value = ""
        document.querySelector("#task-name").disabled = false
        document.querySelector("#description").value = ""
        document.querySelector("#due-date").value = ""
    }

    static showTaskDialog(){

        UI.cleanTaskDialog()

        const dialogTask = document.querySelector("#taskDialog")
        dialogTask.showModal()


        const projectName = document.querySelector("#heading")

        const projectInput = document.querySelector("#project-name")
        projectInput.value = projectName.textContent

        if(projectName.textContent !== ""){
           projectInput.disabled = true;
        }


        const priorities = document.querySelectorAll(".priority")
        let priority = "low"

        priorities.forEach((button)=>{
            button.addEventListener("click",()=>{
                priorities.forEach(btn => { btn.classList.remove("active") 
                button.checked = false;})        
                button.classList.add("active")
                button.checked = true;
                priority = button.id;
                console.log(priority);

            })
        })

        const saveTask = document.querySelector("#taskSave")

        saveTask.addEventListener("click",()=>{
             UI.addTask(priority);
             dialogTask.close();
        })

        const cancelBtn = document.querySelector("#taskCancel")
        cancelBtn.addEventListener("click",()=>{
            dialogTask.close()
        })
    }

    static addTask(priority){

        const projectName = document.querySelector("#project-name").value
        const taskName = document.querySelector("#task-name").value
        const description = document.querySelector("#description").value
        const dueDate = document.querySelector("#due-date").value

        LocalStorage.saveTask(projectName,new Task(taskName,description,dueDate,priority,false,projectName));
        UI.loadHomePage()

    }

    static deleteTask(project,task){

        const deleteDialog = document.querySelector("#task-delete")

        deleteDialog.showModal()

        const deleteConfirm = document.querySelector("#deleteBtn")

        deleteConfirm.addEventListener("click",()=>{
            console.log(project,task);
            LocalStorage.deleteTaskFromStorage(project,task)
            UI.loadHomePage()
            deleteDialog.close()
        })

        document.querySelector("#cancelDeleteBtn").addEventListener("click",()=>{
            deleteDialog.close()
        })


    }

    static renderTasks(project,type){

        const content = document.querySelector("#content")
        content.innerHTML = ""

        let tasks = [];

        const heading = document.querySelector("#heading")

        if(type === "all"){
         tasks = LocalStorage.getAllTasks(project);
         }else if (type === "today"){
          tasks = LocalStorage.getTodayTask();
          heading.innerHTML = "<h2>Today</h2>"
        }else{
            tasks = LocalStorage.getThisWeekTask();
            heading.innerHTML = "<h2>This Week</h2>"
        }
        console.log(tasks);


        for(let i = 0;i<tasks.length;i++){

            const div = document.createElement("div")   
            div.setAttribute("class","task-container")
            const color = UI.gerPriorityColor(tasks[i].priority)
    
            div.style.border = `1px solid ${color}`
            div.style.borderLeft = `20px solid ${color}`
            const date = format(toDate(tasks[i].dueDate),' do eee')

            let taskName = tasks[i].name.replaceAll(" ","-");
            let projectName = tasks[i].projectName.replaceAll(" ","-")
  
            div.innerHTML = `<div><div><input class = "complete-task" data-name = ${taskName} data-project-name = ${projectName} type = "radio" ></div><div id = "cont-task-name"><div class = "task-name" data-project-name = ${projectName}>${tasks[i].name}</div></div><div id = "view-task"><a href = "">${projectName}</a></div></div><div>${date}<svg data-name = ${taskName} data-pro-name = ${projectName} style = "margin-left : 13px;" id = "taskdeleteIcon" class = "task-delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e73636"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></div>`

            if(tasks[i].completed){
                div.innerHTML = `<div><div><input class = "complete-task" data-name = ${taskName} data-project-name = ${projectName} type = "radio" ></div><div id = "cont-task-name"><s>${tasks[i].name}</s></div><div id = "view-task"><a href = "">${projectName}</a></div></div><div>${date}<svg  data-name = ${taskName} data-pro-name = ${projectName} style = "margin-left : 13px;" id = "taskdeleteIcon" class = "task-delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e73636"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></div>`
            }

            content.prepend(div)
        }

        document.querySelectorAll(".complete-task").forEach((ele)=> {
            const task = LocalStorage.getTask(ele.getAttribute("data-project-name").replaceAll("-"," "),ele.getAttribute("data-name").replaceAll("-"," "))
            if(task.completed){ele.checked = true}
        })


        const taskview = document.querySelectorAll(".task-name")

        taskview.forEach((view)=>{
            view.addEventListener("click",()=>{
                UI.taskUpdate(view.textContent,view.getAttribute("data-project-name").replaceAll("-"," "));
            })
        })

        UI.makeTaskComplete();
        UI.handleEventListeners();

        return tasks;

    }

    static makeTaskComplete(){

        const complete_task  = document.querySelectorAll(".complete-task")

        if(complete_task != null){
            complete_task.forEach((ele)=>{
                const proName= ele.getAttribute("data-project-name").replaceAll("-"," ");
                ele.addEventListener("click",()=>{                 
                    LocalStorage.completeTask(proName,ele.getAttribute("data-name").replaceAll("-"," "))

                    if(document.querySelector("#heading").textContent === "All Tasks"){
                        UI.renderTasks(undefined,"all")
                    }else{
                        UI.renderTasks(document.querySelector("#heading").textContent,"all")
                    }
                })
            })
        }
    }


    static gerPriorityColor(priority){

        switch(priority){
            case "low":
                return "green"
            case "medium":
                return "yellow"
            default:
                return "red"
        }
    }


}