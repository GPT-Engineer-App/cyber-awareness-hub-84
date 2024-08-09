import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    topics: "",
    videoLength: "",
    timeConsumption: "",
    difficultyLevel: "",
    quizQuestions: "",
    availableLanguages: "",
  });

  useEffect(() => {
    const storedLessons = localStorage.getItem("lessons");
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingLesson((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewLesson((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedLessons;
    if (editingLesson) {
      updatedLessons = lessons.map((lesson) =>
        lesson.id === editingLesson.id ? { ...editingLesson, topics: editingLesson.topics.split(",").map((topic) => topic.trim()), availableLanguages: editingLesson.availableLanguages.split(",").map((lang) => lang.trim()) } : lesson
      );
      setEditingLesson(null);
      toast.success("Lesson updated successfully");
    } else {
      updatedLessons = [
        ...lessons,
        {
          ...newLesson,
          id: Date.now(),
          topics: newLesson.topics.split(",").map((topic) => topic.trim()),
          availableLanguages: newLesson.availableLanguages.split(",").map((lang) => lang.trim()),
        },
      ];
      setNewLesson({
        title: "",
        description: "",
        topics: "",
        videoLength: "",
        timeConsumption: "",
        difficultyLevel: "",
        quizQuestions: "",
        availableLanguages: "",
      });
      toast.success("Lesson added successfully");
    }
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
  };

  const handleEdit = (lesson) => {
    setEditingLesson({
      ...lesson,
      topics: lesson.topics.join(", "),
      availableLanguages: lesson.availableLanguages.join(", "),
    });
  };

  const handleDelete = (id) => {
    const updatedLessons = lessons.filter((lesson) => lesson.id !== id);
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
    toast.success("Lesson deleted successfully");
  };

  const renderLessonForm = (lesson, isEditing = false) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Title"
        value={lesson.title}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="description"
        placeholder="Description"
        value={lesson.description}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="topics"
        placeholder="Topics (comma-separated)"
        value={lesson.topics}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="videoLength"
        placeholder="Video Length"
        value={lesson.videoLength}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="timeConsumption"
        placeholder="Time Consumption"
        value={lesson.timeConsumption}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="difficultyLevel"
        placeholder="Difficulty Level"
        value={lesson.difficultyLevel}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="quizQuestions"
        placeholder="Number of Quiz Questions"
        value={lesson.quizQuestions}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Input
        name="availableLanguages"
        placeholder="Available Languages (comma-separated)"
        value={lesson.availableLanguages}
        onChange={(e) => handleInputChange(e, isEditing)}
        required
      />
      <Button type="submit">{isEditing ? "Update Lesson" : "Add Lesson"}</Button>
      {isEditing && (
        <Button type="button" onClick={() => setEditingLesson(null)} className="ml-2">
          Cancel
        </Button>
      )}
    </form>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</CardTitle>
        </CardHeader>
        <CardContent>
          {editingLesson ? renderLessonForm(editingLesson, true) : renderLessonForm(newLesson)}
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold mb-4">Existing Lessons</h2>
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="mb-4">
          <CardContent className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{lesson.title}</h3>
              <p>{lesson.description}</p>
            </div>
            <div>
              <Button onClick={() => handleEdit(lesson)} className="mr-2">
                Edit
              </Button>
              <Button onClick={() => handleDelete(lesson.id)} variant="destructive">
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
