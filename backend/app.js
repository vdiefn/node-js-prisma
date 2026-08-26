import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes/index.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use((req, res) => {
  res.status(404).json({status:"false", message: "您的路由不存在"})
})

app.use((err, req, res, next) => {
  if(err.isOperational){
    return res.status(err.statusCode).json({status:"failed", message:err.message})
  }

  res.status(500).json({name: err.name, message:err.message})
})


export default app