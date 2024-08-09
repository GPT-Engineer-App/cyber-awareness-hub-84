import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    lessonId: "",
    title: "",
    description: "",
    topics: [],
    videoLength: "",
    timeConsumption: "",
    difficultyLevel: "",
    quizQuestions: "",
    availableLanguages: [],
    thumbImage: "",
  });

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

  const handleInputChange = (name, value, isEditing = false) => {
    if (isEditing) {
      setEditingLesson((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewLesson((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTopicChange = (topicIndex, isChecked, isEditing = false) => {
    const updateTopics = (prev) => {
      const newTopics = [...prev.topics];
      if (isChecked) {
        newTopics.push(topicIndex);
      } else {
        const index = newTopics.indexOf(topicIndex);
        if (index > -1) {
          newTopics.splice(index, 1);
        }
      }
      return { ...prev, topics: newTopics };
    };

    if (isEditing) {
      setEditingLesson(updateTopics);
    } else {
      setNewLesson(updateTopics);
    }
  };

  const handleLanguageChange = (langIndex, isChecked, isEditing = false) => {
    const updateLanguages = (prev) => {
      const newLanguages = [...prev.availableLanguages];
      if (isChecked) {
        newLanguages.push(langIndex);
      } else {
        const index = newLanguages.indexOf(langIndex);
        if (index > -1) {
          newLanguages.splice(index, 1);
        }
      }
      return { ...prev, availableLanguages: newLanguages };
    };

    if (isEditing) {
      setEditingLesson(updateLanguages);
    } else {
      setNewLesson(updateLanguages);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedLessons;
    if (editingLesson) {
      updatedLessons = lessons.map((lesson) =>
        lesson.lessonId === editingLesson.lessonId ? editingLesson : lesson
      );
      setEditingLesson(null);
      toast.success("Lesson updated successfully");
    } else {
      updatedLessons = [...lessons, newLesson];
      setNewLesson({
        lessonId: "",
        title: "",
        description: "",
        topics: [],
        videoLength: "",
        timeConsumption: "",
        difficultyLevel: "",
        quizQuestions: "",
        availableLanguages: [],
        thumbImage: "",
      });
      toast.success("Lesson added successfully");
    }
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleDelete = (lessonId) => {
    const updatedLessons = lessons.filter((lesson) => lesson.lessonId !== lessonId);
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
    toast.success("Lesson deleted successfully");
  };

  const renderLessonForm = (lesson, isEditing = false) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="lessonId"
        placeholder="Lesson ID"
        value={lesson.lessonId}
        onChange={(e) => handleInputChange("lessonId", e.target.value, isEditing)}
        required
      />
      <Input
        name="title"
        placeholder="Title"
        value={lesson.title}
        onChange={(e) => handleInputChange("title", e.target.value, isEditing)}
        required
      />
      <Input
        name="description"
        placeholder="Description"
        value={lesson.description}
        onChange={(e) => handleInputChange("description", e.target.value, isEditing)}
        required
      />
      <div>
        <h4 className="mb-2">Topics</h4>
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`topic-${index}`}
              checked={lesson.topics.includes(index)}
              onCheckedChange={(checked) => handleTopicChange(index, checked, isEditing)}
            />
            <label htmlFor={`topic-${index}`}>{topic}</label>
          </div>
        ))}
      </div>
      <Input
        name="videoLength"
        placeholder="Video Length"
        value={lesson.videoLength}
        onChange={(e) => handleInputChange("videoLength", e.target.value, isEditing)}
        required
      />
      <Input
        name="timeConsumption"
        placeholder="Time Consumption"
        value={lesson.timeConsumption}
        onChange={(e) => handleInputChange("timeConsumption", e.target.value, isEditing)}
        required
      />
      <Select
        name="difficultyLevel"
        value={lesson.difficultyLevel}
        onValueChange={(value) => handleInputChange("difficultyLevel", value, isEditing)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name="quizQuestions"
        placeholder="Number of Quiz Questions"
        value={lesson.quizQuestions}
        onChange={(e) => handleInputChange("quizQuestions", e.target.value, isEditing)}
        required
      />
      <div>
        <h4 className="mb-2">Available Languages</h4>
        {languages.map((language, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`lang-${index}`}
              checked={lesson.availableLanguages.includes(index)}
              onCheckedChange={(checked) => handleLanguageChange(index, checked, isEditing)}
            />
            <label htmlFor={`lang-${index}`}>{language}</label>
          </div>
        ))}
      </div>
      <Input
        name="thumbImage"
        placeholder="Thumbnail Image URL"
        value={lesson.thumbImage}
        onChange={(e) => handleInputChange("thumbImage", e.target.value, isEditing)}
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
