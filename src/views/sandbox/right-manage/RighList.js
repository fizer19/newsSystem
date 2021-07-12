import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover,Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function RighList() {
  const [dataSource, setDataSource] = useState([
  ])
  useEffect(() => {
    getData()
  }, [])
  //获取数据
  const getData = () => {

    axios.get('/rights?_embed=children').then(res => {
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
      title: '权限名称',
      dataIndex: 'title'

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }

    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(item)} />
          <Popover 
          content={<div style={{textAlign:'center'}}><Switch checked={item.pagepermisson} onChange={()=>switchChange(item)}></Switch></div>} 
          title="页面配置项" 
          trigger={item.pagepermisson === undefined?"":"click"}>
            {/* 如果没有pagepermisson属性，就禁用按钮，但是只禁用仍会触发气泡卡片，所以气泡卡片trigger需要调整 */}
            <Button type="primary" shape="circle" icon={<EditOutlined /> } disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    }
  ]
  //单选按钮改变
  const switchChange = (item) => {
    //因为item是引用类型，所以改变item相当于修改原来的dataSource
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if(item.grade === 1) {
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})
    }else {
      axios.patch(`/children/${item.id}`,{pagepermisson:item.pagepermisson})
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
    console.log(item);
    //修改当前页面状态+后端同步
    if (item.grade === 1) {
      // setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`).then(res => {
        console.log(res);
        getData()
      })
    } else {
      axios.delete(`/children/${item.id}`).then(res => {
        console.log('res', res);
        getData()
      })


    }

  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
