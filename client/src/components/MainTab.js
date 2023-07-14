import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, notification } from 'antd'
import axios from 'axios'

export default function MainTab() {

    const onFinishRegular = (values) => {
      axios.post(`http://${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/maintab/set_regular_trades`, {
          baseFeePlus:  values.baseFeePlus,
          minerTip: values.minerTip,
          gasLimit: values.gasLimit,
      })
      .then((res) => {
          notification.success({
              message: 'Success!',
              placement: 'top',
            });
      });
    };
    const onFinishFrontend = (values) => {
        axios.post(`http://${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/maintab/set_frontrun_trades`, {
            baseFeePlusFR:  values.baseFeePlusFR,
            minerTipFR: values.minerTipFR,
            gasLimitFR: values.gasLimitFR,
        })
        .then((res) => {
            notification.success({
                message: 'Success!',
                placement: 'top',
              });
        });
    }
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

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
                onFinish={onFinishRegular}
                onFinishFailed={onFinishFailed}
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
                    <Button type="primary" htmlType='submit' shape='round' className='m-5 bg-blue-600'>Save</Button>
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
                onFinish={onFinishFrontend}
                onFinishFailed={onFinishFailed}
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
                    <Button type="primary" htmlType='submit' shape='round' className='m-5 bg-blue-600'>Save</Button>
                </Row>
            </Form>
        </div>
    )
}