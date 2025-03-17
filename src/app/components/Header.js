'use client';

import Image from "next/image";
import Link from "next/link";
import '../globals.css';
import { Prosto_One, Montserrat } from "next/font/google";
import { useRouter } from 'next/navigation';


const prostoOne = Prosto_One({
    weight: '400',
    subsets: ["latin"],
});
const montserrat = Montserrat({
    weight: '400',
    subsets: ["latin"],
});

export default function Header() {
  const router = useRouter();

  const handleAccountRedirect = () => {
    router.push('/account');
  };

  return (
    <div className="sticky top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-8 py-6">
      
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            priority={true}
            className="dark:invert cursor-pointer"
            src="/LoGo.svg"
            alt="logo"
            width={192}
            height={48}
          />
        </Link>
      </div>
      
      <nav className={`${montserrat.className} flex flex-1 justify-center space-x-8 font-medium text-gray-700 uppercase`}>
        <Link href="/" className="hover:text-gray-900 cursor-pointer">Home</Link>
        <Link href="/#collections" className="hover:text-gray-900 cursor-pointer">Tea Collections</Link>
        <Link href="/products" className="hover:text-gray-900 cursor-pointer">Products</Link>
        <Link href="/#blog" className="hover:text-gray-900 cursor-pointer">Blog</Link>
        <Link href="/#contact" className="hover:text-gray-900 cursor-pointer">Contact Us</Link>

    
      
      
      </nav>

      
      <div className="flex space-x-6 items-center">
        <Image
          src="/Person.svg"
          alt="user profile"
          width={24}
          height={24}
          className="cursor-pointer hover:opacity-80"
          onClick={handleAccountRedirect}
        />
        <Link href="/cart">
          <Image src="/local_mall.svg" alt="cart" width={24} height={24} className="cursor-pointer hover:opacity-80" />
        </Link>
      </div>
    </div>
  );
}
