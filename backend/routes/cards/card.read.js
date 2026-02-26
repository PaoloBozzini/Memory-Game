import express from "express";
import knexInstance from "../../database/knexfile.js";

const router = express.Router();

const TOPIC_MAP = {
  food: 1,
  school: 2,
};

router.get("/", async (req, res) => {
  try {
    // Give a default if limit is missing
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    // validation
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res
        .status(400)
        .json({ error: "Limit must be an integer between 1 and 50" });
    }

    const topicRaw = (req.query.topic ?? "").toString().trim().toLowerCase();

    let topicId = null;
    if (topicRaw) {
      if (TOPIC_MAP[topicRaw]) {
        topicId = TOPIC_MAP[topicRaw];
      } else if (/^\d+$/.test(topicRaw)) {
        topicId = Number(topicRaw);
      } else {
        return res.status(400).json({ error: `Unknown topic: ${topicRaw}` });
      }
    }

    let query = knexInstance("cards").select("*");

    if (topicId !== null) {
      query = query.where("topic_id", topicId);
    }

    const cards = await query.orderByRaw("RANDOM()").limit(limit);

    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch cards" });
  }
});

export default router;