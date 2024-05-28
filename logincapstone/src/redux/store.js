//redux를 사용하는 경우, State를 보관하는 store가 존재합니다. 여기서 다른 컴포넌트들이 State들을 꺼내 쓰는것.
//컴포넌트에서 공유 할 필요가 없는 state 경우엔 redux 사용하지 말고, 그냥 props만 하는게 좋습니다.  
import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLicenseList,getExamScheduleList } from '../firebase/firebase'

export const fetchingLicenseList = createAsyncThunk(
  "licenseList/getLicenseList",
  async()=>{
    const response = await fetchLicenseList();
    //console.log("store.js ->", response);
    return response; //자격증 이름 목록 반환.
  }
);

export const fetchingExamSchedule = createAsyncThunk(
  "examSchedule",
  async()=>{
    const response = await getExamScheduleList();
    console.log("store.js/fetchingExamSchedule -> ", response);
    return response;
  }
);


let examScheduleList = createSlice({
  name : "examScheduleList",
  initialState :{ //안에 있는 데이터(여기서는 자격증 이름 목록)
    examScheduleList: []
  },
  reducers:{//state로 치면 setState 비슷하다고 생각하시면 됩니다. 
    
  },
  extraReducers : (builder) =>{
    builder
    .addCase(fetchingExamSchedule.pending, (state)=>{//비동기작업이 시작.

    })
    .addCase(fetchingExamSchedule.fulfilled, (state,action)=>{//비동기작업성공
      //console.log("examScheduleList/addCase->",action.payload); // 로그출력 
      state.examScheduleList = action.payload;
    })
    .addCase(fetchingExamSchedule.rejected, (state,action)=>{//비동기작업실패
      console.error("fetchingExamSchedule 비동기작업 실패", action.error.message);
    })
  }
});



let licenseList = createSlice({
  name : "licenseList",
  initialState :{ //안에 있는 데이터(여기서는 자격증 이름 목록)
     licenseList: []
  },
  reducers:{//state로 치면 setState 비슷하다고 생각하시면 됩니다. 
    sortLicenseList(state){//myList를 
      state.licenseList.sort((a,b)=> a.name.localeCompare(b.name,'ko-KR'));
     // console.log("called 한글로정렬");
    }
  },
  extraReducers : (builder) =>{
    builder
    .addCase(fetchingLicenseList.pending, (state)=>{//비동기작업이 시작.

    })
    .addCase(fetchingLicenseList.fulfilled, (state,action)=>{//비동기작업성공
     // console.log("addCase->",action.payload); // fetchingLicenseList.fulfilled에서 로그 출력
      state.licenseList = action.payload;
    })
    .addCase(fetchingLicenseList.rejected, (state,action)=>{//비동기작업실패
   
    })
  }
})

export let{sortLicenseList} = licenseList.actions;










export default configureStore({//이곳에 만든 state를 등록하면 됩니다. 
  reducer: { 
    licenseList : licenseList.reducer, //state를 등록합니다. licenseList state를 모든 컴포넌트에서 사용가능합니다. SignUp 페이지에서 사용 예시를 보시면 됩니다.
    examScheduleList : examScheduleList.reducer
  }
}) 