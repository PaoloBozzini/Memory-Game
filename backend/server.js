import express from "express";
import cors from "cors";
import cardsRoutes from "./routes/cards/card.read.js";


import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());



// Fix for ES modules: __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Serve all files in frontend folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, '..' ,"frontend")));




//API routes
app.use("/cards", cardsRoutes);

// Serve index.html on "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..' ,"frontend, 'index.html'"));
});


app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({error:"Internal server error"});
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
