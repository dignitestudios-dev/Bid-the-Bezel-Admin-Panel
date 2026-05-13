"use client";

import React, { useState } from "react";
import { MessageSquare, User, CalendarDays, Trash2 } from "lucide-react";

import { useParams } from "next/navigation";
import {
  useDeleteQuestion,
  useGetQuestions,
} from "@/app/feature/productqa/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/date.utils";
import { Pagination } from "@/components/pagination";

const ProductQA = () => {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const params = useParams();

  const { data: productQa, isLoading: productLoading } = useGetQuestions(
    params.id as string,
    page,
  );
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();

  const questions = productQa?.data || [];
  const handleDelete = (qaId: string) => {
    setDeletingId(qaId);

    deleteQuestion(
      { qaId },
      {
        onSettled: () => {
          setDeletingId(null);
        },
      },
    );
  };
  const pagination = productQa?.pagination;

  return (
    <div className="rounded-2xl border bg-background p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5" />

          <h2 className="text-xl font-semibold">Product Questions</h2>
        </div>

        <Badge variant="secondary">{questions?.length} Questions</Badge>
      </div>

      <Separator />

      {/* LOADING */}
      {productLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : questions?.length === 0 ? (
        /* EMPTY */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="size-10 text-muted-foreground opacity-50 mb-3" />

          <h3 className="font-medium">No questions yet</h3>

          <p className="text-sm text-muted-foreground mt-1">
            This product has no customer questions.
          </p>
        </div>
      ) : (
        /* QUESTIONS */
        <div className="space-y-5">
          {questions.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border p-5 space-y-5 hover:shadow-sm transition"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  {/* QUESTION */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="size-4 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        {item?.askedBy?.userName}
                      </p>

                      <Badge className="bg-blue-100 text-blue-700 border-0">
                        Asked
                      </Badge>
                    </div>

                    <p className="text-base font-medium">{item?.question}</p>
                  </div>

                  {/* ANSWER */}
                  {item?.answer && (
                    <div className="rounded-xl bg-muted/50 p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="size-4 text-muted-foreground" />

                        <p className="text-sm font-medium">
                          {item?.answeredBy?.userName}
                        </p>

                        <Badge className="bg-green-100 text-green-700 border-0">
                          Answered
                        </Badge>
                      </div>

                      <p className="text-sm leading-6">{item?.answer}</p>
                    </div>
                  )}
                </div>

                {/* DELETE BUTTON */}
                <Button
                  size="icon"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:bg-red-100 hover:text-red-500"
                >
                  {isDeleting ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>

              {/* FOOTER */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-4" />

                <span>{formatDate(item?.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {questions?.length > 0 && pagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductQA;
