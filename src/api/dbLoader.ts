import {Database} from 'bun:sqlite';

export const db = new Database("db.sqlite")

//load the database or create it if it doesnt exist
export async function loadDB() {

    db.query(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY,
            Name TEXT,
            Platform TEXT,
            Year_of_Release INTEGER,
            Genre TEXT,
            Publisher TEXT,
            Global_Sales_Mil REAL
        )
    `).run();
    
    //check if the database already has the games loaded
    const count = db.query("SELECT COUNT(*) as count FROM games").get() as {count:number};

    if (count.count === 0) {
        //no data in the database. populate it with the data from the csv file
        await importCSV();
    } else {
        console.log("Database already constains data.")
    }
}

async function importCSV() {
    console.log("Importing CSV data...");
    const file = await Bun.file(process.cwd() + "\\public\\dataset.csv").text();
    const csvData = file.split("\n").slice(1);
    const insert = db.prepare("INSERT INTO games (Name, Platform, Year_of_Release, Genre, Publisher, Global_Sales_Mil) VALUES (?, ?, ?, ?, ?, ?)");

    db.transaction(() => {

        for (const row of csvData) {
            const values = row.split(",");
            if (values.length < 6) continue;
            insert.run(values[0], values[1], parseInt(values[2]), values[3], values[4], parseFloat(values[5]));
        }

    })();

    console.log("Data imported successfully!");
}
