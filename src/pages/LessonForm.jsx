import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const LessonForm = ({ lesson, topics, languages, onSubmit }) => {
  const [formData, setFormData] = useState({
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
    if (lesson) {
      setFormData(lesson);
    }
  }, [lesson]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (topicIndex, isChecked) => {
    setFormData((prev) => {
      const newTopics = isChecked
        ? [...prev.topics, topicIndex]
        : prev.topics.filter((t) => t !== topicIndex);
      return { ...prev, topics: newTopics };
    });
  };

  const handleLanguageChange = (langIndex, isChecked) => {
    setFormData((prev) => {
      const newLanguages = isChecked
        ? [...prev.availableLanguages, langIndex]
        : prev.availableLanguages.filter((l) => l !== langIndex);
      return { ...prev, availableLanguages: newLanguages };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="lessonId"
        placeholder="Lesson ID"
        value={formData.lessonId}
        onChange={(e) => handleInputChange("lessonId", e.target.value)}
        required
      />
      <Input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        required
      />
      <Input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        required
      />
      <div>
        <h4 className="mb-2">Topics</h4>
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`topic-${index}`}
              checked={formData.topics.includes(index)}
              onCheckedChange={(checked) => handleTopicChange(index, checked)}
            />
            <label htmlFor={`topic-${index}`}>{topic}</label>
          </div>
        ))}
      </div>
      <Input
        name="videoLength"
        placeholder="Video Length"
        value={formData.videoLength}
        onChange={(e) => handleInputChange("videoLength", e.target.value)}
        required
      />
      <Input
        name="timeConsumption"
        placeholder="Time Consumption"
        value={formData.timeConsumption}
        onChange={(e) => handleInputChange("timeConsumption", e.target.value)}
        required
      />
      <Select
        name="difficultyLevel"
        value={formData.difficultyLevel}
        onValueChange={(value) => handleInputChange("difficultyLevel", value)}
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
        value={formData.quizQuestions}
        onChange={(e) => handleInputChange("quizQuestions", e.target.value)}
        required
      />
      <div>
        <h4 className="mb-2">Available Languages</h4>
        {languages.map((language, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`lang-${index}`}
              checked={formData.availableLanguages.includes(index)}
              onCheckedChange={(checked) => handleLanguageChange(index, checked)}
            />
            <label htmlFor={`lang-${index}`}>{language}</label>
          </div>
        ))}
      </div>
      <Input
        name="thumbImage"
        placeholder="Thumbnail Image URL"
        value={formData.thumbImage}
        onChange={(e) => handleInputChange("thumbImage", e.target.value)}
        required
      />
      <Button type="submit">{lesson ? "Update Lesson" : "Add Lesson"}</Button>
    </form>
  );
};

export default LessonForm;
