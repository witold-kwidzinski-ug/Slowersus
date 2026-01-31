import Letter from "./P2Letter";


export default function P2WordView({words}) {

    return (
        <div id="wordgrid">
            {words.map((n,i) => <div key={`row${i}`} className="wordrow">
                {n.map((o, j) => 
                    <Letter key={`letter${i}-${j}`} letterinfo={o} />
                )}
            </div>)}
            {words.length !== 6 && Array(5-words.length).fill(null).map((n, i) => 
                <div key={`emptyrow${i}`} className="wordrow">
                    {Array(5).fill(null).map((o, j) => <Letter key={`emptytile${j}`} letterinfo={{letter: "", color: "whitesmoke"}} />)}
                </div>
            )}
        </div>
    )


}