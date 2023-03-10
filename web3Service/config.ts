const chainId = 31337;

export const NetworkConfiguration = {
  chainId,
  nftAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  marketAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  params: [
    {
      chainId: "0x" + chainId.toString(16),
      rpcUrls: ["http://127.0.0.1:8545/"],
      chainName: "localhost-testnet",
      nativeCurrency: {
        name: "MYETH",
        symbol: "MYETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
  ],
};
export const rpcUrl = () => {
  return NetworkConfiguration.params[0].rpcUrls[0];
};

export const ipfsConfig = {
  protocol: "http",
  ip: "localhost",
  port: 8080,
  path: "ipfs",
};

export const getIpfsURL = (cid: string) => {
  const { protocol, ip, port, path } = ipfsConfig;
  return `${protocol}://${ip}:${port}/${path}/${cid}`;
};

export const arweaveConfig = {
  protocol: "http",
  host: "127.0.0.1",
  port: 1984,
};

export const getArweaveURL = (cid: string) => {
  const { protocol, host, port } = arweaveConfig;
  return `${protocol}://${host}:${port}/${cid}`;
};
