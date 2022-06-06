# SPA L1/L2 Subgraph
This subgraph Contains the following sections:
- SPA/wSPA ETH L1 Analytics.
- SPA Arbitrum L2 Analytics.
- SPA Arbitrum L2 Farm

## 1- SPA/wSPA ETH L1 Analytics
 
The subgraph contains the following events:
- SPA L1 Transfers.
- wSPA L1 Transfers.
- SPA L1 Total Supply (per event & daily).
- wSPA L1 Total Supply (per event & daily).
- Circulating supply SPA L1 Balances (per event & daily).
- Circulating supply wSPA L1 Balances (per event & daily).
  
[LINK](https://thegraph.com/hosted-service/subgraph/sperax/spa-ethereum-l1)

## 2- SPA L2 Arbitrum Analytics
The subgraph contains the following events:
- SPA L2 Transfers.
- SPA L2 Total Supply (per event & daily).
- Circulating supply SPA L2 Balances (per event & daily).
  
[LINK](https://thegraph.com/hosted-service/subgraph/sperax/spa-arbitrum-l2)

## 3- SPA L2 Farm Analytics
The subgraph contains the following events:
- SPA L2 Farm Stake.
- SPA L2 Farm Withdraw.
  
[LINK](https://thegraph.com/hosted-service/subgraph/sperax/spa-arbitrum-l2)

# Deployement
To deploy the subgraphs on a [local node](https://github.com/graphprotocol/graph-node) here are the following commands:
- For ETH L1 network
  
```
 yarn codegen-l1
 yarn create-local-l1
 yarn deploy-local-l1
 ```
 - For Arbitrum L2 Network
  ```
 yarn codegen-l2
 yarn create-local-l2
 yarn deploy-local-l2
 ```