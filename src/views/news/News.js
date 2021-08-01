import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Card, Col, Row } from 'antd'
export default function News() {
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            console.log(res);
        })
    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"

                title="全球大新闻"
                subTitle="查看新闻"
            />
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
