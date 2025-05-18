
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";

const blogPosts = [
  {
    title: "Top 5 Tips for a Pet-Friendly Yard",
    description: "Learn how to create a safe and enjoyable outdoor space for your furry friends.",
    image: "https://placehold.co/400x250.png",
    imageHint: "dog playing yard",
    slug: "/blog/pet-friendly-yard-tips"
  },
  {
    title: "The Importance of Regular Pet Waste Removal",
    description: "Discover the health and environmental benefits of keeping your yard clean.",
    image: "https://placehold.co/400x250.png",
    imageHint: "clean garden tools",
    slug: "/blog/importance-of-waste-removal"
  },
  {
    title: "Choosing the Right Service Plan For You",
    description: "A guide to selecting the perfect pet waste management plan for your needs.",
    image: "https://placehold.co/400x250.png",
    imageHint: "calendar schedule",
    slug: "/blog/choosing-service-plan"
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 md:py-24 bg-accent">
      <div className="container">
        <div className="text-center mb-12">
           <div className="flex justify-center mb-4">
            <Newspaper className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground">Tips & Updates From Our Blog</h2>
          <p className="mt-4 text-lg text-accent-foreground/80 max-w-2xl mx-auto">
            Stay informed with our latest articles on pet care, yard maintenance, and company news.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card text-card-foreground">
              <div className="relative h-48 w-full">
                <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" data-ai-hint={post.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{post.title}</CardTitle>
                <CardDescription className="text-muted-foreground h-12 overflow-hidden text-ellipsis">{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Additional content can go here if needed */}
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-primary hover:bg-primary/10 hover:border-primary"
                ><Link href={post.slug}>Read More</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            ><Link href="/blog">View All Posts</Link></Button>
        </div>
      </div>
    </section>
  );
}
