import { createAction, handleActions } from 'redux-actions';
//import firestore from '../firebase/firebase';
import {db} from '../firebase/firebase';
import dateFormat from 'dateformat';


// action type
const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_READ = 'READ';
const BOARD_LIST = 'LIST'; 

export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE, brdno => brdno);
export const board_read = createAction(BOARD_READ);
export const board_list = createAction(BOARD_LIST);


//FireStore에서 데이터를 가지고 와서 기존의 state.boards에 넣어주는 기능
export const firebase_board_list = () =>{
    return (dispatch) => {
        return db.collection('boards').orderBy("brddate", "desc").get() //작성된 날짜를 기준으로 최근 데이터가 먼저 오게
                    .then((snapshot) => {
                        var rows = [];
                        snapshot.forEach((doc) => {
                            var childData = doc.data();
                            childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
                            rows.push(childData);
                        });
                        dispatch(board_list(rows)); //화면에 출력하기 위해 board_list() 함수를 호출해서 redux로 보관
                    });    
    }//firebase_board_list()로 서버에서 데이터를 가지고 오고, board_list()로 state에 저장하는 구조
}

export const firebase_board_remove = ( brdno = {}) => {//주어진 brdno로 firestore에 있는 데이터를 삭제하는 명령어
    return (dispatch) => {
        console.log(brdno);
        return db.collection('boards').doc(brdno).delete().then(() => {//삭제하고 나면 화면에 출력하기 위해 데이터를 가지고 있는 state.boards에서 제거하기 위해 board_remove() 호출
            dispatch(board_remove(brdno));
        })
    }
};


//수정인지 신규 등록인지 구분해서 수정이면 update, 신규등록이면 set으로 데이터를 저장
export const firebase_board_save = ( data = {}) => {
    return (dispatch) => {
        if (!data.brdno) {
            var doc = db.collection('boards').doc();
            data.brdno = doc.id;
            data.brddate = Date.now();
            return doc.set(data).then(() => {//저장하고 나면 board_save() 호툴해서 state.boards의 값을 수정하여 화면에 반영
                data.brddate = dateFormat(data.brddate, "yyyy-mm-dd");
                dispatch(board_save(data));
            })
        } else {
            return db.collection('boards').doc(data.brdno).update(data).then(() => {
                dispatch(board_save(data));
            })            
        }
    }
};

const initialState = {
    boards: [], 
    selectedBoard: {}
};

export default handleActions({
    [BOARD_LIST]: (state, { payload: data }) => {
        return {boards: data, selectedBoard: {} };
    },
    [BOARD_SAVE]: (state, { payload: data }) => {
        let boards = state.boards;
        let inx = boards.findIndex(row => row.brdno === data.brdno);
        if (inx===-1) {                                                    // new : Insert
            let newboards = [{date: new Date(), ...data }]
            return {boards: newboards.concat(boards), selectedBoard: {} };
        } else {                                                           // Update
            return {boards: boards.map(row => data.brdno === row.brdno ? {...data }: row), selectedBoard: {} };
        }    
    },
    [BOARD_REMOVE]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {boards: boards.filter(row => row.brdno !== brdno), selectedBoard: {} };
    },
    [BOARD_READ]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {
            boards: boards,
            selectedBoard: boards.find(row => row.brdno === brdno)
        };
    }
}, initialState);
