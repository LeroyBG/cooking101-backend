/* every user should have 'favorite' and 'originals' cookbooks
but since i can't create them when the users are initialized on frontend,
every time the server receives a request, we check if their cookbooks
have been initialized and if not, initialize them */
import { db } from "../config/firebase-config.js"
export const createDefaultCookbooks = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('No user set in request')
        }
        let userCookbooks = await db.collection('cookbook-ownerships').doc(req.user.uid).get()
        if (userCookbooks.exists) {
            return next()
        }
        // this user's cookbooks haven't been initialized

        // create this user's cookbooks
        await db.collection('cookbooks').add({
            owner: req.user.uid,
            name: 'Originals',
            recipes: []
        })
        await db.collection('cookbooks').add({
            owner: req.user.uid,
            name: 'Favorites',
            recipes: []
        })

        // give them an ownership document
        await db.collection('cookbook-ownerships').doc(req.user.uid).set()

        console.log('cookbook ownership created successfully')
        return next()
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

/* cookbook-ownership collection structure */
/* 
    [userId_1, userId_2, ...]
*/