import React, { useState } from 'react';
import { Button, Input, Table, Row, Col } from 'antd';


const columns = [
    {
        title: 'Date/Time',
        dataIndex: 'time',
    },
    {
        title: 'Token Sym',
        dataIndex: 'tokenSym',
    },
    {
        title: 'Transaction Hash',
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
        title: 'Profit/Loss',
        dataIndex: 'plPercent',
        render: (text) => <span>{text}%</span>,
    },
    {
        title: 'Profit/Loss',
        dataIndex: 'plAmount',
        render: (text) => <span>${text}</span>,
    },
];
const data = [
    {
        key: '1',
        time: '07/09/2023 - 18:34',
        tokenSym: 'PEPE',
        hash: 'https://etherscan.io/tx/0x6e37415a316ed961cc1ef7b0bf4a8320dd45e5f5ec8ff0a1ca572ad1f60731db',
        contractPair: 'https://dexscreener.com/ethereum/0x4ff4c7c8754127cc097910cf9d80400adef5b65d',
        sl: 3.50,
        tsl: 4.00,
        tp: 50.00,
        baseAmount: 1.00,
        tokenQty: '1.255b',
        buyPrice: '0.000002568',
        currentPrice: '0.000003575',
        plPercent: 39.21,
        plAmount: 729.20,
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

export default function TradesTab() {
    
    return (
      <div className='text-left'>
        <p className="text-3xl font-bold">Trades</p>
        <Row>
            <Button type='primary' size='large' className='bg-blue-600 m-5' onClick={() => {
                
            }}>SELL ALL</Button>
            
            <Col span={3} className='m-5 text-lg mt-6'>
                Enter Partial Sell (%): 
            </Col>                
            <Col span={5} className='m-5 mt-6'>
                <Input />
            </Col>
            <Button type='primary' size='large' className='bg-blue-600 m-5' onClick={() => {
                
            }}>SELL Partial Submit</Button>
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
