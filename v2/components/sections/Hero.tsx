import { Megaphone, Twitter as TwitterIcon, CheckCircle } from "lucide-react";
import SignInButton from "../auth/signin-button";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
              <Megaphone className="h-6 w-6 text-[#1DA1F2]" />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Turn Your Best Tweets into a Consistent Content Engine
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            TweetEcho analyzes your highest-performing content to generate
            authentic tweets that drive 40% more engagement—while saving you
            hours each week
          </p>

          {/* Metrics Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#1DA1F2]">7,500+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Twitter users
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#1DA1F2]">250,000+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhanced tweets
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#1DA1F2]">36%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average engagement increase
              </p>
            </div>
          </div>

          {/* Success Path */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
            {[
              {
                step: "1",
                title: "Connect Twitter",
                description: "Takes just 1 minute",
                icon: TwitterIcon,
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "We analyze your top content",
                icon: CheckCircle,
              },
              {
                step: "3",
                title: "Strategy Dashboard",
                description: "Get personalized insights",
                icon: CheckCircle,
              },
              {
                step: "4",
                title: "Publish & Grow",
                description: "Better tweets, automated",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/4 right-0 w-full h-0.5 bg-blue-200 -mr-6 z-0"></div>
                )}
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3 z-10 relative">
                  <item.icon className="w-6 h-6 text-[#1DA1F2]" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Single CTA */}
          <div className="flex justify-center items-center max-w-lg mx-auto mb-8">
            <SignInButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
