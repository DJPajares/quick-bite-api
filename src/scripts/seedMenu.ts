import 'dotenv/config';
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem';

const menuItems = [
  // Appetizers
  {
    name: 'Crispy Spring Rolls',
    description: 'Golden fried rolls filled with vegetables and served with sweet chili sauce',
    price: 6.99,
    category: 'appetizers',
    available: true,
    preparationTime: 10,
    tags: ['vegetarian', 'popular']
  },
  {
    name: 'Buffalo Wings',
    description: 'Spicy chicken wings with blue cheese dip',
    price: 9.99,
    category: 'appetizers',
    available: true,
    preparationTime: 15,
    tags: ['spicy', 'popular']
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Breaded mozzarella cheese sticks with marinara sauce',
    price: 7.99,
    category: 'appetizers',
    available: true,
    preparationTime: 12,
    tags: ['vegetarian']
  },

  // Main Course
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'main-course',
    available: true,
    preparationTime: 20,
    tags: ['popular', 'signature']
  },
  {
    name: 'Grilled Chicken Pasta',
    description: 'Fettuccine pasta with grilled chicken in creamy Alfredo sauce',
    price: 14.99,
    category: 'main-course',
    available: true,
    preparationTime: 25,
    tags: ['popular']
  },
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on thin crust',
    price: 11.99,
    category: 'main-course',
    available: true,
    preparationTime: 18,
    tags: ['vegetarian', 'popular']
  },
  {
    name: 'Fish and Chips',
    description: 'Beer-battered fish with crispy fries and tartar sauce',
    price: 13.99,
    category: 'main-course',
    available: true,
    preparationTime: 22,
    tags: []
  },
  {
    name: 'Vegan Buddha Bowl',
    description: 'Quinoa, roasted vegetables, avocado, and tahini dressing',
    price: 12.49,
    category: 'main-course',
    available: true,
    preparationTime: 15,
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
    tags: ['vegetarian']
  },
  {
    name: 'Onion Rings',
    description: 'Beer-battered onion rings',
    price: 4.99,
    category: 'sides',
    available: true,
    preparationTime: 10,
    tags: ['vegetarian']
  },
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, Caesar dressing',
    price: 5.99,
    category: 'sides',
    available: true,
    preparationTime: 5,
    tags: ['healthy']
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 6.99,
    category: 'desserts',
    available: true,
    preparationTime: 12,
    tags: ['popular', 'signature']
  },
  {
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with berry compote',
    price: 5.99,
    category: 'desserts',
    available: true,
    preparationTime: 5,
    tags: ['popular']
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops with toppings and whipped cream',
    price: 4.99,
    category: 'desserts',
    available: true,
    preparationTime: 5,
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
    tags: ['fresh', 'healthy']
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice',
    price: 3.49,
    category: 'beverages',
    available: true,
    preparationTime: 2,
    tags: []
  },
  {
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola',
    price: 2.49,
    category: 'beverages',
    available: true,
    preparationTime: 1,
    tags: []
  },
  {
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water',
    price: 2.99,
    category: 'beverages',
    available: true,
    preparationTime: 1,
    tags: []
  },
  {
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt and ice',
    price: 4.99,
    category: 'beverages',
    available: true,
    preparationTime: 5,
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
    
    categories.forEach(cat => {
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
