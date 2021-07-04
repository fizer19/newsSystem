import React, { useState } from 'react'
import { Layout,Dropdown,Menu, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout
export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const menu = (
    <Menu >
      <Menu.Item key="1">超级管理员</Menu.Item>
      <Menu.Item key="2" danger>退出</Menu.Item>
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
        <span style={{marginRight: '10px'}}>欢迎回来admin</span>
        <Dropdown
          overlay={menu}
        >
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}