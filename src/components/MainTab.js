import React, { useState } from 'react';
import { Form, Input, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';

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
                <div className='flex'>
                    <Form.Item
                    label="Base Fee Plus"
                    name="baseFeePlus"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="Miner Tip"
                    name="minerTip"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="Gas Limit"
                    name="gasLimit"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Button type="primary" shape='round' className='m-5 bg-blue-600' >Save</Button>
                </div>
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
                <div className='flex'>
                    <Form.Item
                    label="FR Base Fee Plus"
                    name="baseFeePlusFR"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="FR Miner Tip"
                    name="minerTipFR"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="FR Gas Limit"
                    name="gasLimitFR"
                    rules={[
                        {
                        required: true,
                        message: 'Please fill info!',
                        },
                    ]}
                    className='m-5'
                    >
                        <Input />
                    </Form.Item>
                    <Button type="primary" shape='round' className='m-5 bg-blue-600' >Save</Button>
                </div>
            </Form>
        </div>
    )
}