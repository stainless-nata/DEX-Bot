import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Col, Row } from 'antd';

export default function SwapTab() {

    const [basePrice, setBasePrice] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(0);
    const [pairSlippage, setPairSlippage] = useState(0);

    const onFinish = (values) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <p className="text-2xl font-bold float-left">Buy/Swap</p>
            <Form
                name="basic"
                labelCol={{
                span: 8,
                }}
                wrapperCol={{
                span: 16,
                }}
                initialValues={{
                remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                        <Form.Item
                        label="Contract Pair:"
                        name="pairAddr"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your username!',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item
                        label="Amount to Spend:"
                        name="amountSpend"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>
                        
                        <Form.Item
                        label="Custom Slippage (%):"
                        name="slippage"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>
                    </div>
                    <div className='ml-20 mr-20'>
                        <Form.Item label="" name="pairAddr" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Base Price = <span className='text-blue-600'>${basePrice}</span></p>
                        </Form.Item>
                        <Form.Item label="" name="pairAddr" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Token Price = <span className='text-blue-600'>${tokenPrice}</span></p>
                        </Form.Item>
                        <Form.Item label="" name="pairAddr" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Pair Slippage = <span className='text-blue-600'>{pairSlippage}%</span></p>
                        </Form.Item>
                    </div>
                </div>
                <div className='mt-10'>
                    <Form.Item label="" name="pairAddr">
                        <Row>
                            <Col span={1} className='mt-1'>
                                <Checkbox onChange={() => {}} className='align-middle'/>
                            </Col>
                            <Col span={9} className='mt-1'>
                                <p>Large Transaction Front-run Amount $ :</p>
                            </Col>
                            <Col span={8}>
                                <Input />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="" name="pairAddr">
                        <Row>
                            <Col span={1} className='mt-1'>
                                <Checkbox onChange={() => {}} className='align-middle'/>
                            </Col>
                            <Col span={9} className='mt-1'>
                                <p>Stop Loss(SL) % :</p>
                            </Col>
                            <Col span={8}>
                                <Input />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="" name="pairAddr">
                        <Row>
                            <Col span={1} className='mt-1'>
                                <Checkbox onChange={() => {}} className='align-middle'/>
                            </Col>
                            <Col span={9} className='mt-1'>
                                <p>Trailing Stop Loss(TSL) % :</p>
                            </Col>
                            <Col span={8}>
                                <Input />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="" name="pairAddr">
                        <Row>
                            <Col span={1} className='mt-1'>
                                <Checkbox onChange={() => {}} className='align-middle'/>
                            </Col>
                            <Col span={9} className='mt-1'>
                                <p>Take Profit(TP) % :</p>
                            </Col>
                            <Col span={8}>
                                <Input />
                            </Col>
                        </Row>
                    </Form.Item>
                </div>
                <Button type='primary' size='large' className='bg-blue-600 mt-12 w-60'>Submit</Button>
            </Form>
        </div>
    )
}