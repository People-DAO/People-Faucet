import { Input, Select } from 'antd';
const { Option } = Select;

function SelectInput({  }) {
  const selectAfter = (
    <Select placeholder="Give me Ether" className="select-after" style={{width: 180}}>
      <Option value="1">3 Ethers / 8hours</Option>
      <Option value="2">7.5 Ethers / 1day</Option>
      <Option value="3">18.75 Ethers / 3days</Option>
    </Select>
  );
  return(
    <Input placeholder='Social network URL containing your Ethereum address' addonAfter={selectAfter} style={{width: 700, marginBottom: 20}} />
  )
}

export default SelectInput;