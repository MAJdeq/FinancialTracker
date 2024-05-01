import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { createClient } from "@supabase/supabase-js";
import cactus from "../assets/cactus.svg";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { Separator } from "../components/ui/separator";

export default function Login({ setToken }) {
  const supbaseUrl = "https://cduizgpxirkaahnlnaip.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdWl6Z3B4aXJrYWFobmxuYWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2ODU1OTQsImV4cCI6MjAyODI2MTU5NH0.d_SQIqyRo6_dxN85nZlinEPDsoac4h2cH0XBKDA5YJE";
  const supabase = createClient(supbaseUrl, supabaseKey);

  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      setToken(data);
      navigate("/home");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <div class="background-container"></div>
      <div className="flex-container">
        <Card>
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Separator />
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                Log In
                <img
                  src={cactus}
                  style={{ height: "23px", width: "23px", marginLeft: "10px" }}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label style={{ marginTop: "10px" }} htmlFor="email">
                    Email
                  </Label>
                  <Input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label
                    style={{ marginTop: "10px" }}
                    className="pb-2"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button style={{ marginTop: "20px" }} type="submit">
                {" "}
                Submit{" "}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            Don't have an account?{" "}
            <Link
              style={{ marginLeft: "5px", textDecoration: "underline" }}
              to="/signup"
            >
              {" "}
              Sign Up{" "}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
