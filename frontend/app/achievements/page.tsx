import Link from "next/link";
import Image from "next/image";
import { achievements, ideas, users } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AchievementsPage() {
  const sortedAchievements = [...achievements].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  return (
    <div className="container py-8 animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Celebrate completed projects and their successful outcomes
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="participated">I Participated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-8">
          {sortedAchievements.map((achievement) => {
            const relatedIdea = ideas.find(idea => idea.id === achievement.ideaId);
            const teamMembers = achievement.teamMemberIds.map(id => users.find(user => user.id === id)!);
            
            return (
              <Card key={achievement.id} className="overflow-hidden hover-scale">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="relative h-64 md:h-auto md:col-span-1">
                    <Image
                      src={achievement.images[0]}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:col-span-2">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                          Achievement
                        </Badge>
                        {relatedIdea && (
                          <Badge variant="outline">
                            {relatedIdea.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{achievement.title}</CardTitle>
                      <CardDescription>
                        {new Date(achievement.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="mb-4 text-muted-foreground">
                        {achievement.description}
                      </p>
                      
                      <h4 className="font-medium mb-2">Team Members</h4>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.image} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      {relatedIdea && (
                        <div>
                          <h4 className="font-medium mb-2">Original Idea</h4>
                          <Link href={`/ideas/${relatedIdea.id}`}>
                            <Button variant="outline" size="sm">
                              {relatedIdea.title}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
        
        <TabsContent value="participated" className="space-y-8">
          {sortedAchievements
            .filter(achievement => achievement.teamMemberIds.includes("1"))
            .map((achievement) => {
              const relatedIdea = ideas.find(idea => idea.id === achievement.ideaId);
              const teamMembers = achievement.teamMemberIds.map(id => users.find(user => user.id === id)!);
              
              return (
                <Card key={achievement.id} className="overflow-hidden hover-scale">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-64 md:h-auto md:col-span-1">
                      <Image
                        src={achievement.images[0]}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:col-span-2">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                            My Achievement
                          </Badge>
                          {relatedIdea && (
                            <Badge variant="outline">
                              {relatedIdea.category}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{achievement.title}</CardTitle>
                        <CardDescription>
                          {new Date(achievement.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="mb-4 text-muted-foreground">
                          {achievement.description}
                        </p>
                        
                        <h4 className="font-medium mb-2">Team Members</h4>
                        <div className="flex flex-wrap gap-3 mb-6">
                          {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.image} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{member.name}</span>
                            </div>
                          ))}
                        </div>
                        
                        {relatedIdea && (
                          <div>
                            <h4 className="font-medium mb-2">Original Idea</h4>
                            <Link href={`/ideas/${relatedIdea.id}`}>
                              <Button variant="outline" size="sm">
                                {relatedIdea.title}
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
        </TabsContent>
      </Tabs>
    </div>
  );
}