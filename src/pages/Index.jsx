import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          <Shield className="inline-block mr-2 h-10 w-10" />
          Welcome to Cyber Security Awareness
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Empower Your Digital Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In today's interconnected world, understanding cyber security is crucial. 
              Our platform offers comprehensive lessons to help you navigate the digital 
              landscape safely and confidently.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link to="/lessons">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Lessons
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/about">
                  <Users className="mr-2 h-4 w-4" />
                  Learn About Us
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Why Cyber Security Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Protect your personal and financial information</li>
                <li>Safeguard your digital identity</li>
                <li>Understand and mitigate online risks</li>
                <li>Contribute to a safer digital ecosystem</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Password security and management</li>
                <li>Recognizing and avoiding phishing attempts</li>
                <li>Data privacy best practices</li>
                <li>Safe browsing and online transactions</li>
                <li>And much more!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
