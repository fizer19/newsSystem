import React, { useState, useEffect } from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import {Spin} from 'antd'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RighList from './right-manage/RighList'
import NewsAdd from './news-manage/NewsAdd'
import NewsCategory from './news-manage/NewsCategory'
import NewsDraft from './news-manage/NewsDraft'
import NewsPreview from './news-manage/NewsPreview'
import NewsUpdate from './news-manage/NewsUpdate'
import Audit from './audit-manage/Audit'
import AuditList from './audit-manage/AuditList'
import Published from './publish-manage/Published'
import Unpublished from './publish-manage/Unpublished'
import Sunset from './publish-manage/Sunset'

import Notfound from './notfound/Notfound'
import axios from 'axios'

import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RighList,

    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset

}
function NewsRouter(props) {
    const [routerList, setRouterList] = useState([])
    useEffect(()=>{
        try {
            Promise.all([
                axios.get('/rights'),
                axios.get('/children')
            ]).then(res => {
                
                setRouterList([...res[0].data,...res[1].data])
            })
        } catch (error) {
            console.log(error);
        }
        
    },[])

    const checkRoute = (item) => {
        //本地路由对照表中是否包含该路由，以及该路由是否启用，pagepermisson为0表示禁用，1表示启用
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserRight = (item) => {
        //用户权限中是否包含该路由
        const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.loading}>

            <Switch>
                {
                    routerList.map(item=>{
                        if(checkRoute(item) && checkUserRight(item)) {

                            // 要使用严格匹配
                            return <Route exact path={item.key} key={item.key} component={LocalRouterMap[item.key]}></Route>
                        }
                        return null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    //如果网速慢，会先渲染routerList是空数组，会先渲染Notfound组件，所以判断一下routerList是否为空
                    routerList.length>0 && <Route path="*" component={Notfound} />
                }
                
            </Switch>
        </Spin>
    )
}
const mapStateToProps = (state) => {
    const {loadingReducer:{loading}} = state
    return {
      loading,
    }
  }
export default connect(mapStateToProps)(NewsRouter)