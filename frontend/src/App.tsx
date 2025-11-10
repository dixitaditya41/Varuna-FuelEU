import { useState } from "react";
import { Layout } from "./adapters/ui/Layout";

// Pages

import { RoutesPage } from "./adapters/ui/routes/RoutesPage";
import { ComparePage } from "./adapters/ui/compare/ComparePage";
import { BankingPage } from "./adapters/ui/banking/BankingPage";
import { PoolingPage } from "./adapters/ui/pooling/PoolingPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("routes");

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "routes" && <RoutesPage />}
      {activeTab === "compare" && <ComparePage />}
      {activeTab === "banking" && <BankingPage />}
      {activeTab === "pooling" && <PoolingPage />}
    </Layout>
  );
}
