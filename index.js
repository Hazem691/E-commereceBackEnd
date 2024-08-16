import dotenv from 'dotenv' ;
import express from 'express';
dotenv.config() ;
import connectionDB from './db/connection.js'
import { initApp } from './src/initApp.js'

const app = express() ;
const port = process.env.PORT || 5000 ;
initApp(app,express) ;


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
