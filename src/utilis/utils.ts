import {
  BigInt,
  Address,
  log,
  TypedMap,
  TypedMapEntry,
  BigDecimal,
} from "@graphprotocol/graph-ts";
import {
  SperaxL2,
  Approval,
  Transfer,
} from "../../generated/SperaxL2/SperaxL2";
import { SperaxL1 } from "../../generated/SperaxL1/SperaxL1";
//Convert timestamp to Date
export function timestampConvertDate(time: BigInt): string {
  let date = new Date(1000 * time.toI32());
  let dateConverted = date
    .toDateString()
    .concat(" ")
    .concat(date.toTimeString());

  return dateConverted;
}
export function digitsConvert(value: BigInt): BigDecimal {
  let converted = value
    .toBigDecimal()
    .div(BigDecimal.fromString("1000000000000000000"));

  return converted;
}

export function spaL2BalanceCheck(spa: SperaxL2, address: string): BigDecimal {
  let balance = spa.try_balanceOf(Address.fromString(address));
  if (balance.reverted) {
    log.info("TotalSupply Revert", []);
    return BigDecimal.fromString("0");
  } else {
    return balance.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
  }
}
export function spaL1BalanceCheck(spa: SperaxL1, address: string): BigDecimal {
  let balance = spa.try_balanceOf(Address.fromString(address));
  if (balance.reverted) {
    log.info("TotalSupply Revert", []);
    return BigDecimal.fromString("0");
  } else {
    return balance.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
  }
}
// let mapped = new TypedMap<string, BigDecimal>();

// export function getHolders(address:string,balance:BigDecimal):BigDecimal{
//   let mappedEntry = new TypedMapEntry<string, BigDecimal>(address,balance);

//   mapped.entries.push(mappedEntry)

//  let size= BigInt.fromI32(mapped.entries.length).toBigDecimal()
//   return size
// }
