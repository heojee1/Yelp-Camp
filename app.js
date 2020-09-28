const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });