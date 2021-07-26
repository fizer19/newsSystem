import React, { useState, useEffect,useRef,useContext } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([
  ])
  useEffect(() => {
    getData()
  }, [])
  //获取数据
  const getData = () => {

    axios.get('/categories').then(res => {
      console.log(res);
      setDataSource(res.data)
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),

    },

    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(item)} />

        </div>
      }
    }
  ]

  const EditableContext = React.createContext(null)
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  //可编辑单元格
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = (record)=> {
    setDataSource(dataSource.map(item=>{
      if(item.id===record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title
        }
        
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{
      title: record.title,
      value: record.record
    })
    // console.log(record);
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

    axios.delete(`/category/${item.id}`).then(res => {
      console.log('res', res);
      getData()
    })




  }

  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
