import { db } from "../config/firebase-config";
import express from "express";
import { authenticate } from "../middleware/AuthenticateUser";
import { createDefaultCookbooks } from "../middleware/createDefaultCookbooks";
import { cookbookSchema } from "../schema/cookbook";

const router = express.Router();

router.use(authenticate);
router.use(createDefaultCookbooks);

// add a new cookbook belonging to the requesting user
router.post("/create", async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const cookbookName = req.body.name;
    const newCookbook = {
      owner: userId,
      name: cookbookName,
      recipes: [],
    };
    await cookbookSchema.validateAsync(newCookbook);
    await db.collection("cookbooks").add(newCookbook);
    res.sendStatus(201);
    return;
  } catch (err) {
    if (err.isJoi && err.name === "ValidationError") {
      console.log(err);
      res.status(400).send("invalid request");
      return;
    }
    res.status(500).send(err);
    return;
  }
});
