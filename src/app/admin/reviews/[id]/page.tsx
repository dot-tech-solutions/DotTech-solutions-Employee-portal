import { notFound } from "next/navigation";
import { memoryStore } from "@/lib/store";
import { ReviewInterfaceClient } from "@/components/reviews/review-interface";

export default async function AdminReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = memoryStore.getSubmissionById(id);
  if (!submission) notFound();

  const task = memoryStore.getTaskById(submission.taskId);
  const employee = memoryStore.getUserById(submission.employeeId);
  const review = memoryStore.getReviewBySubmission(submission.id);
  const allVersions = memoryStore.getSubmissionsByTask(submission.taskId);

  return (
    <ReviewInterfaceClient
      submission={submission}
      task={task}
      employee={employee}
      review={review}
      allVersions={allVersions}
    />
  );
}
