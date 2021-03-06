import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";
import { SperaxL2, Transfer } from "../generated/SperaxL2/SperaxL2";

import {
  spaL2TransferEvent,
  spaL2Balance,
  spaL2DayBalance,
  spaL2TotalSupplyDayEvent,
  spaL2FromWallet,
  spaL2ToWallet,
} from "../generated/schema";
import {
  timestampConvertDateTime,
  digitsConvert,
  spaL2BalanceCheck,
  timestampConvertDate,
} from "../src/utilis/utils";

export function handleTransfer(event: Transfer): void {
  let fromWallet = new spaL2FromWallet(event.params.from.toHex());
  fromWallet.blockNumber = event.block.number;
  let toWallet = new spaL2ToWallet(event.params.from.toHex());
  toWallet.blockNumber = event.block.number;

  fromWallet.save();
  toWallet.save();
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
  let dayBalance = new spaL2DayBalance(
    timestampConvertDate(event.block.timestamp)
  );

  let dayTotalSupply = new spaL2TotalSupplyDayEvent(
    timestampConvertDate(event.block.timestamp)
  );

  let erc20 = SperaxL2.bind(event.address);

  // Calculate Sperax L2 Total Supply

  let erc20TotalSupply = erc20.try_totalSupply();
  if (erc20TotalSupply.reverted) {
    log.info("TotalSupply Revert", []);
  } else {
    entity.totalSupply = erc20TotalSupply.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
    dayTotalSupply.totalSupply = entity.totalSupply;
  }

  // Calculate SPA L2 Balances
  // 1- Bootstrap Liquidity Deployer
  balance.bootstrapLiquidityDeployer = spaL2BalanceCheck(
    erc20,
    "0xc28c6970D8A345988e8335b1C229dEA3c802e0a6"
  );
  dayBalance.bootstrapLiquidityDeployer = balance.bootstrapLiquidityDeployer;

  // 2- USDs/USDC Farm Rewarder (SPA)

  balance.usdsUsdcFarmRewarder = spaL2BalanceCheck(
    erc20,
    "0x1733c5bc884090C73D89303467461693c54Ba58B"
  );
  dayBalance.usdsUsdcFarmRewarder = balance.usdsUsdcFarmRewarder;

  // 3- USDs/USDC Farm Vesting (SPA)

  balance.usdsUsdcFarmVesting = spaL2BalanceCheck(
    erc20,
    "0x638d76763dE9492b609b0d8830D8F626C5933A4D"
  );
  dayBalance.usdsUsdcFarmVesting = balance.usdsUsdcFarmVesting;

  // 4- SPA/USDs Farm Rewarder 1 (SPA)

  balance.spaUsdsFarmRewarder1 = spaL2BalanceCheck(
    erc20,
    "0x136C218Ff8E87eD68f851433685960819F06b1fE"
  );
  dayBalance.spaUsdsFarmRewarder1 = balance.spaUsdsFarmRewarder1;

  // 5- SPA/USDs Farm Vesting 1 (SPA)

  balance.spaUsdsFarmVesting1 = spaL2BalanceCheck(
    erc20,
    "0x03b35477cFD400dEdfAc06f40422491500cbc663"
  );
  dayBalance.spaUsdsFarmVesting1 = balance.spaUsdsFarmVesting1;

  // 6- SPA/USDs Farm Rewarder 2 (SPA)

  balance.spaUsdsFarmRewarder2 = spaL2BalanceCheck(
    erc20,
    "0x36033594EC23E0f0B187f767889Eb4C539F4aE03"
  );
  dayBalance.spaUsdsFarmRewarder2 = balance.spaUsdsFarmRewarder2;
  // 7- SPA/USDs Farm Vesting 2 (SPA)

  balance.spaUsdsFarmVesting2 = spaL2BalanceCheck(
    erc20,
    "0xC0F0484a216AfF20E0ead1a1513cE40fe0AFe0fe"
  );
  dayBalance.spaUsdsFarmVesting2 = balance.spaUsdsFarmVesting2;
  // 8- SPA-Reserve-L2 multi-sig

  balance.spaReserveL2MultiSig = spaL2BalanceCheck(
    erc20,
    "0xb56e5620A79cfe59aF7c0FcaE95aADbEA8ac32A1"
  );
  dayBalance.spaReserveL2MultiSig = balance.spaReserveL2MultiSig;

  // 9- SPA Farm
  balance.spaFarm = spaL2BalanceCheck(
    erc20,
    "0xc150cbdDC5932258fAc768bEB4d2352D127039fd"
  );
  dayBalance.spaFarm = balance.spaFarm;
  // 10- SPA Farm Rewarder
  balance.spaFarmRewarder = spaL2BalanceCheck(
    erc20,
    "0x852afF031bb282C054B26628A799D7F3a896873e"
  );
  dayBalance.spaFarmRewarder = balance.spaFarmRewarder;
  // 11- Reward Distributor
  balance.rewardDistributor = spaL2BalanceCheck(
    erc20,
    "0x2c07bc934974BbF413a4a4CeDA98713DCb8d9e16"
  );
  dayBalance.rewardDistributor = balance.rewardDistributor;
  // 12- SPA Buyback
  balance.spaBuyback = spaL2BalanceCheck(
    erc20,
    "0xA61a0719e9714c95345e89a2f1C83Fae6f5745ef"
  );
  dayBalance.spaBuyback = balance.spaBuyback;
  // 13- veSPA L2
  balance.veSPAL2 = spaL2BalanceCheck(
    erc20,
    "0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"
  );
  dayBalance.veSPAL2 = balance.veSPAL2;
  balance.totalBalances = balance.bootstrapLiquidityDeployer
    .plus(balance.usdsUsdcFarmRewarder)
    .plus(balance.usdsUsdcFarmVesting)
    .plus(balance.spaUsdsFarmRewarder1)
    .plus(balance.spaUsdsFarmVesting1)
    .plus(balance.spaUsdsFarmRewarder2)
    .plus(balance.spaUsdsFarmVesting2)
    .plus(balance.spaReserveL2MultiSig)
    .plus(balance.spaFarmRewarder)
    .plus(balance.spaFarm)
    .plus(balance.rewardDistributor)
    .plus(balance.spaBuyback)
    .plus(balance.veSPAL2);
  dayBalance.totalBalances = balance.totalBalances;

  // Balances Entities
  balance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  balance.timeStampUnix = event.block.timestamp;
  balance.blockNumber = event.block.number;
  balance.transactionHash = event.transaction.hash;
  // Daily Balances Entities
  dayBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  dayBalance.timeStampUnix = event.block.timestamp;
  dayBalance.blockNumber = event.block.number;
  dayBalance.transactionHash = event.transaction.hash;

  // Daily L2 Total Supply Entities
  dayTotalSupply.timeStamp = timestampConvertDateTime(event.block.timestamp);
  dayTotalSupply.timeStampUnix = event.block.timestamp;
  dayTotalSupply.blockNumber = event.block.number;
  dayTotalSupply.transactionHash = event.transaction.hash;

  // Transfer Entities
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = digitsConvert(event.params.value);
  entity.count = entity.count.plus(BigInt.fromI32(1));
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  entity.save();
  balance.save();
  dayBalance.save();
  dayTotalSupply.save();
}
