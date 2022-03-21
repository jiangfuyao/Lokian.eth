import axios from "axios";

export async function getMandalaGasParams(rpc: string): Promise<{
  gasPrice: number;
  gasLimit: number;
}> {
  const res = (
    await axios.post(rpc, {
      id: 0,
      jsonrpc: "2.0",
      method: "eth_getEthGas",
      params: [{
          "gasLimit": 800000,
          "storageLimit": 1500
      }]
    })
  ).data.result;

  console.log(res)

  return {
    gasLimit: parseInt(res.gasLimit, 16),
    gasPrice: parseInt(res.gasPrice, 16),
  };
}