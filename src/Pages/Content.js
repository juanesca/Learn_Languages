import React, { useState, useEffect } from "react";
import { axios } from "./../Functions/AxiosPath";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { toast } from "react-toastify";
import { useParams } from "react-router";



const Content = () => {
    let { id } = useParams();

    
    return(
        <div>

        </div>
    )
}

export default Content;