const router = require("express").Router();
const authorize = require("./../controllers/authorize");
const subir = require('./../controllers/subir')
const multer = require('multer');
const path = require('path');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.body.count++;
    console.log(req.body);
    if (req.body.count == 1) {
      cb(null, './utiles/mocks/Content');
    } else {
      cb(null, './utiles/mocks/Contentarch');
    }
  },
  filename: async (req, file, cb) => {
    cb(null, "contenido" + (new Date()).getTime() + req.body.posteador + "" + path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage });

const db = require("./../db/db");

router.get("/mis/:id&:tc", authorize, async (req, res) => {
  try {
    const { id, tc } = req.params;
    let connection = await db.connect();
    await connection.query(
      "SELECT tipos_contenidos.strtipo ,contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador JOIN tipos_contenidos ON tipos_contenidos.id = contenidos.tipocontenido WHERE contenidos.posteador = $1 AND contenidos.tipocontenido=$2", [id, tc]
    ).then(content => {
      connection.release();
      res.json(content.rows);
    })
      .catch(err => {
        connection.release();
        console.log(err);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});
router.get("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    let connection = await db.connect();
    await connection.query(
      "SELECT contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.id = $1 ", [id]
    ).then(content => {
      connection.release();
      res.json(content.rows);
    })
      .catch(err => {
        connection.release();
        console.log(err);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});
router.get("/get/:tipo&:id", authorize, async (req, res) => {
  try {
    let { tipo, id } = req.params;
    let connection = await db.connect();
    await connection.query(
      "SELECT random() as orden ,contenidos.*, CONCAT(usuarios.nombres,' ',usuarios.apellidos) AS nombre FROM contenidos JOIN usuarios ON usuarios.id = contenidos.posteador WHERE contenidos.tipocontenido = $1 AND contenidos.posteador != $2", [tipo, id]
    ).then(content => {
      connection.release();
      res.json(content.rows);
    })
      .catch(err => {
        connection.release();
        console.log(err);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.post("/add", authorize, upload.array('img', 2), subir, async (req, res) => {

  const { tipocontenido, titulo, reseña, posteador, idioma, idiomaenseñar, URL } = req.body;
  try {
    let connection = await db.connect();
    await connection.query(`INSERT INTO public.contenidos
      (tipocontenido, titulo, reseña, contenido, posteador, idioma, idiomaenseñar, img)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8);`, [tipocontenido, titulo, reseña,URL[1], posteador, idioma, idiomaenseñar, URL[0]])
      .then(data => {
        connection.release();
        console.log("exito");
        res.status(200);
      }).catch(err => {
        connection.release();
        console.log(err);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Serever error");
  }
});

router.put("/edit", authorize, upload.array('img', 2), subir, async (req, res) => {
  try {
    const { tipocontenido, titulo, reseña, id, posteador, idioma, idiomaenseñar, URL } = req.body;
    let connection = await db.connect();
    await connection.query(`UPDATE contenidos
      SET tipocontenido=$1, titulo=$2, reseña=$3, contenido=$4, posteador=$5, idioma=$6, idiomaenseñar=$7, img=$8
      WHERE id = $8;`, [tipocontenido, titulo, reseña, URL[1], posteador, idioma, idiomaenseñar, id, URL[0]])
      .then(res => {
        connection.release();
        res.status(200)
      })
      .catch(err => {
        connection.release();
        console.log(err);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error")
  }
});
router.delete("/delete/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    let connection = await db.connect();
    await connection.query("DELETE FROM contenidos WHERE id = $1", [id])
      .then(res => {
        connection.release();
        res.status(200);
      })
      .catch(err => {
        connection.release();
        res.status(200);
      });
  } catch (err) {
    console.error(err.message);
    res.status(200).json("Server error");
  }
})

module.exports = router;
