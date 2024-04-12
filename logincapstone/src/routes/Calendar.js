import React, { useEffect, useRef } from "react";
import { format, addMonths, startOfWeek, addDays } from "date-fns";
import { endOfWeek, isSameDay, isSameMonth, startOfMonth, endOfMonth } from "date-fns";
import uuid from "react-uuid";
import "./_style.css";
import { getExamScheduleList,auth } from "../firebase/firebase.js";
import { fetchingExamSchedule } from "../redux/store.js";
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from "firebase/auth";


function convertToDate(dateNum){ //공공데이터에선 날짜를 20230509 이런 식으로 반환함. 이를 Date객체로 만들어 리턴해주는 함수. 
    const dateString = dateNum.toString();// 숫자를 문자열로 변환 -- 데이터 타입 확인해보고 문자면 이건 주석처리

    const year = parseInt(dateString.substring(0,4), 10); //0~3까지 10진수로 변환 
    const month = parseInt(dateString.substring(4,6),10) -1 ; //4~5까지 10진수로 변환, -1 하는 이유는 JS에서 month는 0부터 시작
    const day = parseInt(dateString.substring(6,8),10); // 6~7까지 10진수 변환. 

    return new Date(year, month, day);
}

const RenderHeader = ({ currentMonth }) => { //현재 달을 표시하는 컴포넌트 
    return (
        <div className="header row">
            {currentMonth.toLocaleString("en-US", { month: "long" })}
        </div>
    );
};


const RenderDays = () => { // 주의 요일을 표시해주는 컴포넌트 
    const days = [];
    const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col" key={i}>
                {date[i]}
            </div>,
        );
    }
    return <div className="days row">{days}</div>;
};

//달력에 표시할 중요한 일정들. store.js에 넣고, 활용하는게 좋을 듯. 


const RenderCells = ({ currentMonth, selectedDate }) => { //실제 달력의 날짜들을 표시해줌. 현재 달, 선택된 날짜를 입력받음. 해달 월의 시작과 끝을 계산 
    //각 날짜에 해당하는 셀을 생성함. 셀은 현재 달, 선택된 날짜 , 주말 여부에 따라 다른 스타일을 표시함. 

    

    const monthStart = startOfMonth(currentMonth); //현재 달의 시작 일 

    const monthEnd = endOfMonth(monthStart); //현재 달의 마지막 일 

    const startDate = startOfWeek(monthStart); //현재 달의 시작일,(일요일 기준)

    const endDate = endOfWeek(monthEnd); //현재 달의 종료일 , (토요일 기준)

    const rows = []; //각 주를 담는 배열 

    let days = []; //한 주 동안의 날짜를 담는 배열 

    let day = startDate; //startDate 부터 순회 시작 

    let formattedDate = ""; //날짜 표시하는 변수 

    while (day <= endDate) { //startDate 부터 endDate까지 모든 날짜 순회 
        for (let i = 0; i < 7; i++) { //한 주의 7일 반복 
            formattedDate = format(day, "d"); //day를 d 포멧으로 변경 
            //중요 날짜에 대한 체크
            const isImportant = importantDates.some(importantDate =>
                isSameDay(day, importantDate.date)
            );
            const importantText = isImportant ? importantDates.find(importantDate =>
                isSameDay(day, importantDate.date)
            ).text : '';
            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart) //만약 같은 달이 아니면, ex. 4월 달력인데, 3월 31일 날짜면 
                            ? "disabled gray-text" // 회색으로 텍스트 표시 
                            : isSameDay(day, selectedDate) // 현재 일과, 동일한 날짜면 굵은 검은색(selected 표시)
                            ? "selected"
                            : ""
                    } ${
                        format(day, "EEEE") === "Sunday"  //일요일은 빨강, 토요일은 파랑 표시 
                            ? "red-text"
                            : format(day, "EEEE") === "Saturday"
                            ? "blue-text"
                            : ""
                    }`}
                    key={uuid()}  //각 셀에 고유한 키 삽입 
                >
                    <span
                        className={
                            isSameDay(day, selectedDate) //선택된 날짜(오늘)에는 today 클래스 할당 
                                ? "text today"
                                : isSameMonth(day, monthStart) //현재 달의 날짜에는 기본텍스트 할당 
                                ? ""
                                : "text not-valid" //현재 달이 아닌 날짜에는 not-valid 스타일 적용
                        }
                    >
                        {formattedDate}  
                        {isImportant && <span style={{fontSize:"10px"}}><br></br>{importantText}</span>}
                    </span>
                </div>,
            );
            day = addDays(day, 1); //다음 날짜로 이동  
        }//forEnd
        //한 주치 날짜를 포함하는 row를 rows에 추가함. 
        rows.push(
            <div className="row" key={uuid()}>
                {days}
            </div>,
        );
        days = []; //다음 주를 위해 days 초기화. 
    }//whileEnd
    return <div className="body">{rows}</div>;
};

const isLastDayOfMonth = (date, monthEnd) => {
    return format(date, "yyyy-MM-dd") === format(monthEnd, "yyyy-MM-dd");
};
const importantDates = [ 
     // 다른 중요 날짜들...
  ];

  
const Calendar = () => { //전체 달력을 생성하는 컴포넌트, 현재 날짜와 선택된 날짜를 기반으로, 12개월치 달력을 생성하고, 현재 달로 스크롤 할 수 있는 기능을 제공함. 
    let dispatch = useDispatch();
    const examScheduleList = useSelector((state)=>state.examScheduleList.examScheduleList);
    
    useEffect(()=>{ //먼저 dispatch로 사용자가 로그인 한 상태인걸 확인, 시험 일정을 가져옴. 
        onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(fetchingExamSchedule());
            } else {
              // 사용자가 로그아웃한 상태입니다.
            }
          });
    },[dispatch])
   
    useEffect(()=>{
        if(examScheduleList&&Array.isArray(examScheduleList)){ //리스트에 데이터가 있을 경우에만 실행
            for(let i = 0; i<examScheduleList.length; i++){//사용자가 고른 자격증의 갯수만큼 반복함. examScheduleList[0] 은 첫번째, examScheduleList[1] 은 두번째 .. 2는 세번째
                for(let j=0; j<examScheduleList[i].length; j++){//examScheduleList[i].length -> 자격증 시험의 횟수 == j+1, ex. 1회,2회,3회..   
                    let examName = examScheduleList[i][j].nameOfExam; //시험 이름 
                    let licenseName = examScheduleList[i][j].nameOfLicense; //자격증 이름
                    importantDates.push(
                        {date: convertToDate(examScheduleList[i][j].docExamEndDt), text: examName+ ' 필기시험종료일자'},
                        {date: convertToDate(examScheduleList[i][j].docExamStartDt), text: examName+' 필기시험시작일자'},
                        {date: convertToDate(examScheduleList[i][j].docPassDt), text: examName+' 필기시험 합격자 발표일자'},
                        {date: convertToDate(examScheduleList[i][j].docRegEndDt), text: examName+' 필기시험원서접수 종료일자'},
                        {date: convertToDate(examScheduleList[i][j].docReStartDt), text: examName+' 필기시험원서접수 시작일자'},
                        {date: convertToDate(examScheduleList[i][j].docSubmitEndDt), text: examName+' 응시자격서류제출 종료일자'},
                        {date: convertToDate(examScheduleList[i][j].docSubmitStartDt), text: examName+' 응시자격서류제출 시작일자'},
                        {date: convertToDate(examScheduleList[i][j].pracExamEndDt), text: examName+' 실기시험 종료 일자'},
                        {date: convertToDate(examScheduleList[i][j].pracExamStartDt), text: examName+' 실기시험 시작 일자'},
                        {date: convertToDate(examScheduleList[i][j].pracPassEndDt), text: examName+' 합격자발표 종료일자'},
                        {date: convertToDate(examScheduleList[i][j].pracPassStartDt), text: examName+' 합격자발표 시작일자'},
                        {date: convertToDate(examScheduleList[i][j].pracCreEndDt), text: examName+' 실기시험원서접수 종료일자'},
                        {date: convertToDate(examScheduleList[i][j].pracCreStartDt), text: examName+' 실기시험원서접수 시작일자'},
                    );
                }
            }
          //  console.log(importantDates);
        }//if END
    },[examScheduleList]); 

   
   
    
    const currentDate = new Date();
    const selectedDate = new Date();

    let currentMonth = new Date(format(currentDate, "yyyy"));
    let months = [];

    const monthRef = useRef(null);

    for (let i = 0; i < 12; i++) { //12번 반복 
        months.push(
            <div
                className="calendar__item"
                key={uuid()}
                ref={
                    format(currentMonth, "MM") === format(selectedDate, "MM")
                        ? monthRef
                        : null
                }
            >
                <RenderHeader currentMonth={currentMonth} />
                <RenderCells
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                />
            </div>,
        );
        currentMonth = addMonths(currentMonth, 1);
    }

    useEffect(() => {
        if (monthRef.current !== null) {
            monthRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, []);

    function scrollCurrentMonth() { //현재 달로 이동함. 
        if (monthRef.current !== null) {
            monthRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="schedule-calendar">
            <div className="text-today">
                <p className="text-current" onClick={scrollCurrentMonth}>
                    {currentDate.toLocaleString("en-US", { month: "long" })}
                    {format(currentDate, " dd")}
                </p>
                <p className="text-year">{format(currentDate, " yyyy")}</p>
            </div>
            <RenderDays />
            <div className="calendar-list">{months}</div>
        </div>
    );
};

export default Calendar;