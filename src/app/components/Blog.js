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

export default function Blog() {
    return (
        <div  className="flex flex-col items-center p-8 bg-[#F4F4F4] text-black">
        
            <h2 id="blog" className={`${prostoOne.className} text-4xl leading-[44px] mb-8`}>Last Blog Posts</h2>
            
            <div className="flex gap-6 mb-8">
                <Image
                    src="/blog-image-1.jpg"
                    alt="How to Steep Tea Like a Pro"
                    width={263}
                    height={360}
                    className="object-cover"
                />
                <div className="max-w-md">
                    <h3 className={`${prostoOne.className} text-[22px] mb-2`}>How to Steep Tea Like a Pro</h3>
                    <p className={`${montserrat.className} text-[16px]`}>
                        Brewing the perfect cup of tea is an art, and it all starts with the right technique. Begin by selecting fresh, high-quality tea leaves or bags. Heat your water to the ideal temperature—green tea prefers 175°F (80°C), while black tea thrives at 212°F (100°C). Steep for the recommended time, usually 2-5 minutes, depending on the type of tea. Oversteeping can lead to bitterness, so keep an eye on the clock. Finally, pour and savor the moment. With these simple steps, you’ll unlock the full flavor and aroma of your tea, turning every sip into a masterpiece.
                    </p>
                </div>
            </div>
            
           
            <div className="flex gap-6">
               
                <div className="max-w-md">
                    <h3 className={`${prostoOne.className} text-[22px] mb-2`}>All about tea aromas</h3>
                    <p className={`${montserrat.className} text-[16px]`}>
                        The world of tea is a symphony of scents, each variety offering its own unique bouquet. Floral notes dance in jasmine and chamomile, while earthy tones ground pu-erh and green teas. Citrusy hints brighten herbal blends, and smoky whispers linger in lapsang souchong. These aromas are not just delightful—they tell the story of the tea’s origin, processing, and character. To fully appreciate them, take a moment to inhale deeply before each sip. Let the fragrance transport you to lush fields, misty mountains, or sunlit gardens. Tea is more than a drink; it’s an experience for the senses.
                    </p>
                </div>
                <Image
                    src="/blog-image-2.jpg"
                    alt="All about tea aromas"
                    width={263}
                    height={360}
                    className="object-cover"
                />
            </div>
        </div>
    );
}
