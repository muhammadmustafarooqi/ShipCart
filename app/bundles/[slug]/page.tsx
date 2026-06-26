"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Package, ShoppingBag, Plus, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

interface Bundle {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bundlePrice: number;
  itemsRequired: number;
  images: string[];
  allowedProducts: Product[];
}

export default function BundlePage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/bundles/${slug}`);
        if (!res.ok) {
          router.push('/404');
          return;
        }
        const data = await res.json();
        setBundle(data.bundle);
      } catch (error) {
        console.error("Failed to fetch bundle:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBundle();
  }, [slug, router]);

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p._id === product._id);
      if (isSelected) {
        return prev.filter(p => p._id !== product._id);
      } else {
        if (bundle && prev.length >= bundle.itemsRequired) {
          toast.error(`You can only select up to ${bundle.itemsRequired} items.`);
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleAddToCart = () => {
    if (!bundle) return;
    if (selectedProducts.length !== bundle.itemsRequired) {
      return toast.error(`Please select exactly ${bundle.itemsRequired} items to build this bundle.`);
    }

    const sortedIds = selectedProducts.map(p => p._id).sort().join(",");
    const cartLineId = `bundle-${bundle._id}-${sortedIds}`;

    const bundleItem = {
      productId: cartLineId,
      bundleId: bundle._id,
      name: bundle.name,
      price: bundle.bundlePrice,
      quantity: 1,
      image: bundle.images?.[0] || selectedProducts[0]?.images?.[0] || "",
      selectedBundleItems: selectedProducts.map(p => ({ productId: p._id, name: p.name })),
    };

    addItem(bundleItem);
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bundle) return null;

  const isComplete = selectedProducts.length === bundle.itemsRequired;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-['Outfit']">
      <Navbar />
      
      <main className="flex-1 page-container py-12 px-4 md:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Store
        </Link>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Left Column - Product Grid */}
          <div>
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{bundle.name}</h1>
              {bundle.description && <p className="text-gray-600 text-lg">{bundle.description}</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Choose Your Items</h2>
                  <p className="text-gray-500 font-medium">Select exactly {bundle.itemsRequired} items to build your bundle.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-slate-900">Rs. {bundle.bundlePrice}</div>
                  <div className="text-sm font-bold text-orange-500">Bundle Deal</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bundle.allowedProducts.map(product => {
                  const isSelected = selectedProducts.some(p => p._id === product._id);
                  return (
                    <div 
                      key={product._id} 
                      onClick={() => toggleProduct(product)}
                      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden group bg-gray-50 ${isSelected ? 'border-slate-900 shadow-md ring-4 ring-slate-100' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <div className="aspect-square relative bg-white mix-blend-multiply">
                        <Image
                          src={product.images?.[0] || "https://placehold.co/400x400/ffffff/cccccc?text=Product"}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg transform scale-100 animate-in zoom-in duration-200">
                              <Check size={24} strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`p-4 border-t transition-colors ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-gray-100 text-slate-900'}`}>
                        <div className="font-bold text-sm line-clamp-2 mb-1">{product.name}</div>
                        <div className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-gray-500 line-through'}`}>
                          Value: Rs. {product.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Box */}
          <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: "400px" }}>
            <div className="bg-slate-900 text-white p-6 text-center">
              <Package size={32} className="mx-auto mb-2 opacity-80" />
              <h3 className="text-xl font-bold">Your Bundle Box</h3>
              <p className="text-white/70 text-sm mt-1">{selectedProducts.length} of {bundle.itemsRequired} Selected</p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4 bg-gray-50/50">
              {Array.from({ length: bundle.itemsRequired }).map((_, idx) => {
                const product = selectedProducts[idx];
                return (
                  <div key={idx} className={`h-20 rounded-xl border-2 border-dashed flex items-center p-2 gap-3 transition-colors ${product ? 'border-slate-900 bg-white shadow-sm border-solid' : 'border-gray-300 bg-gray-50'}`}>
                    {product ? (
                      <>
                        <div className="w-14 h-14 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.images[0] || "https://placehold.co/100x100"} alt={product.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-500 mb-0.5">Item {idx + 1}</div>
                          <div className="text-sm font-bold text-slate-900 truncate">{product.name}</div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleProduct(product); }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-gray-50 rounded-full hover:bg-red-50 transition-colors mr-1"
                        >
                          <X size={16} strokeWidth={2.5} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center text-gray-400 text-sm font-semibold gap-2">
                        <Plus size={16} /> Select Item {idx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isComplete 
                    ? "bg-[#ff6b00] text-white hover:bg-[#e66000] shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={20} />
                {isComplete ? "Add Bundle to Cart" : `Select ${bundle.itemsRequired - selectedProducts.length} More`}
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
