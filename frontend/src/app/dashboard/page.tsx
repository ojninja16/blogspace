"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import { CreatePostForm } from "@/components/create-post-form"
import { Loader2, PlusCircle, FileText, Edit } from "lucide-react"
import { type Post, postsAPI } from "../../lib/api"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      // Load user posts
      fetchUserPosts()
    }
  }, [user])

  const fetchUserPosts = async () => {
    if (!user) return

    setIsLoadingPosts(true)
    try {
      // Fetch posts by the current user
      const posts = await postsAPI.getUserPosts(user.id)
      console.log("posts", posts)
      setUserPosts(posts)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleCreatePost = async (title: string, content: string) => {
    try {
      // Show loading state
      setIsLoadingPosts(true);
      
      // Create a new post
      const newPost = await postsAPI.createPost(title, content);
      
      // After creation, fetch all posts again to ensure consistency
      if (user) {
        const updatedPosts = await postsAPI.getUserPosts(user.id);
        setUserPosts(updatedPosts);
      } else {
        // Fallback if user context somehow isn't available
        setUserPosts([newPost, ...userPosts]);
      }
      
      // Reset UI state
      setIsCreatingPost(false);
      setActiveTab("posts");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.email.split("@")[0]}</p>
        </div>
        <Button
          onClick={() => {
            setIsCreatingPost(true)
            setActiveTab("create")
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts"
          >
            <FileText className="mr-2 h-4 w-4" /> My Posts
          </TabsTrigger>
          <TabsTrigger value="create">
            <Edit className="mr-2 h-4 w-4" /> Create Post
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {isLoadingPosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t created any posts yet. Create your first post now!
              </p>
              <Button
                onClick={() => {
                  setIsCreatingPost(true)
                  setActiveTab("create")
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Post
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="create" >
          <CreatePostForm onSubmit={handleCreatePost} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

