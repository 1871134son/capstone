import { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {boardSave} from "../firebase/firebase.js"
import React, { useEffect, useState } from 'react';
import { getUserName } from "../firebase/firebase.js";

/**
 * Write class
 */
//class Write extends Component {
function Write(){
    

    const [brdno, setBrdno] = useState(0);//brdno가 있으면 업데이트 없으면 새로?
    
    const [title, setTitle] = useState('');
    const [content,setContent] = useState('');
    const [brddate, setBrddate] = useState('');
    //const [brdwriter, setBrdwriter] = useState('');
    

    //날짜 정보 가져오기
    useEffect(() => {
        setBrddate(getCurrentDate());
    }, []); 

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1, 2자리로 만듦
        const day = String(date.getDate()).padStart(2, '0'); // 일자도 2자리로 만듦
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };


    



    const navigate = useNavigate();
   
    const handleSubmit = async (event) => {
      event.preventDefault();
      const brdwriter = await getUserName();//작성자 정보 가져오기
      


        boardSave(brdno, title, content, brddate, brdwriter);
         
        navigate('/postlist'); // 
    
    };


  
        return (
            <div>
                <Form onSubmit={handleSubmit}>
                
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>제목</Form.Label>
                        <Form.Control type="text"  value={title} 
                        onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea"  value={content} 
                        onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" required/>
                    </Form.Group>
                    <Button type="submit" onClick={()=>{    
                    console.log("버튼눌림");
                 }} variant="info" >작성완료</Button>
                </Form>             
                <Link to="/postlist">  <Button variant="secondary">취소</Button></Link>
            </div>
        );
    
}

export default Write;