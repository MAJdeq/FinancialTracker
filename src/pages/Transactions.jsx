import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "../components/ui/sheet";
import {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Transactions() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [transactions, setTransactions] = useState([]);

  const { account_id } = useParams();

  const [formData, setFormData] = useState({
    accountId: account_id,
    description: "",
    amount: 0,
    notes: "",
    is_deposit: false,
  });

  function handleChange(event) {
    console.log(event.target);
    const { id, name, value, ariaChecked } = event.target;
    if (id === "withdrawal") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: ariaChecked === "false", // Update based on input value or checkbox checked state
      }));
    } else if (id === "deposit") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        is_deposit: ariaChecked === "false", // Update based on input value or checkbox checked state
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Update based on input value or checkbox checked state
      }));
    }
  }

  async function updateAmount(number) {
    try {
      const { data, error } = await supabase
        .from("Accounts")
        .select("current_balance")
        .eq("account_id", account_id)
        .single();

      if (error) {
        console.error("Error fetching account amount:", error.message);
        return;
      }

      const currentAmount = data.current_balance;
      console.log(currentAmount);
      const updatedAmount = formData.is_deposit
        ? parseFloat(currentAmount) + parseFloat(number)
        : parseFloat(currentAmount) - parseFloat(number);

      try {
        const { data, error } = await supabase
          .from("Accounts")
          .update({ current_balance: updatedAmount })
          .eq("account_id", account_id);

        if (error) {
          console.error("Error updating account balance:", error.message);
        } else {
          console.log("Account balance updated successfully");
          console.log("Updated data:", data);
        }
      } catch (error) {
        console.error("Error updating account balance:", error.message);
      }
    } catch (error) {
      console.error("Error updating account amount:", error.message);
    }
  }

  function addTransaction(e) {
    e.preventDefault();
    supabase
      .from("Transactions")
      .insert([
        {
          account_id: formData.accountId,
          description: formData.description,
          amount: formData.amount,
          notes: formData.notes,
          is_deposit: formData.is_deposit,
        },
      ])
      .then(async () => {
        fetchTransactions();
        // Fetch the current account balance
        await supabase
          .from("Accounts")
          .select("current_balance")
          .eq("account_id", account_id)
          .single();

        updateAmount(formData.amount);

        // Fetch updated transactions after adding a new one

        // Clear the form data after successful insertion
        setFormData({
          accountId: account_id,
          description: "",
          amount: 0,
          notes: "",
          is_deposit: false,
        });
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
      });
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  function fetchTransactions() {
    supabase
      .from("Transactions")
      .select("*")
      .eq("account_id", account_id)
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.message);
      });
  }

  return (
    <>
      <div class="background-container"></div>
      <div className="flex-container">
        <Card style={{ width: "60%", height: "60%" }}>
          <CardHeader>
            <Link to="/home">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex">
              <CardTitle style={{ fontSize: "40px" }}>
                Transaction History
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    {/* <TableCell
                      className={`font-medium ${
                        transaction.is_deposit ? "deposit" : "withdrawal"
                      }`}
                    >
                      ${transaction.amount}
                    </TableCell> */}
                    <TableCell className="font-medium">
                      {transaction.is_deposit ? (
                        <div className="deposit">+${transaction.amount}</div>
                      ) : (
                        <div className="withdrawal">-${transaction.amount}</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.notes}
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
                  <Button>Log Transaction</Button>
                </div>
              </SheetTrigger>
              <SheetContent>
                <form onSubmit={addTransaction} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Transaction Description
                    </Label>
                    <Input
                      name="description"
                      placeholder="Transaction Description"
                      className="col-span-3"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Transaction Amount</Label>
                    <Input
                      name="amount"
                      placeholder="Transaction Amount"
                      className="col-span-3"
                      type="number"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Notes</Label>
                    <Input
                      name="notes"
                      placeholder="Notes"
                      className="col-span-3"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox
                      id="deposit"
                      name="deposit"
                      onClick={(event) => {
                        handleChange(event);
                      }}
                    />

                    <div className="grid gap-1.5 leading-none">
                      <label
                        style={{ marginLeft: "4px" }}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Is Deposited?
                      </label>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button type="submit">Add</Button>
                  </SheetClose>
                </form>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
