import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import NewsEdit from '../../../components/news-manage/NewsEdit'
import style from './News.module.css'
import axios from 'axios'
const { Step } = Steps
const { Option } = Select
export default function NewsAdd(props) {
    const [currentStep, setCurrentStep] = useState(0)
    const [newsCategory, setNewsCategory] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState('')
    useEffect(() => {
        axios.get('/categories').then(res => {
            // console.log(res.data);
            setNewsCategory(res.data)
        })
    }, [])
    const newsRef = useRef(null)
    const handleNext = () => {
        if (currentStep === 0) {
            newsRef.current.validateFields().then(res => {
                //console.log(res);
                setFormInfo(res)
                setCurrentStep(currentStep + 1)
            }).catch(err => {
                console.log(err);
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空')
            } else {

                setCurrentStep(currentStep + 1)
            }
            console.log(formInfo, content);
        }
    }
    //上一步
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1)
    }

    const User = JSON.parse(localStorage.getItem('token'))
    //点击保存或审核
    const handleSave = (auditState) => {
        try {
            axios.post('/news', {
                ...formInfo,
                content,
                region: User.region ? User.region : '全球',
                author: User.username,
                roleId: User.roleId,
                auditState,
                publishState: 0,
                createTime: Date.now(),
                star: 0,
                view: 0,
                
                // publishTime: 0
            }).then(res => {
                //console.log(res);
                if(res?.status === 201) {
                    message.success('提交成功')
                    props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
                    notification.info({
                        message: `通知`,
                        description: `您可以在${auditState===0?'草根箱':'审核列表'}中查看您的新闻`,
                        placement:"bottomRight",
                    });
                }else {
                    message.error('提交失败')
                }
            })
        } catch (error) {
            console.log(error);
        }
        
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
                                    newsCategory.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={currentStep === 1 ? '' : style.active}>
                    <NewsEdit getContent={(value) => {
                        setContent(value)
                    }}></NewsEdit>
                </div>
                <div className={currentStep === 2 ? '' : style.active}>
                    
                </div>
            </div>
            <div style={{ marginTop: '50px' }}>
                {
                    currentStep === 2 && <span>
                        <Button type="primary" onClick={()=>handleSave(0)}>保存草稿</Button>
                        <Button danger onClick={()=>handleSave(1)}>提交审核</Button></span>
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
