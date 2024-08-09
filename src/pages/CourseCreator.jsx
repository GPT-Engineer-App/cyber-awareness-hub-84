import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CourseCreator = ({ lessons, topics }) => {
  const [prompt, setPrompt] = useState('');
  const [maxDuration, setMaxDuration] = useState(120);
  const [selectedLessons, setSelectedLessons] = useState([]);

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
    setSelectedLessons(selected);
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

        {selectedLessons.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Generated Course (Total Duration: {totalDuration} minutes)</h3>
            <Accordion type="single" collapsible className="w-full">
              {selectedLessons.map((lesson, index) => (
                <AccordionItem key={lesson.lessonId} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full">
                      <span>{lesson.title}</span>
                      <span className="text-sm text-gray-500">{lesson.timeConsumption} min</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">{lesson.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {lesson.topics.map(topicIndex => (
                        <Badge key={topicIndex} variant="secondary">
                          {topics[topicIndex]}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCreator;
