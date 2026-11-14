import { useNavigate } from "react-router-dom"


export default function CancelledModal() {

    const nav = useNavigate()

    return (
        <div className="modal">
            <div className="content">
                <h1>Your opponent has left</h1>
                <div className="buttons_row">
                    <button onClick={() => nav("/lobbies")}>Go back to lobbies</button>
                </div>
            </div>
        </div>
    )

}