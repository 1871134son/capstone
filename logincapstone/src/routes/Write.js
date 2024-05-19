import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { boardSave, getUserName } from '../firebase/firebase.js';
import styles from './Write.module.css';

function Write() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [brddate, setBrddate] = useState('');

    useEffect(() => {
        setBrddate(Date.now()); // Set current date
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const brdwriter = await getUserName(); // Get the writer's information
        boardSave(null, title, content, brddate, brdwriter);
        navigate('/postlist');
    };

    return (
        <main role="main" className={styles.container}>
            <h2 className={styles.writeTitle}>글쓰기</h2>
            <Form onSubmit={handleSubmit}>
                <div className={styles.pt1}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            required
                            className={styles.input}
                        />
                    </Form.Group>
                </div>
                <div className={styles.pt1}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            required
                            className={styles.textarea}
                        />
                    </Form.Group>
                </div>
                <div className={`${styles.pt1} ${styles.textRight}`}>
                    <Button type="submit" variant="success" className={styles.submitButton}>
                        작성완료
                    </Button>
                    <Link to="/postlist">
                        <Button variant="secondary" type="button" className={styles.cancelButton}>
                            취소
                        </Button>
                    </Link>
                </div>
            </Form>
        </main>
    );
}

export default Write;
