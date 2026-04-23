const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("vault.db");

db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT,
        url TEXT,
        username TEXT,
        password TEXT,
        notes TEXT,
        category TEXT
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        masterPassword TEXT
    )
    `)

})

module.exports = db