import Image from "next/image";

export interface GridInfoCardProps {
  title: string;
  value: string;
  imageNum: 1 | 2 | 3;
}

const GridInfoCard = ({ title, value, imageNum }: GridInfoCardProps) => {
  return (
    <div className="w-full rounded-lg p-6 px-8 border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm text-foreground/60">{title}</p>
          <p className="text-2xl text-foreground/90 font-semibold mt-2">{value}</p>
        </div>
        <Image src={`/${imageNum}.png`} alt="img" height={60} width={80} />
      </div>
    </div>
  );
};

export default GridInfoCard;
