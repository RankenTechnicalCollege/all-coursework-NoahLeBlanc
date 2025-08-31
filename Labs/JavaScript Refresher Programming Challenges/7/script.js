function brewCoffee(){
    document.getElementById("coffeeStatus").innerText = "Brewing..."
    setTimeout(() => {
        document.getElementById("coffeeStatus").innerText = "Done"
    }, "3000");
}

function makeToast(){
    document.getElementById("toastStatus").innerText = "Toasting..."
    setTimeout(() => {
        document.getElementById("toastStatus").innerText = "Done"
    }, "2000");
}

function pourJuice(){
    document.getElementById("juiceStatus").innerText = "Pouring..."
     setTimeout(() => {
        document.getElementById("juiceStatus").innerText = "Done"
     }, "1000")
}
