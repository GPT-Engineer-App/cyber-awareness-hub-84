import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const CourseSidebar = ({ selectedLessons, onRemoveLesson, onGenerateDescription }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Selected Lessons</h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {selectedLessons.map(lesson => (
          <div key={lesson.lessonId} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
            <span>{lesson.title}</span>
            <Button variant="ghost" size="sm" onClick={() => onRemoveLesson(lesson.lessonId)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </ScrollArea>
      <Button onClick={onGenerateDescription} className="w-full mt-4">
        Generate Course Description
      </Button>
    </div>
  );
};

export default CourseSidebar;
