import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, notification } from 'antd'
import axios from 'axios'

export default function MainTab() {

    return (
        <div className='text-left'>
            <Form
                name="basic"
                labelCol={{
                span: 10,
                }}
                wrapperCol={{
                span: 16,
                }}
                initialValues={{
                remember: true,
                }}
                autoComplete="off"
            >
                <p className='text-2xl font-bold'>Regular Trades</p>
                <Row>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="Base Fee Plus"
                        name="baseFeePlus"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="Miner Tip"
                        name="minerTip"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="Gas Limit"
                        name="gasLimit"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Button type="primary" shape='round' className='m-5 bg-blue-600' onClick={() => {
                        axios.post(`http://${process.env.REACT_APP_SERVER_URL}/set_regular_trades`, {
                            baseFeePlus:  100,
                            minerTip: 10,
                            gasLimit: 50,
                        })
                        .then((res) => {
                            notification.success({
                                message: 'Success!',
                                placement: 'top',
                              });
                        });
                    }}>Save</Button>
                </Row>
            </Form>
            <Form
                name="basic"
                labelCol={{
                span: 10,
                }}
                wrapperCol={{
                span: 16,
                }}
                initialValues={{
                remember: true,
                }}
                autoComplete="off"
            >
                <p className='text-2xl font-bold'>Front-Run Trades (FR)</p>
                <Row>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="FR Base Fee Plus"
                        name="baseFeePlusFR"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="FR Miner Tip"
                        name="minerTipFR"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} className='m-5'>
                        <Form.Item
                        label="FR Gas Limit"
                        name="gasLimitFR"
                        rules={[
                            {
                            required: true,
                            message: 'Please fill info!',
                            },
                        ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Button type="primary" shape='round' className='m-5 bg-blue-600' onClick={() => {
                        axios.post(`http://localhost:8008/set_frontrun_trades`, {
                            frBaseFeePlus:  100,
                            frMinerTip: 10,
                            frGasLimit: 50,
                        })
                        .then((res) => {
                            notification.success({
                                message: 'Success!',
                                placement: 'top',
                              });
                        });
                    }}>Save</Button>
                </Row>
            </Form>
        </div>
    )
}