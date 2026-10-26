import Script from "next/script";
import { editorialText, type EditorialCopy } from "./editorialCopy";

interface NotesSectionProps {
  title: string;
  copy?: EditorialCopy;
}

export const DEFAULT_THREADS_POSTS = [
  "https://www.threads.com/@happywecant/post/DZkRRZvn4Zu",
  "https://www.threads.com/@happywecant/post/DZSdOKKn-Cl",
  "https://www.threads.com/@happywecant/post/DY_1saaH38o",
] as const;

export function validThreadsPostUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["threads.com", "www.threads.com"].includes(url.hostname) && /^\/@[^/]+\/post\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

function ThreadsPost({ url, index }: { url: string; index: number }) {
  const postId = new URL(url).pathname.split("/")[3];
  return (
    <div data-cms-field={`threads_post_${index + 1}_url`} className="min-w-0">
      <div className="relative max-h-[610px] overflow-hidden rounded-2xl border border-[#e0e3dd] bg-white">
        <blockquote
          id={`ig-tp-${postId}`}
          className="text-post-media m-0 min-w-0 rounded-2xl border border-black/10 bg-white p-6 text-center text-zinc-900"
          data-text-post-permalink={url}
          data-text-post-version="0"
        >
          <a href={url} target="_blank" rel="noopener noreferrer" className="block py-8 text-sm font-semibold underline underline-offset-4">
            在 Threads 查看貼文
          </a>
        </blockquote>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white" />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-[#3c6948] underline underline-offset-4 hover:text-[#203e28]">
        到 Threads 閱讀全文 ↗
      </a>
    </div>
  );
}

export function NotesSection({ title, copy }: NotesSectionProps) {
  const heading = editorialText(copy, "blog_title", title);
  const posts = DEFAULT_THREADS_POSTS.map((fallback, index) => {
    const value = editorialText(copy, `threads_post_${index + 1}_url`, fallback);
    return validThreadsPostUrl(value) ? value : fallback;
  });
  return (
    <section id="blog" data-cms-section="blog" className="scroll-mt-20 bg-[#f3f4f1] px-5 pb-28 text-[#202421] md:px-10">
      <div className="mx-auto max-w-[850px] border-t border-[#dfe4dd] pt-12 md:pt-16">
        <h2 data-cms-field="blog_title" style={{ textTransform: "none" }} className="text-[clamp(2rem,3.5vw,2.9rem)] font-semibold tracking-[-.05em]">{/^insights$/i.test(heading.trim()) ? "Insights" : heading}</h2>
        <p data-cms-field="blog_description" className="mb-9 mt-3 max-w-2xl text-sm leading-7 text-[#657168]">
          {editorialText(copy, "blog_description", "我偶爾把工作中遇到的問題、試過的方法和學到的東西記在 Threads。")}
        </p>
        <div className="threads-grid grid items-start gap-5 md:grid-cols-2">
          {posts.map((url, index) => <ThreadsPost key={`${index}-${url}`} url={url} index={index} />)}
        </div>
        <Script src="https://www.threads.com/embed.js" strategy="afterInteractive" />
      </div>
    </section>
  );
}
