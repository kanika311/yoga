import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Program from "@/models/Program";
import FAQ from "@/models/FAQ";
import Testimonial from "@/models/Testimonial";
import Settings from "@/models/Settings";

export async function getBlogs() {
  try {
    await connectDB();
    const items = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("getBlogs error:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    await connectDB();
    const item = await Blog.findOne({ slug, published: true }).lean();
    if (!item) return null;
    // Increment view count asynchronously
    Blog.updateOne({ slug }, { $inc: { views: 1 } }).catch(() => {});
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("getBlogBySlug error:", error);
    return null;
  }
}

export async function getPrograms(fallback: any[] = []) {
  try {
    await connectDB();
    const items = await Program.find({ published: { $ne: false } }).sort({ order: 1 }).lean();
    if (!items || items.length === 0) return fallback;
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("getPrograms error:", error);
    return fallback;
  }
}

export async function getProgramBySlug(slug: string, fallback: any = null) {
  try {
    await connectDB();
    const item = await Program.findOne({ slug, published: { $ne: false } }).lean();
    if (!item) return fallback;
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("getProgramBySlug error:", error);
    return fallback;
  }
}

export async function getFAQs(fallback: any[] = []) {
  try {
    await connectDB();
    const items = await FAQ.find({ published: { $ne: false } }).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("getFAQs error:", error);
    return fallback;
  }
}

export async function getTestimonials(fallback: any[] = []) {
  try {
    await connectDB();
    const items = await Testimonial.find({
      published: { $ne: false },
      status: { $nin: ["pending", "rejected"] },
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("getTestimonials error:", error);
    return fallback;
  }
}

export async function getSettings() {
  try {
    await connectDB();
    const item = await Settings.findOne().lean();
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("getSettings error:", error);
    return null;
  }
}
