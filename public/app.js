async function unlock(){

    const password = document.getElementById("master").value

    const res = await fetch("/unlock",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({password})
    })

    const data = await res.json()

    if(data.valid){

        window.location="vault.html"

    }else{

        alert("Wrong password")
    }
}



async function loadVault(){

    const res = await fetch("/credentials")

    const data = await res.json()

    const list = document.getElementById("list")

    list.innerHTML=""

    data.forEach(c=>{

        const div = document.createElement("div")

        div.innerHTML=`
        <h3>${c.service}</h3>
        <p>${c.username}</p>
        <button onclick="copy('${c.password}')">Copy Password</button>
        `

        list.appendChild(div)

    })
}


function copy(text){

    navigator.clipboard.writeText(text)

    alert("Copied")
}
function passwordStrength(password){

    let score = 0

    if(password.length > 8) score++
    if(/[A-Z]/.test(password)) score++
    if(/[0-9]/.test(password)) score++
    if(/[^A-Za-z0-9]/.test(password)) score++

    if(score <=1) return "Weak"
    if(score <=3) return "Fair"

    return "Strong"
}
const used = {}

data.forEach(c=>{

    if(used[c.password]){
        alert("Password reused!")
    }

    used[c.password]=true
})