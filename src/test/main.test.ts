/// <reference lib="dom" />
// @vitest-environment happy-dom


import { describe, it, expect, beforeAll, afterAll, vi, Mock, beforeEach } from "vitest";

import {fetchGames} from '../main'

const serverUrl = "http://localhost:3000"

afterAll(() => {
  vi.clearAllMocks()
});

describe("Frontend Integration Tests", () => {

    it("should fetch games from the API with fetchGames", async () => {


        // Mock Game Data (for testing frontend behavior)
        const mockGame = [{
            id: 1,
            Name: "Test Game",
            Platform: "PC",
            Year_of_Release: 2024,
            Genre: "Action",
            Publisher: "Test Publisher",
            Global_Sales_Mil: 1.5
        }];

        //mock fetch function and make it return mockGame
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockGame),
            }),
        ) as Mock;

        let g = await fetchGames();
        expect(g).toEqual(mockGame)
    });
})