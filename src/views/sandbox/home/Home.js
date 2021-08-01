import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
    const [viewList, setViewList] = useState([])
    const [startList, setStartList] = useState([])
    const [visible, setVisible] = useState(false)
    const [allList, setAllList] = useState([])
    const [pieChart, setPieChart] = useState(null)
    const barRef = useRef()
    const pieRef = useRef()
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            //console.log(res);
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            //console.log(res);
            setStartList(res.data)
        })
    }, [])
    useEffect(() => {

        axios.get("/news?publishState=2&_expand=category").then(res => {
            setAllList(res.data)
            console.log(_.groupBy(res.data, item => item.category.title));
            renderBarView(_.groupBy(res.data, item => item.category.title))
        })

        // 指定图表的配置项和数据
        return () => {
            window.onresize = null
        }


    }, [])
    const renderBarView = (data) => {
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(data),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(data).map(item => item.length)
            }]
        };
        var myChart = echarts.init(barRef.current);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            //  console.log('resize');
            myChart.resize()
        }
    }
    const rederPieView = (obj) => {
        var myChart;
        if(!pieChart) {
            myChart = echarts.init(pieRef.current)
            setPieChart(myChart)
        }else {
            myChart = pieChart
        }
        var currentList = allList.filter(item=>item.author===username)
        var groupObj = _.groupBy(currentList,item=>item.category.title)
        var list = []
        for(let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }
        console.log(currentList);
        

        var option = {
            title: {
                text: '当前用户新闻分类',
                // subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }
    

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            bordered
                            dataSource={startList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card

                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(()=>{

                                    setVisible(true)
                                    rederPieView()
                                },0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={username}
                            description={<div>
                                <b>{region ? region : '全球'}</b>
                                <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                            </div>}
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer
                width="500px"
                title="个人新闻分类"
                placement="right"
                closable={true}
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}></div>
            </Drawer>
            <div ref={barRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}></div>
        </div>
    )
}
