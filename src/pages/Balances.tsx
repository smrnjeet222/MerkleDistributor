import { Contract, ContractInterface, ethers } from "ethers";
import { useAccount } from "wagmi";
import MD_ABI from "../contracts/merkleDistributor.json";
import { MD_ADDRESS, POPOO_HKS_SERVICE } from "../contracts";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const Balances = () => {
  const getBalancesInfoMutation = useMutation({
    mutationFn: () => {
      return axios.post(`api/trade-service/trade/hks/getBalances`);
    },
  });

  useEffect(() => {
    getBalancesInfoMutation.mutate();
  }, []);

  return (
    <>
      <div className="flex flex-col w-full gap-4 py-6">
        {getBalancesInfoMutation.isLoading && (
          <progress className="progress w-full p-1" />
        )}
        {getBalancesInfoMutation.isSuccess &&
          Object.entries<string>(getBalancesInfoMutation.data.data.data).map(
            (d) => (
              <div className="bg-base-300 p-2 rounded-md" key={d[0]}>
                <span className="text-sm italic">Address: </span>
                <span className="font-semibold">{d[0]}</span>
                <div className="divider my-0" />
                <span className="text-sm italic">Balance: </span>
                <span className="font-semibold">
                  {ethers.utils.formatEther(d[1]).toString()}
                </span>
              </div>
            )
          )}
      </div>
    </>
  );
};

export default Balances;
