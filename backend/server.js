import express from "express";
const port=3000;
const app=express();

import cardsRoutes from "./routes/cards/card.read.js";
app.use(express.json());
app.use('/cards',cardsRoutes);


app.listen(port , () =>{

    console.log(`Server runs on http://localhost:${port}`);}

);