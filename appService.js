const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPlayerPokemonFromDb(username) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT nickname, name, pp_level FROM Player_Pokemon WHERE tr_username = '${username}'`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

/*Renbo: fetch items table from database*/
async function fetchItemstableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Items');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

/*Renbo: fetch item berry table from database*/
async function fetchItemsberryFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute("SELECT * FROM Items WHERE NAME LIKE '%berry%' ");
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//fetch item medicine table from database*/
async function fetchItemsmedicineFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute("SELECT * FROM Items WHERE NAME NOT LIKE '%berry%' ");
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//funtion to filter item by name
async function fetchItembyNameFromDb(name) {
    return await withOracleDB(async (connection) => {
        //Pass name as a variable to sql query
        const result = await connection.execute(`SELECT * FROM Items WHERE NAME = :name`, [name]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchGymsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Gym');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// inserts battle and returns auto generated battle id
async function insertBattle(date, winner) {
    return await withOracleDB(async (connection) => {
        console.log(date);
        console.log(winner);
        let battle_date = date;
        const result = await connection.execute(
            `INSERT INTO Battle (battle_date, winner) VALUES (TO_DATE(:battle_date, 'dd/mm/yyyy'), :winner)`,
            [battle_date, winner],
            { autoCommit: true }
        );
        console.log(result.lastRowid);
        const battleid = await connection.execute(`SELECT id FROM Battle WHERE ROWID = '${result.lastRowid}'`);
        return battleid.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


async function fetchPokemonFromDb() {
    return await withOracleDB(async (connection) => {
       const result = await connection.execute('SELECT name FROM Pokemon');
       return result.rows;
    }).catch(()=> {
        return [];
    });
}

async function fetchEvolutionsFromDb() {
    return await withOracleDB(async (connection) => {
       const result = await connection.execute('SELECT * FROM Evolutions');
       return result.rows;
    }).catch(()=> {
        return [];
    });
}

async function fetchTypeFiltersFromDb(type) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT DISTINCT name FROM Pokemon_type WHERE type = '${type}'`);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


async function fetchTypeMatchupFromDb(attack, defence) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT effect_multiplier FROM Type_Versus WHERE attack_type=:attack and defense_type=:defence`, 
            [attack, defence]
        );
        return result.rows[0][0];
    }).catch(()=> {
        return -1;
    });

}

async function fetchPokemonByNameFromDb(name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT name FROM Pokemon 
                                                WHERE name LIKE '%${name}%'`);
        return result.rows;
    }).catch(()=> {
        return [];
    });

}



module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    fetchPlayerPokemonFromDb,
    fetchGymsFromDb,
    fetchPokemonFromDb,
    fetchEvolutionsFromDb, 
    fetchTypeFiltersFromDb,
    fetchItemstableFromDb,
    fetchItemsberryFromDb,
    fetchItemsmedicineFromDb,
    fetchItembyNameFromDb,
    insertBattle,
    fetchTypeMatchupFromDb,
    fetchPokemonByNameFromDb
};