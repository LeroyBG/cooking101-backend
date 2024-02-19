import express from "express";

import { authenticate } from "../middleware/AuthenticateUser.js";
import { recipeSchema } from "../schema/recipe.js";
import { db } from "../config/firebase-config.js";

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

// post a recipe belonging to the requesting user
router.post('/', async (req, res, next) => {
    try {
        const newRecipe = req.body
        newRecipe.creator = req.user
        await recipeSchema.validateAsync(newRecipe)
        await db.collection('recipes').add(newRecipe)
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