import { useFormik } from "formik"

import { useLocation, useNavigate } from "react-router-dom"
import { useUserInfo } from "../../contexts/UserInfoContext"

import "./form.css"


export default function Login() {

    const navigate = useNavigate()
    const location = useLocation()

    const path = location.state.from || "/main" 

    const {dispatch} = useUserInfo()

    const loginForm = useFormik({
        initialValues: {
            name: "",
            password: ""
        },

        onSubmit: async (values) => {
            const d = await fetch("http://localhost:8000/login", {
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

            console.log("login success")

            dispatch({type: "LOGIN", payload: d})
            
            localStorage.setItem("userinfo", JSON.stringify({id: d.id, name: d.name}))

            navigate(path)

        }
    })
    

    return (
        <>
            <form id={"loginform"} onSubmit={loginForm.handleSubmit}>
                <input type="text" name="name" value={loginForm.values.name} onChange={loginForm.handleChange} placeholder="name" />
                <input type="text" name="password" value={loginForm.values.password} onChange={loginForm.handleChange} placeholder="password" />
                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate("/register")}>No account?</button>
            </form>
        </>
    )
}