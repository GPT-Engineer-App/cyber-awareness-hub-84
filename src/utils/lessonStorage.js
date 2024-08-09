const STORAGE_KEY = 'lessonsData';

export const getLessonsData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : { lessons: [], topics: [], languages: [] };
};

export const setLessonsData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addLesson = (lesson) => {
  const data = getLessonsData();
  data.lessons.push(lesson);
  setLessonsData(data);
};

export const updateLesson = (updatedLesson) => {
  const data = getLessonsData();
  const index = data.lessons.findIndex(lesson => lesson.lessonId === updatedLesson.lessonId);
  if (index !== -1) {
    data.lessons[index] = updatedLesson;
    setLessonsData(data);
  }
};

export const deleteLesson = (lessonId) => {
  const data = getLessonsData();
  data.lessons = data.lessons.filter(lesson => lesson.lessonId !== lessonId);
  setLessonsData(data);
};
