import express from "express";
import knexInstance from "../../database.js";

const router=express.Router();

//  🔴 [blocking] The param `:id` is misleading — it's not a card ID, it's a LIMIT (how many
// cards to fetch). Rename to `:limit` or `:count`. In REST, `:id` means "get item with this ID."
//  📚  A more RESTful design: GET /cards?limit=8 using req.query.limit instead of
// a URL param. This makes the intent clearer.
router.get("/all-cards/:id", async (req, res) => {
  try{
    const {id}=req.params;
    //  🔴 [blocking] No input validation! A user could send /cards/all-cards/abc (NaN),
    // /cards/all-cards/-1, or /cards/all-cards/999999. 

    const allCards=await knexInstance('cards')
    .select('*')
    .limit(Number(id));
    res.json(allCards);
  }catch (error){
    res.status(500).json({error:"Failed to fetch cards"})};
});

export default router;