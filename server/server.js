const express=require('express')
const bodyparser=require('body-parser')
const router=require('./route')
const cors=require('cors')
const app=express()

app.use(cors());
app.use(bodyparser.json())
app.use(router)

app.get("/",(req,res)=>{
    res.send("<h1>Welcome to Bank Server</h1>")
})

app.listen(5000,(req,res)=>{
    console.log("Server is Running on http://localhost:5000")
})