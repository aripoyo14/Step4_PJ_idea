"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, XIcon } from "lucide-react";

const categories = [
  "すべてのカテゴリー",
  "教育",
  "医療・健康",
  "テクノロジー",
  "Eコマース",
  "社会貢献",
  "環境",
  "金融",
  "エンターテイメント",
  "その他"
];

const statuses = [
  "すべてのステータス",
  "募集中",
  "進行中",
  "完了"
];

const popularTags = [
  "AI",
  "モバイルアプリ",
  "Webアプリ",
  "ブロックチェーン",
  "SNS",
  "サステナビリティ",
  "IoT",
  "教育",
  "ヘルスケア",
  "フィンテック"
];

export function IdeaFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべてのカテゴリー");
  const [selectedStatus, setSelectedStatus] = useState("すべてのステータス");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("すべてのカテゴリー");
    setSelectedStatus("すべてのステータス");
    setSelectedTags([]);
  };
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">フィルター</h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="アイデアを検索..."
            className="pl-10 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">カテゴリー</h3>
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <RadioGroupItem value={category} id={`category-${category}`} />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div>
          <h3 className="font-semibold mb-3">ステータス</h3>
          <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-3">
                  <RadioGroupItem value={status} id={`status-${status}`} />
                  <Label 
                    htmlFor={`status-${status}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div>
          <h3 className="font-semibold mb-3">人気のタグ</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag) 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {(searchQuery || selectedCategory !== "すべてのカテゴリー" || selectedStatus !== "すべてのステータス" || selectedTags.length > 0) && (
        <div className="pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-gray-500 w-full hover:bg-gray-100"
          >
            <XIcon className="mr-2 h-4 w-4" />
            フィルターをクリア
          </Button>
        </div>
      )}
    </div>
  );
}