import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

/*=============================================================
FETCH ALL PRODUCTS
GET /api/products
Public
==============================================================*/
const getProducts = asyncHandler(async (req, res) => {
  // how many products per page?
  const pageSize = 4
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  // total count of products
  const count = await Product.countDocuments({ ...keyword })

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) })
})
/*=============================================================
FIND PRODUCT BY ID
GET /api/products/:id
Public
==============================================================*/
const getProductByID = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) return res.status(200).json(product)
  else {
    return res.status(404).json({ error: 'Product not found' })
  }
})

/*=============================================================
Delete a Product
DELETE /api/products/:id
Private/Admin
==============================================================*/
const deleteProduct = asyncHandler(async (req, res) => {
  // find the product
  const product = await Product.findById(req.params.id)

  // if it was there, remove it
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
/*=============================================================
Create a Product
POST /api/products/
Private/Admin
==============================================================*/
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample descreption',
  })

  const createdProduct = await product.save()

  res.json(createdProduct)
})
/*=============================================================
Update a Product
PUT /api/products/:id
Private/Admin
==============================================================*/
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
/*=============================================================
Create a new Review
POST /api/products/:id/review
Private/
==============================================================*/
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
/*=============================================================
Get top rated products
POST /api/products/top
Public
==============================================================*/
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

export default {
  getProducts,
  getProductByID,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
