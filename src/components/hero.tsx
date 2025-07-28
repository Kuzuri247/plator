import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 bg-gradient-hero">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto tracking-tighter">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <ColourfulText text="Everything in a Plate" />
            <br />
            <ColourfulText text="Create with Style" />
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-wrap">
            Transform your content creation with meme templates, stylish text
            integration, and smart post scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-primary dark:bg-gradient-primary-dark hover:shadow-purple transition-all text-lg px-8 py-6 hover:-translate-y-1 ease-in-out duration-200"
            >
              <p>Start Creating Free</p>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-neutral-200 dark:bg-neutral-800 border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-smooth text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ColourfulText({ text }: { text: string }) {
  const colors = ['currentColor']; // Single color to maintain the parent text color

  const [currentColors, setCurrentColors] = useState(colors);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          initial={{
            y: 0,
          }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.01, 1],
            filter: ['blur(0px)', `blur(5px)`, 'blur(0px)'],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block whitespace-pre tracking-tight"
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}
