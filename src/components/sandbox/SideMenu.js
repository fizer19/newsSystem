import React from 'react'
import './index.css'
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import {
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios'
const { Sider } = Layout;
const { SubMenu } = Menu;



const iconList = {
  "/home":<HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <UserOutlined />,
  "/audit-manage": <UserOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/audit-manage/list": <UserOutlined />,
  "/publish-manage": <UserOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/publish-manage/published": <UserOutlined />,
  "/publish-manage/sunset": <UserOutlined />,


}
function SideMenu(props) {
  const [menu,setMenu] = React.useState([])
  React.useEffect(() => {
    try {
      axios.get("/rights?_embed=children").then(res => {
        if(res) {

          setMenu(res.data)
        }
        
        
      })
    } catch (error) {
      console.log(error);
    }
    
  },[])
  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
  
  const hasPagepermisson = (item) => {
    //pagepermisson标识是否是列表页，rights.includes(item.key)表示后台返回的角色权限列表中是否包含了当前item的key值
    return item.pagepermisson===1 && rights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    //对后端返回的权限列表遍历
    return menuList.map(item => {
      //如果后children属性并且不为空，再通过hasPagepermisson判断是否应该展示
      // item.children?.length   ？的作用在于如果该属性undifined，则不进行后续操作
      if(item.children?.length && hasPagepermisson(item)) {
        return <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>{renderMenu(item.children)}</SubMenu>
      }else {
        return hasPagepermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
      }
    })
  }

  //默认选中菜单路径
  const selectKeys = [props.location.pathname]
  //默认展开菜单
  const openKeys = ['/' + props.location.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
        {props.collapsed?<div className="logo"></div>:<div className="logo">全球新闻发布系统</div>}
        <Menu style={{flex:1,"overflow":"auto"}} theme="dark" mode="inline" defaultOpenKeys={openKeys} selectedKeys={selectKeys}>
          {renderMenu(menu)}
        </Menu>
      </div>
    </Sider>
  )
}
const mapStateToProps = (state) => {
  const {collapsedReducer:{collapsed}} = state
  return {
    collapsed:collapsed
  }
}

export default connect(mapStateToProps)(withRouter(SideMenu))
