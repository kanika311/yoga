import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiSafe } from "@/lib/api";
import { PHOTOS } from "@/lib/constants";
import CTABand from "@/components/CTABand";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await apiSafe(`/api/blogs/${slug}`, null);
  return { title: post?.title || "Article" };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const post = await apiSafe(`/api/blogs/${slug}`, null);
  if (!post) notFound();

  return (
    <>
      <article>
        <div className="relative isolate min-h-[60vh]">
          <Image src={post.image || PHOTOS.nature} alt="" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-forest-deep/65" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 pb-16 pt-40 md:px-8">
            <p className="text-xs uppercase tracking-[0.28em] text-gold-soft">{post.category}</p>
            <h1 className="mt-3 font-serif text-4xl text-cream md:text-6xl">{post.title}</h1>
            <p className="mt-4 text-cream/80">
              {post.author} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
        <div className="section max-w-3xl">
          <Link href="/blog" className="text-sm text-gold-deep">
            ← All articles
          </Link>
          <p className="mt-6 text-lg text-forest-mid">{post.excerpt}</p>
          <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-forest-mid prose-headings:font-serif prose-headings:text-forest">
            {post.content}
          </div>
        </div>
      </article>
      <CTABand />
    </>
  );
}
