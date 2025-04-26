import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: number;
  image: string;
  title: string;
  description: string;
}

const banners: Banner[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&q=75&fit=crop&w=600",
    title: "Special Thali",
    description: "Get 20% off on your first order"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&q=75&fit=crop&w=600",
    title: "Free Delivery",
    description: "On orders above ₹300"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&q=75&fit=crop&w=600",
    title: "Trending Now",
    description: "Try Mumbai's best Vada Pav"
  }
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  
  const next = () => {
    setCurrent((current + 1) % banners.length);
  };
  
  const prev = () => {
    setCurrent((current - 1 + banners.length) % banners.length);
  };
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-40 md:h-56 overflow-hidden rounded-xl">
      <div 
        className="flex h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="w-full h-full flex-shrink-0 relative"
          >
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="text-xl font-bold">{banner.title}</h3>
              <p className="text-sm">{banner.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={prev}
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        onClick={next}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
      >
        <ChevronRight size={20} />
      </button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "w-2 h-2 rounded-full",
              current === index ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
