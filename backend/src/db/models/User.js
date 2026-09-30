import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    // Incremented on logout to revoke existing refresh tokens
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
