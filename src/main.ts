
//contact the server, request games list
export async function fetchGames() {
  const response = await fetch("http://localhost:3000/games");
  const games = await response.json();

  updateHTML(games);
  
  return games
}


const games = await fetchGames();

//updates the table element in the html to display the games list that was retrieved
export function updateHTML(games: any) {
  const table = document.getElementById("game-list");
  if(table == null) {
    console.log("could not find game list element")
    return
  }
  table!.innerHTML = "";

  games.forEach((game: any) => {
    const tr = document.createElement("tr");

    //every table row element has its id property reference the id of the game so that eventlisteners can read its id property and get the game id
    tr.setAttribute("id", `game-${game.id}`);
    tr.innerHTML = `
        <td>${game.Name}</td>
        <td>${game.Platform}</td>
        <td>${game.Year_of_Release}</td>
        <td>${game.Genre}</td>
        <td>${game.Publisher}</td>
        <td>${game.Global_Sales_Mil}</td>
        <td><a class="action" href="#">Change</a></td>
      `;
    table.appendChild(tr);

    //add an on-click event listener to the <a> link element that is clicked to update the current entry in this table row
    tr.children[6].children[0].addEventListener("click", change);

  });
}

function getGameById(id: number) {
  return games[id-1]
}

//close the popup when the close link is clicked in the popup
document.getElementById("close")?.addEventListener("click", closePopup)

//update function called when change is clicked on the popup
document.getElementById("change-btn")?.addEventListener("click", update)

//update an entry in the database with new values that were supplied through the popup
export async function update(this: HTMLElement, ev: Event) {
  //get popup input values
  let nName = (document.getElementById("name")! as HTMLInputElement).value;
  let nPlatform = (document.getElementById("platform")! as HTMLInputElement).value;
  let nRelease = parseInt((document.getElementById("release")! as HTMLInputElement).value);
  let nGenre = (document.getElementById("genre")! as HTMLInputElement).value;
  let nPublisher = (document.getElementById("publisher")! as HTMLInputElement).value;
  let nSales = parseFloat((document.getElementById("sales")! as HTMLInputElement).value);

  //check values
  if (nName == '' || nPlatform == '' || isNaN(nRelease) || nGenre == '' || nPublisher == '' || isNaN(nSales)) {
    alert("Invalid sales value");
    return;
  }

  //get game id to be updated. The parent div of the change button has now got an id property with the value game-[id]
  const div = this.parentElement! as HTMLDivElement;
  const gameID = parseInt(div.getAttribute("id")!.split("-")[1]);

  if(isNaN(gameID)) {
    console.error(`Could not find game with id ${gameID} in table row with id ${div.getAttribute("id")}`)
    alert("Update failed");
    closePopup();
    return
  }

  console.log(`Changing data for game ${gameID}`)

  //send post request
  const response = await fetch("http://localhost:3000/update-game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameID, nName, nPlatform, nGenre, nRelease, nPublisher, nSales })
  });

  closePopup()

  if (response.ok) {
    alert("Updated successfully!");
    fetchGames(); // Refresh the list
  } else {
    console.error(`Update Failed:${response.status}: ${response.body}`)
    alert("Update failed");
  }

}


//open up popup and populate the values of the inputs inside with the values of the game that is to be changed
function change(this: HTMLElement, ev: Event) {
  document.getElementById("popup")!.style.display = "flex";

  //get tr html element which holds the id of the game in its id property
  const tableRow = this.parentElement!.parentElement as HTMLTableRowElement;
  const gameID = parseInt(tableRow.getAttribute("id")!.split("-")[1]);
  console.log(gameID)

  let game: any = getGameById(gameID)!;

  if (game == undefined) {
    console.error(`Could not find game with id ${gameID} in table row with id ${tableRow.getAttribute("id")}`)
    closePopup();
    alert("Update Failed")
    return
  }

  //set the id property of the parent div (class buttons) of the change button to the id of 
  //the game so that the change button click event can retrieve the game id from that parent
  document.getElementsByClassName("buttons")[0].setAttribute("id", `game-${gameID}`);

  //populate input values with the data from the game that is to be updated
  (document.getElementById("name")! as HTMLInputElement).value = game.Name;
  (document.getElementById("platform")! as HTMLInputElement).value = game.Platform;
  (document.getElementById("release")! as HTMLInputElement).value = game.Year_of_Release;
  (document.getElementById("genre")! as HTMLInputElement).value = game.Genre;
  (document.getElementById("publisher")! as HTMLInputElement).value = game.Publisher;
  (document.getElementById("sales")! as HTMLInputElement).value = game.Global_Sales_Mil;
}

function closePopup() {
  document.getElementById("popup")!.style.display = "none"
}
