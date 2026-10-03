/**
 * Content of the built-in sample screen: a fictional meal-planning app called "Larder".
 * Every mood re-presents this exact content, so the redesign stays recognisable.
 */

export const SAMPLE_NAME = "Larder — weekly meal plan"

export const SAMPLE_NAV = ["Plan", "Pantry", "Recipes", "Shopping"] as const

export const SAMPLE_HERO = {
  kicker: "Week 40 · 29 Sep – 5 Oct",
  title: "This week’s meal plan",
  lede: "Five dinners planned. Your shopping list updates as you go.",
  primary: "Add meal",
  secondary: "Share plan",
}

export const SAMPLE_STATS = [
  { value: "5/7", label: "dinners planned" },
  { value: "12", label: "items to buy" },
  { value: "$48", label: "estimated spend" },
] as const

export const SAMPLE_MEALS = [
  { day: "Mon", name: "Miso aubergine with soba", meta: "35 min", tag: "Vegetarian" },
  { day: "Tue", name: "Lemon chicken traybake", meta: "50 min", tag: "High protein" },
  { day: "Wed", name: "Leftovers night", meta: "10 min", tag: "Easy" },
  { day: "Thu", name: "Chickpea & spinach curry", meta: "30 min", tag: "Vegan" },
  { day: "Fri", name: "Homemade pizza", meta: "60 min", tag: "Family" },
] as const

export const SAMPLE_LIST = {
  title: "Shopping list",
  items: ["Aubergines ×2", "Soba noodles", "Lemons ×3", "Chickpeas, 2 tins", "Baby spinach"],
  link: "Open full list",
}

export const SAMPLE_AVATAR = "MR"

/** Design-size of the sample screen; the preview scales this canvas to fit. */
export const SAMPLE_WIDTH = 840
export const SAMPLE_HEIGHT = 640
