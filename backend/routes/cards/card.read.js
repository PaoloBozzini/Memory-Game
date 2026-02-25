import express from "express";
import knexInstance from "../../database/knexfile.js";

const router=express.Router();

router.get("/", async (req, res) => {
  try{
    const limit=Number(req.query.limit);

    //validation
    if (!Number.isInteger(limit) || limit  < 1 || limit > 50){
      res.status(400).json({error:"Limit must be an integer between 1 and 50"});
    }

    const Cards=await knexInstance('cards')
    .select('*')
    .limit(limit);
    res.json(Cards);
  }catch (error){
    res.status(500).json({error:"Failed to fetch cards"})};
});

export default router;