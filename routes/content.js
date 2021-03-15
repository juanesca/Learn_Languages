const router = require("express").Router();
const authorize = require("./../controllers/authorize");

const db = require("./../db/db");

router.get("/teoria", authorize, async (req, res) => {
  try {
    let connection = await db.connect();
    const content = await connection.query(
      "SELECT contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.tipocontenido = 1"
    );
    connection.release();
    res.json(content.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.get("/libros", authorize, async (req, res) => {
  try {
    let connection = await db.connect();
    const content = await connection.query(
      "SELECT contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.tipocontenido = 2"
    );
    connection.release();
    res.json(content.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.get("/juegos", authorize, async (req, res) => {
  try {
    let connection = await db.connect();
    const content = await connection.query(
      "SELECT contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.tipocontenido = 3"
    );
    connection.release();
    res.json(content.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.get("/peliculas", authorize, async (req, res) => {
  try {
    let connection = await db.connect();
    const content = await connection.query(
      "SELECT contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.tipocontenido = 4"
    );
    connection.release();
    res.json(content.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});


router.post("/add",authorize,async(req,res)=>{
    try {
        const {tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar} = req.body;
        let connection = await db.connect();
        if (tipo_cont == 1) {
            await connection.query("INSERT INTO contenidos (tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar) VALUES ($1,$2,$3,$4,$5,$6,$7)",[tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar]);
        } else {
            await connection.query("INSERT INTO contenidos (tipocontenido,titulo,reseña,contenido,posteador,idioma) VALUES ($1,$2,$3,$4,$5,$6)",[tipocontenido,titulo,reseña,contenido,posteador,idioma]);
        };
        connection.release();
        res.status(200)
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Serever error");
    }
});

router.put("/edit/:id",authorize,async(req,res)=>{
    try {
        const {id} = req.params;
        const {tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar} = req.body;
        let connection = await db.connect();
        if (tipo_cont == 1) {
            await connection.query("UPDATE contenidos SET (tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar) = ($1,$2,$3,$4,$5,$6,$7) WHERE id = $8",[tipocontenido,titulo,reseña,contenido,posteador,idioma,idiomaenseñar,id]);
        } else {
            await connection.query("UPDATE contenidos SET (tipocontenido,titulo,reseña,contenido,posteador,idioma) = ($1,$2,$3,$4,$5,$6) WHERE id = $7",[tipocontenido,titulo,reseña,contenido,posteador,idioma,id]);
        };
        connection.release();
        res.status(200)
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error")
    }
});

router.delete("delete/:id",authorize,async(req,res)=>{
    try {
        const {id} = req.params;
        let connection = await db.connect();
        await connection.query("DELETE FROM contenidos WHERE id = $1",[id]);
        connection.release();
        res.status(200);
    } catch (err) {
        console.error(err.message);
        res.status(200).json("Server error");
    }
})

module.exports = router;
