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