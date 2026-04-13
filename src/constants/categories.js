import iconSalary from "@/assets/icons/category/category-salary-black.png";
import iconPocket from "@/assets/icons/category/category-pocket-black.png";
import iconFood from "@/assets/icons/category/category-food-black.png";
import iconTrans from "@/assets/icons/category/category-trans-black.png";
import iconShop from "@/assets/icons/category/category-shop-black.png";
import iconCulture from "@/assets/icons/category/category-culture-black.png";

export const CATEGORY_MAP = {
  c1: { name: "급여", icon: iconSalary, type: "income" },
  c2: { name: "용돈", icon: iconPocket, type: "income" },
  c3: { name: "식비", icon: iconFood, type: "expense" },
  c4: { name: "교통/통신", icon: iconTrans, type: "expense" },
  c5: { name: "쇼핑", icon: iconShop, type: "expense" },
  c6: { name: "문화/여가", icon: iconCulture, type: "expense" },
};

export const CATEGORIES = Object.entries(CATEGORY_MAP).map(([id, val]) => ({
  id,
  ...val,
}));

export function getCategoryInfo(categoryId) {
  return CATEGORY_MAP[categoryId] ?? { name: categoryId, icon: null, type: null };
}

export function getCategoriesByType(type) {
  return CATEGORIES.filter((cat) => cat.type === type);
}
