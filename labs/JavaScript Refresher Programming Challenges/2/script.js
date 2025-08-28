const SECRET = 42;

function checkInput(){
    let userInput = document.getElementById("userInput").value;
    getType(userInput.toLowerCase())
    wasTheGuessRight(userInput)
}

function getType(userInput){
    if(!isNaN(userInput)){
        document.getElementById("typeOfInput").innerHTML = "Data Type: Number"
    }
    else if(userInput == "true" || userInput == "false"){
        document.getElementById("typeOfInput").innerHTML = "Data Type: Bool"
    }
    else{
        document.getElementById("typeOfInput").innerHTML = "Data Type: String"
    }


}
function wasTheGuessRight(userInput){
    if(userInput == 42){
        document.getElementById("output").innerHTML = "you did it!"
    }
    else if(userInput == ""){
        document.getElementById("output").innerHTML = "please enter something!"
    }
    else{
        document.getElementById("output").innerHTML = "You didn't guess the secret!"
    }
}
