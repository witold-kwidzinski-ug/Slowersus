import { createContext, useContext, useReducer } from "react";

import userInfoReducer from "./UserInfoReducer";

const UserInfoContext = createContext(null)

export default function UserInfoProvider({children}) {
    const [state, dispatch] = useReducer(userInfoReducer, {id: null, name: null}, () => {
        const info = localStorage.getItem("userinfo")

        if (info) {
            return JSON.parse(info)
        } else {
            return {id: null, name: null}
        }

    })
    console.log(state)

    

    return (
        <UserInfoContext.Provider value={{state, dispatch}}>
            {children}
        </UserInfoContext.Provider>
    )
}


export function useUserInfo() {
    const context = useContext(UserInfoContext)

    if (context === null) {
        throw new Error("useUserInfo must be in UserInfoProvider.")
    }

    return context

}