"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Users, Tag } from 'lucide-react';

// Temporary workshop data
const tempWorkshops = [
  {
    id: "1",
    name: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your first website. No prior experience needed!",
    price: 0, // Free
    mentor: { name: "Jane Doe", image: "/temp-avatars/mentor1.jpg" },
    bannerImage: "/temp-banners/web-dev.jpg",
    enrollmentCount: 120,
    numberOfDays: 5,
  },
  {
    id: "2",
    name: "Advanced React Patterns",
    description: "Dive deep into advanced React concepts, state management, and performance optimization techniques.",
    price: 4900, // Represents ₹49.00
    mentor: { name: "John Smith", image: "/temp-avatars/mentor2.jpg" },
    bannerImage: "/temp-banners/react-adv.jpg",
    enrollmentCount: 75,
    numberOfDays: 7,
  },
  {
    id: "3",
    name: "Data Science with Python",
    description: "Explore data analysis, visualization, and machine learning using Python and popular libraries.",
    price: 9900, // Represents ₹99.00
    mentor: { name: "Alice Brown", image: "/temp-avatars/mentor3.jpg" },
    bannerImage: "/temp-banners/data-science.jpg",
    enrollmentCount: 90,
    numberOfDays: 10,
  },
];

const FeaturedWorkshops = () => {
  return (
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Featured Workshops
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover new skills and accelerate your career with our expert-led workshops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tempWorkshops.map((workshop) => (
            <Card key={workshop.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="p-0 relative">
                <div className="aspect-[16/9] w-full relative">
                  <Image 
                    src={workshop.bannerImage} 
                    alt={workshop.name} 
                    layout="fill" 
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2 hover:text-sky-600 transition-colors">
                  <Link href={`/workshops/${workshop.id}`}>{workshop.name}</Link>
                </CardTitle>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{workshop.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                  <span className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1 text-sky-500" /> {workshop.numberOfDays} Days</span>
                  <span className="flex items-center"><Users className="h-3.5 w-3.5 mr-1 text-sky-500" /> {workshop.enrollmentCount} Enrolled</span>
                </div>
                <div className="text-lg font-bold text-sky-600 mb-1">
                  {workshop.price === 0 ? 'Free' : `₹${(workshop.price / 100).toFixed(2)}`}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-200">
                <Link href={`/workshops/${workshop.id}`} passHref className='w-full'>
                  <Button variant="default" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/workshops" passHref>
            <Button variant="outline" size="lg" className="text-sky-600 border-sky-600 hover:bg-sky-50 hover:text-sky-700">
              Explore All Workshops
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkshops;
