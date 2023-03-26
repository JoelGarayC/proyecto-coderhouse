import bodyparser from 'body-parser'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import { app } from './config.js'
import { connectDB } from './database/connectDB.js'
import routes from './routes/index.routes.js'
import viewsRoutes from './routes/views.routes.js'

class App {
  constructor() {
    this.app = express()
    this.connectDataBase()
    this.midlewares()
    this.routes()
  }

  connectDataBase() {
    connectDB()
  }

  midlewares() {
    this.app.use(cookieParser())
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: `mongodb+srv://Joel:${process.env.DB_PASSWORD}@cluster0.pqiwc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
          ttl: 10000
        }),
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      })
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(bodyparser.urlencoded({ extended: true }))
    this.app.use(bodyparser.json())
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use('/', viewsRoutes)
    this.app.use(app.pathApi, routes)
  }
}

export default App
