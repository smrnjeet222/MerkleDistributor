import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import { POPOO_HKS_SERVICE } from "../contracts";

const Records = () => {
  const { address } = useAccount();

  const getClaimsRecordsMutation = useMutation({
    mutationFn: (addrr: string) => {
      return axios.post(
        `${POPOO_HKS_SERVICE}/trade-service/trade/hks/getClaimsRecords`,
        {
          walletAddress: addrr,
        }
      );
    },
  });

  return (
    <>
      <div className="form-control w-full gap-4 py-6">
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
          disabled={getClaimsRecordsMutation.isLoading}
          onClick={() => {
            getClaimsRecordsMutation.mutate(address!);
          }}
        >
          get Claims Records
        </button>
        {getClaimsRecordsMutation.isSuccess && (
          <div className="bg-base-300 p-2 rounded-md">
            {JSON.stringify(getClaimsRecordsMutation.data, null, 2)}
          </div>
        )}
      </div>

      <div className="divider"></div>
    </>
  );
};

export default Records;
