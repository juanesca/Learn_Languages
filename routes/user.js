const router = require("express").Router();
const {hash, compare} = require("bcrypt")
const jwtGenerator = require('../utils/jwtGenerator');
const authorize =  require('../middleware/authorize');

const db = require("../db/db");

router.post("/user/:id", authorize, async (req,res) => {
    try {
        
    } catch (err) {
        
    }
})

router.post('/register',async (req,res) => {
    try {
        const { email, name, pass, apll, idi_n, idi_o, inten} = req.body;
        const user = await db.query("SELECT * FROM usuarios WHERE correo = $1",[email]);

        if (user.length > 0) {
            return res.status(401).json({ msg: 'user already exists!'});
        }

        const salt = Math.random() * 5;
        const password = await hash(pass,salt)

        let newUser = await db.query("INSERT INTO usuarios (nombres,apellidos,idioma_nativo,idoma_objetivo,intencion,correo,contraseña) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",[name,apll,idi_n,idi_o,inten,email,password]);
        
        const jwtToken = jwtGenerator(newUser.id);
        return res.json({ jwtToken }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/login', async (req,res) => {
    try {
        const { email, pass} = req.body;

        const user = await db.query("SELECT * FROM usuarios WHERE correo = $1",[email]);

        if(user.length === 0){
            return res.status(401).json({msg: 'Invalid Email'});
        }

        const validPassword = await compare(pass, user[0].password);

        if (!validPassword) {
            return res.status(401).json({msg: 'Invalid Password'}); 
        }

        const jwtToken = jwtGenerator(user[0].id);
        return res.json({ jwtToken }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/verify', authorize, (req,res) => {
    try {
        res.json({status:true})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})





module.exports = router;