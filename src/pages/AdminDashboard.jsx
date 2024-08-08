import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [lessons, setLessons] = useState([]);
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
    // Load lessons from localStorage on component mount
    const storedLessons = localStorage.getItem("lessons");
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLessons = [
      ...lessons,
      {
        ...newLesson,
        id: Date.now(),
        topics: newLesson.topics.split(",").map((topic) => topic.trim()),
        availableLanguages: newLesson.availableLanguages.split(",").map((lang) => lang.trim()),
      },
    ];
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
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
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              value={newLesson.title}
              onChange={handleInputChange}
              required
            />
            <Input
              name="description"
              placeholder="Description"
              value={newLesson.description}
              onChange={handleInputChange}
              required
            />
            <Input
              name="topics"
              placeholder="Topics (comma-separated)"
              value={newLesson.topics}
              onChange={handleInputChange}
              required
            />
            <Input
              name="videoLength"
              placeholder="Video Length"
              value={newLesson.videoLength}
              onChange={handleInputChange}
              required
            />
            <Input
              name="timeConsumption"
              placeholder="Time Consumption"
              value={newLesson.timeConsumption}
              onChange={handleInputChange}
              required
            />
            <Input
              name="difficultyLevel"
              placeholder="Difficulty Level"
              value={newLesson.difficultyLevel}
              onChange={handleInputChange}
              required
            />
            <Input
              name="quizQuestions"
              placeholder="Number of Quiz Questions"
              value={newLesson.quizQuestions}
              onChange={handleInputChange}
              required
            />
            <Input
              name="availableLanguages"
              placeholder="Available Languages (comma-separated)"
              value={newLesson.availableLanguages}
              onChange={handleInputChange}
              required
            />
            <Button type="submit">Add Lesson</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
