const router = require("express").Router();
const authorize = require("./../controllers/authorize");

const db = require("./../db/db");

router.post('/ucc/add',authorize,async(req,res)=>{
  try{
    const {id_usuario,id_calificado,valor}=req.body;
    let connection = await db.connect();
    await connection.query('INSERT INTO ucc (id_usuario,id_calificado,valor) VALUES ($1,$2,$3)',[id_usuario,id_calificado,valor]);
    await connection.query('UPDATE contenidos SET (calificacion) = (SELECT AVG(valor) FROM ucc WHERE id_calificado = $1) WHERE id = $1',[id_calificado]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.delete('/ucc/delete/:id_u&id_c',authorize,async(req,res)=>{
  try{
    const {id_u,id_c}=req.params;
    let connection = await db.connect();
    await connection.query('DELETE FROM ucc WHERE id_usuario = $1 AND id_calificado = $2',[id_u,id_c]);
    await connection.query('UPDATE contenidos SET (calificacion) = (SELECT AVG(valor) FROM ucc WHERE id_calificado = $1) WHERE id = $1',[id_c]);
    connection.release();
    res.status(200);
  }catch(err){
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.put('/ucc/edit/:id_u&id_c',authorize,async(req,res)=>{
  try{
    const {id_u,id_c} = req.params;
    const {valor} = req.body;
    let connection = await db.connect();
    await connection.query('UPDATE ucc SET (valor) = ($1) WHERE id_usuario = $2 AND id_calificado = $3',[valor,id_u,id_c]);
    await connection.query('UPDATE contenidos SET (calificacion) = (SELECT AVG(valor) FROM ucc WHERE id_calificado = $1) WHERE id = $1',[id_c]);
    connection.release();
    res.status(200);
  }catch(err){
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.get('/ucc/:id_u&id_c',authorize,async(req,res)=>{
  try{
    const {id_u,id_c} = req.params;
    let connection = await db.connect();
    const cal = await connection.query('SELECT valor FROM ucc WHERE id_usuario = $1 AND id_calificado = $2',[id_u,id_c]);
    connection.release();
    res.json(cal.rows);
  }catch(err){
    console.error(err.message);
    res.status(500).json('Server error');
  }
})

// ucf

router.post('/ucf/add', authorize, async (req, res) => {
  try {
    const { id_usuario, id_calificacion, calificacion} = req.body;
    let connection = await db.connect();
    await connection.query('INSERT INTO ucf (id_usuario,id_calificacion,calificacion) VALUES ($1,$2,$3)', [id_usuario, id_calificacion,calificacion]);
    await connection.query('UPDATE respforos SET (calificacion) = (SELECT AVG(valor) FROM ucf WHERE id_calificacion = $1) WHERE id = $1', [id_calificacion]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.delete('/ucf/delete/:id_u&id_c', authorize, async (req, res) => {
  try {
    const { id_u, id_c } = req.params;
    let connection = await db.connect();
    await connection.query('DELETE FROM ucf WHERE id_usuario = $1 AND id_calificacion = $2', [id_u, id_c]);
    await connection.query('UPDATE respforos SET (calificacion) = (SELECT AVG(valor) FROM ucf WHERE id_calificacion = $1) WHERE id = $1', [id_c]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.put('/ucf/edit/:id_u&id_c', authorize, async (req, res) => {
  try {
    const { id_u, id_c } = req.params;
    const { calificacion } = req.body;
    let connection = await db.connect();
    await connection.query('UPDATE ucf SET (calificacion) = ($1) WHERE id_usuario = $2 AND id_calificacion = $3', [calificacion, id_u, id_c]);
    await connection.query('UPDATE respforos SET (calificacion) = (SELECT AVG(valor) FROM ucf WHERE id_calificacion = $1) WHERE id = $1', [id_c]);
    connection.release();
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

router.get('/ucc/:id_u&id_c', authorize, async (req, res) => {
  try {
    const { id_u, id_c } = req.params;
    let connection = await db.connect();
    const cal = await connection.query('SELECT valor FROM ucc WHERE id_usuario = $1 AND id_calificado = $2', [id_u, id_c]);
    connection.release();
    res.json(cal.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});



module.exports = router;