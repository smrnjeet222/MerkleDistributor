import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal
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
      <div className="container text-center m-auto my-4 text-4xl">
        Connecting...
      </div>
    );
  if (isDisconnected)
    return (
      <div className="container text-center m-auto my-4 text-4xl">
        Disconnected
      </div>
    );

  return <div className="container max-w-lg mx-auto">{props.children}</div>;
};

export default Layout;
