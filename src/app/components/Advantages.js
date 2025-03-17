import Image from "next/image";
import '../globals.css';

export default function Advantages() {
  return (
    <div className="bg-[#E4E4E4] py-8 flex flex-col items-center">
                <div className="flex justify-center space-x-12 mb-6">
                    <div className="flex items-center space-x-2">
                    <Image
                        src="/local_cafe.svg"
                        alt="cofe"
                        width={24}
                        height={24}
                    />
                        <span className="text-[16px] font-medium">450+ KIND OF LOOSE TEA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Image
                        src="/redeem.svg"
                        alt="redeem"
                        width={24}
                        height={24}
                    />
                        <span className="text-[16px] font-medium">CERTIFICATED ORGANIC TEAS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Image
                        src="/local_shipping.svg"
                        alt="shipping"
                        width={24}
                        height={24}
                    />
                        <span className="text-[16px] font-medium">FREE DELIVERY</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Image
                        src="/sell.svg"
                        alt="sell"
                        width={24}
                        height={24}
                    />
                        <span className="text-[16px] font-medium">SAMPLE FOR ALL TEAS</span>
                    </div>
                </div>
                <button className="border border-black text-black text-[14px] font-medium w-[281px] h-[56px] flex items-center justify-center hover:bg-gray-300">
                    LEARN MORE
                </button>
            </div>
        
  )

}