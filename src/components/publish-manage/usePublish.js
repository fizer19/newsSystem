import {useState,useEffect} from 'react'
import axios from 'axios'
export default function usePublish(type) {
    const {username} = JSON.parse(localStorage.getItem('token'))
    useEffect(()=>{
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
            setdataSource(res.data)
            console.log(res);
        })
    },[username, type])
    const [dataSource, setdataSource] = useState([])

    const handleSunset = (id) => {
        console.log(id);
    }
    const handlePublish = (id) => {
        console.log(id);
    }
    const handleDelete = (id) => {
        console.log(id);
    }
    return {
        dataSource,
        handleSunset,
        handlePublish,
        handleDelete
    }
}