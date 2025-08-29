const userNames = ['ApeLincoln', 'TheNotoriousP.I.G.','Brieoncé']

function getInput(){
    input = document.getElementById("userInput").value;
    let userName = SearchForUserName(input)

    if(userName != undefined){
        document.getElementById("output").innerHTML = `${userName} Found`

    }
    else{
        document.getElementById("output").innerHTML =  "Not Found"
    }
    
}

function SearchForUserName(input){
    let i = 0
    while(i < 3){
        if(input.toLowerCase() == userNames[i].toLowerCase()){
            return(userNames[i])
        }
        else{
            i++
        }
    }
}