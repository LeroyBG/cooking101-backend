import express from "express";

import { authenticate } from "../middleware/AuthenticateUser.js";
import { recipeSchema } from "../schema/recipe.js";
import { db } from "../config/firebase-config.js";
import { createDefaultCookbooks } from "../middleware/createDefaultCookbooks.js";

const router = express.Router()

// make a dummy write to db to make sure connection is stable
router.get('/test', async (req, res, next) => {
    try {
        await db.collection('recipes').add({
            name: 'Test'
        })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.use(authenticate)
router.use(createDefaultCookbooks)

// post a recipe belonging to the requesting user
router.post('/create', async (req, res, next) => {
    try {
        const newRecipe = req.body
        newRecipe.creator = req.user.uid
        
        // validate
        await recipeSchema.validateAsync(newRecipe)

        // create recipe
        const newRecipeRef = await db.collection('recipes').add(newRecipe)
        
        // add recipe to user's 'Originals' cookbook
        let userOriginals = await db.collection('cookbooks')
            .where('owner', '==', req.user.uid).where('name', '==', 'Originals').get()
        
        if (userOriginals.empty) {
            throw new Error("Users should always have an 'Originals' cookbook")
        }
        
        // userOriginals should be an array of size 1 
        // because each user should only have 1 'originals' doc
        userOriginals = userOriginals[0]
        await db.collection('cookbooks').doc(userOriginals.id).update({
            recipes: userOriginals.recipes + [newRecipeRef.id]
        })
        
        res.sendStatus(201)
        return
    } catch (err) {
        if (err.isJoi && err.name === 'ValidationError') {
            console.log(err)
            res.status(400).send('invalid request')
            return
        }
        console.log(err)
        res.status(500).send(err)
        return
    }
})


// get all recipes belonging to the requesting user
router.get('/mine', async (req, res, next) => {
    try {
        const myRecipes = await db.collection('recipes').where('owner', '==', req.user).get()
        res.status(200).send(myRecipes)
        return
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
        return
    }
})

export default router