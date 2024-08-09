import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, ChevronLeft, ChevronRight, Clock, Video, BarChart2, HelpCircle, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import CourseCreator from './CourseCreator';
import CourseBuilder from './CourseBuilder';

const ITEMS_PER_PAGE = 6;

const fetchLessons = async () => {
  const response = await fetch('/lessons.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortTopic, setSortTopic] = useState('');
  const [sortLanguage, setSortLanguage] = useState('');
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'da' for Danish

  const { data, isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessons,
  });

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
    if (!data) return [];
    
    let result = data.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.topics.some((topic, index) => lesson.topics.includes(index) && topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortTopic && sortTopic !== 'all') {
      result = result.filter(lesson => lesson.topics.includes(parseInt(sortTopic)));
    }

    if (sortLanguage && sortLanguage !== 'all') {
      result = result.filter(lesson => lesson.availableLanguages.includes(parseInt(sortLanguage)));
    }

    return result;
  }, [data, searchTerm, sortTopic, sortLanguage]);

  const totalPages = Math.ceil((filteredAndSortedLessons?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLessons = filteredAndSortedLessons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          <Shield className="inline-block mr-2 h-10 w-10" />
          {language === 'en' ? 'Cyber and Data Security Awareness' : 'Cyber- og Datasikkerhedsbevidsthed'}
        </h1>
        
        <div className="mb-6 flex space-x-4 items-center">
          <Button onClick={() => setShowCourseCreator(!showCourseCreator)}>
            {showCourseCreator 
              ? (language === 'en' ? 'Hide Course Creator' : 'Skjul Kursus Skaber') 
              : (language === 'en' ? 'Create Custom Course' : 'Opret Tilpasset Kursus')}
          </Button>
          <Button onClick={() => setShowCourseBuilder(!showCourseBuilder)}>
            {showCourseBuilder 
              ? (language === 'en' ? 'Hide Course Builder' : 'Skjul Kursus Bygger') 
              : (language === 'en' ? 'Build Course' : 'Byg Kursus')}
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="language-select">Language:</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-[120px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="da">Dansk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder={language === 'en' ? "Search lessons..." : "Søg lektioner..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={sortTopic} onValueChange={setSortTopic}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'en' ? "Sort by Topic" : "Sortér efter emne"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? "All Topics" : "Alle emner"}</SelectItem>
              {data.topics.map((topic, index) => (
                <SelectItem key={index} value={index.toString()}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortLanguage} onValueChange={setSortLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'en' ? "Sort by Language" : "Sortér efter sprog"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? "All Languages" : "Alle sprog"}</SelectItem>
              {data.languages.map((language, index) => (
                <SelectItem key={index} value={index.toString()}>{language}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCourseCreator && data && <CourseCreator lessons={data.lessons} topics={data.topics} />}
        {showCourseBuilder && <CourseBuilder selectedLessons={selectedLessons} onReset={handleResetCourse} />}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {paginatedLessons.map(lesson => (
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
                <img src={lesson.thumbImage} alt={lesson.title} className="w-full h-32 object-cover mb-4 rounded" />
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
                  Time: {lesson.timeConsumption}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <Video className="inline-block mr-1 h-4 w-4" />
                  Video: {lesson.videoLength}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <BarChart2 className="inline-block mr-1 h-4 w-4" />
                  Difficulty: {lesson.difficultyLevel}
                </div>
                <div className="text-sm text-gray-600">
                  <HelpCircle className="inline-block mr-1 h-4 w-4" />
                  Number of quiz questions: {lesson.quizQuestions}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-600">
                  Available in: {lesson.availableLanguages.map(langIndex => data.languages[langIndex]).join(", ")}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> {language === 'en' ? 'Previous' : 'Forrige'}
          </Button>
          <span>{language === 'en' ? `Page ${currentPage} of ${totalPages}` : `Side ${currentPage} af ${totalPages}`}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {language === 'en' ? 'Next' : 'Næste'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
