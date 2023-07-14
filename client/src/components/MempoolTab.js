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
    key: 'maker',
  },
];

export default function MempoolTab() {
    const [data, setData] = useState([
        {
          key: '1',
          time: '14:39:55',
          type: 'BUY',
          symbol: 'PEPE',
          amount: 3941,
          maker: '0x4ff4c7c8754127cc097910cf9d80400adef5b65d'
        },
    ])
    const [pairAddr, setPairAddr] = useState('0xa43fe16908251ee70ef74718545e4fe6c5ccec9f')
    const [amount, setAmount] = useState(1000)
    const [isBuy, setIsBuy] = useState(false)
    const [isSell, setIsSell] = useState(false)

    const { lastJsonMessage } = useWebSocket(`ws://${process.env.REACT_APP_BASE_URL}:8007`, {
        share: true,
    })

    useEffect(() => {
        console.log(lastJsonMessage)
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
                        setPairAddr('0xa43fe16908251ee70ef74718545e4fe6c5ccec9f')
                        setAmount(1000)
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
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}