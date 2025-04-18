
import { 
    Brain, 
    BarChart, 
    MessageSquare,
    Lightbulb, 
    TrendingUp 
  } from "lucide-react";
  
  const features = [
    {
      icon: Brain,
      title: "10x Your Content Creation Speed",
      description: "Generate weeks of high-performing tweets in minutes, not hours. Our AI analyzes your past successes to replicate winning patterns.",
      highlight: "Save 20+ hours per month"
    },
    {
      icon: BarChart,
      title: "Double Your Engagement Rate",
      description: "Get data-driven recommendations that consistently outperform manual tweeting. Users see up to 200% increase in engagement.",
      highlight: "Proven results"
    },
    {
      icon: MessageSquare,
      title: "Keep Your Authentic Voice",
      description: "Our AI learns your unique style, tone, and hashtag preferences to maintain authenticity while maximizing reach.",
      highlight: "100% unique to you"
    },
    {
      icon: Lightbulb,
      title: "Never Run Out of Ideas",
      description: "Get fresh, relevant content suggestions based on trending topics in your niche and your audience's interests.",
      highlight: "Always trending"
    },
    {
      icon: TrendingUp,
      title: "Optimize Every Tweet",
      description: "Post at peak times with optimized hashtags, thread structures, and call-to-actions that drive engagement.",
      highlight: "Maximum impact"
    }
  ];
  
  const Features = () => {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center space-y-6 mb-16">
            <h3 className="text-3xl font-bold">
              Your Personal Tweet Copilot: From Zero to Viral
            </h3>
          </div>
          <div className="space-y-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-lg border-2 hover:border-blue-500 transition-colors bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="h-12 w-12 text-[#1DA1F2]" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium dark:bg-blue-900 dark:text-blue-100">
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  