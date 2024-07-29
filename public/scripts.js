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

// TODO: update this, using for now in place of login

let trainer = ""; //initial setup of global variable trainer

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
// Modified this so that it updates any table with data fetched from 'endpoint'
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
async function filterPokemonType() {
    const typeElement = document.getElementById('pokemonType');
    const type = typeElement.value;

    const tableElement = document.getElementById("pokedex-pokemon-table");
    const tableBody = tableElement.querySelector('tbody');

    if(type == "all") {
        fetchAndDisplayUsers('pokedex-pokemon-table', '/pokedex');
        return;
    }

    const response = await fetch(`/pokedex/type-filter/${type}`, {
        method: 'GET', 
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


// 
async function challengeGym() {
    const gymName = document.getElementById('searchName').value;
    const date = new Date();
    let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    // console.log(currentDate);

    const response = await fetch('/insert-battle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: currentDate,
            winner: 'Test'
        })
    });
    const responseData = await response.json();
    const messageElement = document.getElementById('gymResultMsg');
    console.log(responseData.id);
    // if (responseData.success) {
    //     messageElement.textContent = `Data inserted successfully! id: ${responseData.id} `;
    // } else {
    //     messageElement.textContent = "Error inserting data!";
    // }

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

// Find and display the pokemon with the user-inputted name
async function getPokemonByName() {
    const name = document.getElementById("nameInput").value.toLowerCase();
    console.log(name);
    fetchAndDisplayUsers('pokedex-pokemon-table', `/pokedex/find-by-name/${name}`);
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
    console.log('entered function');
    if(e.key =='Enter') {
        console.log('enter detected');
        getPokemonByName();
    }
}

// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    if (document.body.id == 'home') {
        // I've commented this out because for some unknown reason it causes multiple error messages to display otherwise
        // but everything seems to be working fine - might want to investigate more later
        // checkDbConnection();
        document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
        document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
        document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
        document.getElementById("countDemotable").addEventListener("click", countDemotable);
    } else if (document.body.id == 'pokedex') {
        document.getElementById("type-search-button").addEventListener("click", filterPokemonType);
        document.getElementById("effectiveness-button").addEventListener("click", getEffectiveness);
        document.getElementById("name-search-button").addEventListener("click", getPokemonByName);
        document.getElementById("reset-button").addEventListener("click", fetchTableData);
        document.getElementById("nameInput").addEventListener('keypress', searchEnter);
    } else if (document.body.id == 'gym') {
        document.getElementById("gym-search").addEventListener("submit", challengeGym);
    } else if (document.body.id == 'store') {
        document.getElementById("findbytype-button").addEventListener("click", filterItems);
        document.getElementById("findbyname-button").addEventListener("click", findItemByName);
    } else if (document.body.id == 'login') {
        //sign up button direct to signup page
        document.getElementById("signup-btn").addEventListener("click", function () {
            window.location.href = 'signup.html';
        });
        //login button to login
        document.getElementById("login-btn").addEventListener("click", verifyLogin);
    }
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    if (document.body.id == 'home') {
        fetchAndDisplayUsers('demotable', '/demotable');
    } else if (document.body.id == 'team') {
        fetchAndDisplayUsers('team-pokemon-table', '/player-pokemon', username);
    } else if (document.body.id == 'gym') {
        fetchAndDisplayUsers('gym-table', '/gym');
    } else if (document.body.id == 'pokedex') {
        fetchAndDisplayUsers('pokedex-pokemon-table', '/pokedex');
        fetchAndDisplayUsers('pokedex-evolution-table', '/pokedex/evolutions');
    } else if (document.body.id == 'store') {
        fetchAndDisplayUsers('item-table', '/store');
    }
}
