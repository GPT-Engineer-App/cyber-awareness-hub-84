import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LessonForm from "./LessonForm";
import { getLessonsData, addLesson, updateLesson, deleteLesson } from "../utils/lessonStorage";

const AdminDashboard = () => {
  const [lessonsData, setLessonsData] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const data = getLessonsData();
    setLessonsData(data);
    toast.warning("Changes are saved locally and will be lost when clearing browser data.", {
      duration: 5000,
      position: "top-center",
    });
  }, []);

  const handleSubmit = (lesson) => {
    if (editingLesson) {
      updateLesson(lesson);
    } else {
      const newLessonId = `SEC${String(lessonsData.lessons.length + 1).padStart(3, '0')}`;
      addLesson({ ...lesson, lessonId: newLessonId });
    }
    setLessonsData(getLessonsData());
    setIsDialogOpen(false);
    setEditingLesson(null);
    toast.success("Lesson saved successfully");
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDelete = (lessonId) => {
    deleteLesson(lessonId);
    setLessonsData(getLessonsData());
    toast.success("Lesson deleted successfully");
  };

  if (!lessonsData) return <div>Loading...</div>;

  const { lessons, topics, languages } = lessonsData;

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
