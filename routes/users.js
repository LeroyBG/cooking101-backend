import { getAuth } from 'firebase-admin/auth'
import express, { Router }  from 'express'
import Joi from 'joi'
import { db } from '../config/firebase-config.js'

import { cookbookSchema } from '../schema/cookbook.js'
import { userSchema } from '../schema/user.js'

const router = express.Router()

// this should never be used because user creation is handled by firebase, but it's a good reference
router.post('/', async (req, res, next) => {
    try {
        const candidate = {
            name: req.body.userName,
            password: req.body.password,
        }
    
        // validate req
        // right now, username and password are just unconstrained strings
        await Joi.string().validateAsync(candidate.name)
        await Joi.string().validateAsync(candidate.password)

        await userSchema.validateAsync(candidate)

        const auth = getAuth()

        const newUser = await auth.createUser({
            displayName: candidate.name,
            password: candidate.password
        })

        const newCookbooks = {
            originals: {
                owner: newUser.uid,
                name: 'Originals',
                recipes: []
            },
            favorites: {
                owner: newUser.uid,
                name: 'Favorites',
                recipes: []
            }
        }

        cookbookSchema.validateAsync(newCookbooks.originals)
        cookbookSchema.validateAsync(newCookbooks.favorites)

        await db.collection('cookbooks').add(newCookbooks.originals)
        await db.collection('cookbooks').add(newCookbooks.favorites)

        res.sendStatus(201)
        return
    } catch (err) {
        if (err.isJoi && err.name === 'ValidationError') {
            console.log(err)
            res.status(400).send('invalid request')
            return
        }

        res.status(500).send('err')
        console.log(err)
        return
    }
})

export default router