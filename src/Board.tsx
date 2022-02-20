import React, { useEffect, useState } from 'react'
import './Board.scss'
import Grid from './Grid'
import { useDebounce } from 'usehooks-ts'
import { createZigZagArrFromN } from './utils'

function Board(): React.ReactElement {
    const [n, updateN] = useState<number>(10)
    const debouncedN = useDebounce<number>(n, 500)
    const additionalClass = debouncedN > 7 ? 'big' : 'small'
    const [zigZagArr, updateZigZagArr] = useState<number[][]>(createZigZagArrFromN(debouncedN))

    function onNumberChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const number = evt.target.value
        if (number) {
            updateN(Number(number))
        }
    }

    useEffect(() => {
        const newZigZagArr = createZigZagArrFromN(Number(debouncedN))
        updateZigZagArr(newZigZagArr)
    }, [debouncedN])

    return (
        <main className="container">
            <header className="header">
                <h2>Type number of row and column:</h2>
                <input type="number" defaultValue={debouncedN} onChange={onNumberChange} min={1} />
            </header>

            <div className={`board ${additionalClass}`}>
                <Grid zigZagArr={zigZagArr} updateZigZagArr={updateZigZagArr} />
            </div>
        </main>
    )
}

export default Board
