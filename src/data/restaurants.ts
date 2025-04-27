export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  isPopular: boolean;
  category: string;
  subCategory: string;
  description: string;
  specialIngredients?: string;
  spiceLevel: 'Low' | 'Medium' | 'High' | 'None';
  portionSize: string;
  dietaryInfo: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  bannerImage: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  distance: string;
  description: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  cuisines: string[];
  specialDiets: string[];
  operatingHours: string;
  isVeg: boolean;
  costForTwo: number;
  menu: {
    [key: string]: MenuItem[];
  };
}

export const restaurantsData: { [key: string]: Restaurant } = {
  "1": {
    id: "1",
    name: "Maharaja Thali House",
    image: "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage: "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    ratingCount: 245,
    deliveryTime: "30-40 min",
    distance: "1.2 km",
    description: "A delivery-only service offering traditional North Indian thalis and desserts.",
    address: "Shop 2, Ground Floor, Penkarpada, Pawar Niwas, Dehubratgharat Chawl, Near Shankarmandir, Mira Road, Mumbai",
    coordinates: {
      latitude: 19.2967,
      longitude: 72.8504
    },
    phone: "+91 84299 84513",
    cuisines: ["North Indian", "Desserts"],
    specialDiets: ["Vegetarian", "Jain"],
    operatingHours: "10:30 AM - 9:30 PM",
    isVeg: true,
    costForTwo: 600,
    menu: {
      thalis: [
        {
          id: "t1",
          name: "Royal Maharaja Thali",
          price: 399,
          isVeg: true,
          isPopular: true,
          category: "Thali",
          subCategory: "Deluxe",
          description: "A grand thali with 4 curries, 2 breads, rice, dessert, and more",
          specialIngredients: "Ghee-laced rotis, seasonal sabzis, served with lassi",
          spiceLevel: "Medium",
          portionSize: "Full meal",
          dietaryInfo: "Can be made Jain on request"
        },
        {
          id: "t2",
          name: "Rajwadi Special Thali",
          price: 499,
          isVeg: true,
          isPopular: true,
          category: "Thali",
          subCategory: "Premium",
          description: "Premium thali with 6 curries, 3 breads, pulao, and special dessert",
          specialIngredients: "Special paneer dishes, dry fruits, and traditional sweets",
          spiceLevel: "Medium",
          portionSize: "Full meal",
          dietaryInfo: "Pure vegetarian"
        }
      ],
      starters: [
        {
          id: "s1",
          name: "Paneer Tikka",
          price: 180,
          isVeg: true,
          isPopular: true,
          category: "Starters",
          subCategory: "Grilled",
          description: "Marinated paneer cubes grilled to perfection",
          specialIngredients: "Tandoori masala, grilled with mint chutney",
          spiceLevel: "Medium",
          portionSize: "6 pieces",
          dietaryInfo: "Suitable for vegetarians"
        }
      ],
      breads: [
        {
          id: "b1",
          name: "Aloo Paratha",
          price: 120,
          isVeg: true,
          isPopular: true,
          category: "Breads",
          subCategory: "Indian bread",
          description: "Soft paratha stuffed with spiced potato filling",
          specialIngredients: "Served with pickle and yogurt",
          spiceLevel: "Low",
          portionSize: "2 pieces",
          dietaryInfo: "Can be made vegan"
        }
      ],
      mainCourse: [
        {
          id: "m1",
          name: "Chole Bhature",
          price: 220,
          isVeg: true,
          isPopular: true,
          category: "Main Course",
          subCategory: "Punjabi",
          description: "Fried bread paired with spicy chickpea curry",
          specialIngredients: "Served with pickled onions and yogurt",
          spiceLevel: "Medium",
          portionSize: "2 bhatures + chole",
          dietaryInfo: "Vegan-friendly"
        }
      ],
      rice: [
        {
          id: "r1",
          name: "Veg Biryani",
          price: 250,
          isVeg: true,
          isPopular: true,
          category: "Rice",
          subCategory: "Biryani",
          description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
          specialIngredients: "Garnished with fried onions and mint",
          spiceLevel: "Medium",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "r2",
          name: "Paneer Pulao",
          price: 280,
          isVeg: true,
          isPopular: true,
          category: "Rice",
          subCategory: "Pulao",
          description: "Aromatic rice preparation with fresh paneer cubes and mild spices",
          specialIngredients: "Fresh cottage cheese and saffron",
          spiceLevel: "Low",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegetarian"
        }
      ],
      desserts: [
        {
          id: "d1",
          name: "Gulab Jamun",
          price: 80,
          isVeg: true,
          isPopular: true,
          category: "Desserts",
          subCategory: "Sweet",
          description: "Soft, syrup-soaked deep-fried dumplings",
          specialIngredients: "Made with khoya and dipped in rose-flavored syrup",
          spiceLevel: "None",
          portionSize: "2 pieces",
          dietaryInfo: "Vegetarian"
        }
      ],
      sideDishes: [
        {
          id: "sd1",
          name: "Raita (Boondi)",
          price: 50,
          isVeg: true,
          isPopular: false,
          category: "Side Dish",
          subCategory: "Yogurt-based",
          description: "Chilled yogurt with boondi and spices",
          specialIngredients: "Cumin, coriander, and chili powder",
          spiceLevel: "Low",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegetarian"
        }
      ],
      beverages: [
        {
          id: "bev1",
          name: "Lassi (Sweet)",
          price: 90,
          isVeg: true,
          isPopular: true,
          category: "Beverages",
          subCategory: "Yogurt drink",
          description: "Creamy, sweet yogurt drink",
          specialIngredients: "Served chilled with a sprinkle of cardamom",
          spiceLevel: "None",
          portionSize: "Glass",
          dietaryInfo: "Vegetarian"
        }
      ]
    }
  },
  "2": {
    id: "2",
    name: "Mumbai Tiffin Service",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&q=75&fit=crop&w=600",
    bannerImage: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&q=75&fit=crop&w=1200",
    rating: 4.2,
    ratingCount: 189,
    deliveryTime: "25-35 min",
    distance: "0.8 km",
    description: "A network of tiffin services offering home-cooked meals across various locations in Mumbai.",
    address: "Multiple locations across Mumbai including Andheri, Bandra, Lower Parel, Churchgate, Dadar, Nariman Point, Vile-Parle, Santacruz, Goregaon, Fort, Mahalaxmi, Kurla, CST, Chembur, and more",
    coordinates: {
      latitude: 19.0760, // Central Mumbai coordinates
      longitude: 72.8777
    },
    cuisines: ["Maharashtra", "Home Style"],
    specialDiets: ["Vegetarian", "Non-Vegetarian"],
    operatingHours: "7:00 AM - 9:00 PM",
    isVeg: false,
    costForTwo: 500,
    menu: {
      tiffinBoxes: [
        {
          id: "t1",
          name: "Veg Tiffin Box",
          price: 250,
          isVeg: true,
          isPopular: true,
          category: "Tiffin Box",
          subCategory: "Standard",
          description: "A packed meal with rice, dal, sabzi, and roti",
          specialIngredients: "Seasonal vegetables, soft roti",
          spiceLevel: "Medium",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "t2",
          name: "Chicken Tiffin Box",
          price: 300,
          isVeg: false,
          isPopular: true,
          category: "Tiffin Box",
          subCategory: "Non-Veg",
          description: "Chicken curry with rice, roti, and a dessert",
          specialIngredients: "Slow-cooked chicken with spices",
          spiceLevel: "High",
          portionSize: "Serving for 1",
          dietaryInfo: "Non-vegetarian"
        }
      ],
      snacks: [
        {
          id: "s1",
          name: "Pav Bhaji",
          price: 130,
          isVeg: true,
          isPopular: true,
          category: "Snacks",
          subCategory: "Street food",
          description: "Spicy vegetable mash served with buttered pav",
          specialIngredients: "Served with chopped onions and lemon",
          spiceLevel: "High",
          portionSize: "1 plate",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "s2",
          name: "Vada Pav",
          price: 50,
          isVeg: true,
          isPopular: true,
          category: "Street Food",
          subCategory: "Snack",
          description: "Deep-fried potato patty stuffed in a bun with chutneys",
          specialIngredients: "Served with spicy chutney",
          spiceLevel: "High",
          portionSize: "1 piece",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "s3",
          name: "Dhokla",
          price: 80,
          isVeg: true,
          isPopular: false,
          category: "Snacks",
          subCategory: "Gujarati",
          description: "Steamed savory cake made from fermented rice and chickpea flour",
          specialIngredients: "Garnished with mustard seeds and coriander",
          spiceLevel: "Medium",
          portionSize: "6 pieces",
          dietaryInfo: "Vegan-friendly"
        }
      ],
      mainCourse: [
        {
          id: "m1",
          name: "Rava Upma",
          price: 120,
          isVeg: true,
          isPopular: false,
          category: "Main Course",
          subCategory: "Breakfast",
          description: "South Indian savory semolina dish with vegetables",
          specialIngredients: "Served with coconut chutney",
          spiceLevel: "Medium",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegan-friendly"
        }
      ],
      beverages: [
        {
          id: "b1",
          name: "Mango Lassi",
          price: 100,
          isVeg: true,
          isPopular: true,
          category: "Beverages",
          subCategory: "Yogurt drink",
          description: "Refreshing mango-flavored yogurt drink",
          specialIngredients: "Made with fresh mango puree",
          spiceLevel: "None",
          portionSize: "Glass",
          dietaryInfo: "Vegetarian"
        }
      ]
    }
  },
  "3": {
    id: "3",
    name: "Vada Pav Corner",
    image: "https://images.pexels.com/photos/17433337/pexels-photo-17433337/free-photo-of-roll-with-fried-meat-and-green-chili.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    bannerImage: "https://images.pexels.com/photos/17433337/pexels-photo-17433337/free-photo-of-roll-with-fried-meat-and-green-chili.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.7,
    ratingCount: 312,
    deliveryTime: "15-25 min",
    distance: "0.5 km",
    description: "A popular spot known for its vada pav and other street food items.",
    address: "28, Goregaon - Mulund Link Rd, Subhash Nagar, Goregaon, Mumbai",
    coordinates: {
      latitude: 19.1467,
      longitude: 72.8489
    },
    cuisines: ["Street Food", "Snacks"],
    specialDiets: ["Vegetarian"],
    operatingHours: "8:00 AM - 10:00 PM",
    isVeg: true,
    costForTwo: 200,
    menu: {
      streetFood: [
        {
          id: "sf1",
          name: "Vada Pav Classic",
          price: 40,
          isVeg: true,
          isPopular: true,
          category: "Street Food",
          subCategory: "Snack",
          description: "Crispy fried vada in a soft pav with chutneys",
          specialIngredients: "Served with spicy green chutney",
          spiceLevel: "High",
          portionSize: "1 piece",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "sf2",
          name: "Cheese Vada Pav",
          price: 60,
          isVeg: true,
          isPopular: true,
          category: "Street Food",
          subCategory: "Snack",
          description: "Vada pav stuffed with gooey cheese",
          specialIngredients: "Melted cheese inside crispy potato patty",
          spiceLevel: "Medium",
          portionSize: "1 piece",
          dietaryInfo: "Vegetarian"
        }
      ],
      snacks: [
        {
          id: "s1",
          name: "Pav Bhaji",
          price: 120,
          isVeg: true,
          isPopular: true,
          category: "Snacks",
          subCategory: "Street food",
          description: "Spicy vegetable curry served with buttered pav",
          specialIngredients: "Served with onions, lemon, and coriander",
          spiceLevel: "High",
          portionSize: "1 plate",
          dietaryInfo: "Vegan-friendly"
        },
        {
          id: "s2",
          name: "Bhel Puri",
          price: 60,
          isVeg: true,
          isPopular: true,
          category: "Snacks",
          subCategory: "Street food",
          description: "Puff rice mixed with vegetables and tangy tamarind chutney",
          specialIngredients: "Served with crispy sev",
          spiceLevel: "Medium",
          portionSize: "1 plate",
          dietaryInfo: "Vegan-friendly"
        }
      ],
      beverages: [
        {
          id: "b1",
          name: "Aam Panna",
          price: 40,
          isVeg: true,
          isPopular: false,
          category: "Beverages",
          subCategory: "Drink",
          description: "Tangy raw mango drink with mint",
          specialIngredients: "Served chilled with a hint of cumin",
          spiceLevel: "Low",
          portionSize: "Glass",
          dietaryInfo: "Vegetarian"
        }
      ]
    }
  },
  "4": {
    id: "4",
    name: "Punjabi Dhaba",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600",
    bannerImage: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.0,
    ratingCount: 178,
    deliveryTime: "35-45 min",
    distance: "1.5 km",
    description: "A dhaba-style restaurant offering a variety of North Indian and Chinese dishes.",
    address: "384, SVS Road, Near Vijay Sales, Prabhadevi, Mumbai",
    coordinates: {
      latitude: 19.0176,
      longitude: 72.8285
    },
    phone: "+91 22 2432 6685",
    cuisines: ["North Indian", "Chinese"],
    specialDiets: ["Vegetarian", "Non-Vegetarian"],
    operatingHours: "11:00 AM - 11:00 PM",
    isVeg: false,
    costForTwo: 700,
    menu: {
      mainCourse: [
        {
          id: "m1",
          name: "Butter Chicken",
          price: 350,
          isVeg: false,
          isPopular: true,
          category: "Main Course",
          subCategory: "Tandoori",
          description: "Creamy chicken curry with a smoky tandoori flavor",
          specialIngredients: "Served with naan and basmati rice",
          spiceLevel: "Medium",
          portionSize: "Serving for 1",
          dietaryInfo: "Non-vegetarian"
        },
        {
          id: "m2",
          name: "Dal Makhani",
          price: 180,
          isVeg: true,
          isPopular: true,
          category: "Main Course",
          subCategory: "Punjabi",
          description: "Slow-cooked black lentils in a creamy gravy",
          specialIngredients: "Topped with butter and cream",
          spiceLevel: "Low",
          portionSize: "Serving for 1",
          dietaryInfo: "Vegan-friendly (without butter)"
        }
      ],
      breads: [
        {
          id: "b1",
          name: "Tandoori Roti",
          price: 30,
          isVeg: true,
          isPopular: true,
          category: "Breads",
          subCategory: "Tandoori",
          description: "Soft, slightly crispy bread baked in a clay oven",
          specialIngredients: "Served with curry",
          spiceLevel: "None",
          portionSize: "1 piece",
          dietaryInfo: "Vegan-friendly"
        }
      ],
      starters: [
        {
          id: "s1",
          name: "Punjabi Paneer Tikka",
          price: 200,
          isVeg: true,
          isPopular: true,
          category: "Starters",
          subCategory: "Tandoori",
          description: "Marinated paneer cubes grilled with spices",
          specialIngredients: "Served with mint chutney",
          spiceLevel: "Medium",
          portionSize: "6 pieces",
          dietaryInfo: "Vegetarian"
        }
      ],
      desserts: [
        {
          id: "d1",
          name: "Gajar Halwa",
          price: 100,
          isVeg: true,
          isPopular: false,
          category: "Desserts",
          subCategory: "Sweet",
          description: "Sweet carrot pudding made with ghee, milk, and dry fruits",
          specialIngredients: "Garnished with almonds and cashews",
          spiceLevel: "None",
          portionSize: "Small bowl",
          dietaryInfo: "Vegetarian"
        }
      ]
    }
  }
}; 