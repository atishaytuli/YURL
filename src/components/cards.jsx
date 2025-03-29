import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Cards = () => {
  return (
    <div className="relative bg-[#F7F4EE] mt-12 w-full px-6 md:px-12 py-16 md:py-20 flex flex-col items-center">
      <img
        src="./link.svg"
        alt="Link Icon"
        className="absolute top-6 right-6 w-12 md:w-16"
      />
      <div className="max-w-screen-lg text-center mx-auto">
        <h2 className="text-3xl md:text-6xl font-semibold text-gray-900">
          Get the most out of <br />
          every url you share.
        </h2>

        <p className="mt-6 text-gray-700 text-xl max-w-2xl mx-auto">
          Create personalized short links and transfer links from one domain
          to another. It's easy to get started and it's free —{" "}
          <span className="relative inline-block">
            two things everyone loves.
            <span className="absolute bottom-[-1px] left-0 w-full h-2 bg-yellow-300"></span>
          </span>
        </p>

        <button className="mt-12 flex items-center gap-2 bg-blue-900 text-white px-6 py-3  font-semibold shadow-md hover:bg-blue-700 transition-all mx-auto hover:rounded-lg">
          Get Started
          <img src="./star.svg" alt="Star Icon" className="w-4" />
        </button>
      </div>

      {/* Accordion Section */}
      <Accordion type="multiple" collapsible className="w-full max-w-2xl my-16">
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold text-lg">
            How does &nbsp; YURL URL Shortener work?
          </AccordionTrigger>
          <AccordionContent className="text-blue-900 text-base">
            Simply paste your long URL, click "Shorten Now," and get a short,
            shareable YURL instantly!
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="font-semibold text-lg">
            Is &nbsp; YURL Shortener free to use?
          </AccordionTrigger>
          <AccordionContent className="text-blue-900 text-base">
            Yes! YURL is completely free for basic usage. Advanced analytics and
            custom URLs are available with premium plans.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="font-semibold text-lg">
            Can I track my &nbsp; YURL shortened URLs?
          </AccordionTrigger>
          <AccordionContent className="text-blue-900 text-base">
            Yes! YURL provides real-time analytics, including clicks, location,
            and device type.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Bottom Left Floating SVG */}
      <img
        src="./star.svg"
        alt="Decorative Star"
        className="w-16 md:w-24 absolute bottom-6 left-6"
      />
    </div>
  );
};

export default Cards;
