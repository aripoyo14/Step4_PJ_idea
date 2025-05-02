import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ideas, users, achievements } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, UsersIcon, MessageSquare } from "lucide-react";
import { ProjectResources } from "./components/project-resources";
import { RepoAnalysis } from "./components/repo-analysis";

interface IdeaPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return ideas.map((idea) => ({
    id: idea.id,
  }));
}

export default function IdeaPage({ params }: IdeaPageProps) {
  const idea = ideas.find((idea) => idea.id === params.id);
  
  if (!idea) {
    notFound();
  }
  
  const author = users.find((user) => user.id === idea.authorId)!;
  const relatedAchievement = achievements.find((achievement) => achievement.ideaId === idea.id);
  const teamMembers = idea.joinRequests
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean);
  
  const statusColors = {
    'open': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-gray-100 text-gray-800',
  };
  
  const statusText = {
    'open': '募集中',
    'in-progress': '進行中',
    'completed': '完了',
  };

  return (
    <div className="container py-8 animate-in">
      <Card className="mb-8">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={author.image} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{author.name}</h2>
                <p className="text-sm text-muted-foreground">
                  投稿日: {idea.createdAt.toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
            <Badge className={statusColors[idea.status]}>
              {statusText[idea.status]}
            </Badge>
          </div>
          
          <div>
            <CardTitle className="text-3xl mb-2">{idea.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{idea.category}</Badge>
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {idea.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <HeartIcon className="h-4 w-4" />
                <span>{idea.likes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>4</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">プロジェクトの詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">チームメンバー</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={author.image} alt={author.name} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">リーダー</p>
                    </div>
                  </div>
                  {teamMembers.map((member) => (
                    <div key={member!.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member!.image} alt={member!.name} />
                        <AvatarFallback>{member!.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member!.name}</p>
                        <p className="text-xs text-muted-foreground">メンバー</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">必要なスキル</h3>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">プロジェクトリソース</CardTitle>
              <CardDescription>
                開発に関連するリソースとドキュメント
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectResources ideaId={params.id} />
            </CardContent>
          </Card>
        </div>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">ディスカッション</CardTitle>
            <CardDescription>
              プロジェクトについて質問や提案を共有しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">GitHubリポジトリ分析</h3>
                <RepoAnalysis ideaId={params.id} />
              </div>
              <div className="text-center text-muted-foreground py-8">
                まだコメントはありません
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {relatedAchievement && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">プロジェクトの成果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-4">{relatedAchievement.title}</h3>
                <p className="text-muted-foreground">
                  {relatedAchievement.description}
                </p>
              </div>
              <div className="grid gap-4 grid-cols-2">
                {relatedAchievement.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={image}
                      alt={`Achievement ${index + 1}`}
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}