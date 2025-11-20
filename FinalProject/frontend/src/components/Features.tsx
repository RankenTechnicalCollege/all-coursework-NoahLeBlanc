import { CheckCircle, Zap, Shield, BarChart3, Users, GitBranch } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: CheckCircle,
    title: "Smart Issue Tracking",
    description: "Capture and organize bugs with intelligent categorization and priority assignment.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Search, filter, and update issues in milliseconds.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and security to keep your data safe.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Gain insights with comprehensive reports and visualizations.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with comments, mentions, and notifications.",
  },
  {
    icon: GitBranch,
    title: "Git Integration",
    description: "Connect with GitHub, GitLab, and Bitbucket for seamless workflow.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to Track Bugs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help your team identify, track, and resolve issues efficiently.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
