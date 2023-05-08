import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { NavLink, Route, Routes } from "react-router-dom";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "./components/Navbar";
import Home from "./Layout";
import Claim from "./pages/Claim";
import Records from "./pages/Records";
import Balances from "./pages/Balances";
import Layout from "./Layout";

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
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        <ConnectKitProvider theme="retro">
          <Navbar />
          <div className="divider my-0" />
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
