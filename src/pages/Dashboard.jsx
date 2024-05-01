import React from "react";
import "../index.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import cactus from "../assets/cactus.svg";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export default function Dashboard({ token }) {
  const supbaseUrl = "https://cduizgpxirkaahnlnaip.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdWl6Z3B4aXJrYWFobmxuYWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2ODU1OTQsImV4cCI6MjAyODI2MTU5NH0.d_SQIqyRo6_dxN85nZlinEPDsoac4h2cH0XBKDA5YJE";
  const supabase = createClient(supbaseUrl, supabaseKey);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  const [formData, setFormData] = useState({
    account_name: "",
    current_balance: "",
    user_id: token.user.id,
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

  function addAccount() {
    supabase
      .from("Accounts")
      .insert([
        {
          account_name: formData.account_name,
          current_balance: formData.current_balance,
          user_id: formData.user_id,
        },
      ])
      .then((response) => {
        console.log("Account added successfully:", response);
        // Clear the form data after successful insertion
        setFormData({
          account_name: "",
          current_balance: "",
          user_id: token.user.id,
        });
      })
      .catch((error) => {
        console.error("Error adding account:", error);
      });
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  function fetchAccounts() {
    supabase
      .from("Accounts")
      .select("*")
      .eq("user_id", token.user.id)
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.message);
      });
  }

  async function handleDelete(accountId) {
    try {
      const { error } = await supabase
        .from("Accounts")
        .delete()
        .eq("account_id", accountId);

      if (error) {
        console.error("Error deleting account:", error.message);
      } else {
        console.log("Account deleted successfully");
        // Optionally, you can update the list of accounts after deletion
        fetchAccounts();
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  }

  return (
    <>
      <div class="background-container"></div>
      <div className="flex-container">
        <Card style={{ width: "60%", height: "60%" }}>
          <CardHeader>
            <div className="flex">
              <CardTitle style={{ fontSize: "40px" }}>Dashboard</CardTitle>
              <h2 className=" flex ml-auto">
                Welcome back {token.user.user_metadata.name}!
                <img
                  style={{ height: "20px", width: "20px", marginLeft: "5px" }}
                  src={cactus}
                />
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accounts" className="w-[400px]">
              <TabsList className=" flexgrid w-full grid-cols-2">
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="logout">Logout</TabsTrigger>
              </TabsList>
              <TabsContent value="accounts">
                <Table>
                  <TableCaption>A list of your accounts.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.account_id}>
                        <TableCell>{account.account_name}</TableCell>
                        <TableCell>${account.current_balance}</TableCell>
                        <TableCell>
                          <Link to={`/transactions/${account.account_id}`}>
                            <Button>Transaction</Button>
                          </Link>
                          <Button
                            style={{ marginLeft: "5px" }}
                            variant="destructive"
                            onClick={() => handleDelete(account.account_id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Sheet>
                  <SheetTrigger asChild>
                    <div
                      style={{ marginTop: "10px" }}
                      className="flex justify-center items-center"
                    >
                      <Button>Add Account</Button>
                    </div>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Add Account</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={addAccount} className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Account Name</Label>
                        <Input
                          name="account_name"
                          placeholder="Account Name"
                          className="col-span-3"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current_balance" className="text-right">
                          Current Balance
                        </Label>
                        <Input
                          onChange={handleChange}
                          name="current_balance"
                          placeholder="Current Balance"
                          className="col-span-3"
                          type="number"
                        />
                      </div>
                      <SheetClose asChild>
                        <Button type="submit">Add</Button>
                      </SheetClose>
                    </form>
                  </SheetContent>
                </Sheet>
              </TabsContent>
              <TabsContent value="logout">
                <Button onClick={handleLogout}>Logout</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
