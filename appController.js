const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// Counts number of pokemon a player has
router.get('/count-pokemon/:username', async (req, res) => {
    const {username} = req.params;
    const tableCount = await appService.countPlayerPokemon(username);
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

// counts number of pokemon of each type that a player has
router.get('/count-player-pokemon-type', async (req, res) => {
    const tableContent = await appService.countPlayerPokemonByType(req.headers['username']);
    res.json({data: tableContent});
});

// get player pokemon info
router.get('/player-pokemon', async (req, res) => {
    const tableContent = await appService.fetchPlayerPokemonFromDb(req.headers['username']);
    res.json({data: tableContent});
});

// update player pokemon level
router.put('/player-pokemon', async (req, res) => {
    const { name, nickname, username, level } = req.body;
    const updateResult = await appService.updatePokemonLevel(name, nickname, username, level);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// delete player pokemon
router.delete('/player-pokemon/:pokemon/:nickname', async (req, res) => {
    const {pokemon, nickname} = req.params;
    const deleteResult = await appService.deletePlayerPokemonFromDb(req.headers['username'], pokemon, nickname);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/player-items', async (req, res) => {
    const tableContent = await appService.fetchPlayerItemsFromDb(req.headers['username']);
    res.json({data: tableContent});
});

// fetch and return the leaderboard of all players that have caught all pokemon
router.get('/leaderboard/pokemon', async (req, res) => {
    const tableContent = await appService.fetchPokemonLeaderboardFromDb();
    res.json({data: tableContent});
});

// fetch and return the leaderboard of all players with more than one gym badge
router.get('/leaderboard/gym', async (req, res) => {
    const tableContent = await appService.fetchGymLeaderboardFromDb();
    res.json({data: tableContent});
});

// fetch and return the leaderboard of all players with more than one gym badge
router.get('/frequentbuyers', async (req, res) => {
    const tableContent = await appService.fetchFrequentBuyersFromDb();
    res.json({data: tableContent});
});


// fetch and return user info
router.get('/user-info', async (req, res) => {
    const info = await appService.fetchUserbyUsernameFromDb(req.headers['username']);
    res.json({  username: info[0][0],
                name: info[0][1],
                password: info[0][2],
                start_date: info[0][3],
                zip: info[0][4]
    });
});

// update user's name in database
router.post("/update-name", async (req, res) => {
    const { username, newName } = req.body;
    const updateResult = await appService.updateName(username, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// update user's password in database
router.post("/update-password", async (req, res) => {
    const { username, newPassword } = req.body;
    const updateResult = await appService.updatePassword(username, newPassword);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// add player pokemon after catching it
router.post("/player-pokemon/catch", async (req, res) => {
    const {name, nickname, tr_username, pp_level} = req.body;
    const insertResult = await appService.insertPlayerPokemon(name, nickname, tr_username, pp_level);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


// add player pokemon move after catching it
router.post("/player-pokemon/learned-move", async (req, res) => {
    const {move, name, nickname, tr_username} = req.body;
    const insertResult = await appService.insertPlayerPokemonMove(move, name, nickname, tr_username);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// get player pokemon learned moves
router.get("/learned-move/:username/:pokemon/:nickname", async (req, res) => {
    const {username, pokemon, nickname} = req.params;
    const tableContent = await appService.fetchLearnedMovesFromDb(username, pokemon, nickname);
    res.json({data: tableContent});
});

// get player badges
router.get('/player-badges', async (req, res) => {
    const tableContent = await appService.fetchPlayerBadgesFromDb(req.headers['username']);
    res.json({data: tableContent});
});

// add player badge
router.post("/player-badges", async (req, res) => {
    const { gym, username, badge } = req.body;
    const insertResult = await appService.insertPlayerBadge(gym, username, badge);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.get('/gym', async (req, res) => {
    const tableContent = await appService.fetchGymsFromDb();
    res.json({data: tableContent});
});

// get badges a player has not yet received from specific gym
router.get('/player-badges-remaining/:gym/:username', async (req, res) => {
    const {gym, username} = req.params;
    const tableContent = await appService.fetchPlayerBadgesRemainingFromDb(username, gym);
    res.json({data: tableContent});
});

router.post("/insert-battle", async (req, res) => {
    const {date, winner } = req.body;
    const insertResult = await appService.insertBattle(date, winner);
    if (insertResult > 0) {
        res.json({ success: true , id: insertResult});
    } else {
        res.status(500).json({ success: false , id: -1});
    }
});

router.post("/challenge-gym", async (req, res) => {
    const { gym, username, battle } = req.body;
    const insertResult = await appService.insertGymChallenge(gym, username, battle);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//get items from database
router.get('/store', async (req, res) => {
    const tableContent = await appService.fetchItemstableFromDb();
    res.json({data: tableContent});
});

// get item from database order by name alphabetically
router.get('/item_list_orderbyname', async (req, res) => {
    const tableContent = await appService.fetchItemsAlphabetic();
    res.json({data: tableContent});
});

// get item summary data (berry count & medicine count) from database
router.get('/summarize_item', async (req, res) => {
    const tableContent = await appService.summarizeItem();
    res.json({data: tableContent});
});

//get items_berries from databse
router.get('/store_berry', async (req, res) => {
    const tableContent = await appService.fetchItemsberryFromDb();
    res.json({data: tableContent});
});

//get items_medicine from databse
router.get('/store_medicine', async (req, res) => {
    const tableContent = await appService.fetchItemsmedicineFromDb();
    res.json({data: tableContent});
});

//get items by name from databse
router.get('/store/:name', async (req, res) => {
    //parse the parameter from address
    const name = req.params.name;
    const tableContent = await appService.fetchItembyNameFromDb(name);
    res.json({data: tableContent});
});

//get berry by name from databse
router.get('/berries/:name', async (req, res) => {
    //parse the parameter from address
    const name = req.params.name;
    const tableContent = await appService.fetchBerryByNameFromDb(name);
    res.json({data: tableContent});
});

//get medicine by name from databse
router.get('/medicine/:name', async (req, res) => {
    //parse the parameter from address
    const name = req.params.name;
    const tableContent = await appService.fetchMedicineByNameFromDb(name);
    res.json({data: tableContent});
});

//Add item information to trainer_items table
router.post("/trainer_items", async (req, res) => {
    const { name, username, quantity } = req.body;
    const insertResult = await appService.insertTrainerAndItem(name, username, quantity);
    if (insertResult) {
        res.json({ success: true , id: insertResult});
    } else {
        res.status(500).json({ success: false , id: -1});
    }
});

//get username and item from trainer_items databse
router.get('/trainer_items/:username/:itemname', async (req, res) => {
    //parse the parameter from address
    const { username, itemname } = req.params;
    const tableContent = await appService.fetchUserAndItemFromDb(username, itemname);
    res.json({data: tableContent});
});

//update the quantity of trainer item
router.post("/trainer_items/:name/:username/:quantity", async (req, res) => {
    const { name, username, quantity } = req.body;
    const insertResult = await appService.updateQuantity(name, username, quantity);
    if (insertResult > 0) {
        res.json({ success: true , id: insertResult});
    } else {
        res.status(500).json({ success: false , id: -1});
    }
});

//insert zipcode and timezone to timezone table
router.post("/insert-timezone", async (req, res) => {
    const { zipcode, timezone } = req.body;
    const insertResult = await appService.insertTimezoneDb(zipcode, timezone);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Insert new user to trainer table
router.post("/insert-user", async (req, res) => {
    const { username, name, password, startdate, zipcode } = req.body;
    const insertResult = await appService.insertUserToDb(username, name, password, startdate, zipcode);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//get users by username and password from databse
router.get('/login/:username/:password', async (req, res) => {
    const { username, password } = req.params;
    const tableContent = await appService.fetchUserFromDb(username, password);
    res.json({data: tableContent});
});

//Verify username for login and signup
router.get('/login/:username', async (req, res) => {
    const { username } = req.params;
    const tableContent = await appService.fetchUserbyUsernameFromDb(username);
    res.json({data: tableContent});
});

//Verify & Find zipcode for signup and zipcode update.
router.get('/timezone/:zipcode', async (req, res) => {
    const { zipcode } = req.params;
    const tableContent = await appService.fetchTimezoneFromDb(zipcode);
    res.json({data: tableContent});
});

//Update zipcode for trainer.
router.post('/update_zipcode', async (req, res) => {
    const { username, zipcode } = req.body;
    const insertResult = await appService.updateUserZipcode(username, zipcode);
    
    if (insertResult) {
        res.json({ success: true , id: insertResult});
    } else {
        res.status(500).json({ success: false , id: -1});
    }
});

//Get pokemon for display in the pokedex 
router.get('/pokedex', async (req, res) => {
    const tableContent = await appService.fetchPokemonFromDb();
    res.json({data: tableContent});
});

//Get pokemon evolutions for display in the pokedex 
router.get('/pokedex/evolutions', async (req, res) => {
    const tableContent = await appService.fetchEvolutionsFromDb();
    res.json({data: tableContent});
});

// Get all pokemon that match the requested type
router.get('/pokedex/find-by-name/:name', async (req, res) => {
    const tableContent = await appService.fetchPokemonByNameFromDb(req.params.name);
    res.json({data: tableContent});
});

//Get all pokemon that match the requested filters
// Binds object tranformed to map to preserve key order when iterated for query construction
router.get('/pokedex/filter', async (req, res) => {
    //parse incoming object
    const bindsObject = JSON.parse(req.headers.binds);
    const bindsMap = new Map();
    for(let property in bindsObject) {
        bindsMap.set(property, bindsObject[property]);
    }
    const tableContent = await appService.fetchPokedexFiltersFromDb(bindsMap);
    res.json({data: tableContent});
});

// Get the type effectiveness match-up of the requested types
router.get('/pokedex/effectiveness', async (req, res) => {
    const {attack, defence} = req.headers;
    const multiplier = await appService.fetchTypeMatchupFromDb(attack, defence);

    if (multiplier >= 0) {
        res.json({
            success: true,
            num: multiplier
        });
    } else {
        res.status(500).json({
            success: false,
            count: multiplier
        });
    }

});

// Get pokemon stats from database
router.get('/pokemon/stats/:name', async (req, res) => {
    const content = await appService.fetchPokemonStatsFromDb(req.params.name);
    res.json({data: content});
});

// Get names of all tables in database
router.get('/table-names', async (req, res) => {
    const content = await appService.fetchTableNames();
    res.json({data: content});
});

// Get names of all columns in 'table' in database
router.get('/column-names/:table', async (req, res) => {
    const content = await appService.fetchColumnNames(req.params.table);
    res.json({data: content});
});

router.get('/selected-columns/:table', async (req, res) => {
    const content = await appService.fetchSpecifiedColumnsFromDB(req.params.table, req.headers['columns']);
    res.json({data: content});
});


module.exports = router;