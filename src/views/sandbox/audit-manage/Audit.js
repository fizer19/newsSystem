import React, { useState, useEffect } from 'react'
import { Table,Tag, Button, notification } from 'antd'
import axios from 'axios'
export default function Audit() {
    const [dataSource, setDataSource] = useState([])
    const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get('/news?auditState=1&_expand=category').then(res => {
            //正常应该由后端返回角色可以看到的用户列表，但是这里是json-serve,所以需要自己筛选
            const list = res.data
            console.log('list',list);
            setDataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])
        })
    }, [roleId, username, region])

    const columns = [
        {
          title: '新闻标题',
          dataIndex: 'title',
          render: (title, item) => {
            return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
          }
    
    
        },
        {
          title: '作者',
          dataIndex: 'author'
    
        },
        {
          title: '新闻分类',
          dataIndex: 'category',
          render: (category) => {
            return <div >{category.title}</div>
          }
    
        },
        {
          title: '审核状态',
          dataIndex: 'auditState',
          render: (auditState) => {
            const colorList = ['black', 'orange', 'green', 'red']
            const stateList = ['未审核', '审核中', '已通过', '未通过']
            return <Tag color={colorList[auditState]} >{stateList[auditState]}</Tag>
          }
    
        },
        {
          title: '操作',
          render: (item) => {
            return <div>
    
    
              <Button type="primary" onClick={()=>handleAudit(item,2,1)}>通过</Button>
              <Button danger onClick={()=>handleAudit(item,3,1)}>驳回</Button>

            </div>
          }
        }
      ]

      const handleAudit = (item, auditState,publishState) => {
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`/news/${item.id}`,{
          auditState,
          publishState
        }).then(res=>{
          notification.info({
            message: `通知`,
            description: `您可以在[审核管理/审核列表]中查看您的新闻`,
            placement: "bottomRight",
          });
        })
      }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
        </div>
    )
}
