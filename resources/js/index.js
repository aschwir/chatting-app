const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const saveButton = document.getElementById("save-button");
const editButton = document.getElementById("edit-button");
const currentUse = document.getElementById("currentUser");

const serverURL = "https://it3049c-chat.fly.dev/messages"
const MILLISECONDS_IN_TEN_SECONDS = 10000;
let currentUser = nameInput.value;

let siteData = {
    "user" : "Users",
    "userNames" : []
}

nameInput.value = "";

if(nameInput.value == ""){
    myMessage.disabled = true;
}

 async function updateMessages() {
   const messages = await fetchMessages(); 

    let formattedMessages = "";

    messages.forEach(message => {
        formattedMessages += formatMessage(message, nameInput.value);
    });
    chatBox.innerHTML = formattedMessages;
}


function fetchMessages() {
    return fetch(serverURL)
        .then( response => response.json())
}

 function formatMessage(message,myNameInput){
      const time = new Date(message.timestamp);
      const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

    if (myNameInput === message.sender) {
        return `
        <div class="mine messages">
            <div class="message">
                ${message.text}
            </div>
            <div class="sender-info">
                ${formattedTime}
            </div>
        </div>
        `
    } else {
        return `
            <div class="yours messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${message.sender} ${formattedTime}
                </div>
            </div>
        `
    }
}


function sendMessages(username, text) {
    const newMessage = {
        sender: username,
        text: text,
        timestamp: new Date()
    }

    fetch (serverURL, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
    });
}

sendButton.addEventListener("click",function(e){
  e.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
})

saveButton.addEventListener('click', function(e){
    e.preventDefault();
    let userexsists = siteData.userNames.includes(nameInput.value)

    if(!userexsists){
      siteData.userNames.push(nameInput.value);
      localStorage.setItem(siteData,JSON.stringify(siteData))
    } 
    currentUser = nameInput.value; 
    myMessage.disabled = false;
    nameInput.value = "";
    insertCurrentUser();
})

editButton.addEventListener('click', function(e){
    e.preventDefault();
    let editedName = prompt("Enter new name.");
   let index = siteData.userNames.indexOf(currentUser)
    siteData.userNames[index] = editedName;
    localStorage.setItem(siteData,JSON.stringify(siteData))
    currentUser = editedName;
    insertCurrentUser();
})

function insertCurrentUser(){
    currentUse.innerHTML = `Currrent user: ${currentUser}`
}

updateMessages();
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);
console.log(currentUser);
