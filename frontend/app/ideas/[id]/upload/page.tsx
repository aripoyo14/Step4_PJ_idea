"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/projects/file-upload";
import { useToast } from "@/hooks/use-toast";

export default function UploadResourcePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // 実際のアプリケーションでは、ここでファイルをサーバーにアップロード
      await new Promise(resolve => setTimeout(resolve, 2000)); // アップロードのシミュレーション
      
      toast({
        title: "アップロード完了",
        description: "ファイルが正常にアップロードされました",
        variant: "default",
      });
      
      router.back();
    } catch (error) {
      toast({
        title: "エラー",
        description: "アップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 animate-in">
      <Card>
        <CardHeader>
          <CardTitle>リソースをアップロード</CardTitle>
          <CardDescription>
            プロジェクトに関連するドキュメントやファイルをアップロードできます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" placeholder="ファイルの説明（例：プロジェクト仕様書）" />
          </div>
          
          <div className="space-y-2">
            <Label>ファイル</Label>
            <FileUpload onUpload={handleUpload} />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={uploading}
            >
              キャンセル
            </Button>
            <Button disabled={uploading}>
              {uploading ? "アップロード中..." : "アップロード"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}