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

// Filters visable pokemon in the pokedex according to user-selected type.
async function filterPokedex() {

    const tableElement = document.getElementById("pokedex-pokemon-table");
    const tableBody = tableElement.querySelector('tbody');

    //Construct object to dynamically add given filter types
    const pokeBinds = {};

    if (document.getElementById("type-option").checked && document.getElementById("pokemonType").value != 'all') {
        pokeBinds.poketype = document.getElementById("pokemonType").value.toString();
    }

    if (document.getElementById("attack-option").checked) {
        let attack = document.getElementById("attack-input").value.toString();
        pokeBinds.pokeattack = sanitize(attack, regex_digit);
        if(pokeBinds.pokeattack == null) {
            alert('Invalid attack input! Only numbers are accepted. Please try again.');
            return;
        }
    }

    if (document.getElementById("defence-option").checked) {
        let defence = document.getElementById("defence-input").value.toString();
        pokeBinds.pokedefence = sanitize(defence, regex_digit);
        if(pokeBinds.pokedefence == null) {
            alert('Invalid defence input! Only numbers are accepted. Please try again.');
            return;
        }
    }

    if (document.getElementById("speed-option").checked) {
        let speed = document.getElementById("speed-input").value.toString();
        pokeBinds.pokespeed = sanitize(speed, regex_digit);
        if(pokeBinds.pokespeed == null) {
            alert('Invalid speed input! Only numbers are accepted. Please try again.');
            return;
        }
    }

    const response = await fetch('/pokedex/filter', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'binds': JSON.stringify(pokeBinds) //convert object to JSON string so it can be passed to GET
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

// Retrieve effectiveness multiplier based on attack type and defence type
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

// Creates battle record with current date and winner
// Returns generated battle id or -1 if problem occured during post request
async function createBattleRecord(winner) {
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
        return -1;
    }
    return battleid;
}

// Creates gym challenge record
// Returns true if record created successfully; false otherwise
async function createChallengeRecord(gym, user, battleid) {
    const challengeResponse = await fetch('/challenge-gym', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gym: gym,
            username: user,
            battle: battleid
        })
    });
    const challengeResponseData = await challengeResponse.json();
    return challengeResponseData.success;
}

// Collects new badge if user has not already collected all badges from particular gym
async function collectGymBadge(gym, username) {
    const badgesRemaining = await fetch(`/player-badges-remaining/${gym}/${username}`, {
        method: 'GET'
    });
    
    const badgesRemainingJson = await badgesRemaining.json();

    let badgesNotAquired = []
    Object.values(badgesRemainingJson.data).forEach(value => badgesNotAquired.push(value[0]));

    const messageElement = document.getElementById('gymResultMsg');

    if (badgesNotAquired.length === 0) {
        messageElement.textContent += ` You have already aquired all possible badges from ${gym}`;
    } else {

        const newBadge = badgesNotAquired[0];

        const response = await fetch('/player-badges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gym: gym,
                username: username,
                badge: newBadge
            })
        });

        const responseData = await response.json();
        if (responseData.success) {
            messageElement.textContent += ` You aquire the ${newBadge} badge from ${gym}`;
        } else{
            alert("Error collecting gym badge. Please try again");
        }
    }
}

// Challenges the gym whose name is entered. Creates record of gym battle, gym challenge, and adds any
// badges won during challenge to player inventory
async function challengeGym(event) {
    event.preventDefault();
    let winner;
    Math.random() > 0.5 ? winner = 'player' : winner = 'leader';   // determine battle victor
    let username = sessionStorage.getItem("user");

    const gymName = document.getElementById('searchName').value;
    let gymNameClean  = sanitize_tolowercase(gymName, regex_lowercase_withspace);
    gymNameClean = gymNameClean.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');

    let battleId = await createBattleRecord(winner);

    // challenge gym 
    const messageElement = document.getElementById('gymResultMsg');

    if (await createChallengeRecord(gymNameClean, username, battleId)) {
        if (winner === 'player') {
            messageElement.textContent = `Congratulations! You won the battle at ${gymNameClean}!!!`
        } else {
            messageElement.textContent = `You were defeated in battle at ${gymNameClean}...`
        }
    } else {
        if (username === null) {
            messageElement.textContent = `Error challenging gym: ${gymNameClean}. Log in before attempting gym challenge!`;
        } else {
            messageElement.textContent = `Error challenging gym: ${gymNameClean}. Check that the entered gym name actually exists`;
        }
        return;
    }

    // if player won battle, player receives badge from gym if they haven't already collected them all
    if (winner === 'player') {
        collectGymBadge(gymNameClean, username);   
    }
}

// Fill the Leaderboard with Trainers who have all available pokemon in their current collection
async function fillPokemonLeaderBoard() {

    const tableElement = document.getElementById("leader-board");
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/leaderboard/pokemon', {
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

// Find and display the pokemon with the user-inputted name segment
async function getPokemonByName() {
    const name = document.getElementById("nameInput").value.toLowerCase();
    const sanitizedName = sanitize_tolowercase(name, regex_lowercase_withspace);
    fetchAndDisplayUsers('pokedex-pokemon-table', `/pokedex/find-by-name/${sanitizedName}`);
}

// Reset the item attribute display panel
function resetItemStats() {

    resetStatsHelper('flavor', "Flavor: ");
    resetStatsHelper('hp-restored', "HP Restored: ");
    resetStatsHelper('pp-restored', "PP Restored: ");
    resetStatsHelper('cures', "Cures: ");
    resetStatsHelper('cost', "Cost: ");
}

// Buy item for the trainer on click buy button
async function buyItem() {

    const username = sessionStorage.getItem("user");
    const name_raw = document.getElementById('item-to-buy-input').value;
    const name = sanitize_tolowercase(name_raw, regex_lowercase_withspace); // sanitize the input string

    // Check quantity of the item
    const response_qty = await fetch(`/trainer_items/${username}/${name}`, {
        method: 'GET',
    });

    const responseData_qty = await response_qty.json();
    const contentRows_qty = responseData_qty.data;

    //update the Trainer_Items table
    if (responseData_qty.data.length == 0) {
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
            alert("Item is added to your bag successfully!")
        } else {
            alert("Item cannot be added to your bag!")
        }

    } else {
        let newqty = contentRows_qty[0][2] + 1;
        const response_addold = await fetch(`/trainer_items/:name/:username/:quantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                quantity: newqty
            })
        });

        const responseData_addold = await response_addold.json();

        if (responseData_addold.success) {
            alert("Item is added to your bag successfully!")
        } else {
            alert("Item cannot be added to your bag!")
        }
    }

    fetchTableData();

}

// Handler for click event on item table
async function populateItemStats(itemName) {
    resetItemStats();


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

// Filter items by dropdown menu
async function filterItems() {
    const itemElement = document.getElementById("items");
    const item = itemElement.value;

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

// Find items by entering name
async function findItemByName() {
    let item_raw = document.getElementById("findbyname").value;
    const item = sanitize_tolowercase(item_raw, regex_lowercase_withspace); //sanitize string
    const tableElement = document.getElementById("item-table");

    const response = await fetch(`/store/${item}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    // If no items are found
    if (responseData.data.length == 0) {
        alert("No item found. Please try again");
        return;
    }

    fetchAndDisplayUsers('item-table', `/store/${item}`);
}

// Calculate berry count and medicine count
async function summarizeItem() {
    const response = await fetch('/summarize_item', {
        method: 'GET',
    });

    const responseData = await response.json();
    const columnrows = responseData.data;

    const berry_count = columnrows[0][0];
    const medicine_count = columnrows[0][1];

    document.getElementById("berry-count").textContent = berry_count;
    document.getElementById("medicine-count").textContent = medicine_count;
}

//Reset the summary data to TBD
function resetSummaryData() {
    document.getElementById("berry-count").textContent = 'TBD';
    document.getElementById("medicine-count").textContent = 'TBD';
}

// fecth item data and order the list by name in alphabetical order
async function orderListbyName(){
    const tableElement = document.getElementById('item-table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/item_list_orderbyname', {
        method: 'GET',
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

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

// Helper to allow Pokemon search action by name at "enter" key press
async function searchEnter(e) {
    if (e.key == 'Enter') {
        getPokemonByName();
    }
}

// Allow user to 'encounter' a random wild Pokemon
async function encounterWildPokemon(caughtPokeInfo) {

    resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");

    // Retrieve random pokemon name
    const Nameresponse = await fetch('/pokedex', {
        method: 'GET',
    });
    const NameresponseData = await Nameresponse.json();
    const pokemonList = NameresponseData.data;
    let num = Math.floor(Math.random() * pokemonList.length);
    caughtPokeInfo.name = pokemonList[num];

    // GET and display base stats for pokemon
    populatePokemonStats(caughtPokeInfo.name);

    // Pick Learned Moves
    caughtPokeInfo.learnedMoves = await pickLearnedMoves(caughtPokeInfo.name);
    const learnedMovesTemp = new Array().concat(caughtPokeInfo.learnedMoves);

    // display Learned Moves
    const learnedMovesAttribute = document.getElementById('pokemon-stats-learned-moves');

    while (learnedMovesTemp.length > 0) {
        const move = learnedMovesTemp.pop();
        if (learnedMovesTemp.length != 0) {
            learnedMovesAttribute.innerHTML += `${move}, `;
        } else {
            learnedMovesAttribute.innerHTML += `${move}`;
        }

    }
}

// Realease an 'encountered' pokemon on the catch page
async function releaseCaughtPokemon(caughtPokeInfo) {

    caughtPokeInfo.name = '';
    caughtPokeInfo.learnedMoves = "";
    resetStats();
    resetStatsHelper('pokemon-stats-learned-moves', "LEARNED MOVES: ");

}

// Keep an 'encountered' pokemon on the catch page
async function keepCaughtPokemon(caughtPokeInfo) {
    const username = sessionStorage.getItem("user");
    const nickname = getNickname();

    if (nickname == null || nickname == 'nickname') {
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
    for (i = 0; i < learnedMoves.length; i++) {
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
    let nickname = prompt("Please enter a nickname for your new pokemon", "nickname");
    nickname = sanitize(nickname, regex_withspace);
    return nickname;
}

//Create an array of randomly learned moves from a pokemon's can_learn moves
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
    for (i = 0; i < allData.length; i++) {
        if (!moveArray.includes(allData[i][6])) {
            moveArray.push(allData[i][6]);
        }
    }

    let moveNum = Math.floor(Math.random() * (moveArray.length - 1)) + 1;
    let learnedMoves = new Array();
    for (i = 0; i < moveNum; i++) {
        learnedMoves.push(moveArray[i]);
    }

    return learnedMoves;
}

// Retrieve pokemon stats and display them on page
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
    for (i = 0; i < contentRows.length; i++) {
        if (!typeArray.includes(contentRows[i][5])) {
            typeArray.push(contentRows[i][5]);
        }
    }
    while (typeArray.length > 1) {
        const type = typeArray.pop();
        typeAttribute.innerHTML += `${type}, `;
    }

    const type = typeArray.pop();
    typeAttribute.innerHTML += `${type}`;

    //MOVES
    const moveAttribute = document.getElementById('pokemon-stats-moves');

    if (moveAttribute) {
        const moveArray = new Array();
        for (i = 0; i < contentRows.length; i++) {
            if (!moveArray.includes(contentRows[i][6])) {
                moveArray.push(contentRows[i][6]);
            }
        }
        while (moveArray.length > 0) {
            const move = moveArray.pop();
            if (moveArray.length != 0) {
                moveAttribute.innerHTML += `${move}, `;
            } else {
                moveAttribute.innerHTML += `${move}`;
            }

        }
    }

}

// Reset result blocks on pages
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

// Helper to Reset result blocks on pages
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

    while (learnedMovesTemp.length > 0) {
        const move = learnedMovesTemp.pop();
        if (learnedMovesTemp.length != 0) {
            learnedMovesAttribute.innerHTML += `${move}, `;
        } else {
            learnedMovesAttribute.innerHTML += `${move}`;
        }
    }
}

// Verify login information
async function verifyLogin() {

    const username = document.getElementById("username_text").value.trim();
    const password = document.getElementById("password_text").value;

    //Verify if the enter box is empty
    if (username == ''|| password == '') {
        alert("username and password cannot be empty. please try again");
        return;
    }

    const response = await fetch(`/login/${username}/${password}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    // If username and password does not match, pop up alert window.
    if (responseData.data.length == 0) {
        alert("Username and password combination is wrong. Please try again or sign up (๑❛ᴗ❛๑) ?");
        return;
    }

    // If username and password match, direct to index.html
    sessionStorage.setItem("user", username);
    if (sessionStorage.getItem("user") === 'admin') {
        window.location.href = 'admin.html'
    } else {
        window.location.href = 'index.html';
    }
}

// Everify if the username already taken when sign up
async function verifyUsername(username) {
    const user = username;

    const response = await fetch(`/login/${user}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    if (responseData.data.length == 0) {
        return true;
    } else {
        return false;
    }
};

// Verify if the zipcode already exist in timezone table
async function verifyZipcode(zipcode) {
    const zip = zipcode;
    const response = await fetch(`/timezone/${zip}`, {
        method: 'GET',
    });

    const responseData = await response.json();

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
        return true;
    } else {
        return false;
    }
}

// Inserts new user information into the trainer table
async function insertUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name_raw = document.getElementById('nickname').value.trim();
    const zipcode_raw = document.getElementById('zipcode').value.trim();
    const startdate = getCurrentFormattedDate();
    const timezone = document.getElementById('timezone').value;

    const name = sanitize(name_raw, regex_nickname);
    const zipcode = sanitize(zipcode_raw, regex_zipcode);

    if (username == '' || password == '' || name == '' || zipcode == '') {
        alert("input cannot be empty. please try again");
        return;
    }

    if (!regex_valid_username.test(username)){
        alert("Username is invalid. It needs to be combination of alphanumeric characters or _. please try again");
        return;
    }

    if (!regex_valid_password.test(password)){
        alert("Password is invalid. It needs to be combination of  alphanumeric characters, !, @, #, &. Please try again");
        return;
    }

    // verify if the username already taken
    const verify_user_result = await verifyUsername(username);
    
    if (!verify_user_result) {
        alert("username already exist. please use another one");
        return;
    }
    
    // verify if the zipcode already in the timezone table
    const verify_zipcod_result = await verifyZipcode(zipcode);

    if (verify_zipcod_result) {
        await insertZipcode(zipcode, timezone);
    } else {
        console.log("zipcode does exist. no need to insert to timezone table");
    }

    // insert the new user to trainer table;
    const insertNewUserResult = await fetch('/insert-user', {
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

    const insert_new_user_result = await insertNewUserResult.json();
    if (insert_new_user_result.success) {
        alert("Signup successfully!");
        window.location.href ='login.html';
    } else {
        alert("Sorry there is something wrong with your signup");
    } 
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

    if (username == null) { return; }

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
    newNameValue = sanitize(newNameValue, regex_withspace);

    if (newNameValue == null) {
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
    oldPasswordValue = sanitize(oldPasswordValue, regex_valid_password);


    if (oldPasswordValue != infoResponseData.password) {
        alert("Incorrect password! Please try again.");
        return;
    }

    let newPasswordValue = prompt("Please enter your new password", "new password");
    newPasswordValue = sanitize(newPasswordValue, regex_valid_password);
    if (newPasswordValue === null || newPasswordValue === "new password") {
        return;
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

// Change user's zipcode and timezone
async function launchChangeZipcode(event) {
    event.preventDefault();

    // get the new zipcode from the window dialog box
    let newZipcode = prompt("Please enter your new zipcode", "new zipcode");
    if (newZipcode == null) {
        alert('Please enter a zipcode and try again');
        return;
    }

    let responseSearchZip = await fetch(`/timezone/${newZipcode}`, {
        method: 'GET',
    });

    const responseZipcode = await responseSearchZip.json();

    if (responseZipcode.data.length == 0) {
        const zipModal = document.getElementById('timezone-change-modal');

        document.getElementById("new-zip-confirm-btn").addEventListener('click', async () => {
            let newTimezone = document.getElementById("timezone").value;
            await insertZipcode(newZipcode, newTimezone);
            await updateZipCode(newZipcode); 
            zipModal.close();
        });

        zipModal.showModal();
        
    } else {
        alert("Zipcode already exist! No need to update our timezone records.");
        await updateZipCode(newZipcode);
    };

}

// Function to update the zipcode in the Trainer table
async function updateZipCode(zipCode) {

    let username = sessionStorage.getItem("user");

    //Update the zipcode of trainer
    const responseUpdateZipcode = await fetch(`/update_zipcode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            zipcode: zipCode
        })
    })

    const responseUpdateZipcodeData = await responseUpdateZipcode.json();

    if (responseUpdateZipcodeData.success) {
        resetStatsHelper('username-text', "USERNAME: ");
        resetStatsHelper('name-text', "NAME: ");
        resetStatsHelper('zip-text', "ZIP/POSTAL CODE: ");
        loadProfileInfo();
        alert("Trainer zipcode updated correctly");
    } else {
        alert("Trainer zipcode cannot be updated. Please try again.");
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

// displays user's name followed by display message on object with elementId
async function displayName(elementId, username, displaymessage) {
    const response = await fetch('/user-info', {
        method: 'GET',
        headers: {
            'username': username
        }
    });

    const responseData = await response.json();
    let message = responseData.name;
    message += displaymessage;
    document.getElementById(elementId).innerHTML = (message);
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
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
        if ((sessionStorage.getItem("user") === 'admin')) {
            document.getElementById("admin-button").style.display = "inline-block";
            document.getElementById("admin-button").addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
        document.getElementById("changeName-button").addEventListener('click', changeName);
        document.getElementById("password-button").addEventListener('click', changePassword);
        document.getElementById("changeZipcode").addEventListener('click', launchChangeZipcode);
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
            if (e.target.tagName === 'TD') { populatePokemonStats(e.target.textContent); }
        });
    } else if (document.body.id == 'gym') {
        document.getElementById("gym-search").addEventListener("submit", challengeGym);
        document.getElementById("gym-table").addEventListener('click', (e) => {
            if (e.target.tagName === 'TD') {
                let row = e.target.parentElement
                let rowElements = row.getElementsByTagName('TD');
                let gymName = rowElements[0].textContent;
                document.getElementById('searchName').value = gymName;
            }
        });
    } else if (document.body.id == 'team') {
        let user = sessionStorage.getItem("user");
        if (user === null) {
            document.getElementById("userTeamHeader").innerHTML = ("Log in to view team!");
        } else {
            displayName("userTeamHeader", user, "'s Team");
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
            if (e.target.tagName == 'TD') { populateItemStats(e.target.textContent); }
            //set the item to buy input box as the clicked item
            document.getElementById('item-to-buy-input').value = e.target.textContent;
        });
        document.getElementById('buy-button').addEventListener("click", buyItem);
        document.getElementById('order-list-by-name').addEventListener('click', orderListbyName);
        document.getElementById('summarize-item').addEventListener('click', summarizeItem);
        document.getElementById('reset-summary-data').addEventListener('click', resetSummaryData);
    } else if (document.body.id == 'login') {
        document.getElementById("signup-btn").addEventListener("click", function () {
            window.location.href = 'signup.html';
        });
        document.getElementById("login-btn").addEventListener("click", verifyLogin);
    } else if (document.body.id == 'signup') {
        document.getElementById("register-btn").addEventListener("click", insertUser);
    } else if (document.body.id === 'catch') {

        const caughtPokeInfo = {
            "Name": "",
            "Learned Moves": "",
        }

        document.getElementById('catch-button').addEventListener('click', () => {
            encounterWildPokemon(caughtPokeInfo);
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
        fillPokemonLeaderBoard();
        fetchAndDisplayUsers('gym-board', '/leaderboard/gym');
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
        fetchAndDisplayUsers('frequent-buyers-table', '/frequentbuyers');
    }
}

//Helper function for data sanitize
const regex_lowercase_withspace = /^[a-z\s]+$/ //regex identify lowercase letter with whitesapce inbetween
const regex_lowercase_nospace = /^[a-z]+$/ //regex identify lowercase letter without whitesapce inbetween
const regex_withspace = /^[a-zA-Z\s]+$/ //regex to identify case-sensitive letter with whitespace inbetween
const regex_nospace = /^[a-zA-Z]+$/ //regex to identify case-sensitive letter with whitespace inbetween
const regex_digit = /^[0-9]*$/ //regex to identify digit only inputs
const regex_valid_username = /^[a-zA-Z0-9_]+$/ //regex to for valid username
const regex_valid_password = /^[a-zA-Z0-9!@#&]+$/ //regex for valid password
const regex_nickname = /^[a-zA-Z0-9_\s]+$/ //regex to sanitize nickname
const regex_zipcode = /^[a-zA-Z0-9-\s]+$/ //regex to sanitize zipcode


// sanitize to lowercase string
// used for searching by name (pokemon, item)
function sanitize_tolowercase(str, regex) {
    //trim the leading the tailing white space, and convert to lowercase
    let trim_str = str.trim().toLowerCase();
    let sanitized_str = '';

    for (let char of trim_str) {
        if (regex.test(char)) {
            sanitized_str += char;
        }
    }

    result = sanitized_str.trim();

    if (result !== '') {
        console.log("sanitized string is", result);
        return result;
    } else {
        console.log('Input is invalid. Please try again');
        return;
    }
};

// sanitize to letter sensitive string
// used for renaming (pokemon, nickname)
function sanitize(str, regex) {
    // trim the leading the tailing white space, and convert to lowercase
    let trim_str = str.trim();
    let sanitized_str = '';

    //use regex for matching the string
    for (let char of trim_str) {
        if (regex.test(char)) {
            sanitized_str += char;
        }
    }

    result = sanitized_str.trim();

    if (result !== '') {
        console.log("sanitized string is", result);
        return result;
    } else {
        console.log('Input is invalid. Please try again');
        return;
    }
};
