import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CourseCreator = ({ lessons, topics, onCustomCourseCreation }) => {
  const [prompt, setPrompt] = useState('');
  const [maxDuration, setMaxDuration] = useState(120);

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    const keywords = prompt.toLowerCase().split(' ');
    const filteredLessons = lessons.filter(lesson => {
      const lessonTopics = lesson.topics.map(topicIndex => topics && topics[topicIndex] ? topics[topicIndex].toLowerCase() : '');
      return keywords.some(keyword => 
        lesson.title.toLowerCase().includes(keyword) ||
        lesson.description.toLowerCase().includes(keyword) ||
        lessonTopics.some(topic => topic.includes(keyword))
      );
    });

    let totalDuration = 0;
    const selected = [];
    for (const lesson of filteredLessons) {
      const lessonDuration = parseInt(lesson.timeConsumption);
      if (totalDuration + lessonDuration <= maxDuration) {
        selected.push(lesson);
        totalDuration += lessonDuration;
      }
      if (totalDuration >= maxDuration) break;
    }
    onCustomCourseCreation(selected);
  };

  const totalDuration = useMemo(() => {
    return selectedLessons.reduce((total, lesson) => total + parseInt(lesson.timeConsumption), 0);
  }, [selectedLessons]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create Custom Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePromptSubmit} className="space-y-4">
          <Input
            placeholder="Enter course requirements (e.g., passwords GDPR)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max duration (minutes)"
            value={maxDuration}
            onChange={(e) => setMaxDuration(parseInt(e.target.value))}
          />
          <Button type="submit">Generate Course</Button>
        </form>

        {/* Remove the selectedLessons display from here */}
      </CardContent>
    </Card>
  );
};

export default CourseCreator;
