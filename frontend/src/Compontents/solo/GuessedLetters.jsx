import Letter from "./Letter"

export default function GuessedLetters({letters}) {

    return (
        <div id="lettersview">
            <div className="lettersviewrow">
                {"QWERTYUIOP".split("").map(n => <Letter key={n} letterinfo={{letter: n, color: letters[n]}} />)}
            </div>
            <div className="lettersviewrow">
                {"ASDFGHJKL".split("").map(n => <Letter key={n} letterinfo={{letter: n, color: letters[n]}} />)}
            </div>
            <div className="lettersviewrow">
                {"ZXCVBNM".split("").map(n => <Letter key={n} letterinfo={{letter: n, color: letters[n]}} />)}
            </div>
        </div>
    )
}