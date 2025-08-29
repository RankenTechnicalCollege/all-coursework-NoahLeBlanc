function getInput(){
    input = document.getElementById("userInput").value;
    determineTorF(input)
    determineDataType(input)
}

function determineTorF(input){
    if(input == 0 || -0 || "false" || 0n || "")
        document.getElementById("output").innerHTML = `You're input ${input} is Falsy`
    else{
        document.getElementById("output").innerHTML = `You're input ${input} is Truthy`
    }       
}

function determineDataType(input){
    if(!isNaN(input)){
        document.getElementById("dataType").innerHTML = "DataType: Number"
    }
    else if(input == "true" || "false"){
        document.getElementById("dataType").innerHTML = "DataType: Bool"
    }
}
