import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));


const knexInstance = knex({
    client:"sqlite3",
    connection:{filename: path.resolve(__dirname,"memory-game")},
    useNullAsDefault:true,
});

export default knexInstance;