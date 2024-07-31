/*
 * These functions below are for various webpage functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    // const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    // loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
// Updates any table with data fetched from 'endpoint'
async function fetchAndDisplayUsers(elementID, endpoint, user = null) {
    const tableElement = document.getElementById(elementID);
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'username': user
        }
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

// Filters visable pokemon in the pokedex according to user-selected type.
async function filterPokedex() {

    const tableElement = document.getElementById("pokedex-pokemon-table");
    const tableBody = tableElement.querySelector('tbody');

    let pokeType = "%";
    let attack_input = '0';
    let defence_input = '0';
    let speed_input = '0';

    if(document.getElementById("type-option").checked && document.getElementById("pokemonType").value != 'all') {
        console.log(pokeType);
        pokeType = document.getElementById("pokemonType").value.toString();
    }

    if(document.getElementById("attack-option").checked) {
        console.log(attack_input);
        attack_input = document.getElementById("attack-input").value.toString();
    }

    if(document.getElementById("defence-option").checked) {
        console.log(defence_input);
        defence_input = document.getElementById("defence-input").value.toString();
    }

    if(document.getElementById("speed-option").checked) {
        console.log(speed_input);
        speed_input = document.getElementById("speed-input").value.toString();
    }

    console.log(pokeType);
    console.log(attack_input);
    console.log(defence_input);
    console.log(speed_input);

    const response = await fetch('/pokedex/filter', {
        method: 'GET',
        headers: {
            //'Content-Type': 'application/json',
             'pokeType': pokeType,
             'attack_input': attack_input,
             'defence_input': defence_input,
             'speed_input': speed_input,
        }
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

async function getEffectiveness() {
    const attackTypeElement = document.getElementById('pokemonAttackType');
    const defenceTypeElement = document.getElementById('pokemonDefenceType');
    const attackType = attackTypeElement.value;
    const defenceType = defenceTypeElement.value;

    const response = await fetch("/pokedex/effectiveness", {
        method: 'GET',
        headers: {
            'attack': attackType,
            'defence': defenceType
        }
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('effectivenessMsg');

    if (responseData.success) {
        const effectiveness = responseData.num;
        messageElement.textContent = `${effectiveness} X Effectiveness`;
    } else {
        alert("Error in retrieving data");
    }

}


// Challenges the gym whose name is entered. Creates record of gym battle, gym challenge, and adds any
// badges won during challenge to player inventory
// Sorry for how long and complex this function is ---- TODO: make more readable
async function challengeGym(event) {
    event.preventDefault();
    let winner;
    Math.random() > 0.5 ? winner = 'player' : winner = 'leader';   // determine battle victor
    let username = sessionStorage.getItem("user");

    const gymName = document.getElementById('searchName').value;
    const gymNameClean = gymName.toLowerCase().split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');

    const date = new Date();
    let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    // create battle record
    const response = await fetch('/insert-battle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: currentDate,
            winner: winner
        })
    });
    const responseData = await response.json();
    const battleid = responseData.id;
    if (!responseData.success) {
        alert("Error inserting battle");
    }

    // challenge gym 
    const challengeResponse = await fetch('/challenge-gym', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gym: gymNameClean,
            username: username,
            battle: battleid
        })
    });
    const challengeResponseData = await challengeResponse.json();
    const messageElement = document.getElementById('gymResultMsg');

    if (challengeResponseData.success) {
        if (winner === 'player') {
            messageElement.textContent = `Congratulations! You won the battle at ${gymNameClean}!!!`
        } else {
            messageElement.textContent = `You were defeated in battle at ${gymNameClean}...`
        }
    } else {
        if (username === null ) {
            messageElement.textContent = `Error challenging gym: ${gymNameClean}. Log in before attempting gym challenge!`;
        } else {
            messageElement.textContent = `Error challenging gym: ${gymNameClean}. Check that the entered gym name actually exists`;
        }
    }

    // if player won battle, player receives badge from gym if they haven't already collected them all
    if (winner === 'player' && challengeResponseData.success) {

        // get array of badges that particular gym offers
        const gymBadgeResponse = await fetch(`/badges/${gymNameClean}`, {
            method: 'GET', 
        });
        const gymBadgesJson = await gymBadgeResponse.json();
        let gymBadgesOffered = [];
        Object.values(gymBadgesJson.data).forEach(value => gymBadgesOffered.push(value[0])); 

        // get array of badges player has already acquired from that gym 
        const playerBadgesResponse = await fetch(`/player-badges/${gymNameClean}`, {
            method: 'GET',
            headers: {
                'username': username
            }
        });
        const playerBadgesJson = await playerBadgesResponse.json();
        let playerBadges = [];
        Object.values(playerBadgesJson.data).forEach(value => playerBadges.push(value[0])); 

        const badgesNotAquired = gymBadgesOffered.filter((badge) => !playerBadges.includes(badge));
        if (badgesNotAquired.length === 0) {
            messageElement.textContent += ` You have already aquired all possible badges from ${gymNameClean}`;
        } else {

            const newBadge = badgesNotAquired[0];

            const challengeResponse = await fetch('/player-badges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gym: gymNameClean,
                    username: username,
                    badge: newBadge
                })
            });

            messageElement.textContent += ` You aquire the ${newBadge} badge from ${gymNameClean}`;
        }
    }
}

// Fill the Leaderboard
async function fillLeaderBoard() {

    const tableElement = document.getElementById("leader-board");
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/leaderboard', {
        method: 'GET',
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            if (index != 1) {
                const cell = row.insertCell(index);
                cell.textContent = field;
            } else {
                const cell = row.insertCell(index);
                cell.textContent = field.slice(0, 10);
            }
            
        });
    });

}

// Find and display the pokemon with the user-inputted name
async function getPokemonByName() {
    const name = document.getElementById("nameInput").value.toLowerCase();
    fetchAndDisplayUsers('pokedex-pokemon-table', `/pokedex/find-by-name/${name}`);
}

// Reset the item attribute display panel
function resetItemStats() {
    console.log("resetItemStats function run");

    resetStatsHelper('flavor', "Flavor: ");
    resetStatsHelper('hp-restored', "HP Restored: ");
    resetStatsHelper('pp-restored', "PP Restored: ");
    resetStatsHelper('cures', "Cures: ");
    resetStatsHelper('cost', "Cost: ");
}

// Buy item for the trainer on click buy button
async function buyItem(){

    console.log("buyItem funtion run");
    const username = sessionStorage.getItem("user");
    const name = document.getElementById('item-to-buy-input').value;
  
    console.log(username);
    console.log(name);

    // Check quantity of the item
    const response_qty = await fetch(`/trainer_items/${username}/${name}`, {
        method: 'GET',
    });

    const responseData_qty = await response_qty.json();
    const contentRows_qty = responseData_qty.data;

    // If no items are found
    if (responseData_qty.data.length == 0) {
        //console.log("No item found");
    } else {
        console.log("item found. quantity as follows:");
        console.log(contentRows_qty[0][2]);
    }

    //update the Trainer_Items table
    if (responseData_qty.data.length == 0) {
        console.log("No item found");
        const response_addnew = await fetch('/trainer_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                quantity: 1
            })
        });
    
        const responseData_addnew = await response_addnew.json();
    
        if (responseData_addnew.success) {
            console.log("new item added!");
        } else {
            console.log("Fail to add new item");
        }

    } else {
        console.log("Item found");
        const newqty = contentRows_qty[0][2] + 1;
        console.log(`newQuantity in scripts ${newqty}`);

        //This is the BUG!!!
        const response_addold = await fetch(`/trainer_items/:name/:username/:quantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                // quantity: contentRows_qty[0][2],
                quantity: newqty
            })
        });
    
        const responseData_addold = await response_addold.json();
    
        if (responseData_addold.success) {
            console.log("new item added!");
        } else {
            console.log("Fail to add new item");
        }
    }

}

// Handler for click event on item table
async function populateItemStats(itemName) {
    resetItemStats();

    // console.log("item found!");

    // check the item is berry or medicine
    if (itemName.includes("berry")) {
        const response = await fetch(`/berries/${itemName}`, {
            method: 'GET', 
        });

        const responseData = await response.json();
        const contentRows = responseData.data;

        if (responseData.data.length == 0) {
            alert("Error: No stats found");
            return;
        }

        // console.log("Berry found!");
        // console.log(contentRows[0][1]);

        // fill the berry attribute
        const flavor = document.getElementById('flavor');
        flavor.innerHTML += contentRows[0][1];
          
    } else {
        const response = await fetch(`/medicine/${itemName}`, {
            method: 'GET', 
        });

        const responseData = await response.json();
        const contentRows = responseData.data;

        if (responseData.data.length == 0) {
            alert("Error: No stats found");
            return;
        }

        // fill the medicien attribute
        const hp_restored = document.getElementById('hp-restored');
        if (hp_restored) {
            hp_restored.innerHTML += contentRows[0][1];
        }
        const pp_restored = document.getElementById('pp-restored');
        if (pp_restored) {
            pp_restored.innerHTML += contentRows[0][2];
        }
        const cures = document.getElementById('cures');
        if (cures) {
            cures.innerHTML += contentRows[0][3];
        } 
        const cost = document.getElementById('cost');
        if (cost) {
            cost.innerHTML += contentRows[0][4];
        }
    }
}

// Filter items by dropdown menue
async function filterItems() {
    const itemElement = document.getElementById("items");
    const item = itemElement.value;

    const tableElement = document.getElementById("item-table");
    const tableBody = tableElement.querySelector('tbody');

    if (item == "berries") {
        await fetchAndDisplayUsers('item-table', '/store_berry');
        return;
    } else if (item == 'medicine') {
        fetchAndDisplayUsers('item-table', '/store_medicine');
        return;
    } else {
        fetchAndDisplayUsers('item-table', '/store');
        return;
    }
}

// Find items by enter name
async function findItemByName() {
    const item = document.getElementById("findbyname").value;
    const tableElement = document.getElementById("item-table");
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/store/${item}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    // If no items are found
    if (responseData.data.length == 0) {
        console.log("No item found");
        return;
    }

    fetchAndDisplayUsers('item-table', `/store/${item}`);
}

// Simple helper to allow Pokemon search by name at "enter" press
async function searchEnter(e) {
    if(e.key =='Enter') {
        getPokemonByName();
    }
}

// Allow user to catch a new Pokemon
async function catchPokemon(caughtPokeInfo) {
    //event.preventDefault();

    resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");

    // Retrieve random pokemon name
    const Nameresponse = await fetch('/pokedex', {
        method: 'GET',
    });
    const NameresponseData = await Nameresponse.json();
    const pokemonList = NameresponseData.data;
    let num = Math.floor(Math.random() * pokemonList.length);
    caughtPokeInfo.name = pokemonList[num];

    // GET and display base stats
    populatePokemonStats(caughtPokeInfo.name);

    // Pick Learned Moves
    caughtPokeInfo.learnedMoves = await pickLearnedMoves(caughtPokeInfo.name);
    const learnedMovesTemp = new Array().concat(caughtPokeInfo.learnedMoves);

    // display Learned Moves
    const learnedMovesAttribute = document.getElementById('pokemon-stats-learned-moves');

    while(learnedMovesTemp.length > 0) {
        const move = learnedMovesTemp.pop();
        if (learnedMovesTemp.length != 0) {
            learnedMovesAttribute.innerHTML += `${move}, `;
        } else {
            learnedMovesAttribute.innerHTML += `${move}`;
        }
        
    }
}

// Callback for realeasing a pokemon on the catch page
async function releaseCaughtPokemon(caughtPokeInfo) {
    
    caughtPokeInfo.name = '';
    caughtPokeInfo.learnedMoves = "";
    resetStats();
    resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");
    
}

// Callback for keeping a pokemon on the catch page
async function keepCaughtPokemon(caughtPokeInfo) {
        const username = sessionStorage.getItem("user");
        const nickname = getNickname();

        if(nickname == null || nickname == 'nickname') {
            alert("Error: Pokemon must have a nickname to be added to your team.");
            return;
        }
    
        //Player Pokemon POST
        const response = await fetch('/player-pokemon/catch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: caughtPokeInfo.name.toString(),
                nickname: nickname, 
                tr_username: username, 
                pp_level: 1
            })
        });
        const responseData = await response.json();
        if (!responseData.success) {
            alert("Error catching pokemon!");
            return;
        } 

        // Learned Moves POST
        let learnedMoves = caughtPokeInfo.learnedMoves;
        for(i = 0; i < learnedMoves.length; i++) {
            const response = await fetch('/player-pokemon/learned-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    move: learnedMoves[i].toString(),
                    name: caughtPokeInfo.name.toString(),
                    nickname: nickname, 
                    tr_username: username, 
                })
            });
            const responseData = await response.json();
            if (!responseData.success) {
                alert("Error adding pokemon move!");
                return;
            } 
        }

        
        alert("Pokemon sucessfully added to your team!");

        //Page clean up
        caughtPokeInfo.name = '';
        caughtPokeInfo.learnedMoves = "";
        resetStats();
        resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");
}

function getNickname() {
    var nickname;
    nickname = prompt("Please enter a nickname for your new pokemon", "nickname");
    return nickname;
}

//Helper to create an array of randomly learned moves
async function pickLearnedMoves(pokemonName) {
    const movesResponse = await fetch(`/pokemon/stats/${pokemonName}`, {
        method: 'GET', 
    });

    const movesResponseData = await movesResponse.json();
    const allData = movesResponseData.data;

    if (movesResponseData.data.length == 0) {
        alert("Error: No stats found");
        return;
    }

    const moveArray = new Array();
    for(i = 0; i < allData.length; i++) {
        if(!moveArray.includes(allData[i][6])) {
            moveArray.push(allData[i][6]);
        }
    }

    let moveNum = Math.floor(Math.random() * (moveArray.length - 1)) + 1;
    let learnedMoves = new Array();
    for(i = 0; i < moveNum; i++) {
        learnedMoves.push(moveArray[i]);
    }
    
    return learnedMoves;
}

// Handler for click event on pokedex pokemon table
async function populatePokemonStats(pokemonName) {

    resetStats();

    // GET data
    const response = await fetch(`/pokemon/stats/${pokemonName}`, {
        method: 'GET', 
    });

    const responseData = await response.json();
    const contentRows = responseData.data;

    if (responseData.data.length == 0) {
        alert("Error: No stats found");
        return;
    }

    //NAME
    const nameAttribute = document.getElementById('pokemon-stats-name');
    nameAttribute.innerHTML += pokemonName;

    //HP, ATTACK, DEFENCE, SPEED, GEN
    const hPAttribute = document.getElementById('pokemon-stats-hp');
    hPAttribute.innerHTML += contentRows[0][0];
    const attackAttribute = document.getElementById('pokemon-stats-attack');
    attackAttribute.innerHTML += contentRows[0][1];
    const defenceAttribute = document.getElementById('pokemon-stats-defence');
    defenceAttribute.innerHTML += contentRows[0][2];
    const speedAttribute = document.getElementById('pokemon-stats-speed');
    speedAttribute.innerHTML += contentRows[0][3];
    const genAttribute = document.getElementById('pokemon-stats-gen');
    genAttribute.innerHTML += contentRows[0][4];

    //TYPE
    const typeAttribute = document.getElementById('pokemon-stats-type');
    const typeArray = new Array();
    for(i = 0; i < contentRows.length; i++) {
        if(!typeArray.includes(contentRows[i][5])) {
            typeArray.push(contentRows[i][5]);
        }
    }
    while(typeArray.length > 1) {
        const type = typeArray.pop();
        typeAttribute.innerHTML += `${type}, `;
    }

    const type = typeArray.pop();
    typeAttribute.innerHTML += `${type}`;

    //MOVES
    const moveAttribute = document.getElementById('pokemon-stats-moves');

    if (moveAttribute) {
        const moveArray = new Array();
        for(i = 0; i < contentRows.length; i++) {
            if(!moveArray.includes(contentRows[i][6])) {
                moveArray.push(contentRows[i][6]);
            }
        }
        while(moveArray.length > 0) {
            const move = moveArray.pop();
            if (moveArray.length != 0) {
                moveAttribute.innerHTML += `${move}, `;
            } else {
                moveAttribute.innerHTML += `${move}`;
            }
        
        }
    }

}

// Helpers to reset result block for pokedex
async function resetStats() {

    resetStatsHelper('pokemon-stats-name', "NAME: ");
    resetStatsHelper('pokemon-stats-hp', "HP: ");
    resetStatsHelper('pokemon-stats-attack', "ATTACK: ");
    resetStatsHelper('pokemon-stats-defence', "DEFENCE: ");
    resetStatsHelper('pokemon-stats-speed', "SPEED: ");
    resetStatsHelper('pokemon-stats-gen', "GENERATION: ");
    resetStatsHelper('pokemon-stats-type', "TYPE: ");
    if (document.body.id != 'team') resetStatsHelper('pokemon-stats-moves', "MOVES: ");
}

async function resetStatsHelper(elementID, text) {
    const attribute = document.getElementById(elementID);
    const strongName = document.createElement('strong');
    strongName.textContent = text; 
    attribute.textContent = '';
    attribute.appendChild(strongName);
}

async function populatePlayerPokemonStats(nickname, name, level) {
    resetStatsHelper('pokemon-stats-nickname', "NICKNAME: ");
    resetStatsHelper('pokemon-stats-level', "LEVEL: ");
    resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");
    populatePokemonStats(name);
    document.getElementById('pokemon-stats-nickname').innerHTML += nickname;
    document.getElementById('pokemon-stats-level').innerHTML += level;

    const response = await fetch(`learned-move/${sessionStorage.getItem("user")}/${name}/${nickname}`, {
        method: 'GET', 
    });
    const responseData = await response.json();
    
    const learnedMovesTemp = responseData.data;
    
    // display Learned Moves
    const learnedMovesAttribute = document.getElementById('pokemon-stats-learned-moves');

    while(learnedMovesTemp.length > 0) {
        const move = learnedMovesTemp.pop();
        if (learnedMovesTemp.length != 0) {
            learnedMovesAttribute.innerHTML += `${move}, `;
        } else {
            learnedMovesAttribute.innerHTML += `${move}`;
        } 
    }
}

// Verify login information
//Use username: Suicune7, password: cpsc304IsCool to test for now
async function verifyLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);

    const response = await fetch(`/login/${username}/${password}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    // If username and password does not match, pop up alert window.
    if (responseData.data.length == 0) {
        alert("username and password combination is wrong. pleaese try again or do you want to sign up (๑❛ᴗ❛๑) ?");
        return;
    }

    // If username and password match, direct to index.html
    sessionStorage.setItem("user", username);
    window.location.href = 'index.html';
}

// Everify if the username already taken when sign up
async function verifyUsername(username) {
    const user = username;
    console.log("verify username function is running");
    console.log(user);

    const response = await fetch(`/login/${user}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    if (responseData.data.length == 0) {
        console.log("user does not exist");
        return true;
    } else {
        console.log("user exists");
        return false;
    }    
};
//TODO
// Verify if the zipcode already exist in timezone table
async function verifyZipcode(zipcode) {
    const zip = zipcode;
    const response = await fetch(`/timezone/${zip}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    // If username and password does not match, pop up alert window.
    if (responseData.data.length == 0) {
        return true;
    } else {
        return false;
    }    
};

// Generate new date following specified format
function getCurrentFormattedDate() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date();

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

    return `${day}-${month}-${year}`;
}

// Insert user timezone into timezone
async function insertZipcode(zipcode, timezone) {
    const response_timezone = await fetch('/insert-timezone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            zipcode: zipcode,
            timezone: timezone
        })
    });

    const responseData_timezone = await response_timezone.json();
    if (responseData_timezone.success) {
        console.log("Timezone inserted successfully!");
    } else {
        console.log("Timezone inserted NOT WORK");
    }
    return true;
}

// Insert new user to trainer table
async function insertNewUser(username, name, password, startdate, zipcode) {
    const response_user = await fetch('/insert-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            name: name,
            password: password,
            startdate: startdate,
            zipcode: zipcode
        })
    });

    const responseData_user = await response_user.json();
    if (responseData_user.success) {
        console.log("User inserted successfully!");
    } else {
        console.log("User inserted NOT WORK");
    }
}


// Inserts new user information into the trainer table
async function insertUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('nickname').value;
    const zipcode = document.getElementById('zipcode').value;
    const startdate = getCurrentFormattedDate();
    const timezone = document.getElementById('timezone').value;
    console.log("load parameters");
    console.log(username);
    console.log(name);
    console.log(password);
    console.log(startdate);
    console.log(zipcode);

    // verify if the username already taken
    const verify_user_result = await verifyUsername(username); //important to add, otherwise all the other function will run at the same time
    if (!verify_user_result) {
        alert("username already exist. please use another one");
        return; 
    } 
    console.log("finish run verify user, start verify zipcode")
    // verify if the zipcode already in the timezone table
    const verify_zipcod_result = await verifyZipcode(zipcode);

    if (verify_zipcod_result) {
        alert("zipcode does not exist. need to insert new row in timezone table");
        await insertZipcode(zipcode, timezone);
    } else {
        alert("zipcode does exist. no need to insert to timezone table");
    }

    console.log("finish run verify zipcode, start insert user");
    // insert the new user to trainer table;
    insertNewUser(username, name, password, startdate, zipcode);
    // redirect to the login page 
    alert("new user sign up successfully!");
    window.location.href = 'login.html';
    }

    // Delete selected player pokemon
    async function deletePokemon() {
        let pokemon = document.getElementById('pokemon-stats-name').textContent;
        pokemon = pokemon.split(" ").splice(1).join(" ");
    
        let nickname = document.getElementById('pokemon-stats-nickname').textContent;
        nickname = nickname.split(" ").splice(1).join(" ");
    
        if (pokemon === "" || nickname === "") {
            alert("Select the pokemon you want to release");
            return;
        }
        if (confirm(`Do you want to release your ${pokemon}, ${nickname}?`)) {
            const response = await fetch(`/player-pokemon/${pokemon}/${nickname}`, {
                method: 'DELETE',
                headers: {
                    'username': sessionStorage.getItem("user")
                }
            });
            const responseData = await response.json();
            if (responseData.success) {
                fetchAndDisplayUsers('team-pokemon-table', '/player-pokemon', sessionStorage.getItem("user"));
                resetStats();
                resetStatsHelper('pokemon-stats-nickname', "NICKNAME: ");
                resetStatsHelper('pokemon-stats-level', "LEVEL: ");
                resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");
                document.getElementById("pokemon-type").style.display = 'none';
                getPokemonCount();
            } else {
                alert("Error releasing pokemon");
            }
        }
    }
    
// increase pokemon level by 1    
async function trainPokemon() {
    let pokemon = document.getElementById('pokemon-stats-name').textContent;
    pokemon = pokemon.split(" ").splice(1).join(" ");
    let nickname = document.getElementById('pokemon-stats-nickname').textContent;
    nickname = nickname.split(" ").splice(1).join(" ");
    let level = document.getElementById('pokemon-stats-level').textContent;
    level = level.split(" ").splice(1).join(" ");

    const newLevel = parseInt(level) + 1;

    if (pokemon === "" || nickname === "" || level === "") {
        alert("Select the pokemon you want to train");
        return;
    }
    const response = await fetch('/player-pokemon', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: pokemon,
            nickname: nickname,
            username: sessionStorage.getItem("user"),
            level: newLevel
        })
    });

    const responseData = await response.json();
    if (responseData.success) {
        fetchAndDisplayUsers('team-pokemon-table', '/player-pokemon', sessionStorage.getItem("user"));
        resetStatsHelper('pokemon-stats-level', "LEVEL: ");
        document.getElementById('pokemon-stats-level').innerHTML += newLevel;
        alert(`${nickname}'s level increased from ${level} to ${newLevel}!`);
    } else {
        alert("Error training pokemon! Please try again.");
    }
}

async function countPokemonByType() {
    document.getElementById("pokemon-type").style.display = 'table-row';
    fetchAndDisplayUsers("pokemon-type", "/count-player-pokemon-type", sessionStorage.getItem("user"));
}

async function loadProfileInfo() {
    
    const username = sessionStorage.getItem('user');

    if(username == null) {return;}

    const response = await fetch('/user-info', {
        method: 'GET',
        headers: {
            'username': username
        }
    });

    const responseData = await response.json();

    document.getElementById('username-text').innerHTML += username;
    document.getElementById('name-text').innerHTML += responseData.name;
    document.getElementById('zip-text').innerHTML += responseData.zip;

}

// Change user's name
async function changeName(event) {
    
    event.preventDefault();
    const username = sessionStorage.getItem('user');

    let newNameValue = prompt("Please enter your new name", "new name");
    
    if(newNameValue == null) {
        alert('Please enter a name and try again');
        return;
    }


    const response = await fetch('/update-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            newName: newNameValue
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        resetStatsHelper('username-text', "USERNAME: ");
        resetStatsHelper('name-text', "NAME: ");
        resetStatsHelper('zip-text', "ZIP/POSTAL CODE: ");
        loadProfileInfo();
        alert("Name successfully updated!");
    } else {
        alert("Error updating name! Please try again.");
    }

}

// Change user's password
async function changePassword(event) {
    
    event.preventDefault();
    const username = sessionStorage.getItem('user');

    const infoResponse = await fetch('/user-info', {
        method: 'GET',
        headers: {
            'username': username
        }
    });

    const infoResponseData = await infoResponse.json();

    let oldPasswordValue = prompt("Please enter your old password", "old password");
    while(oldPasswordValue === null || oldPasswordValue === "new password") {
        oldPasswordValue = prompt("Please enter your old password", "old password");
    }


    if(oldPasswordValue != infoResponseData.password) {
        alert("Incorrect password! Please try again.");
        return;
    }

    let newPasswordValue = prompt("Please enter your new password", "new password");
    while(newPasswordValue === null || newPasswordValue === "new password") {
        newPasswordValue = prompt("Please enter your new password", "new password");
    }

    const response = await fetch('/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            newPassword: newPasswordValue
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        resetStatsHelper('username-text', "USERNAME: ");
        resetStatsHelper('name-text', "NAME: ");
        resetStatsHelper('zip-text', "ZIP/POSTAL CODE: ");
        loadProfileInfo();
        alert("Password successfully updated!");
    } else {
        alert("Error updating Password! Please try again.");
    }

}

// count number of player pokemon
async function getPokemonCount() {
    const response = await fetch(`/count-pokemon/${sessionStorage.getItem("user")}`, {
        method: 'GET'
    });

    const responseData = await response.json();

    if (responseData.success) {
        const count = responseData.count;
        document.getElementById("pokemonCaught").innerHTML = ('Pokemon Caught: ' + count);
    } else {
        alert("Error in count pokemon");
    }
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    if (sessionStorage.getItem('user') == null && (document.body.id != 'login') && (document.body.id != 'signup')) {
        window.location.href = 'login.html';
        return;
    }
    if (document.body.id == 'home') {
        loadProfileInfo();
        document.getElementById("logout-button").addEventListener('click', () => {
            if (confirm(`Are you sure you want to logout?`)) {
                sessionStorage.clear();
                window.location.href = 'login.html';
            }
        });
        document.getElementById("changeName-button").addEventListener('click', changeName);
        document.getElementById("password-button").addEventListener('click', changePassword);
    } else if (document.body.id == 'pokedex') {
        document.getElementById("filter-search-button").addEventListener("click", filterPokedex);
        document.getElementById("effectiveness-button").addEventListener("click", getEffectiveness);
        document.getElementById("name-search-button").addEventListener("click", getPokemonByName);
        document.getElementById("reset-button").addEventListener("click", () => {
            fetchTableData();
            resetStats();
        });
        document.getElementById("nameInput").addEventListener('keypress', searchEnter);
        document.getElementById("pokedex-pokemon-table").addEventListener('click', (e) => {
            if (e.target.tagName === 'TD') {populatePokemonStats(e.target.textContent);}
        });
    } else if (document.body.id == 'gym') {
        document.getElementById("gym-search").addEventListener("submit", challengeGym);
    } else if (document.body.id == 'team') {
        let user = sessionStorage.getItem("user");
        if (user === null) {
            document.getElementById("userTeamHeader").innerHTML = ("Log in to view team!");
        } else {
            document.getElementById("userTeamHeader").innerHTML = (user + "'s Team");
        }
        document.getElementById("team-pokemon-table").addEventListener('click', (e) => {
            if (e.target.tagName === 'TD') {
                let row = e.target.parentElement
                let rowElements = row.getElementsByTagName('TD');
                let nickname = rowElements[0].textContent;
                let pokemon = rowElements[1].textContent;
                let level = rowElements[2].textContent;
                populatePlayerPokemonStats(nickname, pokemon, level);
            }
        });
        document.getElementById("train-button").addEventListener("click", trainPokemon);
        document.getElementById("delete-button").addEventListener("click", deletePokemon);
        document.getElementById("count-type-button").addEventListener("click", countPokemonByType);
    } else if (document.body.id == 'store') {
        document.getElementById("findbytype-button").addEventListener("click", filterItems);
        document.getElementById("findbyname-button").addEventListener("click", findItemByName);
        document.getElementById("reset-attribute-button").addEventListener("click", resetItemStats);
        document.getElementById("item-table").addEventListener('click', (e) => {
            //tagName = 'TD' check the tag tabledata cell
            if (e.target.tagName === 'TD') {populateItemStats(e.target.textContent);}
            //set the item to buy input box as the clicked item
            document.getElementById('item-to-buy-input').value = e.target.textContent;
        });
        document.getElementById('buy-button').addEventListener("click", buyItem);
    } else if (document.body.id == 'login') {
        //sign up button direct to signup page
        document.getElementById("signup-btn").addEventListener("click", function () {
            window.location.href = 'signup.html';
        });
        //login button to login
        document.getElementById("login-btn").addEventListener("click", verifyLogin);
    } else if (document.body.id == 'signup') {
        document.getElementById("register-btn").addEventListener("click", insertUser);
    } else if (document.body.id === 'catch') {

        const caughtPokeInfo = {
            "Name": "",
            "Learned Moves": "", 
        }

        document.getElementById('catch-button').addEventListener('click', () => {
            catchPokemon(caughtPokeInfo);
        });
        document.getElementById('keep-button').addEventListener('click', () => {
            keepCaughtPokemon(caughtPokeInfo);
        });
        document.getElementById('release-button').addEventListener('click', () => {
            releaseCaughtPokemon(caughtPokeInfo);
        });

        
    }
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    if (document.body.id == 'home') {
        fillLeaderBoard();
    } else if (document.body.id == 'team') {
        getPokemonCount();
        fetchAndDisplayUsers('team-pokemon-table', '/player-pokemon', sessionStorage.getItem("user"));
        fetchAndDisplayUsers('team-bag', '/player-items', sessionStorage.getItem("user"));
        fetchAndDisplayUsers('team-badges', '/player-badges', sessionStorage.getItem("user"));
    } else if (document.body.id == 'gym') {
        fetchAndDisplayUsers('gym-table', '/gym');
    } else if (document.body.id == 'pokedex') {
        fetchAndDisplayUsers('pokedex-pokemon-table', '/pokedex');
        fetchAndDisplayUsers('pokedex-evolution-table', '/pokedex/evolutions');
    } else if (document.body.id == 'store') {
        fetchAndDisplayUsers('item-table', '/store');
    }
}
