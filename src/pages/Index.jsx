import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, Clock, Video, BarChart2, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CourseCreator from './CourseCreator';
import CourseBuilder from './CourseBuilder';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../LanguageContext';

const translations = {
  en: {
    title: "Mindzeed lessons overview",
    createCustomCourse: "Create Custom Course",
    hideCourseCreator: "Hide Course Creator",
    buildCourse: "Build Course",
    hideCourseBuilder: "Hide Course Builder",
    searchLessons: "Search lessons...",
    sortByTopic: "Sort by Topic",
    sortByLanguage: "Sort by Language",
    allTopics: "All Topics",
    allLanguages: "All Languages",
    time: "Time",
    video: "Video",
    difficulty: "Difficulty",
    quizQuestions: "Number of quiz questions",
    availableIn: "Available in",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    loading: "Loading...",
    error: "Error:",
  },
  da: {
    title: "Mindzeed lektionsoversigt",
    createCustomCourse: "Opret tilpasset kursus",
    hideCourseCreator: "Skjul kursusopretteren",
    buildCourse: "Byg kursus",
    hideCourseBuilder: "Skjul kursusbyggeren",
    searchLessons: "Søg lektioner...",
    sortByTopic: "Sortér efter emne",
    sortByLanguage: "Sortér efter sprog",
    allTopics: "Alle emner",
    allLanguages: "Alle sprog",
    time: "Tid",
    video: "Video",
    difficulty: "Sværhedsgrad",
    quizQuestions: "Antal quizspørgsmål",
    availableIn: "Tilgængelig på",
    previous: "Forrige",
    next: "Næste",
    page: "Side",
    of: "af",
    loading: "Indlæser...",
    error: "Fejl:",
  },
};

import { getLessonsData } from '../utils/lessonStorage';

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTopic, setSortTopic] = useState('');
  const [sortLanguage, setSortLanguage] = useState('');
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [lessonsData, setLessonsData] = useState(null);

  useEffect(() => {
    const data = getLessonsData();
    setLessonsData(data);
  }, []);

  const handleCustomCourseCreation = (lessons) => {
    setSelectedLessons(lessons);
    setShowCourseBuilder(true);
    setShowCourseCreator(false);
  };

  if (!lessonsData) return <div className="text-center mt-8">{t.loading}</div>;

  const { lessons, topics, languages } = lessonsData;

  const handleLessonSelect = (lesson, isChecked) => {
    setSelectedLessons((prev) => {
      if (isChecked) {
        return [...prev, lesson];
      } else {
        return prev.filter((l) => l.lessonId !== lesson.lessonId);
      }
    });
    setShowCourseBuilder(true);
  };

  const handleResetCourse = () => {
    setSelectedLessons([]);
    setShowCourseBuilder(false);
  };

  const isLessonSelected = (lesson) => {
    return selectedLessons.some(l => l.lessonId === lesson.lessonId && l.title === lesson.title);
  };

  const filteredAndSortedLessons = useMemo(() => {
    if (!data || !data.lessons) return [];
    
    let result = data.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topics.some((topic, index) => lesson.topics.includes(index) && topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortTopic && sortTopic !== 'all') {
      result = result.filter(lesson => lesson.topics.includes(parseInt(sortTopic)));
    }

    if (sortLanguage && sortLanguage !== 'all') {
      result = result.filter(lesson => lesson.availableLanguages.includes(parseInt(sortLanguage)));
    }

    return result;
  }, [data, searchTerm, sortTopic, sortLanguage, topics]);

  if (isLoading) return <div className="text-center mt-8">{t.loading}</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{t.error} {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            <Shield className="inline-block mr-2 h-10 w-10" />
            {t.title}
          </h1>
          <LanguageSelector />
        </div>
        
        <div className="mb-6 flex space-x-4 items-center">
          <Button onClick={() => setShowCourseCreator(!showCourseCreator)}>
            {showCourseCreator ? t.hideCourseCreator : t.createCustomCourse}
          </Button>
          <Button onClick={() => setShowCourseBuilder(!showCourseBuilder)}>
            {showCourseBuilder ? t.hideCourseBuilder : t.buildCourse}
          </Button>
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder={t.searchLessons}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={sortTopic} onValueChange={setSortTopic}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.sortByTopic} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTopics}</SelectItem>
              {topics.map((topic, index) => (
                <SelectItem key={index} value={index.toString()}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortLanguage} onValueChange={setSortLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.sortByLanguage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allLanguages}</SelectItem>
              {languages.map((language, index) => (
                <SelectItem key={index} value={index.toString()}>{language}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCourseCreator && data && (
          <CourseCreator 
            lessons={data.lessons} 
            topics={data.topics} 
            onCustomCourseCreation={handleCustomCourseCreation}
          />
        )}
        {showCourseBuilder && (
          <CourseBuilder 
            selectedLessons={selectedLessons} 
            onReset={handleResetCourse} 
          />
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {filteredAndSortedLessons.map(lesson => (
            <Card 
              key={lesson.lessonId} 
              className="relative flex flex-col transition-all duration-200 hover:bg-gray-50 border border-transparent"
            >
              <div className="absolute top-2 right-2">
                <Checkbox
                  checked={isLessonSelected(lesson)}
                  onCheckedChange={(checked) => handleLessonSelect(lesson, checked)}
                />
              </div>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <iframe
                  src={`https://player.vimeo.com/video/${lesson.videoUrl}`}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                  className="mb-4 rounded"
                ></iframe>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(lesson.topics) 
                    ? lesson.topics.map((topicIndex) => (
                        <Badge key={topicIndex} variant="secondary">{data.topics[topicIndex]}</Badge>
                      ))
                    : Object.keys(lesson.topics).map((topic) => (
                        <Badge key={topic} variant="secondary">{topic}</Badge>
                      ))
                  }
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <Clock className="inline-block mr-1 h-4 w-4" />
                  {t.time}: {lesson.timeConsumption}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <Video className="inline-block mr-1 h-4 w-4" />
                  {t.video}: {lesson.videoLength}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <BarChart2 className="inline-block mr-1 h-4 w-4" />
                  {t.difficulty}: {lesson.difficultyLevel}
                </div>
                <div className="text-sm text-gray-600">
                  <HelpCircle className="inline-block mr-1 h-4 w-4" />
                  {t.quizQuestions}: {lesson.quizQuestions}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-600">
                  {t.availableIn}: {lesson.availableLanguages.map(langIndex => data.languages[langIndex]).join(", ")}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
