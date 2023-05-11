import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Contract, ContractInterface, ethers, logger } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";
import { MD_ADDRESS } from "../contracts";
import MD_ABI from "../contracts/merkleDistributor.json";
import { MerkleDistributor } from "../contracts/types";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Idata {
  amount: string;
  index: number;
  proof: string[];
  // account: string;
  // merkleRoot: string | null;
}

const Claim = () => {
  const { address, connector } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [wallet, setWallet] = useLocalStorage<string>("input", address!);

  const handleClaim = async (adr: string) => {
    const signer = await connector?.getSigner();

    if (!signer || !address) {
      throw new Error("Wallet no connected");
    }
    const mdContract = new Contract(
      MD_ADDRESS,
      MD_ABI as ContractInterface,
      signer
    ) as MerkleDistributor;

    // const resp = await axios.post(`api/trade-service/trade/hks/getMerkelInfo`, {
    //   walletAddress: adr,
    // });
    const resp = await axios.get(
      `https://gnfd-testnet-sp-7.bnbchain.org/view/popoo/merkel_proof.json`
    );
    const merkleRoot = resp.data.merkleRoot;
    const allClaims = resp.data.claims;

    const d: Idata = allClaims[adr];

    console.log(d);

    if (resp.data.code === 1) throw new Error(resp.data.message);

    if (!merkleRoot || !d?.proof || !d?.proof.length)
      throw new Error("The return of Merkle tree data has not been reported");

    if (!amount) throw new Error("Amount cannot be null");

    console.log(amount);
    console.log(ethers.utils.parseEther(amount).toString(), d.amount);

    if (ethers.utils.parseEther(amount).gt(d.amount))
      throw new Error(
        `Amount cannot be greater than current balance,
         Balance: ${ethers.utils.formatEther(d.amount).toString()}`
      );

    const tx = await mdContract.claim(
      d.index,
      adr,
      ethers.utils.parseEther(amount),
      d.proof
    );
    await tx.wait();

    // const resp2 = await axios.post(`api/trade-service/trade/hks/claimsAmount`, {
    //   walletAddress: adr,
    //   claimAmount: ethers.utils.parseEther(amount),
    // });
    // if (resp.data.code === 1) throw new Error(resp.data.message);

    // return resp2;
  };

  const claimsAmountMutation = useMutation({
    mutationFn: handleClaim,
  });

  return (
    <>
      <div className="form-control w-full gap-4 py-6">
        <div>
          <label className="label">
            <span className="label-text">Enter Wallet Address</span>
          </label>
          <input
            type="text"
            placeholder="Wallet Address"
            className="input input-bordered w-full"
            onChange={(e) => {
              setWallet(e.target.value);
            }}
            value={wallet}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Enter Amount</span>
          </label>
          <input
            type="text"
            placeholder="Amount"
            className="input input-bordered w-full"
            onChange={(e) => {
              if (e.target.value) {
                setAmount(e.target.value.trim().replace(/[^\d\.]/g, ""));
              } else {
                setAmount("");
              }
            }}
            value={amount}
          />
        </div>
        <button
          className="mt-6 retro-btn btn btn-sm bg-inherit text-inherit hover:bg-inherit hover::text-inherit w-full disabled:loading "
          disabled={claimsAmountMutation.isLoading}
          onClick={() => {
            claimsAmountMutation.mutate(wallet);
          }}
        >
          Claim
        </button>
        {claimsAmountMutation.isError && (
          <div className="bg-primary p-2 rounded-md break-all ">
            {JSON.stringify(
              (claimsAmountMutation.error as any)?.message,
              null,
              2
            )}
          </div>
        )}
        {claimsAmountMutation.isSuccess && (
          <div className="bg-base-300 p-2 rounded-md uppercase font-semibold">
            Claim Success 
            {/* Remaining Balance:{" "}
            {ethers.utils
              .formatEther(claimsAmountMutation.data?.data?.data?.balance)
              .toString()} */}
          </div>
        )}
      </div>

      <div className="divider"></div>
    </>
  );
};

export default Claim;
