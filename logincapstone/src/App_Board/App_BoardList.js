
import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoardItem from './App_BoardItem';

import {firebase_board_list} from './App_reducer'; //Reducer에 작성해놓은 firebase_board_list()를 사용한다고 선언

class BoardList extends Component {
    componentDidMount() { 
        this.props.dispatch(firebase_board_list()); //컴포넌트가 생성되는 시점에 발생하는 이벤트인 componentDidMount에서 firebase_board_list()를 실행
    }
    render() {
        const { boards} = this.props; //firebase_board_list()를 호출하면 Reducer의 state.boards에 게시글들이 채워지고이것을 바라보고 있는 this.props.boards에 전달되면서 화면에 출력됨

        return (
                <table border="1">
                    <tbody>
                    <tr align="center">
                        <td width="50">No.</td>
                        <td width="300">Title</td>
                        <td width="100">Name</td>
                        <td width="100">Date </td>
                    </tr>
                    {
                        boards.map((row, inx) => 
                            (<BoardItem key={inx} inx={inx+1} row={row} />)
                        )
                    }
                    </tbody>
                </table>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        boards: state.boards,
        selectedBoard: state.selectedBoard
    };
}

export default connect(mapStateToProps)(BoardList);