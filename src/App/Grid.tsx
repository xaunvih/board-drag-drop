import React from "react";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";

interface GridProps {
  zigZagArr: number[][];
  updateZigZagArr: React.Dispatch<React.SetStateAction<number[][]>>;
}

function Grid(props: GridProps): React.ReactElement {
  const { zigZagArr, updateZigZagArr } = props;

  function onDragStart(
    evt: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    columnIndex: number
  ) {
    evt.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ rowIndex, columnIndex })
    );
  }

  function onDragOver(evt: React.DragEvent<HTMLDivElement>) {
    evt.preventDefault();
  }

  function onDrop(
    evt: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    columnIndex: number
  ) {
    const data = JSON.parse(evt.dataTransfer.getData("text/plain")) as {
      rowIndex: number;
      columnIndex: number;
    };
    const newZigZagArr = [...zigZagArr];
    const { rowIndex: sourceRowIndex, columnIndex: sourceColumnIndex } = data;
    const current = newZigZagArr[sourceRowIndex][sourceColumnIndex];
    const target = newZigZagArr[rowIndex][columnIndex];
    if (current === target) {
      // drop on same square
      return;
    }

    newZigZagArr[sourceRowIndex][sourceColumnIndex] = target;
    newZigZagArr[rowIndex][columnIndex] = current;
    updateZigZagArr(newZigZagArr);
  }

  function Cell(props: GridChildComponentProps) {
    const { columnIndex, rowIndex, style } = props;
    const number = zigZagArr[rowIndex][columnIndex];
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
    );
  }

  return (
    <FixedSizeGrid
      columnCount={zigZagArr.length}
      rowCount={zigZagArr.length}
      columnWidth={100}
      rowHeight={100}
      height={700}
      width={700}
      className="grid"
    >
      {Cell}
    </FixedSizeGrid>
  );
}

export default Grid;
