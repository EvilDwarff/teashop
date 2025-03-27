'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Prosto_One, Montserrat } from "next/font/google";

const prostoOne = Prosto_One({
  weight: '400',
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: '400',
  subsets: ["latin"],
});

const collections = ["black tea", "green tea", "white tea", "oolong", "rooibos", "red tea"];

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const selected = searchParams.getAll("collection");
    setSelectedCollections(selected.length > 0 ? selected : collections);
  }, [searchParams]);

  useEffect(() => {
    if (selectedCollections.length > 0) {
      fetch(`/api/products?${selectedCollections.map(c => `collection=${encodeURIComponent(c)}`).join('&')}`)
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [selectedCollections]);

  const toggleCollection = (collection) => {
    const newSelections = selectedCollections.includes(collection)
      ? selectedCollections.filter(c => c !== collection)
      : [...selectedCollections, collection];
    
    const queryString = newSelections.map(c => `collection=${encodeURIComponent(c)}`).join('&');
    router.push(`/products?${queryString}`);
  };

  return (
    <div>
      <Header />
      <div className="w-full h-[350px] relative">
        <Image src="/banner.png" alt="Products Banner" layout="fill" objectFit="cover" />
      </div>
    
      <div className="flex px-8 py-6">
        <div className="w-1/8 p-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Collections</h2>
          {collections.map((collection) => (
            <label key={collection} className="block mb-2">
              <input
                type="checkbox"
                checked={selectedCollections.includes(collection)}
                onChange={() => toggleCollection(collection)}
                className="mr-2"
              />
              {collection.charAt(0).toUpperCase() + collection.slice(1)}
            </label>
          ))}
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-6 p-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="flex flex-col items-center text-center p-4 rounded-lg h-full cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
                <div className="flex flex-col justify-end flex-grow w-full">
                  <p className="text-gray-800 font-medium mt-4">{product.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-3">No products found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
