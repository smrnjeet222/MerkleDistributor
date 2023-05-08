import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";
import { useAccount } from "wagmi";

const Layout = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  const { isConnecting, isDisconnected } = useAccount();

  if (isConnecting)
    return (
      <div className="container text-center m-auto pt-32 text-4xl">
        Connecting...
      </div>
    );
  if (isDisconnected)
    return (
      <div className="container text-center m-auto pt-32 text-4xl">
        Wallet is Disconnected
      </div>
    );

  return (
    <div className="container max-w-lg mx-auto pt-32">{props.children}</div>
  );
};

export default Layout;
