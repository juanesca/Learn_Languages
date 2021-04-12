const router = require("express").Router();
const { hash, compare } = require("bcrypt")
const jwtGenerator = require('./../controllers/jwtGenerator');
const authorize = require('./../controllers/authorize');
const multer = require('multer');
const db = require("./../db/db");
const subir = require('./../controllers/subir');
const path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './utiles/mocks/Users');
    },
    filename: async (req, file, cb) =>{
        cb(null, "usuario" + req.body.id + "" + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

router.put("/user", upload.single('img'), subir, async (req, res) => {
    try {
        const { nombres, apellidos, idioma_nativo, idioma_objetivo, intencion, id, URL } = req.body;
        const connection = await db.connect();
        await connection.query('UPDATE public.usuarios SET nombres=$1, apellidos=$2, idioma_nativo=$3, idioma_objetivo=$4, intencion=$5, img=$7 WHERE id=$6 returning *', [nombres, apellidos, idioma_nativo, idioma_objetivo, intencion, id, URL])
            .then((resp) => {
                connection.release();
                res.json(resp.rows);
            })
            .catch(err => {
                connection.release();
                console.log(err);
            });
    } catch (err) {
        res.status(401).json('error en la actualizacion');
    }
})

router.post('/signup', async (req, res) => {
    try {
        const { email, name, pass, apll, idi_n, idi_o, inten } = req.body;
        const connection = await db.connect();
        const user = await connection.query("SELECT * FROM usuarios WHERE correo = $1", [email]).then((data) => {
            connection.release();
            return data.rows;
        }).catch(err => {
            connection.release();
            console.log(err);
        });
        if (user.length > 0) {
            return res.status(401).json({ msg: 'user already exists!' });
        }

        const salt = Math.random() * 5;
        const password = await hash(pass, salt);
        const conn = await db.connect();
        let newUser = await conn.query("INSERT INTO usuarios (nombres,apellidos,idioma_nativo,idioma_objetivo,intencion,correo,contraseña) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *", [name, apll, idi_n, idi_o, inten, email, password]).then(data => {
            conn.release();
            return data.rows
        }).catch(err => {
            conn.release();
            console.log(err);
        });
        const jwtToken = jwtGenerator(newUser[0].id);

        return res.json({ jwtToken, id: newUser[0].id, intencion: newUser[0].intencion }).status(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error')
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const connection = await db.connect();
        const user = await connection.query("SELECT * FROM usuarios WHERE correo = $1", [email])
            .then((data) => {
                connection.release();
                return data.rows;
            })
            .catch((err) => {
                connection.release();
                console.log(err);
            });
        if (user.length == 0) {
            return res.json({ msg: 'Invalid Email' });
        }
        const validPassword = await compare(pass, user[0].contraseña);

        if (!validPassword) {
            return res.json({ msg: 'Invalid Password' });
        }

        const jwtToken = jwtGenerator(user[0].id);
        return res.json({ jwtToken, id: user[0].id, intencion: user[0].intencion }).status(200);

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
});
router.get('/intenciones', async (req, res) => {
    const connection = await db.connect();
    await connection.query("SELECT * FROM intenciones")
        .then((data) => {
            connection.release();
            res.json(data.rows);
        })
        .catch((err) => {
            connection.release();
            console.log(err);
        });
});
router.get('/idiomas', async (req, res) => {
    const connection = await db.connect();
    await connection.query("SELECT * FROM idiomas")
        .then((data) => {
            connection.release();
            res.json(data.rows);
        })
        .catch((err) => {
            connection.release();
            console.log(err);
        });
});




module.exports = router;