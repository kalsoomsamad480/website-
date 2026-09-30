import ApiError from '../utils/ApiError.js';
import { pick } from '../utils/helpers.js';

/**
 * Generic admin CRUD for simple content collections (offers, testimonials).
 * Only whitelisted fields can be written.
 */
export function createContentService(Model, { label, fields, sort }) {
  const notFound = () => ApiError.notFound(`${label} not found.`);

  return {
    listAll: () => Model.find().sort(sort).lean(),

    create: (data) => Model.create(pick(data, fields)),

    async update(id, data) {
      const doc = await Model.findById(id);
      if (!doc) throw notFound();
      Object.assign(doc, pick(data, fields));
      await doc.save();
      return doc.toObject();
    },

    async remove(id) {
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) throw notFound();
    },
  };
}
