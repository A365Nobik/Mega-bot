export interface IMessage{
    sender:"user"|"assistant"
    timestamp?:Date
    model?:string
    text:string
}