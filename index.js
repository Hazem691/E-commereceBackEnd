import dotenv from 'dotenv' ;
import express from 'express';
dotenv.config() ;
import connectionDB from './db/connection.js'
import { initApp } from './src/initApp.js'

const app = express()
initApp(app,express) ;