import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { Route, Routes } from "react-router-dom";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Layout from "./Layout";
import Navbar from "./components/Navbar";
import useSticky from "./hooks/useSticky";
import Balances from "./pages/Balances";
import Claim from "./pages/Claim";
import Records from "./pages/Records";

const { provider } = configureChains([bscTestnet], [publicProvider()]);

const client = createClient(
  getDefaultClient({
    appName: "MerkleDistributor",
    autoConnect: true,
    provider,
    chains: [bscTestnet],
  })
);
const queryClient = new QueryClient();

const App = () => {
  const { isSticky } = useSticky();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        <ConnectKitProvider
          theme="retro"
          onDisconnect={() => {
            window.localStorage.removeItem("input");
          }}
        >
          <Navbar isSticky={isSticky} />
          <Layout>
            <Routes>
              <Route path="/" element={<Balances />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="/records" element={<Records />} />
            </Routes>
          </Layout>
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default App;
