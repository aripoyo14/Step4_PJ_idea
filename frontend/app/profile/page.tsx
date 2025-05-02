"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserById, getIdeasByAuthor, getAchievementsByTeamMember } from "@/lib/db";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  bio: z.string().max(300, {
    message: "Bio must not exceed 300 characters",
  }),
  skill: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  
  // セッションのローディング状態をチェック
  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // セッションが存在しない場合のハンドリング
  if (!session) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="text-muted-foreground">プロフィールを表示するにはログインしてください。</p>
        </div>
      </div>
    );
  }
  
  // In a real app, this would be fetched from an API
  const user = session?.user?.id ? getUserById(session.user.id) : null;
  const userIdeas = session?.user?.id ? getIdeasByAuthor(session.user.id) : [];
  const userAchievements = session?.user?.id ? getAchievementsByTeamMember(session.user.id) : [];
  
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      skill: "",
    },
  });
  
  function addSkill() {
    const skill = form.getValues("skill");
    if (skill && skill.trim() !== "" && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      form.setValue("skill", "");
    }
  }
  
  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would call an API to update the user profile
    console.log({
      ...values,
      skills,
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
      variant: "default",
    });
  }

  return (
    <div className="container py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center text-xl">{user?.name}</CardTitle>
                <CardDescription className="text-center">{user?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">User since</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Activity</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted rounded-md p-2">
                      <p className="text-2xl font-bold">{userIdeas.length}</p>
                      <p className="text-xs text-muted-foreground">Ideas Posted</p>
                    </div>
                    <div className="bg-muted rounded-md p-2">
                      <p className="text-2xl font-bold">{userAchievements.length}</p>
                      <p className="text-xs text-muted-foreground">Achievements</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell others about yourself..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description about your background, interests, and expertise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input placeholder="Add a skill" {...field} />
                          </FormControl>
                          <Button type="button" onClick={addSkill} className="flex-shrink-0">
                            Add
                          </Button>
                        </div>
                        <FormDescription>
                          Add skills that showcase your expertise
                        </FormDescription>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="gap-1">
                              {skill}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeSkill(skill)}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}