"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, FileIcon, UploadIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function ProjectResources({ ideaId }: { ideaId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [repoUrl, setRepoUrl] = useState("https://github.com/example/project");
  const { toast } = useToast();

  const handleSaveRepo = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/repo-url`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_id: ideaId,
          repo_url: repoUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リポジトリURLの更新に失敗しました');
      }

      toast({
        title: "保存完了",
        description: "GitHubリポジトリのURLが更新されました",
        variant: "default",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "リポジトリURLの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">ソースコード</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="repo-url">GitHubリポジトリのURL</Label>
            <div className="flex gap-2">
              <Input
                id="repo-url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
              <Button onClick={handleSaveRepo}>保存</Button>
            </div>
          </div>
        ) : (
          <a 
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">GitHub リポジトリ</p>
              <p className="text-xs text-muted-foreground">{repoUrl.replace('https://github.com/', '')}</p>
            </div>
          </a>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">ドキュメント</h3>
          <Link href={`/ideas/${ideaId}/upload`}>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              アップロード
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          <a 
            href="#"
            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <FileIcon className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">プロジェクト概要.pdf</p>
              <p className="text-xs text-muted-foreground">2.1 MB</p>
            </div>
          </a>
          <a 
            href="#"
            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <FileIcon className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">技術仕様書.docx</p>
              <p className="text-xs text-muted-foreground">1.5 MB</p>
            </div>
          </a>
          <a 
            href="#"
            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <FileIcon className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">進捗報告.pptx</p>
              <p className="text-xs text-muted-foreground">3.2 MB</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}