const express = require("express")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const db = require("./database")
const {encrypt,decrypt} = require("./crypto")

const app = express()

app.use(bodyParser.json())
app.use(express.static("public"))

const PORT = 3000

// set master password
app.post("/set-master", async(req,res)=>{

    const hash = await bcrypt.hash(req.body.password,10)

    db.run(
        "INSERT OR REPLACE INTO settings (id,masterPassword) VALUES (1,?)",
        [hash]
    )

    res.send({status:"ok"})
})

app.get("/init", async (req, res) => {

    const bcrypt = require("bcrypt")

    const hash = await bcrypt.hash("1234", 10)

    db.run(
        "INSERT OR REPLACE INTO settings (id, masterPassword) VALUES (1, ?)",
        [hash]
    )

    res.send("Master password set to 1234")
})
// unlock vault
app.post("/unlock", (req,res)=>{

    db.get(
        "SELECT masterPassword FROM settings WHERE id=1",
        async(err,row)=>{

        if(!row) return res.send({error:"not set"})

        const valid = await bcrypt.compare(
            req.body.password,
            row.masterPassword
        )

        res.send({valid})
    })
})


// add credential
app.post("/credential",(req,res)=>{

    const encrypted = encrypt(req.body.password)

    db.run(`
        INSERT INTO credentials
        (service,url,username,password,notes,category)
        VALUES (?,?,?,?,?,?)
    `,
    [
        req.body.service,
        req.body.url,
        req.body.username,
        encrypted,
        req.body.notes,
        req.body.category
    ])

    res.send({status:"saved"})
})


// get credentials
app.get("/credentials",(req,res)=>{

    db.all("SELECT * FROM credentials",(err,rows)=>{

        rows = rows.map(c=>({
            ...c,
            password: decrypt(c.password)
        }))

        res.send(rows)
    })
})


// export vault
app.get("/export",(req,res)=>{

    db.all("SELECT * FROM credentials",(err,rows)=>{

        res.json(rows)
    })
})

app.listen(PORT,()=>{
    console.log("Server running")
})