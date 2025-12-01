import 'dotenv/config';
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem';

const menuItems = [
  // Appetizers
  {
    name: 'Crispy Spring Rolls',
    description:
      'Golden fried rolls filled with vegetables and served with sweet chili sauce',
    price: 6.99,
    category: 'appetizers',
    available: true,
    preparationTime: 10,
    image:
      'https://images.unsplash.com/photo-1577859584099-38d38a4aacb5?q=80&w=800&auto=format&fit=crop',
    tags: ['vegetarian', 'popular']
  },
  {
    name: 'Buffalo Wings',
    description: 'Spicy chicken wings with blue cheese dip',
    price: 9.99,
    category: 'appetizers',
    available: true,
    preparationTime: 15,
    image:
      'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?q=80&w=800&auto=format&fit=crop',
    tags: ['spicy', 'popular']
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Breaded mozzarella cheese sticks with marinara sauce',
    price: 7.99,
    category: 'appetizers',
    available: true,
    preparationTime: 12,
    image:
      'https://images.unsplash.com/photo-1734774924912-dcbb467f8599?q=80&w=800&auto=format&fit=crop',
    tags: ['vegetarian']
  },

  // Main Course
  {
    name: 'Classic Cheeseburger',
    description:
      'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'main-course',
    available: true,
    preparationTime: 20,
    image:
      'https://images.unsplash.com/photo-1639020715392-2d8346c3acb0?q=80&w=800&auto=format&fit=crop',
    tags: ['popular', 'signature']
  },
  {
    name: 'Grilled Chicken Pasta',
    description:
      'Fettuccine pasta with grilled chicken in creamy Alfredo sauce',
    price: 14.99,
    category: 'main-course',
    available: true,
    preparationTime: 25,
    image:
      'https://images.unsplash.com/photo-1612548041352-432ad1176ef3?q=80&w=800&auto=format&fit=crop',
    tags: ['popular']
  },
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on thin crust',
    price: 11.99,
    category: 'main-course',
    available: true,
    preparationTime: 18,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop',
    tags: ['vegetarian', 'popular']
  },
  {
    name: 'Fish and Chips',
    description: 'Beer-battered fish with crispy fries and tartar sauce',
    price: 13.99,
    category: 'main-course',
    available: true,
    preparationTime: 22,
    image:
      'https://images.unsplash.com/photo-1706711053549-f52f73a8960c?q=80&w=800&auto=format&fit=crop',
    tags: []
  },
  {
    name: 'Vegan Buddha Bowl',
    description: 'Quinoa, roasted vegetables, avocado, and tahini dressing',
    price: 12.49,
    category: 'main-course',
    available: true,
    preparationTime: 15,
    image:
      'https://images.unsplash.com/photo-1675092789086-4bd2b93ffc69?q=80&w=800&auto=format&fit=crop',
    tags: ['vegan', 'healthy']
  },

  // Sides
  {
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 3.99,
    category: 'sides',
    available: true,
    preparationTime: 8,
    image:
      'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?q=80&w=800&auto=format&fit=crop',
    tags: ['vegetarian']
  },
  {
    name: 'Onion Rings',
    description: 'Beer-battered onion rings',
    price: 4.99,
    category: 'sides',
    available: true,
    preparationTime: 10,
    image:
      'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop',
    tags: ['vegetarian']
  },
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, Caesar dressing',
    price: 5.99,
    category: 'sides',
    available: true,
    preparationTime: 5,
    image:
      'https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?q=80&w=800&auto=format&fit=crop',
    tags: ['healthy']
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 6.99,
    category: 'desserts',
    available: true,
    preparationTime: 12,
    image:
      'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=800&auto=format&fit=crop',
    tags: ['popular', 'signature']
  },
  {
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with berry compote',
    price: 5.99,
    category: 'desserts',
    available: true,
    preparationTime: 5,
    image:
      'https://images.unsplash.com/photo-1706046213335-d0200829b871?q=80&w=800&auto=format&fit=crop',
    tags: ['popular']
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops with toppings and whipped cream',
    price: 4.99,
    category: 'desserts',
    available: true,
    preparationTime: 5,
    image:
      'https://images.unsplash.com/photo-1702564696095-ba5110856bf2?q=80&w=800&auto=format&fit=crop',
    tags: []
  },

  // Beverages
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 3.99,
    category: 'beverages',
    available: true,
    preparationTime: 3,
    image:
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
    tags: ['fresh', 'healthy']
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice',
    price: 3.49,
    category: 'beverages',
    available: true,
    preparationTime: 2,
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
    tags: []
  },
  {
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola',
    price: 2.49,
    category: 'beverages',
    available: true,
    preparationTime: 1,
    image:
      'https://images.unsplash.com/photo-1759424346318-2b25019bfeb4?q=80&w=800&auto=format&fit=crop',
    tags: []
  },
  {
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water',
    price: 2.99,
    category: 'beverages',
    available: true,
    preparationTime: 1,
    image:
      'https://images.unsplash.com/photo-1453825012366-3738046cb6c7?q=80&w=800&auto=format&fit=crop',
    tags: []
  },
  {
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt and ice',
    price: 4.99,
    category: 'beverages',
    available: true,
    preparationTime: 5,
    image:
      'https://images.unsplash.com/photo-1653542773369-51cce8d08250?q=80&w=800&auto=format&fit=crop',
    tags: ['fresh', 'healthy']
  }
];

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert new menu items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`✅ Added ${result.length} menu items`);

    console.log('\n📋 Menu Summary:');
    const categories = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    categories.forEach((cat) => {
      console.log(`   ${cat._id}: ${cat.count} items`);
    });

    console.log('\n✨ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
