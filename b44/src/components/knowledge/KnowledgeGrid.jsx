import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Globe, 
  Type, 
  MoreVertical, 
  Eye, 
  Trash2,
  Calendar,
  Hash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusColors = {
  uploaded: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200", 
  active: "bg-green-100 text-green-700 border-green-200",
  failed: "bg-red-100 text-red-700 border-red-200"
};

const contentTypeIcons = {
  pdf: { icon: FileText, color: "text-red-600", bg: "bg-red-50" },
  website: { icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
  text: { icon: Type, color: "text-purple-600", bg: "bg-purple-50" }
};

export default function KnowledgeGrid({ items, isLoading, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-20 h-6 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-slate-900 mb-2">No items found</h3>
        <p className="text-slate-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const typeConfig = contentTypeIcons[item.content_type] || contentTypeIcons.text;
        const IconComponent = typeConfig.icon;

        return (
          <Card key={item.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeConfig.bg}`}>
                  <IconComponent className={`w-6 h-6 ${typeConfig.color}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">
                {item.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(item.created_date), 'MMM d')}</span>
                </div>
                {item.word_count && (
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>{item.word_count.toLocaleString()} words</span>
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs text-slate-600 border-slate-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs text-slate-500 border-slate-200"
                    >
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {item.content && (
                <p className="text-sm text-slate-600 line-clamp-3">
                  {item.content.substring(0, 150)}...
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}   