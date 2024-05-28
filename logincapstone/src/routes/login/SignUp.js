import React, { useState, useEffect } from 'react';
import { signUp, fetchMajorList, signIn } from "../../firebase/firebase.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchingLicenseList, sortLicenseList } from '../../redux/store.js';
import { useNavigate,useLocation  } from 'react-router-dom';
import './SignIn.css';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signIn(email, password);
        navigate('/');
    };

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src="https://image.freepik.com/free-vector/code-typing-concept-illustration_114360-3581.jpg" alt="user login" />
                </div>
                <div className="login__forms">
                    <form onSubmit={handleSubmit} className="login__register" id="login-in">
                        <h1 className="login__title">로그인</h1>
                        <div className="login__box">
                            <FontAwesomeIcon icon={faUser} className="login__icon" />
                            <input type="text" placeholder="아이디" className="login__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="login__box">
                            <FontAwesomeIcon icon={faLock} className="login__icon" />
                            <input type="password" placeholder="비밀번호" className="login__input" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <a href="#" className="login__forgot">비밀번호를 잊으셨나요? </a>
                        <button type="submit" className="login__button">로그인</button>
                        <div>
                            <span className="login__account login__account--account">계정이 없으신가요?</span>
                            &nbsp;
                            <span className="login__signin login__signin--signup" onClick={() => navigate('/signup')}>가입하기</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (confirmCheck(password, confirm)) {
            navigate('/signup/second', { state: { email, password } });
        } else {
            alert("비밀번호 확인을 다시 입력하세요!");
        }
    };

    function confirmCheck(password, confirm) {
        return password === confirm;
    }

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src="https://image.freepik.com/free-vector/code-typing-concept-illustration_114360-3581.jpg" alt="user signup" />
                </div>
                <div className="login__forms">
                    <form onSubmit={handleSubmit} className="login__create">
                        <h1 className="login__title">회원가입</h1>
                        <div className="login__box">
                            <FontAwesomeIcon icon={faEnvelope} className="login__icon" />
                            <input type="email" placeholder="이메일" className="login__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="login__box">
                            <FontAwesomeIcon icon={faLock} className="login__icon" />
                            <input type="password" placeholder="비밀번호" className="login__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="login__box">
                            <FontAwesomeIcon icon={faLock} className="login__icon" />
                            <input type="password" placeholder="비밀번호 확인" className="login__input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                        </div>
                        <button type="submit" className="login__button">다음</button>
                        <div>
                            <span className="login__account login__account--account">이미 계정이 있으신가요?</span>
                            &nbsp;
                            <span className="login__signin login__signin--signup" onClick={() => navigate('/signin')}>로그인</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function SignUpSecond() {
    const [userName, setUserName] = useState('');
    const [licenses, setLicenses] = useState(['', '', '']);
    const [jmcds, setJmcds] = useState(['empty', 'empty', 'empty']);
    const [majorList, setMajorList] = useState([]);
    const [major, setMajor] = useState('');
    const [majorLicenses, setMajorLicenses] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const licenseList = useSelector((state) => state.licenseList.licenseList);
    const location = useLocation(); // 현재 위치의 state 접근을 위해 useLocation 추가

    useEffect(() => {
        dispatch(fetchingLicenseList());
    }, [dispatch]);

    useEffect(() => {
        async function loadMajorList() {
            try {
                const majors = await fetchMajorList();
                majors.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
                setMajorList(majors);
            } catch (error) {
                console.error("majorList를 가져오는데 실패했습니다.", error);
            }
        }
        loadMajorList();
    }, []);

    useEffect(() => {
        console.log("업데이트된 licenseList -> ", licenseList);
        dispatch(sortLicenseList());
    }, [licenseList, dispatch]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (location.state) { // location.state를 확인
            const { email, password } = location.state; // email과 password 추출
            signUp(email, password, userName, licenses, jmcds, major, majorLicenses);
            navigate('/'); // 가입 성공 시 홈 페이지로 이동
        } else {
            console.error("Navigation state is missing.");
        }
    };

    const handleSelectChange = (index, value) => {
        const selectedLicense = licenseList.find(license => license.name === value);

        const updatedLicense = [...licenses];
        updatedLicense[index] = value;
        setLicenses(updatedLicense);

        if (selectedLicense) {
            const updatedJmcds = [...jmcds];
            updatedJmcds[index] = selectedLicense.jmcd;
            setJmcds(updatedJmcds);
            console.log(selectedLicense.name, selectedLicense.jmcd);
        } else {
            const updatedJmcds = [...jmcds];
            updatedJmcds[index] = "empty";
            setJmcds(updatedJmcds);
            console.error("선택한 자격증을 찾지 못했습니다.", value);
        }
        console.log(jmcds, licenses);
    };

    const majorSelectChange = (value) => {
        const selectedMajor = majorList.find(major => major.name === value);

        setMajor(value);

        if (selectedMajor) {
            setMajorLicenses(selectedMajor.list);
        } else {
            setMajorLicenses(['정보처리기사', '가스기사', '전기기사']);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '95vh' }}>
            <Card className="box" style={{ minWidth: '500px', maxWidth: '600px', borderWidth: '1px' }}>
                <Card.Header className="box" style={{ fontSize: "22px", fontWeight: "bold" }}>EduNavi에 오신 것을 환영합니다!</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 box int_id" controlId="formGroupuserName" style={{ textAlign: "left" }}>
                            <Form.Label className="box" style={{ fontWeight: "bold", textAlign: "left" }}>유저 이름</Form.Label>
                            <Form.Control className="int" type="text" value={userName} placeholder="User name"
                                onChange={(e) => { setUserName(e.target.value) }}
                                required />
                        </Form.Group>

                        <Form.Label style={{ fontWeight: "bold", textAlign: "left", color: "blue", marginTop: "20px" }}>관심 있는 자격증과 학과를 골라주세요.</Form.Label> <br /><br />

                        {Array.from({ length: 2 }).map((_, index) => (
                            <Form.Group className="mb-3 box" controlId={`formGroupLicense${index + 1}`} style={{ textAlign: "left" }} key={index}>
                                <Form.Label className="box" style={{ fontWeight: "bold" }}>관심 있는 자격증{index + 1}</Form.Label>
                                <Form.Control
                                    className="int"
                                    type="text"
                                    list="license_id"
                                    value={licenses[index]} // 현재 상태에 따라 선택값을 설정
                                    onChange={(e) => handleSelectChange(index, e.target.value)} // 변경 이벤트 핸들러
                                />
                                <datalist id="license_id">
                                    {licenseList &&
                                        licenseList.map((license, index) => ( //데이터 리스트에 자격증 정보를 삽입 
                                            <option key={index} value={license.name}>{license.name}</option>
                                        ))
                                    }
                                </datalist>
                            </Form.Group>
                        ))}
                        <Form.Group className="mb-3 box" controlId={`formGroupLicense$`} style={{ textAlign: "left" }}>
                            <Form.Label className="box" style={{ fontWeight: "bold" }}>관심 분야(학과)</Form.Label>
                            <Form.Control
                                className="int"
                                type="text"
                                list="major_id"
                                value={major} // 현재 상태에 따라 선택값을 설정
                                onChange={(e) => majorSelectChange(e.target.value)}  // 변경 이벤트 핸들러
                            />
                            <datalist id="major_id">
                                {majorList &&
                                    majorList.map((major, index) => ( //데이터 리스트에 자격증 정보를 삽입 
                                        <option key={index} value={major.name}>{major.name}</option>
                                    ))
                                }
                            </datalist>
                        </Form.Group>

                        <Button id="btnJoin" type="submit" variant="primary" style={{ width: '200px', marginBottom: "10px", marginTop: "20px", backgroundColor: "#4AD395", fontWeight: "bold", display: "block", margin: "0 auto" }}>
                            가입하기
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export { SignInPage, SignUpPage, SignUpSecond };
