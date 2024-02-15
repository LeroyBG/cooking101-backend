import admin from 'firebase-admin'

// verify firebase JWT token
export async function authenticate(req, res, next) {
    const headerToken = req.headers.authorization
    if (!headerToken) {
        res.status(401).send('no token provided')
        return
    }
    try {
        if (headerToken?.split(' ')[0] !== "Bearer") {
            res.status(401).send("invalid token")
            return
        }
        const token = headerToken.split(' ')[1]
        const decoded = await admin.auth().verifyIdToken(token)
        if (decoded) {
            req.user = decoded
            return next()
        }
        res.status(401).send('unauthorized')
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}