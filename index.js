const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const user= require("./routes/user")

const app = express();

app.set("port", process.env.PORT || 4000);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/user',user);
app.use('/foros',require('./routes/foros'));
app.use('/cal',require('./routes/calificaciones'));
app.use('/content',require('./routes/content'));




app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
})