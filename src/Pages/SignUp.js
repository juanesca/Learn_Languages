import React, { useState, useEffect } from 'react';
import {axios} from './../Functions/AxiosPath';
import { toast } from 'react-toastify';
import { localSave } from '../functions/localStorage';

const Signup = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: '',
    pass: '',
    name: '',
    apll: '',
    idi_n: '',
    idi_o: '',
    inten: ''
  });

  const { email, pass, name } = inputs;

  const onChange = async e => {
    await setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/signup', inputs)
        .then(res => {
          const data = res.data;

          if (data.jwtToken) {
            localSave('token', data.jwtToken);
            // cuadrar siguiente linea en el back
            localSave('intencion', data.intencion);
            localSave('user_id', data.id);
            setAuth(true);
            toast.success('Register Succesfully');
          } else {
            setAuth(false);
            toast.error(data.msg);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <div className="container-fluid d-flex justify-content-center" style={{paddingTop: '10vh'}}>


      <div className="card" style={{ width: "35rem", height: "30rem" }}>
          <div className="card-header" style={{textAlign: 'center'}}>Sign Up</div>
          <form onSubmit={onSubmitForm} className="h-100" style={{paddingBottom: '0px'}}>
            <div className="card-body" style={{height: '80%'}}>
            <div className="form-group row">
          <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
          <div className="col-sm-9">
            <input 
            type="email" 
            className="form-control" 
            id="email"
            onChange={e => onChange(e)}
            name="email"
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="pass" className="col-sm-3 col-form-label">Contraseña</label>
          <div className="col-sm-9">
            <input 
            type="password" 
            className="form-control" 
            id="pass"
            name="pass"
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <div className="row">
        <div className="form-group col-sm-6 row">
          <label htmlFor="idi_o" className="col-sm-3 col-form-label">Idioma Objetivo</label>
          <select
            className="custom-select col-sm-9"
            id="idi_o"
            name="idi_o"
            onChange={e => onChange(e)}
            >
                    <option selected>Choose...</option>
                    <option value="1">English</option>
                    <option value="2">Spanish</option>
            </select>
         </div>
        <div className="form-group col-sm-6 row">
                  <label htmlFor="idi_n" className="col-sm-3 col-form-label">Idioma Nativo</label>
                  <select
                    className="custom-select col-sm-9"
                    id="idi_n"
                    name="idi_n"
                    onChange={e => onChange(e)}
                    >
                    <option selected>Choose...</option>
                    <option value="1">English</option>
                    <option value="2">Spanish</option>
                  </select>
                </div>
              </div>
        <div className="row">
        <div className="form-group col-sm-6 row">
          <label htmlFor="name" className="col-sm-3 col-form-label">Nombre</label>
          <div className="col-sm-9">
            <input 
            type="text" 
            className="form-control" 
            id="name"
            name="name"
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <div className="form-group col-sm-6 row">
          <label htmlFor="apll" className="col-sm-3 col-form-label">Apellido</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              id="apll"
              name="apll"
              onChange={e => onChange(e)}
              />
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-3 col-form-label" htmlFor="inten">Intencion</label>
        <select
         className="custom-select col-sm-9"
         id="inten"
         name="inten"
         onChange={e => onChange(e)}
        >
          <option selected>Choose...</option>
          <option value="">...</option>
        </select>
      </div>
            </div>
            <div className="card-footer" style={{marginBottom: '0px'}}>
            <button className="btn btn-primary btn-block" type="submit">Registrarme</button>
            </div>
          </form>
        </div>



      </div>
    </div>
  )
}

export default Signup;