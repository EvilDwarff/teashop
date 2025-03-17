import Image from "next/image";
import '../globals.css';
import Link from "next/link";5
import { Prosto_One, Montserrat } from "next/font/google";


const prostoOne = Prosto_One({
    weight: '400',
    subsets: ["latin"],
  });
  const montserrat = Montserrat({
    weight: '400',
    subsets: ["latin"],
  });
export default function Main() {
    
    return (
        <div className="flex items-center p-8 pt-8">

            <div className="flex-shrink-0 w-[628px] h-[628px] overflow-hidden pl-8">
                <Image
                    src="/1.png"
                    alt="main"
                    width={628}
                    height={628}
                    className="object-cover"
                />
            </div>
          
      
            <div className="flex flex-col  ml-12 text-left justify-center"> 
                <div>
                <h1 className={`${prostoOne.className} text-4xl leading-[44px]`}>
                    Every day is unique, just like our tea
                </h1>
                </div>
                <div>
                <p className={`${montserrat.className} text-[16px] leading-[24px] tracking-[0.5px] mt-4`}>
We believe that the most meaningful moments are made of little things: the aroma of freshly brewed tea, the warmth in your hands, and the comfort that comes with every sip. Our tea is more than just a drink—it’s a story that begins with the first leaves, handpicked in the most picturesque corners of the world.<br/><br/>

We carefully select every leaf to preserve its natural harmony and uniqueness. After all, just like the days, every tea variety is one-of-a-kind—it can be vibrant and invigorating, delicate and soothing, or rich and full-bodied.<br/><br/>

Take a moment to indulge. Discover flavors that inspire and aromas that transport you to faraway lands. Because every day deserves to be special.


                </p>
                </div>
                <div>
                    <Link href="/products">
                <button className="mt-6 bg-[#3D3D3D] text-white uppercase text-[14px] leading-[20px] tracking-[0.1px] px-8 py-4 w-[263px] h-[56px] text-center hover:bg-gray-600">
                    Browes Teas
                </button>
                </Link>
                </div>
                
            </div>
        </div>
    );
}
