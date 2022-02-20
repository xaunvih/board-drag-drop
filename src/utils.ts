export function createZigZagArrFromN(n: number) {
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
