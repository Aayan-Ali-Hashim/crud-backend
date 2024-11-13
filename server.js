import express from "express"
import fs from "fs"

const app = express()
app.set("view engine", "ejs")
app.use(express.urlencoded())
app.use(express.json())

let id = 0

app.get("/", (req, res) => {
  res.render("index")
})

app
  .route("/register")
  .get((req, res) => {
    res.render("register")
  })
  .post((req, res) => {
    const { username, email, phone } = req.body
 
    const user = {
      username,
      email,
      phone,
      id: ++id,
    }

    fs.readFile("data.json", "utf-8", (err, data) => {
      const users = JSON.parse(data)
      users.push(user)

      fs.writeFile("data.json", JSON.stringify(users), () => {})

      res.render("dashboard", { users })
    })
  })

app.get("/users/:id", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const user = users.find((user) => user.id === Number(req.params.id))

    res.render("profile", { user })
  })
})

app.patch("/users/:id", (req, res) => {
  const { username, email, phone } = req.body

  fs.readFile("data.json", "utf-8", (err, data) => {
    const users = JSON.parse(data)
    const user = users.find((user) => user.id === Number(req.params.id))

    const updatedUsers = users.map((user) => {
      if (user.id === Number(req.params.id)) {
        return { ...user, username: username, email: email, phone: phone }
      }

      return user
    })

    fs.writeFile("data.json", JSON.stringify(updatedUsers), () => {})
  })
})

app.listen(3100, () => console.log("Server is running on port 3000"))
