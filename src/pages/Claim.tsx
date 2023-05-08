import { Contract, ContractInterface, errors, ethers } from "ethers";
import { useAccount } from "wagmi";
import MD_ABI from "../contracts/merkleDistributor.json";
import { MD_ADDRESS, POPOO_HKS_SERVICE } from "../contracts";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MerkleDistributor } from "../contracts/types";

interface Idata {
  amount: string;
  index: number;
  proof: string[];
  account: string;
  merkleRoot: string | null;
}

const Claim = () => {
  const { address, connector } = useAccount();

  const handleClaim = async (adr: string) => {
    const signer = connector?.getSigner();
    if (signer || !address) {
      throw new Error("Wallet no connected");
    }
    const mdContract = new Contract(
      MD_ADDRESS,
      MD_ABI as ContractInterface,
      signer
    ) as MerkleDistributor;

    const resp = await axios.post(
      `${POPOO_HKS_SERVICE}/trade-service/trade/hks/getMerkelInfo`,
      {
        walletAddress: adr,
      }
    );
    const d: Idata = resp.data.data;

    if (!d.merkleRoot)
      throw new Error("The return of Merkle tree data has not been reported");

    const tx = await mdContract.claim(
      d.index,
      adr,
      d.amount,
      d.proof
      // d.proof.map((x) => ethers.utils.formatBytes32String(x))
    );
    await tx.wait();

    return axios.post(
      `${POPOO_HKS_SERVICE}/trade-service/trade/hks/claimsAmount`,
      {
        walletAddress: adr,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const claimsAmountMutation = useMutation({ mutationFn: handleClaim });

  return (
    <>
      <div className="form-control w-full gap-4">
        <div>
          <label className="label">
            <span className="label-text">Your Wallet Address</span>
          </label>
          <input
            type="text"
            readOnly
            placeholder="Wallet Address"
            className="input input-bordered w-full"
            value={address}
          />
        </div>
        <button
          className="retro-btn btn btn-sm bg-inherit text-inherit hover:bg-inherit hover::text-inherit w-full disabled:loading "
          disabled={claimsAmountMutation.isLoading}
          onClick={() => {
            claimsAmountMutation.mutate(address!);
          }}
        >
          Claim
        </button>
        {claimsAmountMutation.isSuccess && (
          <div className="bg-base-300 p-2 rounded-md text-center uppercase font-semibold">
            {JSON.stringify(claimsAmountMutation.data, null, 2)}
          </div>
        )}
      </div>

      <div className="divider"></div>
    </>
  );
};

export default Claim;
