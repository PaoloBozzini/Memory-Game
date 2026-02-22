import knex from "knex";

//  🔴 [blocking] Relative path "../database/memory-game" resolves from process.cwd(), NOT
// from this file's location. If you run `node server.js` from the project root instead of
// backend/, it breaks. Fix with an absolute path:
//   import path from "path";
//   import { fileURLToPath } from "url";
//   const __dirname = path.dirname(fileURLToPath(import.meta.url));
//   connection: { filename: path.resolve(__dirname, "../database/memory-game") }
const knexInstance = knex({
    client:"sqlite3",
    connection:{filename:"../database/memory-game",},
    useNullAsDefault:true,
});

export default knexInstance;