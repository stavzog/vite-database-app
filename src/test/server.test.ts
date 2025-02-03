import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import {Database} from 'bun:sqlite'
import {loadDB} from '../api/dbLoader'

const db = new Database("db.sqlite"); //get real database

async function resetDatabase() {
  console.log("Resetting database...");

  // Delete all existing data
  db.query("DELETE FROM games;").run();

  //call loadDB from dbLoader.ts which imports csv data into database
  await loadDB() 

  console.log("Database reset complete.");
}

//reset database for testing purposes
beforeAll(() => {
  //resetDatabase();
})

//reset database again so it is ready
afterAll(async () => {
  await resetDatabase()
})

describe("Game API", () => {
  it("should return a list of games", async () => {
    const res = await request("http://localhost:3000").get("/games");

    expect(res.status).toBe(200); //success
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("Name", "Wii Sports")
  });

  it("should update a game's data", async () => {
    const res = await request("http://localhost:3000").post("/update-game").send({
      gameID: 1,
      nName: "Updated Game",
      nPlatform: "PS5",
      nRelease: 2029,
      nGenre: "Adventure",
      nPublisher: "Nobody",
      nSales: 2.5
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true)
    
    //maybe test the change in the database
  });

  it("should return 400 for invalid data", async () => {
    const res = await request("http://localhost:3000").post("/update-game").send({
      gameID: 1,
      nName: ""
    });

    expect(res.status).toBe(400)
  });
});