//preveState前一个状态，首次为undefined，可以设置初始值
//action包含操作类型type，和自定义数据
export const loadingReducer = (preveState={
    loading: false
},action) => {
    const {type,data} = action
    switch (type) {
        case "change_loading":
            let newState = {...preveState}
            newState.loading = data
            return newState;
    
        default:
            return preveState;
    }
}