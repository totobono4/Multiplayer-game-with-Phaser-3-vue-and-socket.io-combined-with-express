const express = require("express");
const Handlers = require("./handlers");

const handlers = new Handlers();
const app = express();
const port = 5000;

app.get("/", (req, res)=>{
    res.send(handlers.root(req))
});

app.listen(port, ()=>{
    console.log("Listening on port:"+port)
})