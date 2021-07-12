import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    // 权限列表
    const [regionsList, setRegionsList] = useState([])
    //角色列表
    const [rolesList, setRolesList] = useState([])

    const [currentItem, setCurrentItem] = useState(null)
    //对话框是否可见
    const [isAddVisible, setAddVisible] = useState(false)
    const [isEditVisible, setEditVisible] = useState(false)
    //区域选择是否禁用
    const [regionDisable, setRegionDisable] = useState(false)
    const {roleId,username,region} = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        getUserList()
        getRegionList()
        getRolesList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //添加用户ref
    const addFormRef = useRef(null)
    //编辑用户ref
    const editFormRef = useRef(null)

    
    //获取用户数据
    const getUserList = () => {
        //roleId 1超级管理员 2区域管理员 3区域编辑
        axios.get('/users?_expand=role').then(res => {
            //正常应该由后端返回角色可以看到的用户列表，但是这里是json-serve,所以需要自己筛选
            const list = res.data
            setDataSource(roleId===1?list:[
                ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region===region&&item.roleId===3)
            ])
        })
    }
    //获取权限列表
    const getRegionList = () => {

        axios.get('/regions').then(res => {

            setRegionsList(res.data)
        })
    }
    
    //获取角色列表
    const getRolesList = () => {

        axios.get('/roles').then(res => {
            
            setRolesList(res.data)
        })
    }


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',

            filters: [
                ...regionsList.map(item=>({
                    text:item.title,
                    value: item.value
                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter:(value,item) =>{
                if(value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => {
                return <strong>{region === '' ? '全球' : region}</strong>
            }


        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            }

        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => { onStateChange(item) }}></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(item)} disabled={item.default} />

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>onEditClick(item)} />

                </div>
            }
        }
    ]
    //状态改变
    const onStateChange = (item) => {
        try {
            axios.patch(`/users/${item.id}`, {
                roleState: !item.roleState
            }).then(res=>{
                console.log('修改状态结果', res);
                getUserList()
            })
        } catch (error) {

        }

    }

    //删除操作
    const onDelete = (item) => {
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,

            onOk() {
                console.log('OK');
                deleteItem(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const deleteItem = (item) => {
        axios.delete(`/users/${item.id}`).then(res => {
            getUserList()
        })
    }

    //点击编辑
    const onEditClick  = (item) => {
        console.log(item);
        setCurrentItem(item)
        //状态更新并不保证是同步的，将操作放在一个异步函数中，就能保证同步执行
        setTimeout(()=>{
            if(item.roleId === 1) {
                console.log('1');
                setRegionDisable(true)
            }else {
                console.log('0');
                setRegionDisable(false)
            }
            setEditVisible(true)
            editFormRef.current.setFieldsValue(item)
        },0)
    }
    //添加确认
    const addFromOk = () => {
        try {

            addFormRef.current.validateFields().then(values => {
                addFormRef.current.resetFields()
                console.log("success", values);
                axios.post(`/users`, {
                    ...values,
                    "roleState": true,
                    "default": values.roleId === 1 ? true : false,
                }).then(res => {
                    console.log('添加成功', res);
                    getUserList()
                    setAddVisible(false)
                })
            })
        } catch (error) {
            console.log(error);
        }
        // 
        
    }
    //编辑确认
    const editFromOk = () => {
        try {

            editFormRef.current.validateFields().then(values => {
                
                console.log(values);
                axios.patch(`/users/${currentItem.id}`, values).then(res => {
                    console.log('更新成功', res);
                    getUserList()
                    setEditVisible(false)
                })
            })
        } catch (error) {
            console.log(error);
        }
        // 
        
    }
    return (
        <div>
            <Button type="primary" onClick={() => {
                setAddVisible(true)
            }}>添加用户</Button>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    setAddVisible(false)
                }}
                onOk={addFromOk}
            >
                <UserForm ref={addFormRef} rolesList={rolesList} regionsList={regionsList}></UserForm>
            </Modal>
            <Modal
                visible={isEditVisible}
                title="编辑用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {                   
                    setEditVisible(false)
                }}
                onOk={editFromOk}
            >
                <UserForm isEdit={true} ref={editFormRef} rolesList={rolesList} regionsList={regionsList} regionDisable={regionDisable}></UserForm>
            </Modal>
        </div>
    )
}
