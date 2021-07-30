import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [rightsList, setRightsList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        getRolesData()
        getRightsData()
    }, [])
    const getRolesData = () => {
        axios.get('/roles').then(res => {
            // //console.log(res);
            setDataSource(res.data)
        }).catch(err => console.log(err))
    }
    const getRightsData = () => {
        axios.get('/rights?_embed=children').then(res => {
            // //console.log(res);
            setRightsList(res.data)
        }).catch(err => console.log(err))
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',

            render: (id) => {
                return <strong>{id}</strong>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'

        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDeleteRole(item)} />

                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>onEditClick(item)} />

                </div>
            }
        }
    ]
    //删除
    const onDeleteRole = (item) => {
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
        console.log(item);
        //修改当前页面状态+后端同步

        // setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`).then(res => {
            //console.log(res);
            getRolesData()
        })

    }
    //编辑
    const onEditClick = (item) => {
        setIsModalVisible(true)
        setCurrentRights(item.rights)
        setCurrentId(item.id)
    }
    //点击确定
    const handleOk = () => {
        setIsModalVisible(false);
        setDataSource(dataSource.map(item=>{
            if(item.id===currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        axios.patch(`/roles/${currentId}`,{
            rights: currentRights
        })
        .then(res=>console.log(res))
        .catch(err=>console.log('error',err))
    };
    //点击取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    
    //树形结构勾选后回调
    const onCheck = (checkedKeys, info) => {
        setCurrentRights(checkedKeys)
    };
    /* checkStrictly属性 状态下节点选择完全受控（父子节点选中状态不再关联） */
    return (
        <div>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    checkStrictly={true}
                    onCheck={onCheck}
                    treeData={rightsList}
                />
            </Modal>
        </div>
    )
}
