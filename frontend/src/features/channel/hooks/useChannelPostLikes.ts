import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { likeChannelPost, unlikeChannelPost } from "../api/postInteractionApi";
import type { ChannelPost } from "../types/channelContent.types";

type ShowToast = (message: string, type?: "success" | "error" | "info", title?: string) => void;

export function useChannelPostLikes(
  setPosts: Dispatch<SetStateAction<ChannelPost[]>>,
  showToast: ShowToast,
) {
  const pendingRef = useRef(new Set<string>());
  const [pendingPostIds, setPendingPostIds] = useState<Record<string, boolean>>({});

  const toggleLike = useCallback(
    async (post: ChannelPost) => {
      if (pendingRef.current.has(post.postId)) return;
      pendingRef.current.add(post.postId);
      setPendingPostIds((current) => ({ ...current, [post.postId]: true }));

      try {
        const engagement = post.isLiked
          ? await unlikeChannelPost(post.postId)
          : await likeChannelPost(post.postId);
        setPosts((current) =>
          current.map((item) => (item.postId === post.postId ? { ...item, ...engagement } : item)),
        );
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Could not update your like.",
          "error",
          "Like Failed",
        );
      } finally {
        pendingRef.current.delete(post.postId);
        setPendingPostIds((current) => ({ ...current, [post.postId]: false }));
      }
    },
    [setPosts, showToast],
  );

  return { toggleLike, pendingPostIds };
}
