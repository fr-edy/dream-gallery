import React from "react";
import { motion } from "motion/react";

interface DreamCardProps {
  date: string;
  title: string;
  description: string;
  backgroundImage?: string;
  disableEntranceAnimations?: boolean;
}

const DreamCard: React.FC<DreamCardProps> = ({
  date,
  title,
  description,
  backgroundImage = "/images/dream-background.png",
  disableEntranceAnimations = false,
}) => {
  return (
    <motion.div
      className="relative flex h-[418px] w-[370px] items-end overflow-hidden rounded-[20px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      {...(!disableEntranceAnimations
        ? {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
          }
        : {})}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        rotateX: 1,
        boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8
        }
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8
      }}
    >
      <motion.div 
        className="flex flex-grow flex-col items-start rounded-tr-[3px] rounded-br-[20px] rounded-bl-[20px] bg-white/[0.067] p-[17px_20px_5px_20px] shadow-[inset_0px_-1px_9px_0px_rgba(255,255,255,0.125),inset_0px_0px_4px_0px_rgba(255,255,255,0.125),0px_4px_4px_0px_rgba(0,0,0,0.25),3px_5px_48px_-12px_rgba(0,0,0,0.15),0px_1px_12px_-8px_rgba(0,0,0,0.15)] backdrop-blur-[5px]"
        {...(!disableEntranceAnimations
          ? {
              initial: { y: 20, opacity: 0 },
              animate: { y: 0, opacity: 1 },
            }
          : {})}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2 
          className="font-serif text-2xl leading-[33px] text-white"
          {...(!disableEntranceAnimations
            ? {
                initial: { x: -20, opacity: 0 },
                animate: { x: 0, opacity: 1 },
              }
            : {})}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        >
          {date}
        </motion.h2>
        <motion.h3 
          className="mt-4 font-serif text-xl leading-[27px] text-white"
          {...(!disableEntranceAnimations
            ? {
                initial: { x: -20, opacity: 0 },
                animate: { x: 0, opacity: 1 },
              }
            : {})}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="mt-4 h-[50px] w-[266px] font-serif text-xs leading-relaxed text-white"
          {...(!disableEntranceAnimations
            ? {
                initial: { x: -20, opacity: 0 },
                animate: { x: 0, opacity: 1 },
              }
            : {})}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        >
          {description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default DreamCard;
