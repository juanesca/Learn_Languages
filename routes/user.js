const router = require("express").Router();
const { hash, compare } = require("bcrypt")
const jwtGenerator = require('./../controllers/jwtGenerator');
const authorize = require('./../controllers/authorize');
const multer = require('multer');
const db = require("./../db/db");
const subir = require('./../controllers/subir')
const upload = multer({ storage: multer.memoryStorage() });

router.put("/user", authorize, upload.single('img'), subir, async (req, res) => {
    try {
        const {nombres, apellidos, idioma_nativo,idioma_objetivo,intencion, id, URL }= req.body;
        const connection=await db.connect();
        await connection.query('UPDATE public.usuarios SET nombres=$1 apellidos=$2, idioma_nativo=$3, idioma_objetivo=$4, intencion=$5, img=$7 WHERE id=$6 returning *',[nombres, apellidos, idioma_nativo,idioma_objetivo,intencion, id, URL])
        .then((resp)=>{res.json(resp);});
        connection.release();
    } catch (err) {
        res.status(401).json('error en la actualizacion');
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, name, pass, apll, idi_n, idi_o, inten } = req.body;
        const connection = await db.connect();
        const user = await connection.query("SELECT * FROM usuarios WHERE correo = $1", [email]);
        connection.release();
        if (user.length > 0) {
            return res.status(401).json({ msg: 'user already exists!' });
        }

        const salt = Math.random() * 5;
        const password = await hash(pass, salt)

        let newUser = await db.query("INSERT INTO usuarios (nombres,apellidos,idioma_nativo,idoma_objetivo,intencion,correo,contraseña) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *", [name, apll, idi_n, idi_o, inten, email, password]);

        const jwtToken = jwtGenerator(newUser.id);
        return res.json({ jwtToken }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error')
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const connection = await db.connect();
        const user = await connection.query("SELECT * FROM usuarios WHERE correo = $1", [email]);
        connection.release();
        if (user.length === 0) {
            return res.status(401).json({ msg: 'Invalid Email' });
        }

        const validPassword = await compare(pass, user[0].password);

        if (!validPassword) {
            return res.status(401).json({ msg: 'Invalid Password' });
        }

        const jwtToken = jwtGenerator(user[0].id);
        return res.json({ jwtToken }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error')
    }
});

router.post('/verify', authorize, (req, res) => {
    try {
        res.json({ status: true })
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error')
    }
})





module.exports = router;