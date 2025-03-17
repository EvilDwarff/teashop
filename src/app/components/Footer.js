import Image from "next/image";
import '../globals.css';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: '400',
    subsets: ["latin"],
});

export default function Footer() {
    return (
        <footer className="bg-[#F4F4F4] py-12 px-8 text-black">
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 text-left">
                {/* Collections */}
                <div>
                    <h2 className={`${montserrat.className} text-lg font-semibold mb-4`}>Collections</h2>
                    <ul className="space-y-2 text-sm">
                        {['Black teas', 'Green teas', 'White teas', 'Oolong', 'Rooibos', 'Red teas'].map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Learn */}
                <div>
                    <h2 className={`${montserrat.className} text-lg font-semibold mb-4`}>Learn</h2>
                    <ul className="space-y-2 text-sm">
                        {['About us', 'About our teas', 'Tea academy'].map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h2 className={`${montserrat.className} text-lg font-semibold mb-4`}>Customer Service</h2>
                    <ul className="space-y-2 text-sm">
                        {['Ordering and payment', 'Delivery', 'Privacy and policy', 'Terms & Conditions'].map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Contact Us */}
                <div id="contact">
                    <h2 className={`${montserrat.className} text-lg font-semibold mb-4`}>Contact Us</h2>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-2">
                            <Image src="/location-icon.svg" alt="Location" width={18} height={18} />
                            <span>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Image src="/email-icon.svg" alt="Email" width={18} height={18} />
                            <span>Email: amoopur@gmail.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Image src="/phone-icon.svg" alt="Phone" width={18} height={18} />
                            <span>Tel: +98 9173038406</span>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
