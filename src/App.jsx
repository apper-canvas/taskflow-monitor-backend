import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import ArchivePage from "@/components/pages/ArchivePage";
import React from "react";

function App() {
  return (
    <Router>
      <div className="App">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="today" element={<Dashboard filter="today" />} />
            <Route path="upcoming" element={<Dashboard filter="upcoming" />} />
            <Route path="list/:listId" element={<Dashboard />} />
            <Route path="archive" element={<ArchivePage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;