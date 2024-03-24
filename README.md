## Environment Setup

1. clone this project
2. change directory: `$cd cooking101-backend`
3. run `$npm install`

## Firebase Project Setup

In order to run this project, you need a firebase project

1. Follow [these](https://firebase.google.com/docs/firestore/quickstart) instructions to create a firestore database
   - Note: you must initialize the **firestore** database in the firebase console. firebase provides two types of database: firestore and firebase realtime database. If you don't initialize the **firestore** database in your project settings, you won't be able to connect to a database
2. Under "project settings" > "service accounts", click "generate new private key" to download a new private key
3. Move the file containing the key to this project's "config" directory and rename it to "serviceAccount.json" (so it's ignored using .gitignore)

## Configuring .env

create a file called `.env` containing the information listed in dotenv_example

- the port you want the server to run on
- the (absolute path) to the google private key (serviceAccount.json)
- the firebase database url (https://<database-name>.firebaseio.com)
- the firebase project id (can be different from the project name)

## Running

_Note: This project must be run from its root directory (Same directory as script.js)_

### Production

1. run `$npm start`

### Development

1. run `$npm run devStart`
