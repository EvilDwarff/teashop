import Image from "next/image";
import Link from "next/link";
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

export default function Tea() {
    return (
        <div className="w-full py-14 text-center mt-8">
            <h2 id="collections" className={`${prostoOne.className} text-4xl leading-[44px] mb-8`}>Our Collections</h2>
            <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[ 
                    { name: "GREEN TEA", src: "/green-tea.jpg", link: "/products?collection=green tea" },
                    { name: "BLACK TEA", src: "/black-tea.jpg", link: "/products?collection=black tea" },
                    { name: "WHITE TEA", src: "/white-tea.jpg", link: "/products?collection=white tea" },
                    { name: "RED TEA", src: "/red-tea.jpg", link: "/products?collection=red tea" },
                    { name: "OOLONG", src: "/oolong.jpg", link: "/products?collection=oolong" },
                    { name: "ROOIBOS", src: "/rooibos.jpg", link: "/products?collection=rooibos" },
                ].map((item, index) => (
                    <Link key={index} href={item.link} className="flex flex-col items-center cursor-pointer">
                        <Image src={item.src} alt={item.name} width={360} height={360} className="object-cover" />
                        <p className={`${montserrat.className} text-[16px] font-medium mt-4 uppercase`}>{item.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
