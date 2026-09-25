//Equivalent to C# range type
export interface IRange {
    start: IRangePart,
    end: IRangePart
}

export interface IRangePart {
    value: number,
    isFromEnd: boolean
}