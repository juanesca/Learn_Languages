import React, { useState, useEffect } from "react";
import { axios } from "../Functions/AxiosPath";

import { Modal, ModalBody, ModalFooter, ModalHeader, ButtonGroup, Button } from "reactstrap";

import { Link } from "react-router-dom";

import { localRemove, localGet } from "../Functions/localStorage";

import { toast } from "react-toastify";

let baseurl = "http://localhost:4000/";
const Dashboard = ({ setAuth }) => {
  const [content, setContent] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [newContent, setNewContent] = useState({
    tipocontenido: 0,
    titulo: "",
    reseña: "",
    posteador: localGet('user_id'),
    idioma: 0,
    idiomaenseñar: 0,
    count: 0,
    img: [{}, {}]
  });
  const [tc, settc] = useState(localGet("intencion"))
  const [idiomas, setidi] = useState([]);
  const [mis, setmis] = useState(false);

  useEffect(async () => {
    getContenido();
  }, [tc, mis]);
  useEffect(() => {
    axios.get('/user/idiomas').then((data) => {
      console.log(data.data);
      setidi(data.data);
    });
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
      if (mis) {
        if (tc == 1 || tc == 2) {
          await axios.get(`/content/mis/${localGet('user_id')}&1`).then((res) => {
            setContent(res.data);
          });
        } else if (tc == 3) {
          /*chats*/
        } else if (tc == 4) {
          await axios.get(`/content/mis/${localGet('user_id')}&2`).then((res) => {
            setContent(res.data);
          });
        } else if (tc == 5) {
          await axios.get(`/content/mis/${localGet('user_id')}&4`).then((res) => {
            setContent(res.data);
          });
        } else if (tc == 6) {
          await axios.get(`/content/mis/${localGet('user_id')}&3`).then((res) => {
            setContent(res.data);
          });
        } else {
          /*foros*/
        }
      } else {
        if (tc == 1 || tc == 2) {
          await axios.get(`/content/get/1&${localGet('user_id')}`).then((res) => {
            setNewContent({ ...newContent, tipocontenido: 1 });
            setContent(res.data.sort((a, b) => {
              if (a.orden > b.orden) {
                return 1;
              } else {
                return -1;
              }
            }));
          });
        } else if (tc == 3) {
          /*chats*/
        } else if (tc == 4) {
          await axios.get(`/content/get/2&${localGet('user_id')}`).then((res) => {
            setNewContent({ ...newContent, tipocontenido: 2 });
            setContent(res.data.sort((a, b) => {
              if (a.orden > b.orden) {
                return 1;
              } else {
                return -1;
              }
            }));
          });
        } else if (tc == 5) {
          await axios.get(`/content/get/4&${localGet('user_id')}`).then((res) => {
            setNewContent({ ...newContent, tipocontenido: 4 });
            setContent(res.data.sort((a, b) => {
              if (a.orden > b.orden) {
                return 1;
              } else {
                return -1;
              }
            }));
          });
        } else if (tc == 6) {
          await axios.get(`/content/get/3&${localGet('user_id')}`).then((res) => {
            setNewContent({ ...newContent, tipocontenido: 3 });
            setContent(res.data.sort((a, b) => {
              if (a.orden > b.orden) {
                return 1;
              } else {
                return -1;
              }
            }));
          });
        } else {
          /*foros*/
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChange = async (e) => {
    await setNewContent({ ...newContent, [e.target.name]: e.target.value });
    console.log(newContent);
  };

  const handlePhoto = async (e, i) => {
    let aux = [...newContent.img];
    aux[i] = e.target.files[0];
    await setNewContent({ ...newContent, img: aux });
  };

  const postContenido = async (e) => {
    let valid = true;    
    let x = new FormData();
    x.append('img',newContent.img)
    for (let i in newContent) {
      if (!newContent[i] && i != "count") {
        console.log(i);
        document.getElementById(i).style.border = "1px solid red";
        valid = false;
      } 
    }
    console.log(x);
    let y ={...newContent, img:x}
    if (valid) {
      await axios
        .post("/content/add", y)
        .then((res) => {
          console.log(res);
          modalIns();
          getContenido();
        })
        .catch((err) => console.log(err));
    }
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

  return (
    <div>
      <div className="container-fluid">
        {(() => {
          if (tc == 1 || tc == 2) {
            return <h1>Teoria</h1>
          } else if (tc == 3) {
            return <h1>Chats</h1>
          } else if (tc == 4) {
            return <h1>Libros</h1>
          } else if (tc == 5) {
            return <h1>Peliculas</h1>
          } else if (tc == 6) {
            return <h1>Juegos</h1>
          } else if (tc == 8) {
            return <h1>Foros</h1>
          }
        })()}
        <ButtonGroup color="success">
          {(() => {
            if (tc != 1 && tc != 2) {
              return <Button color="success" onClick={() => {
                settc(1);
              }}>Teoria</Button>
            }
          })()}
          {(() => {
            if (tc != 3) {
              return <Button color="success" onClick={() => {
                settc(3);
              }}>Chats</Button>
            }
          })()}
          {(() => {
            if (tc != 4) {
              return <Button color="success" onClick={() => {
                settc(4);
              }}>Libros</Button>
            }
          })()}
          {(() => {
            if (tc != 5) {
              return <Button color="success" onClick={() => {
                settc(5);
              }}>Peliculas</Button>
            }
          })()}
          {(() => {
            if (tc != 6) {
              return <Button color="success" onClick={() => {
                settc(6);
              }}>Juegos</Button>
            }
          })()}
          {(() => {
            if (1 <= tc && tc <= 7) {
              return <Button color="success" onClick={() => {
                settc(7);
              }}>Foros</Button>
            }
          })()}
        </ButtonGroup>
        <br />
        <br />
        <ButtonGroup>
          <Button
            className="btn btn-success"
            onClick={() => {
              modalIns();
            }}
          >
            Agregar
        </Button>
          {(() => {
            return (<Button
              className="btn btn-success"
              onClick={() => {
                setmis(!mis)
              }}
            >
              {(!mis) ? "Ver los mios" : "Ver todos"}
            </Button>);
          })()}

        </ButtonGroup>
        <br />
        <br />
        <div className="d-flex flex-wrap align-content-around justify-content-center">
          {content.map((bk) => (
            <div key={bk.id} className="col mb-4">
              <div className="card" style={{ width: "18rem" }}>
                <img src={`${baseurl}${bk.img}`} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title" >{bk.titulo}</h5>
                  <div className="row">
                    <p className="card-text">{bk.reseña}</p>
                  </div>
                  <div className="row">
                    <p className="card-text">Calificacion: {Math.round(bk.calificacion * 10) / 10}</p>
                  </div>
                </div>
                <div className="card-footer">
                  {(() => {
                    if (!mis) {
                      return (
                        <Link className="btn btn-success stretched-link" to={`/content/${bk.id}`}>
                          Ver
                        </Link>);
                    } else {
                      return (<><Button color="success">Editar</Button>{" "}<Button color="warning" className="btn btn-success">Eliminar</Button></>);
                    }
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => modalIns()}
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
                <form enctype="multipart/form-data">
                  <input
                    type="file"
                    className="form-control"
                    id="img"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => handlePhoto(e, 0)}
                    name="img"
                  /></form>
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
            </div><div className="form-group row">

              <label htmlFor="img" className="col-sm-2 col-form-label">
                Contenido
              </label>
              <div className="col-sm-10">
                <form enctype="multipart/form-data">
                  <input
                    type="file"
                    className="form-control"
                    id="contenido"
                    onChange={(e) => handlePhoto(e, 1)}
                    name="img"
                  /></form>

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
                  <option style={{ display: "none" }}>Choose...</option>
                  {idiomas.map((elem) => {
                    console.log(elem);
                    return (
                      <option value={elem.id}>{elem.stridioma}</option>
                    );
                  })}
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
                  <option style={{ display: "none" }}>Choose...</option>
                  {idiomas.map((elem) => {
                    console.log(elem);
                    return (
                      <option value={elem.id}>{elem.stridioma}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={(e) => postContenido(e)}
            >
              OK
              </button>

            <button className="btn btn-danger" onClick={() => modalIns()}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
