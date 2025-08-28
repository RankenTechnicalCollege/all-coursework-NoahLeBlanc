const coffeeStatus = document.getElementById('coffeeStatus').innerText


function brewCoffee(){
    setTimeout(() =>{
        coffeeStatus = "loading"
    } ,3000)
    coffeeStatus = "done"
    
}