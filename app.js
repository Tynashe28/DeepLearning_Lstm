const express = require('express');
const path = require('path');
const app = express();

// Express body parser
app.use(express.urlencoded({ extended: true }));

console.log("done");

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
