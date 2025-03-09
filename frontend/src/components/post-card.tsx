import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: string;
};

export function PostCard({ post }: { post: Post }) {
    const formatDate = () => {
        try {
          return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
        } catch (error) {
          console.error("Date formatting error:", error);
          return "recently"; // fallback text
        }
      };
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-4">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t bg-muted/40 p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            {/* <p className="font-medium">{post.authorEmail.split("@")[0]}</p> */}
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="mr-1 h-3 w-3" />
          {formatDate()}
        </div>
      </CardFooter>
    </Card>
  );
}
