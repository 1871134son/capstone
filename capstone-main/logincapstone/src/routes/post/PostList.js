import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../routes/component/table/CommonTable';
import CommonTableColumn from '../../routes/component/table/CommonTableColumn';
import CommonTableRow from '../../routes/component/table/CommonTableRow';
import { postList } from '../../routes/Data';

const PostList = props => {
  const [ dataList, setDataList ] = useState([]);

  useEffect(() => {
    setDataList(postList);
  }, [ ])

  return (
    <>
      <CommonTable headersName={['글번호', '제목', '등록일', '작성자']}>
        {
          dataList ? dataList.map((item, index) => {
            return (
              <CommonTableRow key={index}>
                <CommonTableColumn>{ item.no }</CommonTableColumn>
                <CommonTableColumn>
                  <Link to={`/postView/${item.no}`}>{ item.title }</Link>
                </CommonTableColumn>
                <CommonTableColumn>{ item.createDate }</CommonTableColumn>
                <CommonTableColumn>{ item.readCount }</CommonTableColumn>
              </CommonTableRow>
            )
          }) : ''
        }
      </CommonTable>
    </>
  )
}

export default PostList;