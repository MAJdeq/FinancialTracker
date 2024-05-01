import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../components/ui/button";
import { createClient } from "@supabase/supabase-js";
export default function DataTable(transactions) {
  const allTransactions = transactions.transactions;
  const supbaseUrl = "https://cduizgpxirkaahnlnaip.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdWl6Z3B4aXJrYWFobmxuYWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2ODU1OTQsImV4cCI6MjAyODI2MTU5NH0.d_SQIqyRo6_dxN85nZlinEPDsoac4h2cH0XBKDA5YJE";
  const supabase = createClient(supbaseUrl, supabaseKey);

  async function handleDelete(transactionId) {
    try {
      const { error } = await supabase
        .from("Transactions")
        .delete()
        .eq("transaction_id", transactionId);

      if (error) {
        console.error("Error deleting transaction:", error.message);
      } else {
        console.log("Transaction deleted successfully");
        // Optionally, you can update the list of accounts after deletion
      }
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    }
  }
  return (
    <div>
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
          {allTransactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell
                className={`font-medium ${
                  transaction.is_deposit ? "deposit" : "withdrawal"
                }`}
              >
                ${transaction.amount}
              </TableCell>
              <TableCell className="font-medium">{transaction.notes}</TableCell>
              <Button
                style={{ marginLeft: "5px" }}
                variant="destructive"
                onClick={() => handleDelete(transaction.transaction_id)}
              >
                Delete
              </Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
