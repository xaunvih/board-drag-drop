import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { FixedSizeGrid, GridChildComponentProps } from 'react-window'
import './Board.scss'
import { createZigZagArrFromN } from './utils'

function Board(): React.ReactElement {
    const [n, updateN] = useState<number>(5)
    const debouncedN = useDebounce<number>(n, 500)
    const additionalClass = debouncedN > 7 ? 'big' : 'small'
    const [zigZagArr, updateZigZagArr] = useState<number[][]>(createZigZagArrFromN(debouncedN))

    function onDragStart(evt: React.DragEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) {
        evt.dataTransfer.setData('text/plain', JSON.stringify({ rowIndex, columnIndex }))
    }

    function onDragOver(evt: React.DragEvent<HTMLDivElement>) {
        evt.preventDefault()
    }

    function onDrop(evt: React.DragEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) {
        // check itself

        const data = JSON.parse(evt.dataTransfer.getData('text/plain')) as { rowIndex: number; columnIndex: number }
        const newZigZagArr = [...zigZagArr]

        const { rowIndex: sourceRowIndex, columnIndex: sourceColumnIndex } = data
        const current = newZigZagArr[sourceRowIndex][sourceColumnIndex]

        newZigZagArr[data.rowIndex][data.columnIndex] = newZigZagArr[rowIndex][columnIndex]
        newZigZagArr[rowIndex][columnIndex] = current
        updateZigZagArr(newZigZagArr)
    }

    function onNumberChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const number = evt.target.value
        updateN(Number(number))
    }

    useEffect(() => {
        const newZigZagArr = createZigZagArrFromN(Number(debouncedN))
        updateZigZagArr(newZigZagArr)
    }, [debouncedN])

    function Cell(props: GridChildComponentProps) {
        const { columnIndex, rowIndex, style } = props
        const number = zigZagArr[rowIndex][columnIndex]

        return (
            <div
                onDragStart={(evt) => onDragStart(evt, rowIndex, columnIndex)}
                onDragOver={onDragOver}
                onDrop={(evt) => onDrop(evt, rowIndex, columnIndex)}
                draggable={true}
                className="cell"
                style={style}
                key={number}
            >
                {number}
            </div>
        )
    }

    return (
        <div className="container">
            <header className="header">
                <h2>Type number of row and column:</h2>
                <input type="number" defaultValue={debouncedN} onChange={onNumberChange} min={1} max={1000} />
            </header>

            <div className={`board ${additionalClass}`}>
                <FixedSizeGrid
                    columnCount={debouncedN}
                    rowCount={debouncedN}
                    columnWidth={100}
                    rowHeight={100}
                    height={700}
                    width={700}
                    className="grid"
                >
                    {Cell}
                </FixedSizeGrid>
            </div>
        </div>
    )
}

export default Board
