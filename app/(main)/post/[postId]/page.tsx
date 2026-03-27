"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { PostModal } from "@/components/post/PostModal";
import { PostService } from "@/services/post.service";
import { PostType } from "@/types/post.types";

interface Props {
  params: { postId: string };
}

export default async function PostPage({ params }: Props) {
  let post: PostType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${params.postId}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      notFound();
    }

    const data = await res.json();
    post = data.post;
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return <PostModal post={post} />;
}
