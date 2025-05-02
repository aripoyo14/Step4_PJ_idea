import Link from "next/link";
import { ideas, users } from "@/lib/db";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters } from "@/components/ideas/idea-filters";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IdeasPage() {
  const sortedIdeas = [...ideas].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">アイデアボード</h1>
          <p className="text-lg text-gray-600">
            実現したいアイデアを見つけ、共に創る仲間とつながろう
          </p>
        </div>
        <Link href="/ideas/post">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <PlusIcon className="mr-2 h-4 w-4" />
            アイデアを投稿
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="ideas" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100 p-1 rounded-lg lg:hidden">
            <TabsTrigger value="ideas" className="rounded px-3 py-1.5">アイデア</TabsTrigger>
            <TabsTrigger value="filters" className="rounded px-3 py-1.5">フィルター</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block">
            <IdeaFilters />
          </div>
          
          <TabsContent value="filters" className="lg:hidden">
            <IdeaFilters />
          </TabsContent>
          
          <div className="lg:col-span-3">
            <div className="grid gap-6">
              {sortedIdeas.map((idea) => {
                const author = users.find(user => user.id === idea.authorId);
                return (
                  <IdeaCard 
                    key={idea.id}
                    idea={idea}
                    author={author!}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}