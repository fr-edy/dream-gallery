import React from "react";

interface DreamCardProps {
  date: string;
  title: string;
  description: string;
  backgroundImage?: string;
}

const DreamCard: React.FC<DreamCardProps> = ({
  date,
  title,
  description,
  backgroundImage = "/images/dream-background.png",
}) => {
  return (
    <div
      className="relative flex h-[418px] w-[370px] items-end overflow-hidden rounded-[20px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="flex flex-grow flex-col items-start rounded-tr-[3px] rounded-br-[20px] rounded-bl-[20px] bg-white/[0.067] p-[17px_20px_5px_20px] shadow-[inset_0px_-1px_9px_0px_rgba(255,255,255,0.125),inset_0px_0px_4px_0px_rgba(255,255,255,0.125),0px_4px_4px_0px_rgba(0,0,0,0.25),3px_5px_48px_-12px_rgba(0,0,0,0.15),0px_1px_12px_-8px_rgba(0,0,0,0.15)] backdrop-blur-[5px]">
        <h2 className="font-serif text-2xl leading-[33px] text-white">
          {date}
        </h2>
        <h3 className="mt-4 font-serif text-xl leading-[27px] text-white">
          {title}
        </h3>
        <p className="mt-4 h-[50px] w-[266px] font-serif text-xs leading-relaxed text-white">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DreamCard;
