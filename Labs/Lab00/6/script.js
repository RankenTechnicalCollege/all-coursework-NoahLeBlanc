
const profile = {
    name: "Niah LeBlanc",
    email: "niah_leblanc@insideranken.org",
    isOnline: true
}

document.getElementById("name").innerText += " " + profile.name
document.getElementById("email").innerText += " " + profile.email

if(profile.isOnline){
    document.getElementById("online").innerText += " ✅"
}
else{
    document.getElementById("online").innerHTML += " ❌"
}

function update(){
    profile.email = document.getElementById("updateEmail").value
    document.getElementById("email").innerText = "Email: " + profile.email
}