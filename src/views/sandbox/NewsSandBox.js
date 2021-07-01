import React from 'react'


import { Route, Switch, Redirect } from 'react-router-dom'
import TopHeader from '../../components/sandbox/TopHeader'
import SideMenu from '../../components/sandbox/SideMenu'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RighList from './right-manage/RighList'
import Notfound from './notfound/Notfound'
//css
import './NewsSandBox.css'
//antd
import { Layout } from 'antd'
const { Content } = Layout
export default function NewsSandBox() {
    return (
        <div>
            <Layout>
                <SideMenu />
                <Layout className="site-layout">
                    <TopHeader />
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/user-manage/list" component={UserList} />
                            <Route path="/right-manage/role/list" component={RoleList} />
                            <Route path="/right-manage/right/list" component={RighList} />
                            <Redirect from="/" to="/home" exact />
                            <Route path="*" component={Notfound} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>

        </div>
    )
}
