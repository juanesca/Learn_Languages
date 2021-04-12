import React, { useState, useEffect } from "react";
import { axios } from "../Functions/AxiosPath";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { toast } from "react-toastify";
import { useParams } from "react-router";

const Content = () => {
  let { id } = useParams();
  const [content, setContent] = useState([]);
  const [deleteContentID, setDeleteContentID] = useState("");
  const [modalEliminar, setModalEliminar] = useState(false);
  const [editContentID, setEditContentID] = useState("");
  const [modalInsertar, setModalInsertar] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [newContent, setNewContent] = useState({});

  const getContentID = async () => {
    try {
      await axios.get(`/content/${id}`).then((res) => setContent(res.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteContenido = async (taskID) => {
    await axios.delete(`/content/delete/${taskID}`);
    getContentID();
  };

  const handleChange = async (e) => {
    await setNewContent({ ...newContent, [e.target.name]: e.target.value });
    console.log({ newContent });
  };

  const handlePhoto = async (e) => {
    await setNewContent({ ...newContent, img: e.target.files[0] });
  };

  const modalIns = () => {
    setModalInsertar(!modalInsertar);
  };

  const putContenido = async (taskID) => {
    await axios
      .post(`/content/edit/${taskID}`, newContent)
      .then((res) => {
        modalIns();
        getContentID();
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

  useEffect(() => {
    getContentID();
  }, []);

  return (
    <div>
        <div className="aside-65">

        </div>
        <div className="aside-35">

        </div>

      <Modal isOpen={modalInsertar}>
        <ModalHeader style={{ display: "block" }}>
          <span style={{ float: "right" }} onClick={() => this.modalInsertar()}>
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
            <button
              className="btn btn-success"
              onClick={() => putContenido(editContentID)}
            >
              OK
            </button>

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
              deleteContenido(deleteContentID);
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
  );
};

export default Content;
