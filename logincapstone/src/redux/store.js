//redux를 사용하는 경우, State를 보관하는 store가 존재합니다. 여기서 다른 컴포넌트들이 State들을 꺼내 쓰는것.
//컴포넌트에서 공유 할 필요가 없는 state 경우엔 redux 사용하지 말고, 그냥 props만 하는게 좋습니다.  
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: { }
}) 
