const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");


const app = express();

app.set("port", process.env.PORT || 4000);

app.use(morgan());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());





app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
})