import { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ethers } from "ethers";
import * as CONTRACT from "../contracts/external_contracts";
import { Web3ModalSetup } from "../helpers";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const web3Modal = Web3ModalSetup();
    const provider = await web3Modal.connect();
    const people_abi = CONTRACT[1].contracts.PEOPLE_FAUCET.abi;
    const people_address = CONTRACT[1].contracts.PEOPLE_FAUCET.testAddress;
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const contractInstance = new ethers.Contract(people_address , people_abi , signer);

    // 调用 filter 获取历史 event
    const filterTo = contractInstance.filters.SendToken(null, null);
    const history = await contractInstance.queryFilter(filterTo);

    history.forEach(item => {
      item.amount = ethers.utils.formatUnits(item.args[1], 18);
    })
    setData([...data, ...history]);
    setLoading(false);
    console.log('ret: ', history);

    console.log('filterTo: ', filterTo);


    // if (loading) {
    //   return;
    // }
    // setLoading(true);
    // fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
    //   .then(res => res.json())
    //   .then(body => {
    //     console.log(body)
    //     setData([...data, ...body.results]);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div id="scrollableDiv"
      style={{
        maxHeight: 400,
        width: 650,
        textAlign: 'left',
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)'
    }}>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar>People</Avatar>}
                description={<Input value={item.args[0]} disabled />}
              />
              <div style={{marginLeft: 10}}>{item.amount} people$</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default UserList;