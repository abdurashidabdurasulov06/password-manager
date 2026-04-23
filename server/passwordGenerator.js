function generatePassword(length,upper,numbers,symbols){

    let chars="abcdefghijklmnopqrstuvwxyz"

    if(upper) chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if(numbers) chars+="0123456789"
    if(symbols) chars+="!@#$%^&*()_+"

    let password=""

    for(let i=0;i<length;i++){

        password+=chars.charAt(
            Math.floor(Math.random()*chars.length)
        )
    }

    return password
}

module.exports=generatePassword