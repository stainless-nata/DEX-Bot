import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Col, Row, notification } from 'antd';
import axios from 'axios'

export default function SwapTab() {

    const [basePrice, setBasePrice] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(0);
    const [pairSlippage, setPairSlippage] = useState(0);

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post(`http://${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/swaptab/set`, {
            amountSpend: values.amountSpend,
            frAmount: values.frAmount,
            pairAddr: values.pairAddr,
            pairSlippage: values.pairSlippage,
            sl: values.sl,
            slippage: values.slippage,
            tokenPrice: values.tokenPrice,
            tp: values.tp,
            tsl: values.tsl,
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
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <p className="text-3xl font-bold text-left">Buy/Swap</p>
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
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Form.Item
                        label="Contract Pair:"
                        name="pairAddr"
                        rules={[
                            {
                            required: true,
                            message: 'Please input Contract Pair!',
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
                            message: 'Please input amount!',
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
                            message: 'Please input slippage!',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>
                    </div>
                    <div className='ml-20 mr-20'>
                        <Form.Item label="" name="basePrice" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Base Price = <span className='text-blue-600'>${basePrice}</span></p>
                        </Form.Item>
                        <Form.Item label="" name="tokenPrice" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Token Price = <span className='text-blue-600'>${tokenPrice}</span></p>
                        </Form.Item>
                        <Form.Item label="" name="pairSlippage" className='border border-blue-600 rounded'>
                            <p className='text-lg'>Current Pair Slippage = <span className='text-blue-600'>{pairSlippage}%</span></p>
                        </Form.Item>
                    </div>
                </div>
                <div className='mt-10'>
                    <Form.Item label="" name="frAmount">
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
                    <Form.Item label="" name="sl">
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
                    <Form.Item label="" name="tsl">
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
                    <Form.Item label="" name="tp">
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
                <Button type='primary' htmlType='submit' size='large' className='bg-blue-600 mt-12 w-60'>Submit</Button>
            </Form>
        </div>
    )
}