import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          <Shield className="inline-block mr-2 h-10 w-10" />
          About Our Cyber Security Awareness Program
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our mission is to empower individuals and organizations with the knowledge and skills 
              necessary to navigate the digital world safely. We believe that cyber security awareness 
              is not just a technical issue, but a fundamental aspect of modern digital literacy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We offer a comprehensive suite of lessons covering various aspects of cyber security, 
              from basic password hygiene to advanced topics like social engineering and data privacy. 
              Our courses are designed to be accessible, engaging, and practical, ensuring that learners 
              can immediately apply their knowledge in real-world situations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Expert-curated content updated regularly to reflect the latest threats and best practices</li>
              <li>Interactive learning experiences with quizzes and practical exercises</li>
              <li>Flexible learning paths suitable for beginners to advanced users</li>
              <li>Multi-language support to cater to diverse audiences</li>
              <li>Certificates of completion to recognize your progress</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
