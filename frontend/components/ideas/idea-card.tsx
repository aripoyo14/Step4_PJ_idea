"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Idea, User } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeartIcon, UsersIcon, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface IdeaCardProps {
  idea: Idea;
  author: User;
}

export function IdeaCard({ idea, author }: IdeaCardProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [joinCount, setJoinCount] = useState(idea.joinRequests.length);
  const [hasJoinRequested, setHasJoinRequested] = useState(false);
  
  const statusColors = {
    'open': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    toast({
      title: isLiked ? "Like removed" : "Idea liked",
      description: isLiked 
        ? "You have removed your like from this idea" 
        : "You have liked this idea",
    });
  };
  
  const handleJoinRequest = () => {
    setHasJoinRequested(!hasJoinRequested);
    setJoinCount(hasJoinRequested ? joinCount - 1 : joinCount + 1);
    
    toast({
      title: hasJoinRequested ? "Request withdrawn" : "Request sent",
      description: hasJoinRequested 
        ? "You have withdrawn your request to join this project" 
        : "Your request to join this project has been sent",
      variant: "default",
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.image} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{author.name}</div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(idea.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={`${
            idea.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
            idea.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-4 font-bold">{idea.title}</CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          {idea.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-600 line-clamp-3">
          {idea.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {idea.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleLike}
                >
                  <HeartIcon 
                    className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} 
                  />
                  <span>{likeCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? "Unlike this idea" : "Like this idea"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>4</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comment on this idea</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={hasJoinRequested ? "secondary" : "outline"} 
              size="sm"
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              {hasJoinRequested ? "Request Sent" : "Join Project"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join "{idea.title}"</DialogTitle>
              <DialogDescription>
                Send a request to join this project team. The project creator will review your request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">About this project</h4>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Project creator</h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={author.image} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{author.name}</div>
                    <div className="text-sm text-muted-foreground">{author.bio?.substring(0, 60)}...</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleJoinRequest();
                setIsDialogOpen(false);
              }}>
                {hasJoinRequested ? "Withdraw Request" : "Send Join Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}