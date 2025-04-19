import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  MessageCircle,
  Target,
  Clock,
  Lock,
} from "lucide-react";

const ComparisonBanner = () => {
  const comparisons = [
    {
      feature: "Personalized Voice",
      description: "Learns your unique Twitter voice and style",
      tweetEcho: true,
      genericAI: false,
      manual: false,
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      feature: "Engagement Optimization",
      description: "Optimized specifically to increase Twitter metrics",
      tweetEcho: true,
      genericAI: false,
      manual: false,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      feature: "Time Efficiency",
      description: "Generate weeks of content in minutes",
      tweetEcho: true,
      genericAI: true,
      manual: false,
      icon: <Clock className="w-5 h-5" />,
    },
    {
      feature: "Audience Analysis",
      description: "Studies your followers' preferences and patterns",
      tweetEcho: true,
      genericAI: false,
      manual: false,
      icon: <Target className="w-5 h-5" />,
    },
    {
      feature: "Content Control",
      description: "Full approval and editing before publishing",
      tweetEcho: true,
      genericAI: true,
      manual: true,
      icon: <Lock className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Why TweetEcho Outperforms Alternatives
            </h2>
            <p className="text-lg text-gray-600">
              The only AI tool specifically designed for Twitter that learns
              from <span className="font-semibold">your</span> most successful
              content
            </p>
          </div>

          <div className="border rounded-lg shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b">
              <div className="py-4 px-5"></div>
              <div className="py-4 px-5 text-center">
                <span className="font-medium">TweetEcho</span>
              </div>
              <div className="py-4 px-5 text-center">
                <span className="font-medium">Generic AI</span>
              </div>
              <div className="py-4 px-5 text-center">
                <span className="font-medium">
                  Manual
                  <br />
                  Tweeting
                </span>
              </div>
            </div>

            {/* Feature rows */}
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-b last:border-b-0"
              >
                <div className="py-4 px-5 flex items-center gap-3">
                  <div className="text-gray-700">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-base">{item.feature}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="py-4 px-5 flex justify-center items-center">
                  {item.tweetEcho ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="py-4 px-5 flex justify-center items-center">
                  {item.genericAI ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="py-4 px-5 flex justify-center items-center">
                  {item.manual ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {`Only TweetEcho analyzes your specific audience engagement patterns to create content that truly sounds like you.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonBanner;
