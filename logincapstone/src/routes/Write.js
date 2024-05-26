import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { boardSave, getUserName, getBrdno, updateBrdno, uploadPhoto} from '../firebase/firebase.js';
import styles from './Write.module.css';


function Write() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [brddate, setBrddate] = useState('');

    //사진
    const [photo, setPhoto] = useState(null); // 사진 파일을 위한 상태 변수

    //brdno +1
    const [brdno, setBrdno] = useState(0); // 게시글 번호를 위한 상태 변수


    
    useEffect(() => {
        setBrddate(Date.now()); // Set current date

        // Firestore에서 현재 게시글 번호를 가져옴
        const fetchBrdno = async () => {
            const currentBrdno = await getBrdno();
            setBrdno(currentBrdno);
        };
        fetchBrdno();
    }, []);





    const navigate = useNavigate();

    //사진
    const handlePhotoChange = (event) => {
        setPhoto(event.target.files[0]);
    };
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const brdwriter = await getUserName(); // Get the writer's information


        //사진
        let photoURL = '';
        if (photo) {
            photoURL = await uploadPhoto(photo); // 사진을 Firebase Storage에 업로드하고 URL을 가져옴
        }


        const newBrdno = brdno + 1; // 새로운 게시글 번호 계산
        //사진
        await boardSave(newBrdno, title, content, brddate, brdwriter, photoURL); // 게시글 저장
        await updateBrdno(newBrdno); // Firestore에 새로운 게시글 번호 저장

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

                {/* 사진 */}
                <div className={styles.pt1}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlFile1">
                        <Form.Label>사진 첨부</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handlePhotoChange}
                            className={styles.fileInput}
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
