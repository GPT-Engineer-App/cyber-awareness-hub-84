import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Search } from "lucide-react";

const lessons = [
  { id: 1, title: "Password Security", description: "Learn how to create and manage strong passwords." },
  { id: 2, title: "Phishing Awareness", description: "Identify and avoid phishing attempts in emails and websites." },
  { id: 3, title: "Data Privacy", description: "Understand the importance of protecting personal and company data." },
  { id: 4, title: "Social Engineering", description: "Recognize and prevent social engineering attacks." },
  { id: 5, title: "Mobile Device Security", description: "Secure your smartphones and tablets from cyber threats." },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          <Shield className="inline-block mr-2 h-10 w-10" />
          Cyber and Data Security Awareness
        </h1>
        
        <div className="mb-6 relative">
          <Input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredLessons.map(lesson => (
            <Card key={lesson.id}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{lesson.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
