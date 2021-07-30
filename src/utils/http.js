import axios from "axios"
import NProgress from 'nprogress'
import { store } from "../redux/store"
// //css
import 'nprogress/nprogress.css'
axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.timeout = 5000;
axios.interceptors.request.use((config) => {
    NProgress.start()//顶部进度条
    store.dispatch({
        type: "change_loading",
        data: true
    })
    return config
})
axios.interceptors.response.use(
    response => {
        // console.log('aaaa');
        NProgress.done()
        store.dispatch({
            type: "change_loading",
            data: false
        })
        return response
    },
    error => {
        NProgress.done()
        store.dispatch({
            type: "change_loading",
            data: false
        })
        console.log('error',error);
    }
)