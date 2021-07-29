import React from 'react'
import { Layout,Dropdown,Menu, Avatar } from 'antd'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout
function TopHeader(props) {
  console.log(props);
  
  const changeCollapsed = () => {
    props.changeCollapsed()
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
        props.collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
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

/* 
 connect(
   // mapStateToProps
   // mapDispatchToProps
 )(被包装的组件)
*/
//映射state
const mapStateToProps = (state) => {
  const {collapsedReducer:{collapsed}} = state
  return {
    collapsed:collapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))