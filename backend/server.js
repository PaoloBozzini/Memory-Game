import express from "express";
const port=3000;
const app=express();
app.listen(port , () =>{

    console.log(`Server runs on http://localhost:${port}`);}

);

app.get('/', (req,res)=>{
    res.send('Hello the world');
})






