"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({ 
  onUpload, 
  accept = ".pdf,.doc,.docx,.ppt,.pptx", 
  maxSize = 5 * 1024 * 1024 // 5MB
}: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type && !file.name.includes('.')) {
      toast({
        title: "エラー",
        description: "ファイル形式が不正です",
        variant: "destructive",
      });
      return;
    }

    if (!accept.split(',').some(type => file.name.toLowerCase().endsWith(type.toLowerCase()))) {
      toast({
        title: "エラー",
        description: "このファイル形式はサポートされていません",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "エラー",
        description: `ファイルサイズは${Math.floor(maxSize / 1024 / 1024)}MB以下にしてください`,
        variant: "destructive",
      });
      return;
    }

    onUpload(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <UploadIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            ドラッグ&ドロップまたはクリックしてアップロード
          </p>
          <p className="text-xs text-muted-foreground">
            最大{Math.floor(maxSize / 1024 / 1024)}MBまで
          </p>
        </div>
        <Input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Label htmlFor="file-upload">
          <Button type="button" variant="outline" size="sm">
            ファイルを選択
          </Button>
        </Label>
      </div>
    </div>
  );
}