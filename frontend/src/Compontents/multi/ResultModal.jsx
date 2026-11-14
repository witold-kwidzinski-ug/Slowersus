

export default function ResultModal({message, setIsOver}) {

    return (
        <div className="modal">
            <div className="content">
                <h1>{message}</h1>
                <div className="buttons_row">
                    <button onClick={() => setIsOver(false)}>Continue</button>
                </div>
            </div>
        </div>
    )

}