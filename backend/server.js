import express from "express";
import cors from "cors";
import cardsRoutes from "./routes/cards/card.read.js";

//
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

//API routes
//  🟡 [important] as route naming you have /cards/all-cards
// This is redundant — the "all-cards" part doesn't add any information. 
// The route is already under "/cards", so GET /cards/8 clearly means "get 8 cards". 
// You can simplify to: app.get("/cards/:limit", ...)
// This makes the API cleaner and more intuitive

app.use("/cards", cardsRoutes);

// Fix for ES modules: __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve all files in frontend folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../frontend")));

//  📚  This route is redundant — express.static already serves index.html
// automatically when visiting "/". You can remove this block and the app still works.
// Serve index.html on "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


//  🟡 [important] Missing global error-handling middleware. Add before app.listen():
// app.use((err, req, res, next) => { console.error(err); res.status(500).json({error:"Internal server error"}); });
// Without it, unhandled errors crash the server or leak stack traces.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
