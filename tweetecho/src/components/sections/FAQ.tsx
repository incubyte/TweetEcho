
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
      question: "How does TweetEcho learn my style?",
      answer: "TweetEcho analyzes your past tweets, engagement patterns, and writing style to create a unique voice profile. This includes studying your tone, hashtag usage, emoji frequency, and the types of content that resonates most with your audience."
    },
    {
      question: "Can I edit suggestions before posting?",
      answer: "Absolutely! You have full control over all content. TweetEcho provides suggestions that you can edit, modify, or use as inspiration for your own tweets."
    },
    {
      question: "How much time will this save me?",
      answer: "Most users report saving 5-10 hours per week on content creation. TweetEcho helps you generate quality tweets quickly while maintaining your authentic voice."
    },
    {
      question: "Will people know I'm using AI assistance?",
      answer: "No. TweetEcho is designed to enhance your natural writing style, not replace it. The content generated matches your voice so authentically that it's indistinguishable from your regular tweets."
    }
  ];
  
  const FAQ = () => {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  };
  
  export default FAQ;
  