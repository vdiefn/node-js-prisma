import app from "../app.js"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`server 跑起來了: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start()