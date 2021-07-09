import React, {forwardRef, useState, useEffect} from 'react'
import {  Form, Input, Select } from 'antd'

const { Option } = Select
const UserForm = forwardRef((props,ref) => {
    useEffect(()=>{
        
        setIsDisable(props.regionDisable)
        
    },[props])
    const [isDisable, setIsDisable] = useState(false)

    const {roleId,region} = JSON.parse(localStorage.getItem('token'))
    //检查角色是否可选
    const checkRoleDisable = (item) => {
        
        if(props.isEdit) {
            //编辑
            if(roleId!==1) {
                return true
            }
            return false
        }else {
            //添加
            if(roleId!==1) {
                return item.id !== 3
            }
            return false

        }
        
    }
    //检查区域是否可选
    const checkRegionDisable = (item) => {
        if(props.isEdit) {
            //编辑
            if(roleId!==1) {
                return true
            }
            return false
        }else {
            //添加
            if(roleId!==1) {
                return item.value !== region
            }
            return false

        }
    }
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
                        return <Option disabled={checkRoleDisable(item)} value={item.id} key={item.id}>{item.roleName}</Option>
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
                        return <Option disabled={checkRegionDisable(item)} value={item.value} key={item.id}>{item.title}</Option>
                    })}
                </Select>
            </Form.Item>
            

        </Form>
    )
})


export default UserForm