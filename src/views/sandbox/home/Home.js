import React from 'react'
import axios from 'axios'
export default function Home() {
    const getData = () => {
        //json-server使用 
        // 获取数据
        // axios.get('http://localhost:8000/posts').then(res => console.log(res))
        //新增
        axios.post('http://localhost:8000/posts',{
            title:'text',
            author:'fizer'
        })
    }
    return (
        <div>
            <button onClick={getData}>获取数据</button>
        </div>
    )
}
