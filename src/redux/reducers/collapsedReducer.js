
export const collapsedReducer = (preveState={
    collapsed: false
},action) => {
    const {type} = action
    switch (type) {
        case "change_collapsed":
            let newState = {...preveState}
            newState.collapsed = !newState.collapsed
            return newState;
    
        default:
            return preveState;
    }
    
}