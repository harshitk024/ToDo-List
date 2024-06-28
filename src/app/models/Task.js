import { Project } from "./Project.js";

class Task {
  
    constructor(title,description,dueDate,priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
    }

    setCompleted(){
        this.complete = true;
    }

    
}


