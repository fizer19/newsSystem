import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification,message } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, ArrowUpOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function NewsList(props) {
  const [dataSource, setDataSource] = useState([
  ])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    getData()
    
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  
  const getData = ()=> {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
        const list = res.data;
        list.forEach(item => {
          if (item.children?.length === 0) {
            item.children = ''
          }
        })
        setDataSource(list)
      })
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
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => {
          return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }

    },
    {
      title: '作者',
      dataIndex: 'author'

    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
          return category.title
      }

    },
    
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(item)} />
          <Button   shape="circle" icon={<EditOutlined />} onClick={() => {props.history.push(`/news-manage/update/${item.id}`)}} />
          <Button  type="primary" shape="circle" icon={<ArrowUpOutlined />} onClick={() => onCheck(item.id)} />
          
          
        </div>
      }
    }
  ]
  
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
    console.log(item);
    //修改当前页面状态+后端同步
    try {
        axios.delete(`/news/${item.id}`).then(res => {
            console.log('res', res);
            getData()
        })
    } catch (error) {
        console.log(error);
        
    }
  }
  const onCheck = (id) => {
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      //console.log(res);
      if(res?.status === 200) {
        message.success('提交成功')
        props.history.push('/audit-manage/list')
        notification.info({
            message: `通知`,
            description: `您可以在审核列表中查看您的新闻`,
            placement:"bottomRight",
        });
    }else {
        message.error('提交失败')
    }
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
