function VowelCount(){
    document.getElementById("VowelCountOutput").innerHTML 
    = 
    VowelCountFunction(document.getElementById("VowelCountInput").value);
}

function VowelCountFunction(input){
    let output = 0
    let inputCharArray = [...input]

    for (i = 0; i <= inputCharArray.length; i++ ){
        switch(inputCharArray[i]){
            case 'a' || 'A':
                output ++;
                break;
            case 'e' || 'E':
                output ++;
                break;
            case 'i' || 'I':
                output ++;
                break;
            case 'o' || 'O':
                output ++;
                break;
            case 'u' || 'U':
                output ++;
                break;
        }
    }
    return output;
}

function ReverseString(){
    document.getElementById("ReverseStringOutput").innerHTML
    =
    ReverseStringFunction(document.getElementById("ReverseStringInput").value)
}

function ReverseStringFunction(input){
    let output = "";
    let inputCharArray = [...input];

    inputCharArray.reverse().forEach(element => {
        output += element
    });

    return output;
}

function CapitalizeWords(){
    document.getElementById("CapitalizeWordsOutput").innerHTML
    =
    CapitalizeWordFunction(document.getElementById("CapitalizeWordsInput").value)
}

let CapitalizeWordFunction = function(input){
    let inputArrary = input.split(" ").map(word => word[0].toUpperCase() + word.slice(1));
    return inputArrary.join(' ');
}

function WordCount(){
    document.getElementById("WordCountOutput").innerHTML
    =
    WordCountFunction(document.getElementById("WordCountInput").value)
}

let WordCountFunction = (input) => {
    let inputArrary = input.split(" ");
    output = inputArrary.length;
    return output;
}

function ConcatenateStrings(){
    document.getElementById("ConcatenateStringsOutput").innerHTML
    =
    ConcatenateStringsFunction(document.getElementById("ConcatenateStringsInput1").value, document.getElementById("ConcatenateStringsInput2").value)
}

let ConcatenateStringsFunction = (input1, input2) => input1 + " " + input2;

