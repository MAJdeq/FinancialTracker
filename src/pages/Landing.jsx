import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import "../index.css";
import cactus from "../assets/cactus.svg";

const Landing = () => {
  return (
    <>
      <div class="background-container"></div>
      <div className="flex-container">
        <Card>
          <CardHeader>
            <CardTitle>Cash Cactus</CardTitle>
            <CardDescription>
              Use Cash Cactus for your own personal financial goals!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <Link to="/Login">
                <Button>Log In</Button>
              </Link>
              <Link to="/signup" style={{ marginLeft: "5px" }}>
                <Button>Sign Up</Button>
              </Link>
              <img
                style={{ height: "38px", width: "38px", marginLeft: "auto" }}
                src={cactus}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Landing;
