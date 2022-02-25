import {
  BigInt,
  BigDecimal,
  Bytes,
  Address,
  log,
} from "@graphprotocol/graph-ts";
import { SperaxL2, Approval, Transfer } from "../generated/SperaxL2/SperaxL2";
// import {
//   SperaxL2Balances,
//   Transfer as transferBalances,
// } from "../generated/SperaxL2Balances/SperaxL2Balances";
import { spaL2TransferEvent, spaL2Balance } from "../generated/schema";
import {
  timestampConvertDate,
  digitsConvert,
  spaL2BalanceCheck,
} from "../src/utilis/utils";

export function handleTransfer(event: Transfer): void {
  let entity = new spaL2TransferEvent(
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
  let balance = new spaL2Balance(
    event.transaction.from.toHex().concat("_").concat(event.params.to.toHex())
  );

  let erc20 = SperaxL2.bind(event.address);
  // Calculate SPA L2 Balances
  // 1- Bootstrap Liquidity Deployer
  balance.bootstrapLiquidityDeployer = spaL2BalanceCheck(
    erc20,
    "0xc28c6970D8A345988e8335b1C229dEA3c802e0a6"
  );
  // 2- USDs/USDC Farm Rewarder (SPA)

  balance.usdsUsdcFarmRewarder = spaL2BalanceCheck(
    erc20,
    "0x1733c5bc884090C73D89303467461693c54Ba58B"
  );
  // 3- USDs/USDC Farm Vesting (SPA)

  balance.usdsUsdcFarmVesting = spaL2BalanceCheck(
    erc20,
    "0x638d76763dE9492b609b0d8830D8F626C5933A4D"
  );
  // 4- SPA/USDs Farm Rewarder 1 (SPA)

  balance.spaUsdsFarmRewarder1 = spaL2BalanceCheck(
    erc20,
    "0x136C218Ff8E87eD68f851433685960819F06b1fE"
  );
  // 5- SPA/USDs Farm Vesting 1 (SPA)

  balance.spaUsdsFarmVesting1 = spaL2BalanceCheck(
    erc20,
    "0x03b35477cFD400dEdfAc06f40422491500cbc663"
  );

  // 6- SPA/USDs Farm Rewarder 2 (SPA)

  balance.spaUsdsFarmRewarder2 = spaL2BalanceCheck(
    erc20,
    "0x36033594EC23E0f0B187f767889Eb4C539F4aE03"
  );

  // 7- SPA/USDs Farm Vesting 2 (SPA)

  balance.spaUsdsFarmVesting2 = spaL2BalanceCheck(
    erc20,
    "0xC0F0484a216AfF20E0ead1a1513cE40fe0AFe0fe"
  );

  // 8- SPA-Reserve-L2 multi-sig

  balance.spaReserveL2MultiSig = spaL2BalanceCheck(
    erc20,
    "0xb56e5620A79cfe59aF7c0FcaE95aADbEA8ac32A1"
  );
  // 9- SPA Farm
  balance.spaFarm = spaL2BalanceCheck(
    erc20,
    "0xc150cbdDC5932258fAc768bEB4d2352D127039fd"
  );
  // 10- SPA Farm Rewarder
  balance.spaFarmRewarder = spaL2BalanceCheck(
    erc20,
    "0x852afF031bb282C054B26628A799D7F3a896873e"
  );
  let erc20TotalSupply = erc20.try_totalSupply();
  if (erc20TotalSupply.reverted) {
    log.info("TotalSupply Revert", []);
  } else {
    entity.totalSupply = erc20TotalSupply.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
  }

  balance.totalBalances = balance.bootstrapLiquidityDeployer
    .plus(balance.usdsUsdcFarmRewarder)
    .plus(balance.usdsUsdcFarmVesting)
    .plus(balance.spaUsdsFarmRewarder1)
    .plus(balance.spaUsdsFarmVesting1)
    .plus(balance.spaUsdsFarmRewarder2)
    .plus(balance.spaUsdsFarmVesting2)
    .plus(balance.spaReserveL2MultiSig)
    .plus(balance.spaFarmRewarder)
    .plus(balance.spaFarm);
  // Balances Entities
  balance.timeStamp = timestampConvertDate(event.block.timestamp);
  balance.blockNumber = event.block.number;
  balance.transactionHash = event.transaction.hash;
  balance.save();
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = digitsConvert(event.params.value);
  entity.count = entity.count.plus(BigInt.fromI32(1));
  entity.timeStamp = timestampConvertDate(event.block.timestamp);
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  entity.save();
}
// export function handleTransferBalances(event: transferBalances): void {
//   let balance = new spaL2Balance(
//     event.transaction.from.toHex().concat("_").concat(event.params.to.toHex())
//   );
//   let erc20 = SperaxL2Balances.bind(event.address);

//   // Calculate SPA L2 Balances
//   // 1- Bootstrap Liquidity Deployer
//   balance.bootstrapLiquidityDeployer = spaL2BalanceCheck(
//     erc20,
//     "0xc28c6970D8A345988e8335b1C229dEA3c802e0a6"
//   );
//   // 2- USDs/USDC Farm Rewarder (SPA)

//   balance.usdsUsdcFarmRewarder = spaL2BalanceCheck(
//     erc20,
//     "0x1733c5bc884090C73D89303467461693c54Ba58B"
//   );
//   // 3- USDs/USDC Farm Vesting (SPA)

//   balance.usdsUsdcFarmVesting = spaL2BalanceCheck(
//     erc20,
//     "0x638d76763dE9492b609b0d8830D8F626C5933A4D"
//   );
//   // 4- SPA/USDs Farm Rewarder 1 (SPA)

//   balance.spaUsdsFarmRewarder1 = spaL2BalanceCheck(
//     erc20,
//     "0x136C218Ff8E87eD68f851433685960819F06b1fE"
//   );
//   // 5- SPA/USDs Farm Vesting 1 (SPA)

//   balance.spaUsdsFarmVesting1 = spaL2BalanceCheck(
//     erc20,
//     "0x03b35477cFD400dEdfAc06f40422491500cbc663"
//   );

//   // 6- SPA/USDs Farm Rewarder 2 (SPA)

//   balance.spaUsdsFarmRewarder2 = spaL2BalanceCheck(
//     erc20,
//     "0x36033594EC23E0f0B187f767889Eb4C539F4aE03"
//   );

//   // 7- SPA/USDs Farm Vesting 2 (SPA)

//   balance.spaUsdsFarmVesting2 = spaL2BalanceCheck(
//     erc20,
//     "0xC0F0484a216AfF20E0ead1a1513cE40fe0AFe0fe"
//   );

//   // 7- SPA-Reserve-L2 multi-sig

//   balance.spaReserveL2MultiSig = spaL2BalanceCheck(
//     erc20,
//     "0xb56e5620A79cfe59aF7c0FcaE95aADbEA8ac32A1"
//   );
//   // 8- SPA Farm
//   balance.spaFarm = spaL2BalanceCheck(
//     erc20,
//     "0xc150cbdDC5932258fAc768bEB4d2352D127039fd"
//   );
//   // 9- SPA Farm Rewarder
//   balance.spaFarmRewarder = spaL2BalanceCheck(
//     erc20,
//     "0x852afF031bb282C054B26628A799D7F3a896873e"
//   );

//   // Balances Entities
//   balance.timeStamp = timestampConvertDate(event.block.timestamp);
//   balance.blockNumber = event.block.number;
//   balance.transactionHash = event.transaction.hash;
//   balance.save();
// }

// export function handleApproval(event: Approval): void {
//   // let entity = spaL2ApprovalEvent.load(event.transaction.from.toHex());

//   // // Entities only exist after they have been saved to the store;
//   // // `null` checks allow to create entities on demand
//   // if (!entity) {
//   //   entity = new spaL2ApprovalEvent(event.transaction.from.toHex());

//   // }

//   // entity.owner = event.params.owner;
//   // entity.spender = event.params.spender;
//   // entity.amount = digitsConvert(event.params.value)
//   // entity.timeStamp = timestampConvertDate(event.block.timestamp);
//   // entity.blockNumber = event.block.number;
//   // entity.transactionHash = event.transaction.hash;
//   // entity.gasPrice = event.transaction.gasPrice;
//   // entity.gasUsed = event.block.gasUsed;

//   // entity.save();

// }
