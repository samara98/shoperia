const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is required'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 1,
      validate: {
        validator: (val) => {
          return val > 0;
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
