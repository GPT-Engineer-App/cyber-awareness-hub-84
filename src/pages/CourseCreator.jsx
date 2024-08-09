import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CourseCreator = ({ lessons, topics }) => {
  const [prompt, setPrompt] = useState('');
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedLessons, setSelectedLessons] = useState([]);

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    const keywords = prompt.toLowerCase().split(' ');
    const filteredLessons = lessons.filter(lesson => {
      const lessonTopics = lesson.topics.map(topicIndex => topics[topicIndex].toLowerCase());
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
            <h3 className="text-lg font-semibold mb-2">Suggested Course (Total Duration: {totalDuration} minutes)</h3>
            {selectedLessons.map(lesson => (
              <Card key={lesson.lessonId} className="mb-2 p-2">
                <CardTitle className="text-sm">{lesson.title}</CardTitle>
                <CardContent className="text-xs">
                  Duration: {lesson.timeConsumption} minutes
                  <div className="mt-1">
                    {lesson.topics.map(topicIndex => (
                      <Badge key={topicIndex} variant="secondary" className="mr-1 text-xs">
                        {topics[topicIndex]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCreator;
