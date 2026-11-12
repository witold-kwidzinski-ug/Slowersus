

export default function handleWord(word, answer) {
    const final = Array(5).fill(null)

    const answerobj = [...answer].reduce((acc, el) => {
        if (!acc[el]) {
            return {...acc, [el]: 1}
        }
        return {...acc, [el]: acc[el] + 1}

    }, {})

    for (let i = 0; i < 5; i++) {
        const letter = word[i]
        if (letter === answer[i]) {
            final[i] = {letter, color: "lime"}
            answerobj[letter]--
        }
    }

    for (let i = 0; i < 5; i++) {
        const letter = word[i]
        if (final[i]) continue

        if ([...answer].includes(letter) && answerobj[letter] > 0) {
            final[i] = {letter, color: "gold"}
            answerobj[letter]--
            continue
        }

        final[i] = {letter, color: "gray"}

    }

    return final
}