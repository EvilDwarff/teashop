import Image from "next/image";
import '../globals.css';
import { Prosto_One, Montserrat } from "next/font/google";

const prostoOne = Prosto_One({
    weight: '400',
    subsets: ["latin"],
});
const montserrat = Montserrat({
    weight: '400',
    subsets: ["latin"],
});

export default function Wholesalers() {
    return (
        <div className="flex items-center p-8 pt-8">
            <div className="flex flex-col text-left justify-center w-1/2"> 
                <h1 className={`${prostoOne.className} text-4xl leading-[44px]`}>
                    FOR WHOLESALERS
                </h1>
                <p className={`${montserrat.className} text-[16px] leading-[24px] tracking-[0.5px] mt-4`}>
                We provide premium loose tea leaves, offering over 450 varieties to suit any business. From cozy cafés to luxury hotels, our selection includes black, green, herbal, oolong, and fruit teas, all carefully sourced for exceptional quality.<br/><br/>

We offer customizable options to match your brand and flexible ordering to support your needs. Partner with us to create unique tea experiences for your customers.
</p>
                <button className="border border-black text-black text-[14px] font-medium w-[281px] h-[56px] flex items-center justify-center hover:bg-gray-300 mt-4">
                    GET A FREE CONSULTATION
                </button>
            </div>
            <div className="w-1/2 flex justify-end">
                <Image
                    src="/2.png"
                    alt="WHOLESALERS"
                    width={628}
                    height={628}
                    className="object-cover"
                />
            </div>
        </div>
    );
}