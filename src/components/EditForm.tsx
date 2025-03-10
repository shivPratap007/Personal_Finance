"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { Ttransaction } from "@/app/transactions/page"; // Update this path to match your project structure

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.date(),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.enum([
    "Food",
    "Rent",
    "Entertainment",
    "Transport",
    "Housing",
    "Other",
  ]),
});

export default function EditForm({
  editDetails,
  setCounter,
  setIsOpen,
}: {
  editDetails: Ttransaction;
  setCounter: Dispatch<SetStateAction<number>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: editDetails?.amount || 0,
      date: editDetails?.date ? new Date(editDetails.date) : new Date(),
      description: editDetails?.description || "",
      category: editDetails?.category || "Other",
    },
  });

  async function onSubmit(values: any) {
    try {
      const response = await axios.put(
        `/api/transactions/${editDetails._id}`,
        values
      );
      if (response.status === 200) {
        toast.success("Transaction updated successfully");
        setCounter((prev) => prev + 1);
        setIsOpen(false); // Close the modal after successful update
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full bg-white rounded-lg"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Enter the expense amount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-xs">
                  Select the date of your expense
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Grocery shopping" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Brief description of the expense
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Select the expense category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}