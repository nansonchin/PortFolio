export function calculateConfidence(
    score:number
):number{
    return Math.min(
        score * 2,
        100
    )
}