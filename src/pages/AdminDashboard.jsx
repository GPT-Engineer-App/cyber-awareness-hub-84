import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LessonForm from "./LessonForm";

const AdminDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/lessons.json');
      const data = await response.json();
      setLessons(data.lessons);
      setTopics(data.topics);
      setLanguages(data.languages);
    };
    fetchData();
  }, []);

  const handleSubmit = (lesson) => {
    let updatedLessons;
    if (editingLesson) {
      updatedLessons = lessons.map((l) =>
        l.lessonId === lesson.lessonId ? lesson : l
      );
      toast.success("Lesson updated successfully");
    } else {
      const newLessonId = `SEC${String(lessons.length + 1).padStart(3, '0')}`;
      updatedLessons = [...lessons, { ...lesson, lessonId: newLessonId }];
      toast.success("Lesson added successfully");
    }
    setLessons(updatedLessons);
    setIsDialogOpen(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDelete = (lessonId) => {
    const updatedLessons = lessons.filter((lesson) => lesson.lessonId !== lessonId);
    setLessons(updatedLessons);
    toast.success("Lesson deleted successfully");
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
