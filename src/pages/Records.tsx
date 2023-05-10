import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Records = () => {
  const { address } = useAccount();
  const [wallet, setWallet] = useLocalStorage<string>("input", address!);

  const getClaimsRecordsMutation = useMutation({
    mutationFn: (addrr: string) => {
      return axios.post(
        `api/trade-service/trade/hks/getClaimsRecords`,
        { walletAddress: addrr },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
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
        <button
          className="retro-btn btn btn-sm bg-inherit text-inherit hover:bg-inherit hover::text-inherit w-full disabled:loading "
          disabled={getClaimsRecordsMutation.isLoading}
          onClick={() => {
            getClaimsRecordsMutation.mutate(wallet);
          }}
        >
          get Claims Records
        </button>
        {getClaimsRecordsMutation.isError && (
          <div className="bg-primary p-2 rounded-md break-all ">
            {JSON.stringify(
              (getClaimsRecordsMutation.error as any)?.message,
              null,
              2
            )}
          </div>
        )}
        {getClaimsRecordsMutation.isSuccess &&
          !getClaimsRecordsMutation?.data.data.data.length && (
            <div className="bg-primary p-2 rounded-md break-all ">
              No Record
            </div>
          )}
        {getClaimsRecordsMutation.isSuccess &&
          getClaimsRecordsMutation.data.data.data.map((d: any) => (
            <div className="bg-base-300 p-2 rounded-md" key={d.id}>
              <span className="text-sm italic">Address: </span>
              <span className="font-semibold">{d.walletAddress}</span>
              <div className="divider my-0" />
              <span className="text-sm italic">Receive Amount: </span>
              <span className="font-semibold">
                {ethers.utils.formatEther(d.receiveAmount).toString()}
              </span>
              <div className="divider my-0" />
              <span className="text-sm italic">Date: </span>
              <span className="font-semibold">
                {new Date(d.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default Records;
