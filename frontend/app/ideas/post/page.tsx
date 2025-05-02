"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }).max(100, {
    message: "Title must not exceed 100 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }).max(1000, {
    message: "Description must not exceed 1000 characters",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  tag: z.string().optional(),
});

export default function PostIdeaPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tag: "",
    },
  });
  
  const [tags, setTags] = useState<string[]>([]);
  
  function addTag() {
    const tag = form.getValues("tag");
    if (tag && tag.trim() !== "" && !tags.includes(tag)) {
      setTags([...tags, tag]);
      form.setValue("tag", "");
    }
  }
  
  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would call an API to save the idea to the database
    console.log({
      ...values,
      tags,
    });
    
    toast({
      title: "アイデアを投稿しました",
      description: "アイデアが正常に投稿されました",
      variant: "default",
    });
    
    // Redirect to the ideas page
    router.push("/ideas");
  }

  return (
    <div className="container max-w-2xl py-12 animate-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Idea</CardTitle>
          <CardDescription>
            Share your project idea with the community and find collaborators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="A catchy title for your idea" {...field} />
                    </FormControl>
                    <FormDescription>
                      Be concise but descriptive to attract collaborators
                    </FormDescription>
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
                      <Textarea 
                        placeholder="Describe your idea in detail..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain the problem you're solving, target audience, and how it works
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Social Impact">Social Impact</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input placeholder="Add relevant tags" {...field} />
                      </FormControl>
                      <Button type="button" onClick={addTag} className="flex-shrink-0">
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Add relevant tags to help others find your idea
                    </FormDescription>
                    <FormMessage />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/ideas")}
                >
                  Cancel
                </Button>
                <Button type="submit">Post Idea</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}