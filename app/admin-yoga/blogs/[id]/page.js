"use client";

import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlog() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl text-forest">Edit article</h1>
      <BlogForm id={id} />
    </div>
  );
}
