import React, { useState } from 'react';
import { Button, Input, Table, Row, Col, Checkbox } from 'antd';


const columns = [
    {
        title: 'Trans Type',
        dataIndex: 'transType',
    },
    {
        title: 'Notes',
        dataIndex: 'note',
    },
    {
        title: 'Date/Time',
        dataIndex: 'time',
    },
    {
        title: 'Token Sym',
        dataIndex: 'tokenSym',
    },
    {
        title: 'Tx Hash',
        dataIndex: 'hash',
        render: (link) => <a href={link}>Link</a>,
    },
    {
        title: 'Contract Pair',
        dataIndex: 'contractPair',
        render: (link) => <a href={link}>Link</a>,
    },
    {
        title: 'SL',
        dataIndex: 'sl',
        render: (text) => <span>{text}%</span>,
    },
    {
        title: 'TSL',
        dataIndex: 'tsl',
        render: (text) => <span>{text}%</span>,
    },
    {
        title: 'TP',
        dataIndex: 'tp',
        render: (text) => <span>{text}%</span>,
    },
    {
        title: 'Large Trans Amt?',
        dataIndex: 'largeTransAmount',
        render: (text) => <span>${text}</span>,
    },
    {
        title: 'Base Amt',
        dataIndex: 'baseAmount',
    },
    {
        title: 'Token Qty',
        dataIndex: 'tokenQty',
    },
    {
        title: 'Buy Price',
        dataIndex: 'buyPrice',
    },
    {
        title: 'Current Price',
        dataIndex: 'currentPrice',
    },
    {
        title: 'PL(%)',
        dataIndex: 'plPercent',
        render: (text) => <span>{text}%</span>,
    },
    {
        title: 'PL($)',
        dataIndex: 'plAmount',
        render: (text) => <span>${text}</span>,
    },
    {
        title: 'Total Time in Trade',
        dataIndex: 'totalTime',
    },
];
const data = [
    {
        key: '1',
        transType: 'BUY',
        time: '07/09/2023 - 18:34',
        tokenSym: 'PEPE',
        hash: 'https://etherscan.io/tx/0x6e37415a316ed961cc1ef7b0bf4a8320dd45e5f5ec8ff0a1ca572ad1f60731db',
        contractPair: 'https://dexscreener.com/ethereum/0x4ff4c7c8754127cc097910cf9d80400adef5b65d',
        sl: 3.50,
        tsl: 4.00,
        tp: 50.00,
        largeTransAmount: 5000,
        baseAmount: 1.00,
        tokenQty: '1.255b',
        buyPrice: '0.000002568',
        currentPrice: '0.000003575',
        plPercent: 39.21,
        plAmount: 729.20,
        totalTime: '2d 1h 2m',
    },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
};

export default function HistoryTab() {
    
    return (
      <div className='text-left'>
        <p className="text-3xl font-bold">History</p>
        <Row>
            <Col span={5} className='m-5'>
                <p className='text-lg'>Filter by Token Name/Sym: </p>
            </Col>
            <Col className='m-5'>
                <Input />
            </Col>
            <Col className='m-5'>
                <Button className='bg-blue-600'>Search</Button>
            </Col>
        </Row>
        <Row>
            <Col span={5} className='m-5'>
                <p className='text-lg'>Show Only (can select multiple): </p>
            </Col>
            <Col className='m-5'>
                <Checkbox>Failures</Checkbox>
            </Col>
            <Col className='m-5'>
                <Checkbox>Buys</Checkbox>
            </Col>
            <Col className='m-5'>
                <Checkbox>Sells</Checkbox>
            </Col>
        </Row>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
}
