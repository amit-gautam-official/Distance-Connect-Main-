import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  date: string;
  content: string;
}

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 5.0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Reviews & Feedback
        </h2>
        <div className="flex items-center">
          <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
          <span className="font-medium text-gray-800">{averageRating.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-6"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-medium text-blue-700">
                  {review.avatar || review.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {review.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {review.role}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {review.date}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>

      {totalReviews > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600"
          >
            View All Reviews
          </Button>
        </div>
      )}
    </div>
  );
} 