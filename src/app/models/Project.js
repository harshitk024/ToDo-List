export class Project{
    
    constructor(name){
        this.name = name;
        this.tasks = []
    }

    addTask(task){
        if(!this.tasks.find(t => t.name === task.name)){
            this.tasks.push(task);
        }else{
            console.log(`Task ${task.name} already exists in the Project`);
        }
    }
    
    removeTask(task){

        for(let i = 0;i<this.tasks.length;i++){

            if(this.tasks[i].name == task.name){
                this.tasks.splice(i,1);
                break;
            }
        }
    }

}