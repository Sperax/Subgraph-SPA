import { BigInt, BigDecimal, log, Address } from "@graphprotocol/graph-ts";
import {
  L1Wspa,
  Approval,
  ArbitrumGatewayRouterChanged,
  OwnershipTransferred,
  SPAaddressUpdated,
  Transfer,
} from "../generated/L1Wspa/L1Wspa";
import {
  wspaL1TransferEvent,
  spaL1Balance,
  wSpaTotalSupplyEvent,
  wSpaBalanceEvent,
} from "../generated/schema";

import { timestampConvertDate } from "../src/utilis/utils";

export function handleTransfer(event: Transfer): void {
  // Initialize Entities

  let transfer = new wspaL1TransferEvent(event.transaction.from.toHex());

  let wSpaTotalSupply = new wSpaTotalSupplyEvent(
    event.transaction.from.toHex()
  );
  let wSpaBalance = new wSpaBalanceEvent(event.transaction.from.toHex());
  let erc20 = L1Wspa.bind(event.address);

  // Calculate wSPA Total Supply

  let erc20TotalSupply = erc20.try_totalSupply();
  if (erc20TotalSupply.reverted) {
    log.warning("TotalSupply Revert", []);
  } else {
    wSpaTotalSupply.wSpaTotalSupply = erc20TotalSupply.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
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
  }
  wSpaBalance.save();
  // Transfer Entities

  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = event.params.value
    .toBigDecimal()
    .div(BigDecimal.fromString("1000000000000000000"));
  transfer.count = transfer.count.plus(BigInt.fromI32(1));
  transfer.timeStamp = timestampConvertDate(event.block.timestamp);
  transfer.blockNumber = event.block.number;
  transfer.transactionHash = event.transaction.hash;
  transfer.gasPrice = event.transaction.gasPrice;
  transfer.gasUsed = event.block.gasUsed;

  // totalSupply Entities

  wSpaTotalSupply.timeStamp = timestampConvertDate(event.block.timestamp);
  wSpaTotalSupply.blockNumber = event.block.number;
  wSpaTotalSupply.transactionHash = event.transaction.hash;

  // Balances Entities

  wSpaBalance.timeStamp = timestampConvertDate(event.block.timestamp);
  wSpaBalance.blockNumber = event.block.number;
  wSpaBalance.transactionHash = event.transaction.hash;

  // Saving Entities

  transfer.save();
  wSpaTotalSupply.save();
  wSpaBalance.save();
}

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = wspaL1TransferEvent.load(event.transaction.from.toHex())
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new wspaL1TransferEvent(event.transaction.from.toHex())
  //   // Entity fields can be set using simple assignments
  // }
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)
  // // Entity fields can be set based on event parameters
  // entity.owner = event.params.owner
  // entity.spender = event.params.spender
  // // Entities can be written to the store with `.save()`
  // entity.save()
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.bridge(...)
  // - contract.decimals(...)
  // - contract.decreaseAllowance(...)
  // - contract.increaseAllowance(...)
  // - contract.isArbitrumEnabled(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.router(...)
  // - contract.spaAddress(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
}

export function handleArbitrumGatewayRouterChanged(
  event: ArbitrumGatewayRouterChanged
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleSPAaddressUpdated(event: SPAaddressUpdated): void {}
