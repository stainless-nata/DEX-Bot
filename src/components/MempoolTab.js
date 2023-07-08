import { Row, Col, Button, Input, Checkbox, Table } from 'antd';
import React, { useState } from 'react';

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
const data = [
  {
    key: '1',
    time: '14:39:55',
    type: 'BUY',
    symbol: 'PEPE',
    amount: 3941,
    maker: '0x4ff4c7c8754127cc097910cf9d80400adef5b65d'
  },
];

export default function MempoolTab() {
    
    return (
        <div>
            <Row>
                <Col>
                    <p className="text-3xl font-bold">MEMPOOL</p>
                </Col>
                <Col>
                    <Button size='large' className='bg-blue-600 text-white ml-10'>Clear Data</Button>
                </Col>
                <Col>
                    <Button size='large' className='bg-blue-600 text-white ml-10'>Clear Input Fields</Button>
                </Col>
            </Row>
            <div className='m-5'>
                <Row className=''>
                    <Col>
                        <p className='text-lg m-5'>PAIR ADDRESS:</p>
                    </Col>
                    <Col span={10}>
                        <Input className='m-5' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className='text-lg m-5'>Filter Dolla Amount ($):</p>
                    </Col>
                    <Col>
                        <Input className='m-5' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className='text-lg m-5'>Filter</p>
                    </Col>
                    <Col>
                        <Checkbox className='m-5 mt-6'>BUYS</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox className='m-5 mt-6'>SELLS</Checkbox>
                    </Col>
                </Row>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}