export class Project {

    constructor(name){
        this.name = name;
        this.tasks = []
    }

    addTask(task){
       this.tasks.push(task);
    }

    removeTask(task){
    
       for(let i = 0;i<this.tasks.length;i++){
          if(this.tasks[i].name === task.name){
              this.tasks.splice(i,1);
              break;
          }
       }
    }

    showTasks(){
        console.log(this.tasks);
    }
}