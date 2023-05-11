import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect } from "react";

const Balances = () => {
  // const getBalancesInfoMutation = useMutation({
  //   mutationFn: () => {
  //     return axios.post(`api/trade-service/trade/hks/getBalances`);
  //   },
  // });
  const getBalancesInfoMutation = useMutation({
    mutationFn: () => {
      return axios.get(
        `https://gnfd-testnet-sp-7.bnbchain.org/view/popoo/balances.json`
      );
    },
  });

  useEffect(() => {
    getBalancesInfoMutation.mutate();
  }, []);

  // console.log(JSON.stringify(getBalancesInfoMutation?.data?.data, null, 2));

  return (
    <>
      <div className="flex flex-col w-full gap-4 py-6">
        {getBalancesInfoMutation.isLoading && (
          <progress className="progress w-full p-1" />
        )}
        <div className="flex row justify-between">
          {/* <div className="bg-base-300 p-2 rounded-md">
            <a href="https://gnfd-testnet-sp-7.bnbchain.org/view/popoo/balances.json" target="_blank">
              Show balances on Greenfield &#128279;
            </a>
          </div> */}
          <div className="bg-base-300 p-2 rounded-md">
            <a href="https://gnfd-testnet-sp-7.bnbchain.org/view/popoo/merkel_proof.json" target="_blank">
              Show Merkle Tree on Greenfield &#128279;
            </a>
          </div>
        </div>
        {getBalancesInfoMutation.isSuccess &&
          Object.entries<string>(getBalancesInfoMutation.data.data).map((d) => (
            <div className="bg-base-300 p-2 rounded-md" key={d[0]}>
              <span className="text-sm italic">Address: </span>
              <span className="font-semibold">{d[0]}</span>
              <div className="divider my-0" />
              <span className="text-sm italic">Balance: </span>
              <span className="font-semibold">
                {ethers.utils.formatEther(d[1]).toString()}
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default Balances;
