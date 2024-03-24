import express from "express";
import fs from "node:fs/promises";

import { authenticate } from "../middleware/AuthenticateUser.js";
import { recipeSchema, recipeImageSchema } from "../schema/recipe.js";
import { createDefaultCookbooks } from "../middleware/createDefaultCookbooks.js";

import { db } from "../config/firebase-config.js";
import { admin } from "../config/firebase-config.js";
import {
  downloadFileFromStorage,
  getThumbnailImageFirebaseFilePathFromRecipeId,
  getThumbnailImageLocalFilePathFromRecipeId,
  uploadFileToStorage,
} from "../utilities/FirebaseImageHandling.js";

const router = express.Router();

// make a dummy write to db to make sure connection is stable
router.get("/test", async (req, res, next) => {
  try {
    await db.collection("recipes").add({
      name: "Test",
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.use(authenticate);
router.use(createDefaultCookbooks);

// post a recipe belonging to the requesting user
// the recipe thumbnail image is uploaded to firebase bucket under thumbnail-images/[RECIPE ID]

router.post("/create", async (req, res, next) => {
  try {
    const newRecipe = req.body.recipeDetails;
    const newRecipeThumbnailImage = req.body.recipeThumbnail;
    newRecipe.creator = req.user.uid;

    // validate
    await recipeSchema.validateAsync(newRecipe);
    await recipeImageSchema.validateAsync(newRecipeThumbnailImage);

    // create recipe
    const newRecipeRef = await db.collection("recipes").add(newRecipe);

    // add recipe to user's 'Originals' cookbook
    let userOriginals = await db
      .collection("cookbooks")
      .where("owner", "==", req.user.uid)
      .where("name", "==", "Originals")
      .get();

    if (userOriginals.empty) {
      throw new Error("Users should always have an 'Originals' cookbook");
    }

    // userOriginals should be an array of size 1
    // because each user should only have 1 'originals' doc
    userOriginals = userOriginals[0];
    await db
      .collection("cookbooks")
      .doc(userOriginals.id)
      .update({
        recipes: userOriginals.recipes + [newRecipeRef.id],
      });

    // handle image upload
    const binaryData = Buffer.from(newRecipeThumbnailImage, "base64");
    const localFilePath = getThumbnailImageLocalFilePathFromRecipeId(
      newRecipeRef.id,
    );
    const cloudFilePath = getThumbnailImageFirebaseFilePathFromRecipeId(
      newRecipeRef.id,
    );
    await fs.writeFile(localFilePath, binaryData);

    await uploadFileToStorage(localFilePath, cloudFilePath);

    res.sendStatus(201);
    return;
  } catch (err) {
    if (err.isJoi && err.name === "ValidationError") {
      console.log(err);
      res.status(400).send("invalid request");
      return;
    }
    console.log(err);
    res.status(500).send(err);
    return;
  }
});

// get all recipes belonging to the requesting user
router.get("/mine", async (req, res, next) => {
  try {
    const myRecipes = await db
      .collection("recipes")
      .where("owner", "==", req.user.uid)
      .get();
    res.status(200).send(myRecipes);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
    return;
  }
});

router.get("/specific", async (req, res, next) => {
  const recipeId = req.body.recipeId;

  try {
    const recipe = await db.collection("recipes").doc(recipeId).get();
    if (!recipe.exists) {
      res.status(404).send("Recipe not found");
      return;
    }
    const thumbnailImageCloudPath =
      getThumbnailImageFirebaseFilePathFromRecipeId(recipeId);
    const recipeThumbnail = await downloadFileFromStorage(
      thumbnailImageCloudPath,
    );

    res.status(200).json({
      recipeDetails: recipe,
      recipeThumbnail: recipeThumbnail,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
