import { Row, Col, Button, Input, Checkbox, Table, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import useWebSocket from 'react-use-websocket';

const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Sym',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: '$',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => <span>${text}</span>,
  },
  {
    title: 'Maker',
    dataIndex: 'maker',
    key: 'maker'
  },
];

export default function MempoolTab() {
    const [data, setData] = useState([])
    const [pairAddr, setPairAddr] = useState('0x04cf684036cc8030c64735594b8f5c566c3f74b1')
    const [amount, setAmount] = useState(100)
    const [isBuy, setIsBuy] = useState(false)
    const [isSell, setIsSell] = useState(false)

    const { lastJsonMessage } = useWebSocket(`ws://${process.env.REACT_APP_BASE_URL}:8007`, {
        share: true,
    })

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/mempooltab/get`)
        .then((res) => {
            console.log(res);
            setData(res.data);
        });
        // const temp = window.localStorage.getItem('MEMPOOL_LIST');
        // console.log(temp)
        // if(temp !== null) setData(temp);
    }, [])
    useEffect(() => {
        let temp = []
        while(lastJsonMessage && lastJsonMessage.length !== 0)
            temp.push(lastJsonMessage.pop())
        setData(temp)
        // window.localStorage.setItem('MEMPOOL_LIST', JSON.stringify(temp));
    }, [lastJsonMessage])
    
    return (
        <div>
            <Row>
                <Col>
                    <p className="text-3xl font-bold">MEMPOOL</p>
                </Col>
                <Col>
                    <Button size='large' className='bg-blue-600 text-white ml-10' onClick={() => {
                        setData([])
                    }}>Clear Data</Button>
                </Col>
                <Col>
                    <Button size='large' className='bg-blue-600 text-white ml-10' onClick={() => {
                        setPairAddr('')
                        setAmount(0)
                        setIsBuy(false)
                        setIsSell(false)
                    }}>Clear Input Fields</Button>
                </Col>
            </Row>
            <div className='m-5'>
                <Row className=''>
                    <Col>
                        <p className='text-lg m-5'>PAIR ADDRESS:</p>
                    </Col>
                    <Col span={10}>
                        <Input className='m-5' value={pairAddr} onChange={(e) => {
                            // console.log(e.target.value)
                            setPairAddr(e.target.value)
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className='text-lg m-5'>Filter Dolla Amount ($):</p>
                    </Col>
                    <Col>
                        <Input className='m-5' value={amount} onChange={(e) => {
                            // console.log(e.target.value)
                            setAmount(e.target.value)
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className='text-lg m-5'>Filter</p>
                    </Col>
                    <Col>
                        <Checkbox className='m-5 mt-6' checked={isBuy} onChange={(e) => {
                            setIsBuy(!isBuy)
                        }}>BUYS</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox className='m-5 mt-6' checked={isSell} onChange={(e) => {
                            setIsSell(!isSell)
                        }}>SELLS</Checkbox>
                    </Col>
                </Row>
                <Row className='mt-[-50px] justify-center'>
                    <Button size='large' className='bg-blue-600 text-white' onClick={() => {
                        axios.post(`http://${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/mempooltab/set`, {
                            pairAddr: pairAddr,
                            filterAmount: amount,
                            action: isBuy ? isSell? 'All' : 'Buy' : 'Sell'
                        })
                        .then((res) => {
                            if(res.data == 'Success')
                                notification.success({
                                    message: 'Success!',
                                    placement: 'top',
                                });
                            else 
                                notification.error({
                                    message: 'Failed!',
                                    placement: 'top',
                                });
                        });
                    }}>Submit</Button>
                </Row>
            </div>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={{
                  pageSize: 50,
                }}
                scroll={{
                    x: true,
                    y: 200,
                }}
            />
        </div>
    )
}