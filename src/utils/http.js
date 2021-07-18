import axios from "axios"
import NProgress from 'nprogress'
// //css
import 'nprogress/nprogress.css'
axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.timeout = 5000;
axios.interceptors.request.use((config) => {
    NProgress.start()
    
    return config
})
axios.interceptors.response.use(
    response => {
        console.log('aaaa');
        NProgress.done()
        return response
    },
    error => {
        NProgress.done()
        console.log('error',error);
    }
)