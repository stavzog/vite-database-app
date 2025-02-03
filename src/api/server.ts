import {db, loadDB} from './dbLoader'

loadDB();

Bun.serve({
    port:3000,
    async fetch(req) {
        const url = new URL(req.url);


        //the client is requesting a list of 20 entries in the database
        if (url.pathname === '/games') {
            const games = db.query("SELECT * FROM games LIMIT 20").all();

            console.log("Fetching 20 entries in dataset")
            
            return new Response(JSON.stringify(games), {
                headers: { 
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS, POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        //the client wants to update an entry in the database
        if (url.pathname === "/update-game" && req.method === "POST") {
            console.log("Updating Game")
            try {
                const { gameID, nName, nPlatform, nRelease, nGenre, nPublisher, nSales } = await req.json();
                
                //check the format of the data
                if (!gameID || isNaN(nSales)) {
                    console.error("Invalid Data (400)")
                    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
                }
            
                db.query(`
                    UPDATE games 
                    SET Name = ?, Platform = ?, Year_of_Release = ?, Genre = ?, Publisher = ?, Global_Sales_Mil = ? 
                    WHERE id = ?
                `).run(nName, nPlatform, nRelease, nGenre, nPublisher, nSales, gameID);

                console.log(`Updating ${nName} with ID ${gameID}`)
                
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error("Error Failed to update game")
                return new Response(JSON.stringify({ error: "Failed to update game" }), { status: 500 });
            }
        }

        return new Response("Not Found", {status:404});
    },
});

console.log("Server running on http://localhost:3000")