import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { apiSafe } from "@/lib/api";
import { PHOTOS } from "@/lib/constants";

export const metadata = { title: "Blogs" };

export default async function BlogPage() {
  const posts = await apiSafe("/api/blogs", []);

  return (
    <>
      <PageHero
        image={PHOTOS.lotus}
        eyebrow="Blogs"
        title="Guides for pregnancy, rest and nourishment"
        subtitle="Clear, practical writing from the MummaMove studio — prenatal yoga, sleep, nutrition and recovery."
      />
      <section className="section">
        {posts.length === 0 ? (
          <p className="text-forest-mid">Articles will appear here once published in the CMS.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group card">
                <div className="relative h-56">
                  <Image src={post.image || PHOTOS.nature} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width:1024px) 30vw, 100vw" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{post.category}</p>
                  <h2 className="mt-2 font-serif text-2xl text-forest group-hover:text-forest-mid">{post.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-forest-mid">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
