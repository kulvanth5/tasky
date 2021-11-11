const taskcontainer = document.querySelector(".task_container");
console.log(taskcontainer);

//global array to store all cards

let globalstore = [];

const newcard = ({id,imageUrl,taskTitle,taskType,taskDescription}) =>
    `<div class="col-md-6 col-lg-4" id=${id}>
    <div class="card">
    <div class="card-header d-flex justify-content-end gap-2">
        
        <button type="button" class="btn btn-outline-success" id=${id} onclick="editCard.apply(this,arguments)">
        <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this,arguments)"></i></button>

        <button type="button" class="btn btn-outline-danger" id=${id} onclick="deleteCard.apply(this,arguments)">
        <i class="fas fa-trash-restore" id=${id} onclick="deleteCard.apply(this,arguments)"></i></button>
    </div>
    
    <img src=${imageUrl}
     class="card-img-top" alt="image">

    <div class="card-body">
      <h5 class="card-title">${taskTitle}</h5>
      <p class="card-text">${taskDescription}</p>
     <span class="badge bg-primary float-start">${taskType}</span>
    </div>
    <div class="card-footer text-muted ">
        <button type="button"  class="btn btn-outline-primary float-end" id=${id}>Open Task</button>
    </div>
    </div>
    </div>` ;

    const loadInitialTaskCards = () => {

        //accessing the local storage data
        const getInitialData = localStorage.getItem("tasky") ;    
    
        if(!getInitialData)     //if the data tasky is not present , return from the function
            return ;
    
        //converting the local storage data from stringified-object to DOM
        const { cards } = JSON.parse(getInitialData);
    
        //traverse the array of globalstore to generate html card and display back in browser
        cards.map((card) => {
            const createNewCard = newcard(card);
            taskcontainer.insertAdjacentHTML("beforeend",createNewCard);
            globalstore.push(card);
        });
    }

    const updateLocalStorage = () => {
        localStorage.setItem("tasky",JSON.stringify({ cards: globalstore}));
    }

    const deleteCard = (event) => {

        event = window.event;
        const targetID = event.target.id;
        const tagname = event.target.tagName;

        globalstore = globalstore.filter((cards) => cards.id != targetID);

            updateLocalStorage();

            if(tagname === "BUTTON")
                return taskcontainer.removeChild( event.target.parentNode.parentNode.parentNode);

                return taskcontainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    };

    const editCard = (event) => {

        
        event = window.event;
        const targetID = event.target.id;
        const tagname = event.target.tagName;

        let parentElement;

        if(tagname == "BUTTON")
            parentElement = event.target.parentNode.parentNode ;

        else
            parentElement = event.target.parentNode.parentNode.parentNode;

            let taskTitle = parentElement.childNodes[5].childNodes[1];
            let taskDescription = parentElement.childNodes[5].childNodes[3];
            let taskType = parentElement.childNodes[5].childNodes[5];
            let submitButton = parentElement.childNodes[7].childNodes[1]; 

            taskTitle.setAttribute("contenteditable","true");
            taskDescription.setAttribute("contenteditable","true");
            taskType.setAttribute("contenteditable","true");
            submitButton.setAttribute("onclick","saveEditChanges.apply(this,arguments)");
            submitButton.innerHTML = "Save Changes" ;
    };

    const saveEditChanges = (event) => {

        event = window.event;
        const targetID = event.target.id;
        const tagname = event.target.tagName;

        let parentElement;

        if(tagname == "BUTTON")
            parentElement = event.target.parentNode.parentNode ;

        else
            parentElement = event.target.parentNode.parentNode.parentNode;

            let taskTitle = parentElement.childNodes[5].childNodes[1];
            let taskDescription = parentElement.childNodes[5].childNodes[3];
            let taskType = parentElement.childNodes[5].childNodes[5];
            let submitButton = parentElement.childNodes[7].childNodes[1]; 

            const updateData = {

                taskTitle: taskTitle.innerHTML,
                taskType: taskType.innerHTML,
                taskDescription: taskDescription.innerHTML,
            };

            globalstore = globalstore.map((task) => {

                if( task.id === targetID  ) {
                return{
                        id: task.id,
                        imageUrl: task.imageUrl,
                        taskTitle: updateData.taskTitle,
                        taskDescription: updateData.taskDescription,
                        taskType: updateData.taskType,
                      };
                    }   
                    return task ;
            });

            updateLocalStorage();
            taskTitle.setAttribute("contenteditable", "false");
            taskDescription.setAttribute("contenteditable", "false");
            taskType.setAttribute("contenteditable", "false");
            submitButton.removeAttribute("onclick");
            submitButton.innerHTML = "Open Task";
    };
    const savechanges = () => {
    const taskData = {
        id: `${Date.now()}` ,       //unique number for id card
        imageUrl: document.getElementById("imageurl").value ,
        taskTitle: document.getElementById("tasktitle") .value ,
        taskType: document.getElementById("tasktype").value ,
        taskDescription: document.getElementById("taskdescription").value ,
    }

    const createNewCard = newcard(taskData);

    taskcontainer.insertAdjacentHTML("beforeend",createNewCard);
    globalstore.push(taskData);
    
    updateLocalStorage();

    };

