import React, {forwardRef, useState, useEffect} from 'react'
import {  Form, Input, Select } from 'antd'

const { Option } = Select
const UserForm = forwardRef((props,ref) => {
    useEffect(()=>{
        console.log('@@',props);
        setIsDisable(props.regionDisable)
        
    },[props])
    const [isDisable, setIsDisable] = useState(false)
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码',
                    },
                ]}
            >
                <Input type="password" />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选择角色',
                    },
                ]}
            >
                <Select onChange={(value)=>{
                    if(value === 1) {
                        setIsDisable(true)
                        ref.current.setFieldsValue({
                            region: ''//region为表单name属性
                        })
                    }else {
                        setIsDisable(false)
                    }
                }}>
                    {props.rolesList.map(item => {
                        return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisable?[]:[
                    {
                        required: true,
                        message: '请选择区域',
                    },
                ]}
            >
                <Select disabled={isDisable}>
                    {props.regionsList.map(item => {
                        return <Option value={item.value} key={item.id}>{item.title}</Option>
                    })}
                </Select>
            </Form.Item>
            

        </Form>
    )
})


export default UserForm