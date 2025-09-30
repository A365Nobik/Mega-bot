import Image from "next/image";

export interface IProps {
  w: number;
  h: number;
  src: string;
}

const ImageBlock = ({ w, h, src }: IProps) => {
  return (
    <span className={`flex justify-center items-center w-${w / 4} h-${h / 4}`}>
      <Image
        width={w}
        height={h}
        className="inset-0 rounded-full"
        src={src}
        alt="user-avatar"
      />
    </span>
  );
};

export default ImageBlock;
