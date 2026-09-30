import Category from '../db/models/Category.js';
import MenuItem from '../db/models/MenuItem.js';
import ApiError from '../utils/ApiError.js';
import slugify from '../utils/slugify.js';
import { pick } from '../utils/helpers.js';

const EDITABLE_FIELDS = ['name', 'description', 'image', 'order'];

/** Categories in display order, each with its menu item count. */
export async function listCategories() {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).lean(),
    MenuItem.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countById = new Map(counts.map((entry) => [String(entry._id), entry.count]));
  return categories.map((category) => ({
    ...category,
    itemCount: countById.get(String(category._id)) || 0,
  }));
}

export async function createCategory(data) {
  const fields = pick(data, EDITABLE_FIELDS);
  return Category.create({ ...fields, slug: slugify(fields.name) });
}

export async function updateCategory(id, data) {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found.');

  const fields = pick(data, EDITABLE_FIELDS);
  Object.assign(category, fields);
  if (fields.name) category.slug = slugify(fields.name);
  return category.save();
}

export async function deleteCategory(id) {
  const itemCount = await MenuItem.countDocuments({ category: id });
  if (itemCount > 0) {
    throw ApiError.conflict(`Move or delete the ${itemCount} items in this category first.`);
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw ApiError.notFound('Category not found.');
}
