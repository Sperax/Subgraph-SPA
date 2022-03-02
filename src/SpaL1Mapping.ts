import { BigInt, BigDecimal, log, Address } from "@graphprotocol/graph-ts";
import {
  SperaxL1,
  AllowTransfer,
  Approval,
  BlockTransfer,
  MintPaused,
  MintUnpaused,
  Mintable,
  OwnershipTransferred,
  Paused,
  Transfer,
  Unmintable,
  Unpaused,
} from "../generated/SperaxL1/SperaxL1";
import {
  spaL1TransferEvent,
  spaL1Balance,
  wSpaTotalSupplyEvent,
  wSpaBalanceEvent,
  spaL1TotalSupplyEvent,
} from "../generated/schema";

import { timestampConvertDate, spaL1BalanceCheck } from "../src/utilis/utils";

export function handleTransfer(event: Transfer): void {
  // Initialize Entities

  let transfer = new spaL1TransferEvent(
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
  let balance = new spaL1Balance(
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
  let spaL1TotalSupply = new spaL1TotalSupplyEvent(
    event.transaction.from.toHex()
  );

  // Calculate L1 SPA Total Supply

  let erc20 = SperaxL1.bind(event.address);
  let erc20TotalSupply = erc20.try_totalSupply();
  if (erc20TotalSupply.reverted) {
    log.warning("TotalSupply Revert", []);
  } else {
    spaL1TotalSupply.spaL1TotalSupply = erc20TotalSupply.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
  }
  // Calculate SPA Balances
  // 1- Bootstrap Liquidity

  balance.bootstrapLiquidity = spaL1BalanceCheck(
    erc20,
    "0x8B65CE3b4Eaa8958346096C3a9303b73f2012aCc"
  );

  // 2- Bootstrap Liquidity Deployer

  balance.bootstrapLiquidityDeployer = spaL1BalanceCheck(
    erc20,
    "0xc28c6970D8A345988e8335b1C229dEA3c802e0a6"
  );
  // 3 Private Sale
  balance.privateSale = spaL1BalanceCheck(
    erc20,
    "0x2Fc8d8BCf4b2c0fc6594475E44c473AC3E844B6a"
  );
  // 4 Team & Advisor

  balance.teamAdvisor = spaL1BalanceCheck(
    erc20,
    "0x483fE01ED80aB597e7941B5C925739A396555d27"
  );
  // 5 Sperax Foundation
  balance.SperaxFoundation = spaL1BalanceCheck(
    erc20,
    "0xD95791bcab484C0552833cB558d18d4D3F198AF9"
  );
  // 6 Staking Rewards
  balance.StakingRewards = spaL1BalanceCheck(
    erc20,
    "0xCD1B1ce6ce877a9315E73E2E4Ba3137228068A59"
  );
  // 7 Treasury
  balance.treasury = spaL1BalanceCheck(
    erc20,
    "0x4a692fD139259a5b94Cad7753E3C96350b7F2B9f"
  );
  // 8 Team & Advisor2

  balance.teamAdvisor2 = spaL1BalanceCheck(
    erc20,
    "0xd6D462c58D09bff7f8ec49A995B38eA89C9c5402"
  );
    balance.totalBalancesL1=balance.bootstrapLiquidityDeployer
    .plus(balance.bootstrapLiquidity)
    .plus(balance.privateSale)
    .plus(balance.teamAdvisor)
    .plus(balance.SperaxFoundation)
    .plus(balance.StakingRewards)
    .plus(balance.treasury)
    .plus(balance.teamAdvisor2)
  



  //Transfer Entities
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = event.params.value
    .toBigDecimal()
    .div(BigDecimal.fromString("1000000000000000000"));
  transfer.timeStamp = timestampConvertDate(event.block.timestamp);
  transfer.blockNumber = event.block.number;
  transfer.transactionHash = event.transaction.hash;
  transfer.gasPrice = event.transaction.gasPrice;
  transfer.gasUsed = event.block.gasUsed;
  // totalSupply Entities

  spaL1TotalSupply.timeStamp = timestampConvertDate(event.block.timestamp);
  spaL1TotalSupply.blockNumber = event.block.number;
  spaL1TotalSupply.transactionHash = event.transaction.hash;

  // Balances Entities

  balance.timeStamp = timestampConvertDate(event.block.timestamp);
  balance.blockNumber = event.block.number;
  balance.transactionHash = event.transaction.hash;

  // Saving Entities

  spaL1TotalSupply.save();
  transfer.save();
  balance.save();
}
export function handleAllowTransfer(event: AllowTransfer): void {}

export function handleApproval(event: Approval): void {}

export function handleBlockTransfer(event: BlockTransfer): void {}

export function handleMintPaused(event: MintPaused): void {}

export function handleMintUnpaused(event: MintUnpaused): void {}

export function handleMintable(event: Mintable): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleUnmintable(event: Unmintable): void {}

export function handleUnpaused(event: Unpaused): void {}
