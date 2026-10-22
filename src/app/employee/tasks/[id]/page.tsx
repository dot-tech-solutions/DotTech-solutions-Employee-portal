import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { EmployeeTaskDetailClient } from "@/components/tasks/employee-task-client";

export default async function EmployeeTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const task = memoryStore.getTaskById(id);
  if (!task) notFound();

  // Enforce security: Employee can only see tasks assigned to them
  if (user.role !== "ADMIN" && task.assignedToId !== user.id) {
    redirect("/unauthorized");
  }

  const project = memoryStore.getProjectById(task.projectId);
  const submissions = memoryStore.getSubmissionsByTask(task.id);
  const reviews = memoryStore.getReviews();

  return (
    <EmployeeTaskDetailClient
      task={task}
      project={project}
      submissions={submissions}
      reviews={reviews}
      currentUser={user}
    />
  );
}
