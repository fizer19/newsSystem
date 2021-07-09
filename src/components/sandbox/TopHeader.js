import React, { useState } from 'react'
import { Layout,Dropdown,Menu, Avatar } from 'antd'
import {withRouter} from 'react-router-dom'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout
function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu >
      <Menu.Item key="1">{roleName}</Menu.Item>
      <Menu.Item key="2" danger onClick={
        ()=>{
          localStorage.removeItem('token')
          props.history.replace('/login')
        }
      }>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })} */}
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{float:"right"}}>
        <span style={{marginRight: '10px'}}>欢迎回来<span style={{color:'#1890ff'}}>{username}</span></span>
        <Dropdown
          overlay={menu}
        >
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
export default withRouter(TopHeader)