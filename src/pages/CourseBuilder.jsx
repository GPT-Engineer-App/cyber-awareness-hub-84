import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Video, BarChart2, HelpCircle, RefreshCw } from "lucide-react";

const CourseBuilder = ({ selectedLessons, onReset }) => {
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    generateCourseDescription();
  }, [selectedLessons]);

  const handleReset = () => {
    onReset();
    setCourseDescription('');
  };

  const generateCourseDescription = () => {
    if (selectedLessons.length === 0) {
      setCourseDescription('');
      return;
    }

    const totalDuration = selectedLessons.reduce((sum, lesson) => sum + parseInt(lesson.timeConsumption), 0);
    const averageDifficulty = calculateAverageDifficulty(selectedLessons);
    const topics = [...new Set(selectedLessons.flatMap(lesson => 
      Array.isArray(lesson.topics) ? lesson.topics : Object.keys(lesson.topics)
    ))];

    const description = `
This course consists of ${selectedLessons.length} lessons covering ${topics.length} main topics in the field of cyber and data security awareness. 
The total duration of the course is approximately ${totalDuration} minutes, with an average difficulty level of ${averageDifficulty}. 

The course covers the following key areas:
${topics.map(topic => `- ${topic}`).join('\n')}

By completing this course, you will gain a comprehensive understanding of various aspects of cyber security, 
${selectedLessons.length > 1 
  ? `from ${selectedLessons[0].title.toLowerCase()} to ${selectedLessons[selectedLessons.length - 1].title.toLowerCase()}.` 
  : `focusing on ${selectedLessons[0].title.toLowerCase()}.`}
This course is suitable for individuals looking to ${averageDifficulty === 'Basic' ? 'start their journey in' : averageDifficulty === 'Intermediate' ? 'expand their knowledge of' : 'master'} cyber security awareness.
    `;

    setCourseDescription(description.trim());
  };

  const calculateAverageDifficulty = (lessons) => {
    const difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
    const averageIndex = Math.round(lessons.reduce((sum, lesson) => sum + difficultyLevels.indexOf(lesson.difficultyLevel), 0) / lessons.length);
    return difficultyLevels[averageIndex];
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Course Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Lessons:</h3>
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
                    {lesson.topics.map(topic => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span><Video className="inline mr-1 h-4 w-4" />{lesson.videoLength}</span>
                    <span className="ml-4"><BarChart2 className="inline mr-1 h-4 w-4" />{lesson.difficultyLevel}</span>
                    <span className="ml-4"><HelpCircle className="inline mr-1 h-4 w-4" />{lesson.quizQuestions} questions</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Course Description:</h3>
          <Textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={10}
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={generateCourseDescription}>Regenerate Description</Button>
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseBuilder;
