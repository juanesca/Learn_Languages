const router = require("express").Router();
const authorize = require("./../controllers/authorize");

const db = require("./../db/db");

router.get("/", authorize, async (req, res) => {
  try {
    let connection = await db.connect();
    const foros = await connection.query('SELECT foros.*, CONCAT(usuarios.nombres," ",usuarios.apellidos) AS nombre FROM foros JOIN usuarios ON usuarios.id = foros.preguntador');
    connection.release();
    res.json(foros.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.get('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    let connection = await db.connect();
    const foro = await connection.query('SELECT foros.*, CONCAT(usuarios.nombres," ",usuarios.apellidos) AS nombre FROM foros JOIN usuarios ON usuarios.id = foros.preguntador WHERE foros.id = $1', [id]);
    connection.release();
    res.json(foro.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});

router.get('/resp/:id_f', authorize, async (req, res) => {
  try {
    const { id_f } = req.params;
    let connection = await db.connect();
    const respf = await connection.query('SELECT respforos.*, CONCAT(usuarios.nombres," ",usuarios.apellidos) AS nombre FROM respforos JOIN usuarios ON usuarios.id = respforos.emisor WHERE id_foro = $1', [id_f]);
    connection.release();
    res.json(respf.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.post('/add', authorize, async (req, res) => {
  try {
    const { pregunta, preguntador } = req.body;
    let connection = await db.connect();
    await connection.query('INSERT INTO foros(pregunta,preguntador) VALUES ($1,$2)', [pregunta, preguntador]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.post('/resp/:id_f/add', authorize, async (req, res) => {
  try {
    const { id_f } = req.params;
    const { respuesta, emisor } = req.body;
    let connection = await db.connect();
    await connection.query('INSERT INTO respforos (respuesta,emisor,id_foro) VALUES ($1,$2,$3)', [respuesta, emisor, id_f]);
    await connection.query('UPDATE foros SET (cantidadr) = (SELECT COUNT(*) FROM respforos WHERE id_foro = $1) WHERE id = $1',[id_f]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});

/* el editar un foro es innecesario ya que solo seria cambiar la pregunta lo cual seria mas facil el hacer un foro nuevo, pero por si acaso va a estar de rodos modos.

Esto es igual para el servicio de editar una respuesta
*/

router.put('/edit/:id',authorize,async (req,res) => {
  try{
    const {id} = req.params;
    const {pregunta} = req.body;
    let connection = await db.connect();
    await connection.query('UPDATE foros SET (pregunta) = ($1) WHERE id = $2',[pregunta,id]);
    connection.release();
    res.status(200);
  }catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});

router.put('/resp/edit/:id',authorize,async (req,res) => {
  try{
    const {id} = req.params;
    const {respuesta} = req.body;
    let connection = await db.connect();
    await connection.query('UPDATE respforos SET (respuesta) = ($1) WHERE id = $2',[respuesta,id]);
    connection.release();
    res.status(200);
  }catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});

router.delete('/delete/:id',authorize,async (req,res) => {
  try{
    const {id} = req.params;
    let connection = await db.connect();
    await connection.query('DELETE FROM foros WHERE id = $1',[id]);
    connection.release();
    res.status(200);
  }catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});

router.delete('/resp/:id_f/delete/:id', authorize, async (req,res) => {
  try{
    const {id_f,id} = req.params;
    let connection = await db.connect();
    await connection.query('DELETE FROM respforos WHERE id = $1',[id]);
    await connection.query('UPDATE foros SET (cantidadr) = (SELECT COUNT(*) FROM respforos WHERE id_foro = $1) WHERE id = $1',[id_f]);
    connection.release();
    res.status(200);
  }catch (err) {
    console.error(err.message);
    res.status(500).json('Server error')
  }
});


module.exports = router;