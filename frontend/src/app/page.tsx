"use client"

import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { type Post, postsAPI } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const fetchedPosts = await postsAPI.getAllPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (isLoading) {
    return <div className="container py-8 text-center">Loading posts...</div>
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Welcome to BlogSpace</h1>
        <p className="text-lg text-muted-foreground max-w-[700px] mb-6">
          A modern platform for sharing your thoughts, ideas, and stories with the world.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Display message if user is not logged in */}
      {!user && (
        <div className="mb-8 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md text-center">
          <p className="text-amber-800 dark:text-amber-200">You are not currently logged in</p>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            Please sign in or create an account to start posting.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">
              {!user 
                ? "Posts will appear here once you're connected." 
                : "No posts available. Be the first to create a post!"}
            </p>
            <div className="mt-4">
              {!user && (
                <Button asChild>
                  <Link href="/signup">Sign Up to Start Posting</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}