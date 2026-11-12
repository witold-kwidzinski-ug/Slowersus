

export default function WinModal({isWon, answer, guesses}) {

    return (
        <div className="modal">
            <div className="content">
                <div className="content_info">
                    {isWon ? <h1>Congratulations!</h1> : <h1>You lost!</h1>}
                    <p>The answer was: <b>{answer}</b></p>
                    {isWon && <p>Amount of guesses: {guesses}</p>}
                </div>
                <div className="buttons_row">
                    <button>Try again?</button>
                    <button>See guesses</button>
                </div>
            </div>
        </div>
    )

}