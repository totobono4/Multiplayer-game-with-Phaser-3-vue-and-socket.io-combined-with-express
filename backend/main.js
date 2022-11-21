const express = require("express");
const Handlers = require("./handlers");
const Logger = require("./logger")

const handlers = new Handlers();
const logger = new Logger();
const app = express();
const port = 5000;

app.get("/", (req, res)=>{
    res.send(handlers.root(req))
});

app.listen(port, ()=>{
    logger.debug("Listening on port:"+port)
})