import knex from "knex";

// Connect To Databasse


const knexInstance = knex({
    client:"sqlite3",
    connection:{filename:"../database/memory-game",},
    useNullAsDefault:true,
});

export default knexInstance;