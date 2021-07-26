import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, notification,message } from 'antd'
// import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    // _ne=0 不等于0    _lte=1  小于等于1
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res => {
        console.log(res.data);
        setDataSource(res.data)
      })
  }, [username])

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


          {
            item.auditState === 1 && <Button danger onClick={() => handleRervert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button onClick={()=>handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>
      }
    }
  ]
  // 撤销
  const handleRervert = (item) => {
    try {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.patch(`/news/${item.id}`, {
        auditState: 0
      }).then(res => {
        notification.info({
          message: `通知`,
          description: `您可以在草稿箱中查看您的新闻`,
          placement: "bottomRight",
        });
      })
    } catch (error) {
      console.log(error);
    }

  }
  // 更新
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  //发布
  const handlePublish = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {

      message.success('提交成功')
      props.history.push('/publish-manage/published')
      notification.info({
        message: `通知`,
        description: `您可以在【发布管理/已发布】中查看您的新闻`,
        placement: "bottomRight",

      })
    })}
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
      </div>
    )
  }
