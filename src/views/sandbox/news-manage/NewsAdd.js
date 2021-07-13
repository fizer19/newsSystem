import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select } from 'antd'
import NewsEdit from '../../../components/news-manage/NewsEdit'
import style from './News.module.css'
import axios from 'axios'
const { Step } = Steps
const {Option} = Select
export default function NewsAdd() {
    const [currentStep, setCurrentStep] = useState(0)
    const [newsCategory, setNewsCategory] = useState([])
    useEffect(()=>{
        axios.get('/categories').then(res=>{
            console.log(res.data);
            setNewsCategory(res.data)
        })
    },[])
    const newsRef = useRef(null)
    const handleNext = () => {
        if(currentStep===0){
            newsRef.current.validateFields().then(res=>{
                console.log(res);
                setCurrentStep(currentStep + 1)
            }).catch(err=>{
                console.log(err);
            })
        }else {
            setCurrentStep(currentStep + 1)
        }
    }
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1)
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"

                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={currentStep}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ marginTop: '50px' }}>

                <div className={currentStep === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 15 }}
                        initialValues={{ remember: true }}
                        ref={newsRef}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入标题' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择分类' }]}
                        >
                            <Select>
                                {
                                    newsCategory.map(item=>{
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={currentStep === 1 ? '' : style.active}>
                    <NewsEdit></NewsEdit>
                </div>
                <div className={currentStep === 2 ? '' : style.active}>
                    222<input type="text"></input>
                </div>
            </div>
            <div style={{ marginTop: '50px' }}>
                {
                    currentStep === 2 && <span>
                        <Button type="primary">保存草稿</Button>
                        <Button danger>提交审核</Button></span>
                }
                {
                    currentStep < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    currentStep > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }



            </div>
        </div>
    )
}
