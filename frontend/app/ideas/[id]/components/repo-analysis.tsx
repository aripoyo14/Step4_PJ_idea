"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeIcon, GitBranchIcon, StarIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RepoAnalysis {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  skill_analysis?: string;
}

interface RepoAnalysisProps {
  ideaId: string;
}

export function RepoAnalysis({ ideaId }: RepoAnalysisProps) {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/repo-analysis`);
      if (!response.ok) {
        throw new Error("リポジトリの分析結果を取得できませんでした");
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ideas/${ideaId}/analyze-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("リポジトリの分析に失敗しました");
      }

      toast({
        title: "分析完了",
        description: "GitHubリポジトリの分析が完了しました",
        variant: "default",
      });

      await fetchAnalysis();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : "リポジトリの分析に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [ideaId]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">分析中...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-destructive">{error}</div>
        <Button onClick={fetchAnalysis} disabled={loading}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          再分析
        </Button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">リポジトリが登録されていません</div>
        <Button onClick={fetchAnalysis} disabled={loading}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          分析を開始
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">リポジトリ分析結果</h3>
        <Button onClick={handleAnalyze} disabled={loading} size="sm">
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          再分析
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {analysis.languages.map((lang) => (
          <Badge key={lang} variant="secondary">
            {lang}
          </Badge>
        ))}
        {analysis.frameworks.map((framework) => (
          <Badge key={framework} variant="secondary">
            {framework}
          </Badge>
        ))}
        {analysis.databases.map((db) => (
          <Badge key={db} variant="secondary">
            {db}
          </Badge>
        ))}
        {analysis.tools.map((tool) => (
          <Badge key={tool} variant="secondary">
            {tool}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              使用言語
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.languages.map((lang) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm">{lang}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <StarIcon className="h-4 w-4" />
              技術スタック
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium mb-2">フレームワーク</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.frameworks.map((framework) => (
                    <Badge key={framework} variant="outline">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">データベース</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.databases.map((db) => (
                    <Badge key={db} variant="outline">
                      {db}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">ツール</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.tools.map((tool) => (
                    <Badge key={tool} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {analysis.skill_analysis && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              スキル分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{analysis.skill_analysis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 