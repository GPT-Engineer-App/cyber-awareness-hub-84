import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LessonForm from "./LessonForm";

// Simulated API functions
const fetchLessonsData = async () => {
  const storedData = localStorage.getItem('lessonsData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  const response = await fetch('/lessons.json');
  if (!response.ok) {
    throw new Error('Failed to fetch lessons data');
  }
  const data = await response.json();
  localStorage.setItem('lessonsData', JSON.stringify(data));
  return data;
};

const updateLessonsData = async (newLessons) => {
  localStorage.setItem('lessonsData', JSON.stringify(newLessons));
  return newLessons;
};

const AdminDashboard = () => {
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    toast.warning("Changes are saved locally and will be lost when clearing browser data.", {
      duration: 5000,
      position: "top-center",
    });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lessonsData'],
    queryFn: fetchLessonsData,
  });

  const mutation = useMutation({
    mutationFn: updateLessonsData,
    onSuccess: (data) => {
      queryClient.setQueryData(['lessonsData'], data);
      toast.success("Lessons updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating lessons: ${error.message}`);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { lessons, topics, languages } = data;

  const handleSubmit = (lesson) => {
    let updatedLessons;
    if (editingLesson) {
      updatedLessons = lessons.map((l) =>
        l.lessonId === lesson.lessonId ? lesson : l
      );
    } else {
      const newLessonId = `SEC${String(lessons.length + 1).padStart(3, '0')}`;
      updatedLessons = [...lessons, { ...lesson, lessonId: newLessonId }];
    }
    mutation.mutate({ ...data, lessons: updatedLessons });
    setIsDialogOpen(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDelete = (lessonId) => {
    const updatedLessons = lessons.filter((lesson) => lesson.lessonId !== lessonId);
    mutation.mutate({ ...data, lessons: updatedLessons });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingLesson(null)}>Add New Lesson</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          </DialogHeader>
          <LessonForm
            lesson={editingLesson}
            topics={topics}
            languages={languages}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
      <h2 className="text-xl font-bold my-4">Existing Lessons</h2>
      {lessons.map((lesson) => (
        <Card key={lesson.lessonId} className="mb-4">
          <CardContent className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{lesson.title}</h3>
              <p>{lesson.description}</p>
            </div>
            <div>
              <Button onClick={() => handleEdit(lesson)} className="mr-2">
                Edit
              </Button>
              <Button onClick={() => handleDelete(lesson.lessonId)} variant="destructive">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;
