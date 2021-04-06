import React from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import {localRemove} from '../Functions/localStorage';
const Navbar = ({ setAuth }) => {
    const logout = async (e) => {
        e.preventDefault();
        try {
          localRemove('token');
          localRemove('user_id');
          localRemove("intencion")
          setAuth(false);
          toast.success("Logout successfully");
        } catch (err) {
          console.error(err.message);
        }
      };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          D-Learn
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto nav-pills">
            <li className="nav-item nav-white">..username</li>
            {"   "}
            <li className="nav-item btn btn-white" onClick={(e) => logout(e)}>
              Log out
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
