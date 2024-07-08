import { isToday,isThisWeek} from "date-fns";
export class LocalStorage {

    static saveProject(project){
       
        const projects = JSON.parse(localStorage.getItem("projects")) || [];
        const projectIndex = projects.findIndex(p => p.name === project.name);

        if(projectIndex  !== -1){
           projects[projectIndex] = project;
        }
        else{
            projects.push(project);
        }

        localStorage.setItem("projects",JSON.stringify(projects));
    }

    static saveTask(projectName,task){

        const projects = JSON.parse(localStorage.getItem("projects")) || [];
        const projectIndex = projects.findIndex(p => p.name === projectName)
        let taskIndex;

        if(projectIndex !== -1){
            
            if((taskIndex = projects[projectIndex].tasks.findIndex(t => t.name == task.name))== -1){
                projects[projectIndex].tasks.push(task);
            }else{
                projects[projectIndex].tasks[taskIndex] = task;
                console.log("Task is updated");
                console.log(taskIndex);
            }
        }

        localStorage.setItem("projects",JSON.stringify(projects));
    }


    static getAllTasks(projectName){

        const projects = JSON.parse(localStorage.getItem("projects")) || [];
        let alltasks = []

        if(projectName == undefined){

            projects.forEach(p => {
                alltasks = alltasks.concat(p.tasks)
            });

            return alltasks;
        }

        const projectIndex = projects.findIndex(p => p.name === projectName)

        return projects[projectIndex].tasks
    }

    static completeTask(project,task){

        let tasks = LocalStorage.getAllTasks(project)

        console.log(tasks);

        let index = tasks.findIndex((t)=> t.name == task)

        if(index !== -1){
            tasks[index].completed = true;
        }

        LocalStorage.saveTask(project,tasks[index])
    


    }

    static getTask(project,task){

       const projects = JSON.parse(localStorage.getItem("projects")) || [];

       const pro = projects.find((p)=>p.name == project)

       console.log(pro.tasks.find((t)=>t.name == task));

       return pro.tasks.find((t)=>t.name == task)

    }

    static getProject(project){

        const projects = JSON.parse(localStorage.getItem("projects")) || [];

        return projects.find((p => p.name == project))
    }

    static deleteTaskFromStorage(projectName,task){

        const pro = LocalStorage.getProject(projectName)
        
        const taskIndex = pro.tasks.findIndex(t => t.name === task)

        console.log(taskIndex);

        if(taskIndex !== -1){

        pro.tasks.splice(taskIndex,1);

        }

        LocalStorage.saveProject(pro);

    
    }

    static getTodayTask(){
        const projects = JSON.parse(localStorage.getItem("projects")) || [];

        let todayTask = []

        projects.forEach((p)=>{
            todayTask = todayTask.concat(p.tasks.filter((t)=> isToday(t.dueDate)))
        })

        return todayTask;
    }

    static getThisWeekTask(){
        const projects = JSON.parse(localStorage.getItem("projects")) || [];

        let weekTask = []

        projects.forEach((p)=>{
            weekTask = weekTask.concat(p.tasks.filter((t)=> isThisWeek(t.dueDate)))
        })

        console.log(weekTask);

        return weekTask;
    }





}

