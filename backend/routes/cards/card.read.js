import express from "express";
import knexInstance from "../../database.js";

const router=express.Router();

router.get("/all-cards/:id", async (req, res) => {
  try{
    const {id}=req.params;
    const allCards=await knexInstance('cards')
    .select('*')
    .limit(Number(id));
    res.json(allCards);
  }catch (error){
    res.status(500).json({error:"Failed to fetch cards"})};
});

export default router;