import React, { useEffect, useState, Fragment } from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { toast } from 'react-toastify';

import { axios } from './Functions/AxiosPath'

import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Signup from './Pages/SignUp.jsx';
import ContentID from "./Pages/Content.jsx";

import Navb from "./Components/NavbarLogged";
import Navi from "./Components/Navbar";

toast.configure();

function App() {
  const checkAuthenticated = async () => {
    try {
      await axios.post("/user/verify", null)
        .then(res => {
          const parseRes = res.data.status;
          setAuth(parseRes);
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
  const [x, setcambio] = useState(1);
  const setAuth = boolean => {
    if (boolean != isAuthenticated) {
      setcambio(0);
      setIsAuthenticated(boolean);
    } else {
      setcambio(1);
    }
  };
  const elementos = () => {
    if (isAuthenticated) {
      return (<Navb setAuth={setAuth}  >

      </Navb>);
    } else {
      return ((<Navi>

      </Navi>));
    }
  }
  return (
    <Fragment>
      <Router>
        {elementos()}
        <Switch>
          <Route path="/dashboard" render={props => (isAuthenticated ? (<Dashboard {...props} setAuth={setAuth} />) : (<Redirect to="/login" />))} />
          <Route path="/content/:id" component={ContentID} />
          <Route path="/login" render={props => (!isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />))} />
          <Route path="/" render={props => (!isAuthenticated ? (<Signup {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />))} />
        </Switch>
        {(() => {
          console.log(x);
          if (x == 0) {
            setcambio(1);
            if (isAuthenticated) {
              return (<Redirect to="/dashboard" />);
            } else {
              return (<Redirect to="/login" />);
            }
          }
        })()}
      </Router>

    </Fragment>
  )
}

export default App;