import Link from "next/link";
import { ideas, achievements, users } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function MyPage() {
  // ユーザーIDは仮で"1"を使用
  const userId = "1";
  const user = users.find(u => u.id === userId)!;
  
  const userIdeas = ideas.filter(idea => 
    idea.authorId === userId || idea.joinRequests.includes(userId)
  );
  
  const userAchievements = achievements.filter(achievement => 
    achievement.teamMemberIds.includes(userId)
  );
  
  return (
    <div className="container mx-auto max-w-7xl py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">マイページ</h1>
      
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left sidebar - Profile and achievements */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-center">{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">自己紹介</h3>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">スキル</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">活動実績</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-2xl font-bold">{userIdeas.length}</p>
                      <p className="text-sm text-muted-foreground">アイデア投稿</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-2xl font-bold">{userAchievements.length}</p>
                      <p className="text-sm text-muted-foreground">達成プロジェクト</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近の実績</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="shrink-0">達成</Badge>
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.createdAt.toLocaleDateString("ja-JP")}
                  </p>
                  {achievement !== userAchievements[userAchievements.length - 1] && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right content - Projects */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>参加プロジェクト</CardTitle>
              <CardDescription>
                現在参加中のプロジェクトと完了したプロジェクト
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="active">進行中</TabsTrigger>
                  <TabsTrigger value="completed">完了</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                  {userIdeas
                    .filter(idea => idea.status !== "completed")
                    .map(idea => {
                      const author = users.find(user => user.id === idea.authorId)!;
                      const teamMembers = idea.joinRequests
                        .map(id => users.find(user => user.id === id))
                        .filter(Boolean);
                      
                      return (
                        <Card key={idea.id} className="hover:bg-muted/50 transition-colors">
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{idea.category}</Badge>
                              <Badge 
                                className={
                                  idea.status === "open" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {idea.status === "open" ? "募集中" : "進行中"}
                              </Badge>
                            </div>
                            <Link href={`/ideas/${idea.id}`}>
                              <CardTitle className="text-lg hover:text-primary">
                                {idea.title}
                              </CardTitle>
                            </Link>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">進捗状況</h4>
                                <Progress value={idea.status === "open" ? 20 : 60} className="h-2" />
                                <p className="text-sm text-muted-foreground mt-2">
                                  {idea.status === "open" ? "チーム編成中" : "開発進行中"}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">チームメンバー</h4>
                                <div className="flex -space-x-2">
                                  <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src={author.image} alt={author.name} />
                                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {teamMembers.map(member => (
                                    <Avatar key={member!.id} className="h-8 w-8 border-2 border-background">
                                      <AvatarImage src={member!.image} alt={member!.name} />
                                      <AvatarFallback>{member!.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {userAchievements.map(achievement => {
                    const relatedIdea = ideas.find(idea => idea.id === achievement.ideaId)!;
                    
                    return (
                      <Card key={achievement.id} className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/20 text-primary">達成</Badge>
                            <Badge variant="outline">{relatedIdea.category}</Badge>
                          </div>
                          <Link href={`/ideas/${relatedIdea.id}`}>
                            <CardTitle className="text-lg hover:text-primary">
                              {achievement.title}
                            </CardTitle>
                          </Link>
                          <CardDescription>
                            完了日: {achievement.createdAt.toLocaleDateString("ja-JP")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground mb-4">
                            {achievement.description}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {achievement.images.map((image, index) => (
                              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Achievement ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}