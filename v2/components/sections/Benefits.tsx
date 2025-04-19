import { Card, CardContent } from "@/components/ui/card";
import { Clock, Rocket, BarChart, MessageCircle, Users } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Never Run Out of Ideas",
    description:
      "AI identifies your content themes and suggests fresh angles that resonate with your audience. No more staring at a blank screen.",
    stat: "80%",
    statLabel: "time saved",
  },
  {
    icon: MessageCircle,
    title: "Consistent Brand Voice",
    description:
      "Maintains your unique tone, style, and personality even when scaling your content—your followers won't know the difference.",
    stat: "100%",
    statLabel: "authentic to you",
  },
  {
    icon: BarChart,
    title: "Data-Driven Optimization",
    description:
      "Continuously learns from engagement patterns to improve your content strategy and maximize reach.",
    stat: "36%",
    statLabel: "engagement boost",
  },
  {
    icon: Users,
    title: "Trusted by Creators",
    description:
      "Join thousands of content creators, business owners, and personal brands who've transformed their Twitter presence.",
    stat: "7.5K+",
    statLabel: "active users",
  },
  {
    icon: Rocket,
    title: "Accelerate Your Growth",
    description:
      "Build authority in your niche faster with consistently high-quality content that positions you as a thought leader.",
    stat: "2.8x",
    statLabel: "follower growth",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Creators Choose TweetEcho
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Stop struggling with inconsistent content. Our AI understands what
            makes your audience engage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border-2 hover:border-blue-500"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                    <benefit.icon className="h-8 w-8 text-[#1DA1F2]" />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full mb-3">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {benefit.stat} {benefit.statLabel}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                {`TweetEcho transformed my Twitter strategy. Before, I'd spend
                hours each week trying to come up with content. Now I spend 20
                minutes reviewing AI suggestions that consistently outperform my
                manual tweets. My engagement has doubled in just two months.`}
              </p>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Digital Marketing Consultant
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  +127% engagement rate increase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
