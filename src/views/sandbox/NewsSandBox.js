import React from 'react'


import TopHeader from '../../components/sandbox/TopHeader'
import SideMenu from '../../components/sandbox/SideMenu'
import NewsRouter from './NewsRouter'
//进度条
// import NProgress from 'nprogress'
//css
import './NewsSandBox.css'
// import 'nprogress/nprogress.css'
//antd
import { Layout } from 'antd'
const { Content } = Layout
export default function NewsSandBox() {
    // NProgress.start()
    // useEffect(()=>{
    //     NProgress.done()
    // })
    return (
        
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
                            overflow: 'auto'
                        }}
                    >
                        <NewsRouter />
                    </Content>
                </Layout>
            </Layout>        
    )
}
