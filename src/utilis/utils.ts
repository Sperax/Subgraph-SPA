import {
    BigInt,BigDecimal,TypedMap,TypedMapEntry

  } from "@graphprotocol/graph-ts";
//Convert timestamp to Date
export function timestampConvertDate(time: BigInt):string{

let date= new Date((1000)*(time.toI32()))
let dateConverted = date.toDateString().concat(" ").concat(date.toTimeString())


return dateConverted
}
// let mapped = new TypedMap<string, BigDecimal>();

// export function getHolders(address:string,balance:BigDecimal):BigDecimal{
//   let mappedEntry = new TypedMapEntry<string, BigDecimal>(address,balance);

//   mapped.entries.push(mappedEntry)

//  let size= BigInt.fromI32(mapped.entries.length).toBigDecimal()
//   return size
// }