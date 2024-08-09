import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Video, BarChart2, HelpCircle } from "lucide-react";

const CourseBuilder = ({ selectedLessons }) => {
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    generateCourseDescription();
  }, [selectedLessons]);

  const generateCourseDescription = () => {
    if (selectedLessons.length === 0) {
      setCourseDescription('');
      return;
    }

    const totalDuration = selectedLessons.reduce((sum, lesson) => sum + parseInt(lesson.timeConsumption), 0);
    const averageDifficulty = calculateAverageDifficulty(selectedLessons);
    const topics = [...new Set(selectedLessons.flatMap(lesson => lesson.topics))];

    const description = `
This course consists of ${selectedLessons.length} lessons covering ${topics.length} main topics in the field of cyber and data security awareness. 
The total duration of the course is approximately ${totalDuration} minutes, with an average difficulty level of ${averageDifficulty}. 

The course covers the following key areas:
${topics.map(topic => `- ${topic}`).join('\n')}

By completing this course, you will gain a comprehensive understanding of various aspects of cyber security, 
from ${selectedLessons[0].title.toLowerCase()} to ${selectedLessons[selectedLessons.length - 1].title.toLowerCase()}. 
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
          {selectedLessons.map(lesson => (
            <div key={lesson.lessonId} className="mb-2 p-2 bg-gray-100 rounded">
              <h4 className="font-medium">{lesson.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><Clock className="inline mr-1 h-4 w-4" />{lesson.timeConsumption}</span>
                <span><Video className="inline mr-1 h-4 w-4" />{lesson.videoLength}</span>
                <span><BarChart2 className="inline mr-1 h-4 w-4" />{lesson.difficultyLevel}</span>
                <span><HelpCircle className="inline mr-1 h-4 w-4" />{lesson.quizQuestions} questions</span>
              </div>
              <div className="mt-1">
                {lesson.topics.map(topic => (
                  <Badge key={topic} variant="secondary" className="mr-1">{topic}</Badge>
                ))}
              </div>
            </div>
          ))}
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
        <Button onClick={generateCourseDescription} className="mt-4">Regenerate Description</Button>
      </CardContent>
    </Card>
  );
};

export default CourseBuilder;
