import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Page from "@/models/Page";

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectToDatabase();
  const page = await Page.findOne({ slug: params.slug, isActive: true });

  if (!page) {
    return {
      title: "Page Not Found - CartShip",
    };
  }

  return {
    title: `${page.title} - CartShip`,
  };
}

export default async function CustomPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectToDatabase();
  const page = await Page.findOne({ slug: params.slug, isActive: true });

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="page-container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-outfit tracking-tight">
            {page.title}
          </h1>
          
          <div 
            className="prose prose-orange max-w-none font-jakarta text-gray-700 leading-relaxed
                       prose-headings:font-outfit prose-headings:font-bold prose-headings:text-gray-900
                       prose-a:text-[var(--orange)] prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-lg prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
