import { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";



/**
 * Write class
 */
class Write extends Component {
    /**
     * @return {Component} Component
     */
    render() {
        return (
            <div>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>제목</Form.Label>
                        <Form.Control type="email" placeholder="제목을 입력하세요" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" placeholder="내용을 입력하세요" />
                    </Form.Group>
                </Form>
                <Button variant="info">작성완료</Button>
                <Link to="/postlist">  <Button variant="secondary">취소</Button></Link>
            </div>
        );
    }
}

export default Write;