import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import NotFoundPage from "./notFound.tsx"
import WatchVideo from "./watch/index.tsx"
import { Sidebar } from "./components/sidebar.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <div className="bg-[#1d2838]/80 flex h-screen w-screen">
    <QueryClientProvider client={queryClient}>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/watch" element={<WatchVideo />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </div>
)

