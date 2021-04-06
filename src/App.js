import React, { useEffect, useState, Fragment } from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { toast } from 'react-toastify';

import { axios } from './Functions/AxiosPath'

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/SignUp';
import ContentID from "./Pages/Content";

import Navb from "./Components/NavbarLogged.jsx";
import Navi from "./Components/Navbar";

toast.configure();

function App() {
  const checkAuthenticated = async () => {
    try {
      await axios.post("/user/verify", null)
        .then(async res => {
          const parseRes = await res.data;
          console.log(res);
          parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
          console.log('OK');
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <Fragment>
            <Router>
                <Switch>
                    <Navi>
                      <Route exact path="/login" render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                      <Route exact path="/" render={props => !isAuthenticated ? (<Signup {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                    </Navi>
                    <Navb setAuth={setAuth}  >
                      <Route exact path="/dashboard" render={props => isAuthenticated ? (<Dashboard {...props} setAuth={setAuth} />) : (<Redirect to="/login" />)} />
                      <Route  exact path="/content/:id" component={ContentID} />
                    </Navb>
                </Switch>
            </Router>
        </Fragment>
  )
}

export default App;