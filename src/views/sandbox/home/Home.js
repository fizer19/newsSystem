import React from 'react'
import axios from 'axios'
export default function Home() {
    const OnButtonClk = () => {
        //获取数据
        // axios.get('http://localhost:8000/posts').then(res => {
        //     console.log(res);
        // })
        //新增数据
        // axios.post('http://localhost:8000/posts',{
        //     "title": "test",
        //      "author": "fizer"
        // }).then(res => {
        //     console.log(res);
        // })

        //修改 put  替换掉
        // axios.put('http://localhost:8000/posts/1',{
        //     title:'修改'
        // })

        //修改 patch  局部替换
        // axios.patch('http://localhost:8000/posts/1',{title: 'patch修改'})

        //删除
        // axios.delete('http://localhost:8000/posts/1')  //删除一项数据，与之关联的数据也可以同时删除

        //_embed 向下关联数据
        // axios.get('http://localhost:8000/posts?_embed=comments').then(res => {
        //     console.log(res);
        // })

        //_expand 向上关联数据
        axios.get('http://localhost:8000/comments?_expand=post').then(res => {
            console.log(res);
        })
    }
    return (
        <div>
            <button onClick={OnButtonClk}>按钮</button>
        </div>
    )
}
