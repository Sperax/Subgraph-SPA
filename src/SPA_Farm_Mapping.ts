import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  SPA_Staking_Farm,
  OwnershipTransferred,
  RewardFrozen,
  Staked,
  StakingEnabled,
  Withdrawn,
  WithdrawnWithPenalty,
} from "../generated/SPA_Staking_Farm/SPA_Staking_Farm";
import {
  timestampConvertDateTime,
  digitsConvert,
  spaL2BalanceCheck,
  timestampConvertDate,
} from "../src/utilis/utils";
import {
  spaL2FarmStakeEvent,
  spaL2FarmWithdrawEvent,
  spaL2FarmWithdrawPenalityEvent,
} from "../generated/schema";

export function handleStaked(event: Staked): void {
  let entity = new spaL2FarmStakeEvent(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.block.number.toHexString())
  );

  let contract = SPA_Staking_Farm.bind(event.address);
  let getNumDeposits=contract.try_getNumDeposits(event.params.account)
  getNumDeposits.value
  let expiryTime = contract.try_getDeposits(
    event.params.account,
    getNumDeposits.value.minus(BigInt.fromI32(1))
  );
  if (expiryTime.reverted) {
    log.warning("ExpiryTime Revert", []);
  } else {
    entity.expiryDate = expiryTime.value.expiryTime;
    entity.lockupPeriod = expiryTime.value.expiryTime
      .minus(event.block.timestamp)
      .div(BigInt.fromI32(86400));
  }

  entity.account = event.params.account;
  entity.amount = digitsConvert(event.params.amount);
  entity.totalStakedSPA = digitsConvert(event.params.totalStakedSPA);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  let entity = new spaL2FarmWithdrawEvent(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.block.number.toHexString())
  );


  entity.account = event.params.account;
  entity.amount = digitsConvert(event.params.amount);
  entity.totalStakedSPA = digitsConvert(event.params.totalStakedSPA);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}
export function handleWithdrawnWithPenalty(event: WithdrawnWithPenalty): void {
  let entity = new spaL2FarmWithdrawPenalityEvent(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.block.number.toHexString())
  );


  entity.account = event.params.account;
  entity.amount = digitsConvert(event.params.amount);
  entity.totalStakedSPA = digitsConvert(event.params.totalStakedSPA);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}
export function handleStakingEnabled(event: StakingEnabled): void {}

export function handleRewardFrozen(event: RewardFrozen): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())
  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)
  // // Entity fields can be set based on event parameters
  // entity.previousOwner = event.params.previousOwner
  // entity.newOwner = event.params.newOwner
  // // Entities can be written to the store with `.save()`
  // entity.save()
  // // Note: If a handler doesn't require existing field values, it is faster
  // // _not_ to load the entity from the store. Instead, create it fresh with
  // // `new Entity(...)`, set the fields that should be updated and save the
  // // entity back to the store. Fields that were not set or unset remain
  // // unchanged, allowing for partial updates to be applied.
  // // It is also possible to access smart contracts from mappings. For
  // // example, the contract that has emitted the event can be connected to
  // // with:
  // //
  // // let contract = Contract.bind(event.address)
  // //
  // // The following functions can then be called on this contract to access
  // // state variables and other data:
  // //
  // // - contract.BASE_APR(...)
  // // - contract.SPA(...)
  // // - contract.allowStaking(...)
  // // - contract.endTime(...)
  // // - contract.getDeposits(...)
  // // - contract.getLiability(...)
  // // - contract.getNumDeposits(...)
  // // - contract.isRewardFrozen(...)
  // // - contract.lockupPeriods(...)
  // // - contract.multipliers(...)
  // // - contract.owner(...)
  // // - contract.rewardAccount(...)
  // // - contract.totalStakedSPA(...)
}
