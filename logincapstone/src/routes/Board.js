import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";



import BoardForm from '../App_Board/App_BoardForm';
import BoardList from '../App_Board/App_BoardList';

function BoardPage() {
    return (
        <div>
            <h3>edunavi</h3>
                <BoardForm/>
                {/* <BoardList/> */}

                
                
        </div>

       

        
    );



  }
  
  export default BoardPage;