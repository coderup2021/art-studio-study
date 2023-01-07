import { EthereumProvider } from "hardhat/types";

declare interface Window {
  ethereum: EthereumProvider;
}
