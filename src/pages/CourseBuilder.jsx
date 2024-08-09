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
Enhance your cybersecurity skills with this tailored course of ${selectedLessons.length} lessons covering ${topics.length} critical areas in cyber and data security awareness.
Total duration: ${totalDuration} minutes | Difficulty level: ${averageDifficulty}

Key Topics:
${topics.map(topic => `• ${topic}: Master essential concepts and best practices.`).join('\n')}

Course Highlights:
• Comprehensive Coverage: ${selectedLessons.length > 1 
  ? `From ${selectedLessons[0].title} to ${selectedLessons[selectedLessons.length - 1].title}` 
  : `Focusing on ${selectedLessons[0].title}`}
• Practical Approach: Real-world scenarios and hands-on exercises
• Flexible Learning: Adapted for ${averageDifficulty.toLowerCase()}-level learners
• Interactive Content: Engaging quizzes to reinforce your knowledge

By completing this course, you'll be equipped to:
1. Identify and mitigate common cybersecurity threats
2. Implement robust data protection strategies
3. Contribute to your organization's overall security posture

Perfect for those looking to ${averageDifficulty === 'Basic' ? 'start their journey in' : averageDifficulty === 'Intermediate' ? 'expand their knowledge of' : 'master'} cyber security. Begin your path to becoming a cybersecurity-savvy professional today!
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
