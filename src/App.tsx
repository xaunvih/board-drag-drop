import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { FixedSizeGrid, GridChildComponentProps } from 'react-window'
import './App.scss'

function createZigZagArrFromN(n: number) {
    let start = 1
    const zigZagArr: number[][] = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const indexColumn = i % 2 === 0 ? j : n - 1 - j
            zigZagArr[indexColumn][i] = start++
        }
    }

    return zigZagArr
}

function Board(): React.ReactElement {
    const [n, updateN] = useState<number>(1000)
    const debouncedN = useDebounce<number>(n, 500)
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
            <input
                type="number"
                defaultValue={debouncedN}
                onChange={onNumberChange}
                min={1}
                max={1000}
                placeholder="Type number of row and column..."
            />

            <div className="board">
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

export { createZigZagArrFromN }
export default Board
