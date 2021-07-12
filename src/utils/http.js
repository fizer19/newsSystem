import axios  from "axios"
import NProgress from 'nprogress'
// //css
import 'nprogress/nprogress.css'
axios.defaults.baseURL="http://localhost:8000"

axios.interceptors.request.use((config)=>{
    NProgress.start()
    return config
})
axios.interceptors.response.use((config)=>{
    NProgress.done()
    return config
})