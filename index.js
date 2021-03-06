const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const Socket = require("socket.io");
const user= require("./routes/user");
const cors =require("cors");
const app = express();

app.set("port", process.env.PORT || 4000);


app.use(morgan('dev'));
app.use(cors({origin:"*"}))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({extended: true}));
app.use('/user',user);
app.use('/foros',require('./routes/foros'));
app.use('/cal',require('./routes/calificaciones'));
app.use('/content',require('./routes/content'));
app.get('/:folder&:name',(req,res)=>{
    res.sendFile(`${__dirname}/utiles/mocks/${req.params.folder}/${req.params.name}`);
});

const server = app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
})

const io=Socket(server);
io.on('connection',(socket)=>{
    console.log(socket.id);
})