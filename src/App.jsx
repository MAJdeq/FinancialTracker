import "./index.css";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { useEffect, useState } from "react";
import Transactions from "./pages/Transactions";

export default function App() {
  const [token, setToken] = useState(false);

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/login"} element={<Login setToken={setToken} />} />
        {token ? (
          <>
            <Route path={"/home"} element={<Homepage token={token} />} />
            <Route
              path={"/transactions/:account_id"}
              element={<Transactions />}
            />
          </>
        ) : (
          ""
        )}
      </Routes>
    </div>
  );
}
