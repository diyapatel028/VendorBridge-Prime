import { useState } from "react";
import { useListRfqs, getListRfqsQueryKey, useCreateRfq, useListVendors, getListVendorsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const rfqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Deadline is required"),
  estimatedValue: z.coerce.number().min(1, "Estimated value must be greater than 0"),
  vendorIds: z.array(z.number()).min(1, "Select at least one vendor"),
});

export default function Rfqs() {
  const { data: rfqs, isLoading } = useListRfqs({ query: { queryKey: getListRfqsQueryKey() } });
  const { data: vendors } = useListVendors({ query: { queryKey: getListVendorsQueryKey() } });
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const queryClient = useQueryClient();
  const createRfq = useCreateRfq();

  const form = useForm<z.infer<typeof rfqSchema>>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      deadline: "",
      estimatedValue: 0,
      vendorIds: [],
    },
  });

  const onSubmit = (values: z.infer<typeof rfqSchema>) => {
    createRfq.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRfqsQueryKey() });
          setIsAddOpen(false);
          form.reset();
        },
      }
    );
  };

  const filteredRfqs = rfqs?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Request for Quotations</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create RFQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New RFQ</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Q3 Laptop Procurement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief details about requirements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Value ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vendorIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Vendors (Hold Ctrl/Cmd to select multiple)</FormLabel>
                      <FormControl>
                        <select
                          multiple
                          className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                          value={field.value.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                            field.onChange(values);
                          }}
                        >
                          {vendors?.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createRfq.isPending}>
                    {createRfq.isPending ? "Creating..." : "Create RFQ"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search RFQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Estimated Value</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Quotations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRfqs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No RFQs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRfqs?.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell>
                          <div className="font-medium flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                            {rfq.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                            {rfq.description}
                          </div>
                        </TableCell>
                        <TableCell>{rfq.category}</TableCell>
                        <TableCell>
                          <Badge variant={
                            rfq.status === "Active" ? "default" : 
                            rfq.status === "Closed" ? "secondary" : 
                            "outline"
                          }>
                            {rfq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">${rfq.estimatedValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            {format(new Date(rfq.deadline), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {rfq.quotationCount || 0} / {rfq.vendorIds.length}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
