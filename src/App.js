import {useEffect} from 'react'
import axios from 'axios'
import IndexRouter from './router/IndexRouter'
import './App.css'
function App() {
  useEffect(() =>{
    axios.get('/ajax/movieOnInfoList?token=&optimus_uuid=56EE75A0D98811EB890751083743E8B3C5171B976F4A4AC19CCA2AF442B5F697&optimus_risk_level=71&optimus_code=10')
          .then(res => console.log(res))
          .catch(err => console.log(err))
  },[])
  return <div><IndexRouter></IndexRouter></div>
}

export default App;
