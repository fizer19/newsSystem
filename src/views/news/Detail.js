import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment'
import axios from 'axios';
import { HeartTwoTone } from '@ant-design/icons'
export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        try {
            axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
                .then(res => {

                    setNewsInfo({
                        ...res.data,
                        view: res.data.view + 1
                    })
                    axios.patch(`/news/${props.match.params.id}`, {
                        view: res.data.view + 1
                    })
                })
        } catch (error) {

        }
    }, [props.match.params.id])
    const handleStart = () => {
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartTwoTone twoToneColor="#eb2f96" style={{marginLeft: "10px"}} onClick={() => handleStart()} />
                            </div>}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD") : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>

                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{ __html: newsInfo.content }}
                        style={{ margin: "0 24px", padding: '5px', border: "1px solid gray" }}
                    ></div>
                </div>
            }
        </div>

    )
}
