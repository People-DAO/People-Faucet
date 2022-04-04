import { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';


const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then(res => res.json())
      .then(body => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div id="scrollableDiv"
      style={{
        height: 400,
        width: 550,
        textAlign: 'left',
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)'
    }}>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                description={<Input value={'0xb5f6adbd3218d445212350d8a528e09b4e68a633'} disabled />}
              />
              <div style={{marginLeft: 10}}>17 days ago</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default UserList;