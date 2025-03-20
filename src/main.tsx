import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { Sidebar } from "./components/sidebar.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import NotFoundPage from "./notFound.tsx";
import UploadPage from "./upload/index.tsx";
import WatchVideo from "./watch/index.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <div className="bg-[#1d2838]/80 flex h-full w-full">
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Sidebar />
        <Routes>
          <Route index path="/" element={<App />} />
          <Route path="/watch" element={<WatchVideo />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </div>
);

