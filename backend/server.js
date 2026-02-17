import express from "express";
import cors from "cors";
const port=3000;
const app=express();

import cardsRoutes from "./routes/cards/card.read.js";
app.use(cors());
app.use(express.json());
app.use('/cards',cardsRoutes);


app.listen(port , () =>{

    console.log(`Server run on http://localhost:${port}`);}

);