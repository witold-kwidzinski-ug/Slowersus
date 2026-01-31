import { useFormik } from "formik"


import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../../contexts/UserInfoContext"
import { useLocation } from "react-router-dom"



export default function Login() {

    const navigate = useNavigate()

    const path = "/main" 

    const {dispatch} = useUserInfo()

    const loginForm = useFormik({
        initialValues: {
            name: "",
            password: ""
        },

        onSubmit: async (values) => {
            const d = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: values.name,
                    password: values.password

                })
            }).then(o => o.json())

            if (d.error) {
                console.log(d.error)
                return
            }
            
            console.log("register success")

            dispatch({type: "LOGIN", payload: d})

            navigate(path)
        }
    })
    

    return (
        <form onSubmit={loginForm.handleSubmit}>
            <input type="text" name="name" value={loginForm.values.name} onChange={loginForm.handleChange} placeholder="name" />
            <input type="text" name="password" value={loginForm.values.password} onChange={loginForm.handleChange} placeholder="password" />
            <button type="submit">Login</button>
        </form>
    )
}