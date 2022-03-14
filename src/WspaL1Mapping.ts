import { BigInt, BigDecimal, log, Address } from "@graphprotocol/graph-ts";
import { L1Wspa, Transfer } from "../generated/L1Wspa/L1Wspa";
import {
  wspaL1TransferEvent,
  wSpaTotalSupplyDayEvent,
  wSpaTotalSupplyEvent,
  wSpaBalanceDayEvent,
  wSpaBalanceEvent,
} from "../generated/schema";

import {
  timestampConvertDateTime,
  timestampConvertDate,
} from "../src/utilis/utils";

export function handleTransfer(event: Transfer): void {
  // Initialize Entities

  let transfer = new wspaL1TransferEvent(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(
        event.params.to
          .toHex()
          .concat("_")
          .concat(event.transaction.hash.toHex())
      )
  );

  let wSpaTotalSupply = new wSpaTotalSupplyEvent(
    event.transaction.from.toHex()
  );
  let wSpaBalance = new wSpaBalanceEvent(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(
        event.params.to
          .toHex()
          .concat("_")
          .concat(event.transaction.hash.toHex())
      )
  );

  let dayBalance = new wSpaBalanceDayEvent(
    timestampConvertDate(event.block.timestamp)
  );

  let dayTotalSupply = new wSpaTotalSupplyDayEvent(
    timestampConvertDate(event.block.timestamp)
  );

  let erc20 = L1Wspa.bind(event.address);

  // Calculate wSPA Total Supply

  let erc20TotalSupply = erc20.try_totalSupply();
  if (erc20TotalSupply.reverted) {
    log.warning("TotalSupply Revert", []);
  } else {
    wSpaTotalSupply.wSpaTotalSupply = erc20TotalSupply.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
    dayTotalSupply.wSpaTotalSupply = wSpaTotalSupply.wSpaTotalSupply;
  }

  // Calculate wSPA Balances

  let arbitrumBridgeLockedwSPA = erc20.try_balanceOf(
    Address.fromString("0xcEe284F754E854890e311e3280b767F80797180d")
  );
  if (arbitrumBridgeLockedwSPA.reverted) {
    log.warning("arbitrumBridgeLockedwSPA Revert", []);
  } else {
    wSpaBalance.arbitrumLockedBridgeBlance = arbitrumBridgeLockedwSPA.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));

    dayBalance.arbitrumLockedBridgeBlance =
      wSpaBalance.arbitrumLockedBridgeBlance;
  }
  // Transfer Entities

  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = event.params.value
    .toBigDecimal()
    .div(BigDecimal.fromString("1000000000000000000"));

  transfer.timeStamp = timestampConvertDateTime(event.block.timestamp);
  transfer.timeStampUnix = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  transfer.transactionHash = event.transaction.hash;
  transfer.gasPrice = event.transaction.gasPrice;
  transfer.gasUsed = event.block.gasUsed;

  // TotalSupply Entities

  wSpaTotalSupply.timeStamp = timestampConvertDateTime(event.block.timestamp);
  wSpaTotalSupply.timeStampUnix = event.block.timestamp;
  wSpaTotalSupply.blockNumber = event.block.number;
  wSpaTotalSupply.transactionHash = event.transaction.hash;

  // Balances Entities

  wSpaBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  wSpaTotalSupply.timeStampUnix = event.block.timestamp;
  wSpaBalance.blockNumber = event.block.number;
  wSpaBalance.transactionHash = event.transaction.hash;

  // Daily TotalSupply Entities

  dayTotalSupply.timeStamp = timestampConvertDateTime(event.block.timestamp);
  dayTotalSupply.timeStampUnix = event.block.timestamp;
  dayTotalSupply.blockNumber = event.block.number;
  dayTotalSupply.transactionHash = event.transaction.hash;

  // Daily Balances Entities

  dayBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  dayBalance.timeStampUnix = event.block.timestamp;
  dayBalance.blockNumber = event.block.number;
  dayBalance.transactionHash = event.transaction.hash;

  // Saving Entities

  transfer.save();
  wSpaTotalSupply.save();
  wSpaBalance.save();
  dayBalance.save();
  dayTotalSupply.save();
}
