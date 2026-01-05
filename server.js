const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err))

const User = require("./models/User")
const Course = require("./models/Course")

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html")
})

app.post("/register", async (req, res) => {
  try {
    const { email, password, course } = req.body

    if (!email || !password || !course) {
      return res.json({
        success: false,
        message: "All fields are required"
      })
    }

    await User.create({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      course
    })

    res.json({
      success: true,
      message: "Registered successfully"
    })
  } catch (err) {
    console.error("Register error:", err)
    res.status(500).json({
      success: false,
      message: "Registration failed"
    })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password required"
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      password: password.trim()
    })

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password"
      })
    }

    res.json({
      success: true,
      email: user.email,
      course: user.course
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({
      success: false,
      message: "Login failed"
    })
  }
})

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    console.error("Courses error:", err)
    res.status(500).json([])
  }
})

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
    res.json(users)
  } catch (err) {
    console.error("Users error:", err)
    res.status(500).json([])
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})

