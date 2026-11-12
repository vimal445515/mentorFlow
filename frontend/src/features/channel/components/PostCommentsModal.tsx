import { useEffect, useState, type FormEvent, type FC } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Modal } from "@/shared/components/modal";
import { createPostComment, listPostComments } from "../api/postInteractionApi";
import type { PostComment } from "../types/channelContent.types";

interface PostCommentsModalProps {
  postId: string | null;
  postTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded: (postId: string) => void;
}

const MAX_COMMENT_LENGTH = 2_000;

interface PostCommentLoadResult {
  postId: string;
  attempt: number;
  comments?: PostComment[];
  error?: string;
}

export const PostCommentsModal: FC<PostCommentsModalProps> = ({
  postId,
  postTitle,
  isOpen,
  onClose,
  onCommentAdded,
}) => {
  const [loadResult, setLoadResult] = useState<PostCommentLoadResult | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [draftState, setDraftState] = useState({ postId: "", value: "" });
  const [submitErrorState, setSubmitErrorState] = useState({ postId: "", message: "" });
  const [submittingPostId, setSubmittingPostId] = useState<string | null>(null);
  const isCurrentLoad = loadResult?.postId === postId && loadResult.attempt === loadAttempt;
  const comments = isCurrentLoad ? (loadResult.comments ?? []) : [];
  const loadError = isCurrentLoad ? (loadResult.error ?? "") : "";
  const loading = Boolean(isOpen && postId && !isCurrentLoad);
  const draft = postId && draftState.postId === postId ? draftState.value : "";
  const submitError = postId && submitErrorState.postId === postId ? submitErrorState.message : "";
  const isSubmitting = postId === submittingPostId;

  useEffect(() => {
    if (!isOpen || !postId) return;

    const controller = new AbortController();
    void listPostComments(postId, controller.signal)
      .then((loadedComments) => {
        setLoadResult({ postId, attempt: loadAttempt, comments: loadedComments });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadResult({
          postId,
          attempt: loadAttempt,
          error: error instanceof Error ? error.message : "Could not load comments.",
        });
      });

    return () => controller.abort();
  }, [isOpen, loadAttempt, postId]);

  function handleClose() {
    setLoadAttempt((attempt) => attempt + 1);
    setDraftState({ postId: "", value: "" });
    setSubmitErrorState({ postId: "", message: "" });
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!postId || isSubmitting || loading) return;

    const commentText = draft.trim();
    if (!commentText) {
      setSubmitErrorState({ postId, message: "Write a comment before sending." });
      return;
    }
    if (commentText.length > MAX_COMMENT_LENGTH) {
      setSubmitErrorState({
        postId,
        message: `Comments must be ${MAX_COMMENT_LENGTH} characters or fewer.`,
      });
      return;
    }

    setSubmittingPostId(postId);
    setSubmitErrorState({ postId, message: "" });
    try {
      const comment = await createPostComment(postId, commentText);
      setLoadResult((current) => ({
        postId,
        attempt: loadAttempt,
        comments: [
          ...(current?.postId === postId && current.attempt === loadAttempt
            ? (current.comments ?? [])
            : []),
          comment,
        ],
      }));
      setDraftState({ postId, value: "" });
      onCommentAdded(postId);
    } catch (error) {
      setSubmitErrorState({
        postId,
        message: error instanceof Error ? error.message : "Could not send your comment.",
      });
    } finally {
      setSubmittingPostId((current) => (current === postId ? null : current));
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Comments"
      subtitle={postTitle}
      className="m-auto max-h-[85vh] w-[min(90vw,42rem)] overflow-hidden rounded-2xl border-0 bg-white p-0 text-stone-900 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex max-h-[75vh] flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {loading && <p className="text-sm text-stone-500">Loading comments...</p>}
          {loadError && (
            <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}
          {!loading && !loadError && comments.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-stone-500">
              <MessageSquare className="h-6 w-6" aria-hidden="true" />
              <p className="text-sm">No comments yet. Start the conversation.</p>
            </div>
          )}
          {comments.map((comment) => (
            <article key={comment.commentId} className="flex gap-3">
              {comment.authorImageUrl ? (
                <img
                  src={comment.authorImageUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-600"
                >
                  {comment.authorName.trim().charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="min-w-0 flex-1 rounded-xl bg-stone-50 px-4 py-3">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-stone-900">{comment.authorName}</span>
                  <time className="text-xs text-stone-500" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-stone-700">
                  {comment.commentText}
                </p>
              </div>
            </article>
          ))}
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="border-t border-stone-200 p-5"
        >
          <label htmlFor="post-comment" className="mb-2 block text-sm font-semibold text-stone-800">
            Add a comment
          </label>
          <textarea
            id="post-comment"
            value={draft}
            onChange={(event) => {
              if (postId) setDraftState({ postId, value: event.target.value });
            }}
            maxLength={MAX_COMMENT_LENGTH}
            rows={3}
            placeholder="Share your thoughts..."
            aria-describedby="post-comment-help"
            aria-invalid={Boolean(submitError)}
            className="w-full resize-y rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#3D6946] focus:ring-2 focus:ring-[#3D6946]/15"
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            <span id="post-comment-help" className="text-xs text-stone-500">
              {draft.trim().length}/{MAX_COMMENT_LENGTH}
            </span>
            <button
              type="submit"
              disabled={isSubmitting || loading || !draft.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3D6946] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2F5337] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
          {submitError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {submitError}
            </p>
          )}
        </form>
      </div>
    </Modal>
  );
};
