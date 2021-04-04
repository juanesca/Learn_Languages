import React, { useState, useEffect } from "react";
import { axios } from "./../Functions/AxiosPath";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { Link } from "react-router-dom";

import { localRemove, localGet } from "../Functions/localStorage";

import { toast } from "react-toastify";


const Dashboard = ({ setAuth }) => {
  const [content, setContent] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [newContent, setNewContent] = useState({});
  const [deleteContentID, setDeleteContentID] = useState("");
  const [editContentID, setEditContentID] = useState("");

  useEffect(async () => {
    getContenido();
  }, []);

  const modalIns = () => {
    setModalInsertar(!modalInsertar);
  };
  /*
  const getProfile = async () => {
    try {
      await axios.get(`/user/data/${localGet('user_id')}`);
    } catch (err) {
      console.error(err);
    }
  };
*/
  const getContenido = async () => {
    try {
      let tipoc = localGet("intencion");
      let tc = "";
      if (tipoc == 1) {
        tc = "teorias";
      } else if (tipoc == 2) {
        tc = "libros";
      } else if (tipoc == 3) {
        tc = "juegos";
      } else {
        tc = "peliculas";
      }
      await axios.get(`/content/${tc}`).then((res) => {
        setContent(res.data);
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteContenido = async (taskID) => {
    await axios.delete(`/content/delete/${taskID}`);
    getContenido();
  };

  const handleChange = async (e) => {
    await setNewContent({ ...newContent, [e.target.name]: e.target.value });
    console.log({ newTask });
  };

  const handlePhoto = async (e) => {
    await setNewContent({ ...newTask, img: e.target.files[0] });
  };

  const postContenido = async (e) => {
    e.preventDefault();

    await axios
      .post("/content/add", newContent)
      .then((res) => {
        console.log(res);
        modalIns();
        getContenido();
      })
      .catch((err) => console.log(err));
  };

  const putContenido = async (taskID) => {
    await axios
      .post(`/content/edit/${taskID}`, newContent)
      .then((res) => {
        modalIns();
        getContenido();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const selectContent = (task) => {
    setTipoModal("actualizar");
    setNewContent({
      tipocontenido: task.tipocontenido,
      titulo: task.titulo,
      reseña: task.reseña,
      contenido: task.contenido,
      posteador: task.posteador,
      idioma: task.idioma,
      idiomaenseñar: task.idiomaenseñar,
      img: task.img,
    });
  };

  return (
    <div>
      <div className="container-fluid">
        <br />
        <br />
        <br />

        <button
          className="btn btn-success"
          onClick={() => {
            setNewContent(null);
            setTipoModal("insertar");
            modalIns();
          }}
        >
          Agregar
        </button>
        <br />
        <br />
        <div className="d-flex flex-wrap align-content-around justify-content-center">
          {content.map((bk) => (
            <div key={bk.id} className="col mb-4">
              <div className="card" style={{ width: "18rem" }}>
                <img src={bk.img} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title" >{bk.titulo}</h5>
                  <div className="row">
                    <p className="card-text">{bk.reseña}</p>
                  </div>
                  <div className="row">
                    <p className="card-text">{bk.val}</p>
                  </div>
                </div>
                <div className="card-body">
                  <Link className="btn btn-success" to={`/content/${bk.id}`}>
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => this.modalInsertar()}
            >
              x
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group row">
              <label htmlFor="img" className="col-sm-2 col-form-label">
                Imagen
              </label>
              <div className="col-sm-10">
                <input
                  type="file"
                  className="form-control"
                  id="img"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => handlePhoto(e)}
                  name="img"
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="titulo" className="col-sm-2 col-form-label">
                Titulo
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  onChange={(e) => handleChange(e)}
                  name="titulo"
                  value={newContent ? newContent.titulo : ""}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="reseña" className="col-sm-2 col-form-label">
                Reseña
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="reseña"
                  onChange={(e) => handleChange(e)}
                  name="reseña"
                  value={newContent ? newContent.reseña : ""}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="idioma" className="col-sm-2 col-form-label">
                Idioma
              </label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  id="idioma"
                  onChange={(e) => handleChange(e)}
                  name="idioma"
                  value={newContent ? newContent.idioma : ""}
                >
                  <option selected>Choose...</option>
                  <option value="1">English</option>
                  <option value="2">Spanish</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="tipocontenido" className="col-sm-2 col-form-label">
                Tipo de Contenido
              </label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  id="tipocontenido"
                  onChange={(e) => handleChange(e)}
                  name="tipocontenido"
                  value={newContent ? newContent.tipocontenido : ""}
                >
                  <option selected>Choose...</option>
                  <option value="1">Teoria</option>
                  <option value="2">Libro</option>
                  <option value="3">Juego</option>
                  <option value="4">Pelicula</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="idiomaenseñar" className="col-sm-2 col-form-label">
                Idioma a enseñar
              </label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  id="idiomaenseñar"
                  onChange={(e) => handleChange(e)}
                  name="idiomaenseñar"
                  value={newContent ? newContent.idiomaenseñar : ""}
                >
                  <option selected>Choose...</option>
                  <option value="1">English</option>
                  <option value="2">Spanish</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {tipoModal === "insertar" ? (
              <button
                className="btn btn-success"
                onClick={(e) => postContenido(e)}
              >
                OK
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => putContenido(editTaskID)}
              >
                OK
              </button>
            )}

            <button className="btn btn-danger" onClick={() => modalIns()}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modalEliminar}>
          <ModalBody>Estás seguro que deseas eliminar esta tarea ?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteContenido(deleteTaskID);
                setDeleteContentID(null);
                setModalEliminar(false);
              }}
            >
              Sí
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => setModalEliminar(false)}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
