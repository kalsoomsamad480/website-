import Category from '../db/models/Category.js';
import MenuItem from '../db/models/MenuItem.js';
import ApiError from '../utils/ApiError.js';
import slugify from '../utils/slugify.js';
import { escapeRegex, isObjectId, pick } from '../utils/helpers.js';

const EDITABLE_FIELDS = [
  'name',
  'description',
  'price',
  'category',
  'tags',
  'ingredients',
  'image',
  'isAvailable',
  'calories',
];

const SORTS = {
  default: { _id: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 },
  newest: { createdAt: -1 },
};

const hasValue = (value) => value !== undefined && value !== '';

/** Lists menu items. Query: category (slug), search, tag (comma list), minPrice, maxPrice, sort, available. */
export async function listMenuItems(query = {}) {
  const filter = {};

  if (hasValue(query.category)) {
    const category = await Category.findOne({ slug: String(query.category) })
      .select('_id')
      .lean();
    if (!category) return [];
    filter.category = category._id;
  }

  if (hasValue(query.tag)) {
    filter.tags = {
      $all: String(query.tag)
        .split(',')
        .map((tag) => tag.trim()),
    };
  }

  if (hasValue(query.search)) {
    const pattern = new RegExp(escapeRegex(String(query.search).trim()), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { ingredients: pattern }];
  }

  if (hasValue(query.minPrice) || hasValue(query.maxPrice)) {
    filter.price = {};
    if (hasValue(query.minPrice)) filter.price.$gte = Number(query.minPrice);
    if (hasValue(query.maxPrice)) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.available === 'true') filter.isAvailable = true;
  if (query.available === 'false') filter.isAvailable = false;

  return MenuItem.find(filter)
    .sort(SORTS[query.sort] || SORTS.default)
    .populate('category', 'name slug')
    .lean();
}

/** Finds an item by Mongo id or by slug. */
export async function getMenuItem(idOrSlug) {
  const filter = isObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: String(idOrSlug).toLowerCase() };
  const item = await MenuItem.findOne(filter).populate('category', 'name slug').lean();
  if (!item) throw ApiError.notFound('Menu item not found.');
  return item;
}

async function assertCategoryExists(categoryId) {
  if (!(await Category.exists({ _id: categoryId }))) {
    throw ApiError.unprocessable('Please check the highlighted fields.', [
      { field: 'category', message: 'Category does not exist.' },
    ]);
  }
}

/** Builds a unique slug, adding -2, -3... if the name is already used. */
async function uniqueSlug(name, excludeId) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  while (await MenuItem.exists({ slug, _id: { $ne: excludeId } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function createMenuItem(data) {
  const fields = pick(data, EDITABLE_FIELDS);
  await assertCategoryExists(fields.category);
  const item = await MenuItem.create({
    ...fields,
    slug: await uniqueSlug(fields.name),
  });
  return getMenuItem(item.id);
}

export async function updateMenuItem(id, data) {
  const item = await MenuItem.findById(id);
  if (!item) throw ApiError.notFound('Menu item not found.');

  const fields = pick(data, EDITABLE_FIELDS);
  if (fields.category) await assertCategoryExists(fields.category);
  if (fields.name && fields.name !== item.name) item.slug = await uniqueSlug(fields.name, item._id);

  Object.assign(item, fields);
  await item.save();
  return getMenuItem(item.id);
}

/** Sets availability, or flips it when no value is given. */
export async function setAvailability(id, isAvailable) {
  const item = await MenuItem.findById(id);
  if (!item) throw ApiError.notFound('Menu item not found.');
  item.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : !item.isAvailable;
  await item.save();
  return { id: item.id, isAvailable: item.isAvailable };
}

export async function deleteMenuItem(id) {
  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound('Menu item not found.');
}
