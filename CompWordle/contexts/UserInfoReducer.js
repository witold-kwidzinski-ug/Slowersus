
export default function userInfoReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {name: action.payload.name, id: action.payload.id}
        default:
            return state
    }
}