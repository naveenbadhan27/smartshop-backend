const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { ObjectId } = require("mongodb");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 🔗 MongoDB Connection (Replace with your connection string)
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.lj4x7kv.mongodb.net/smartshop";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");

        // 🔍 Check DB Name
        // console.log("Connected DB:", mongoose.connection.name);

        // 🔍 Full connection info
        // console.log("Host:", mongoose.connection.host);

    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:", err);
    });

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// 📦 Model (collection: admin)
const Admin = mongoose.model("Admin", adminSchema, "admin");

// 🔐 Login API
app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email, password });

        if (admin) {
            return res.json({
                success: true,
                message: "Login successful",
                admin: {
                    email: admin.email,
                    id: admin._id
                }
            });
        } else {
            console.log(admin);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// admin login ends


const categorySchema = new mongoose.Schema({
    name: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model("Category", categorySchema, "categories");

app.post("/api/categories", async (req, res) => {
    const { name, image } = req.body;

    try {
        const newCategory = new Category({ name, image });
        await newCategory.save();

        res.json({ success: true, message: "Category added" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding category" });
    }
});

app.get("/api/categories", async (req, res) => {
    try {
        const data = await Category.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching categories" });
    }
});

app.delete("/api/categories/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting category" });
    }
});

// category ends


const productSchema = new mongoose.Schema(
    {
        // =====================================
        // BASIC INFORMATION
        // =====================================

        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            default: "",
        },

        brand: {
            type: String,
            default: "",
        },

        sku: {
            type: String,
            default: "",
        },

        categoryId: {
            type: String,
            required: true,
        },

        // =====================================
        // IMAGES
        // =====================================

        image: {
            type: String,
            default: "",
        },

        galleryImages: {
            type: [String],
            default: [],
        },

        // =====================================
        // DESCRIPTION
        // =====================================

        shortDescription: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        // =====================================
        // PRICING
        // =====================================

        price: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        salePrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        // =====================================
        // INVENTORY
        // =====================================

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        lowStockThreshold: {
            type: Number,
            default: 5,
        },

        trackInventory: {
            type: Boolean,
            default: true,
        },

        // =====================================
        // PRODUCT STATUS
        // =====================================

        status: {
            type: String,
            enum: [
                "active",
                "draft",
                "upcoming",
                "out_of_stock",
            ],
            default: "active",
        },

        // =====================================
        // ATTRIBUTES
        // WooCommerce Style
        // =====================================

        attributes: [
            {
                name: {
                    type: String,
                    required: true,
                },

                values: {
                    type: [String],
                    default: [],
                },

                visible: {
                    type: Boolean,
                    default: true,
                },

                usedForVariants: {
                    type: Boolean,
                    default: true,
                },
            },
        ],

        // =====================================
        // GENERATED VARIANTS
        // =====================================

        variants: [
            {
                attributes: {
                    type: Object,
                    default: {},
                },

                price: {
                    type: Number,
                    default: 0,
                    min: 0,
                },

                salePrice: {
                    type: Number,
                    default: 0,
                    min: 0,
                },

                stock: {
                    type: Number,
                    default: 0,
                    min: 0,
                },

                sku: {
                    type: String,
                    default: "",
                },

                image: {
                    type: String,
                    default: "",
                },

                isActive: {
                    type: Boolean,
                    default: true,
                },
            },
        ],

        // =====================================
        // SPECIFICATIONS
        // =====================================

        specifications: [
            {
                key: {
                    type: String,
                    required: true,
                },

                value: {
                    type: String,
                    required: true,
                },
            },
        ],

        // =====================================
        // SEO
        // =====================================

        seoTitle: {
            type: String,
            default: "",
        },

        seoDescription: {
            type: String,
            default: "",
        },

        seoKeywords: {
            type: String,
            default: "",
        },

        // =====================================
        // FLAGS
        // =====================================

        isPopular: {
            type: Boolean,
            default: false,
        },

        isBestDeal: {
            type: Boolean,
            default: false,
        },

        isUpcoming: {
            type: Boolean,
            default: false,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isTrending: {
            type: Boolean,
            default: false,
        },

        isNewArrival: {
            type: Boolean,
            default: false,
        },

        // =====================================
        // REVIEWS
        // =====================================

        averageRating: {
            type: Number,
            default: 0,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        // =====================================
        // ANALYTICS
        // =====================================

        views: {
            type: Number,
            default: 0,
        },

        wishlistCount: {
            type: Number,
            default: 0,
        },

        compareCount: {
            type: Number,
            default: 0,
        },

        purchaseCount: {
            type: Number,
            default: 0,
        },

        // =====================================
        // COMPARISON
        // =====================================

        comparisonEnabled: {
            type: Boolean,
            default: true,
        },

        // =====================================
        // BUNDLE BUILDER
        // =====================================

        bundleEligible: {
            type: Boolean,
            default: false,
        },

        // =====================================
        // PRODUCT BATTLE
        // =====================================

        battleVotes: {
            wins: {
                type: Number,
                default: 0,
            },

            losses: {
                type: Number,
                default: 0,
            },
        },

        // =====================================
        // PRODUCT SCORING
        // =====================================

        performanceScore: {
            type: Number,
            default: 0,
        },

        batteryScore: {
            type: Number,
            default: 0,
        },

        cameraScore: {
            type: Number,
            default: 0,
        },

        displayScore: {
            type: Number,
            default: 0,
        },

        overallScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema, "products");

app.post("/api/products", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.json({
            success: true,
            message: "Product added"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error adding product"
        });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

// app.put("/api/products/:id", async (req, res) => {
//     try {
//         console.log(req.body)
//         console.log(req.params.id)
//         // await Product.findByIdAndUpdate(req.params.id, req.body);
//         // res.json({ success: true });

//         Product.updateOne({
//             _id: new ObjectId(req.params.id)
//         }, {
//             $set: req.body
//         }).then((sicc) => {
//             res.json({success: true})
//         })

//     } catch (err) {
//         res.status(500).json({ message: "Error updating product" });
//     }
// });


app.put("/api/products/:id", async (req, res) => {
    try {

        console.log(req.body);
        console.log(req.params.id);

        const result = await Product.updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: {
                    ...req.body,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            result
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error updating product"
        });
    }
});


// app.put("/api/products/:id", async (req, res) => {
//     try {

//         console.log(req.body);

//         const {
//             price,
//             discount,
//             stock,
//             name
//         } = req.body;

//         if (name !== undefined && !name.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product name is required"
//             });
//         }

//         if (
//             price !== undefined &&
//             Number(price) < 0
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Price cannot be negative"
//             });
//         }

//         if (
//             discount !== undefined &&
//             (Number(discount) < 0 ||
//                 Number(discount) > 100)
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "Discount must be between 0 and 100"
//             });
//         }

//         if (
//             stock !== undefined &&
//             Number(stock) < 0
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "Stock cannot be negative"
//             });
//         }

//         req.body.updatedAt = new Date();

//         const updatedProduct =
//             await Product.findByIdAndUpdate(
//                 req.params.id,
//                 req.body,
//                 {
//                     new: true,
//                     runValidators: true
//                 }
//             );

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.json({
//             success: true,
//             product: updatedProduct
//         });

//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             success: false,
//             message: "Error updating product"
//         });
//     }
// });

// product ends


const bannerSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,

    // 🔥 ADD THIS
    isActive: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Banner = mongoose.model("Banner", bannerSchema, "banners");

app.post("/api/banners", async (req, res) => {
    console.log(req.body);
    try {
        const newBanner = new Banner(req.body);
        await newBanner.save();

        res.json({
            success: true,
            message: "Banner added"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error adding banner"
        });
    }
});

app.get("/api/banners", async (req, res) => {
    try {
        const data = await Banner.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching banners" });
    }
});

app.delete("/api/banners/:id", async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting banner" });
    }
});

app.put("/api/banners/:id", async (req, res) => {
    try {
        await Banner.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating banner" });
    }
});

// banner ends

const sliderSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    link: String,
    order: Number,

    // 🔥 important (checkbox)
    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Slider = mongoose.model("Slider", sliderSchema, "sliders");

app.post("/api/sliders", async (req, res) => {
    try {
        const newSlider = new Slider(req.body);
        await newSlider.save();

        res.json({
            success: true,
            message: "Slider added"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error adding slider"
        });
    }
});

app.get("/api/sliders", async (req, res) => {
    try {
        const data = await Slider.find().sort({ order: 1 }); // 🔥 sorted from backend
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sliders" });
    }
});

app.get("/api/sliders/active", async (req, res) => {
    try {
        const data = await Slider.find({ isActive: true })
            .sort({ order: 1 }); // 🔥 sorted

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sliders" });
    }
});

app.delete("/api/sliders/:id", async (req, res) => {
    try {
        await Slider.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting slider" });
    }
});

app.put("/api/sliders/:id", async (req, res) => {
    try {
        await Slider.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating slider" });
    }
});

// slider ends


const adsSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    link: String,
    order: Number,

    // 🔥 checkbox support
    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Ad = mongoose.model("Ad", adsSchema, "ads");


app.post("/api/ads", async (req, res) => {
    try {
        const newAd = new Ad(req.body);
        await newAd.save();

        res.json({
            success: true,
            message: "Ad added"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error adding ad"
        });
    }
});

app.get("/api/ads", async (req, res) => {
    try {
        const data = await Ad.find().sort({ order: 1 }); // 🔥 sorting from backend
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching ads" });
    }
});

app.delete("/api/ads/:id", async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ad" });
    }
});

app.put("/api/ads/:id", async (req, res) => {
    try {
        await Ad.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating ad" });
    }
});

// ads ends


app.get("/api/productsfilter", async (req, res) => {
    try {
        const { type } = req.query;

        let filter = {};

        if (type === "popular") {
            filter.isPopular = true;
        } else if (type === "offers") {
            filter.isBestDeal = true;
        } else if (type === "upcoming") {
            filter.isUpcoming = true;
        }

        const data = await Product.find(filter);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// Home Page Filter

app.get("/api/products/:id", async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        console.log(data)
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product" });
    }
});

// Single Product


app.get("/api/products/related/:categoryId/:id", async (req, res) => {
    try {
        const { categoryId, id } = req.params;

        const data = await Product.find({
            categoryId,
            _id: { $ne: id }
        }).limit(8);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching related" });
    }
});

// products according to category

const reviewSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema, "reviews");

app.post("/api/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding review" });
    }
});

// review a product

app.post("/api/products/search", async (req, res) => {
    try {
        const { id } = req.body;

        console.log("Search:", id);

        if (!id || id.trim() === "") {
            return res.json([]);
        }

        const data = await Product.find({
            name: { $regex: id, $options: "i" }
        });

        res.json(data);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ message: "Error searching products" });
    }
});

// search ends

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema, "users");

app.post("/api/user/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({
            success: true,
            message: "User registered"
        });

    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

app.post("/api/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// user login

const cartSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    quantity: {
        type: Number,
        default: 1
    },

    selectedVariant: {
        attributes: {
            type: Object,
            default: {}
        },
        sku: String,
        price: Number,
        image: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model("Cart", cartSchema, "cart");



app.post("/api/cart/add", async (req, res) => {
    try {

        const {
            userId,
            productId,
            quantity,
            selectedVariant
        } = req.body;

        let exist;

        if (selectedVariant?.sku) {

            exist = await Cart.findOne({
                userId,
                productId,
                "selectedVariant.sku": selectedVariant.sku
            });

        } else {

            exist = await Cart.findOne({
                userId,
                productId
            });

        }

        if (exist) {

            exist.quantity += quantity || 1;
            await exist.save();

            return res.send("not");

        }

        await Cart.create({
            userId,
            productId,
            quantity: quantity || 1,
            selectedVariant
        });

        return res.send("ok");

    } catch (err) {

        console.log("❌ CART ERROR:", err);

        res.status(500).json({
            message: "Error adding to cart"
        });

    }
});

// addtocart

app.post("/api/cart/get", async (req, res) => {
    try {
        const { userId } = req.body;

        // console.log("UserId:", userId);

        if (!userId) {
            return res.status(400).json({ message: "UserId required" });
        }

        // console.log(userId)
        const data = await Cart.find({ userId });

        // console.log(data)
        res.json(data);

    } catch (err) {
        console.log("❌ Cart Fetch Error:", err);
        res.status(500).json({ message: "Error fetching cart" });
    }
});



app.post("/api/cart/get2", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserId required" });
        }

        // 🔥 Fetch cart items
        const cartItems = await Cart.find({ userId });

        // 🔥 Extract productIds
        const productIds = cartItems.map(item => item.productId);

        // 🔥 Fetch products
        const products = await Product.find({
            _id: { $in: productIds }
        });

        // 🔥 Merge cart + product
        const finalData = cartItems.map(cartItem => {
            const product = products.find(
                p => p._id.toString() === cartItem.productId
            );

            return {
                ...cartItem._doc,
                product
            };
        });

        res.json(finalData);

    } catch (err) {
        console.log("❌ Cart Fetch Error:", err);
        res.status(500).json({ message: "Error fetching cart" });
    }
});

// app.post("/api/cart/count", async (req, res) => {
//     try {
//         const { userId } = req.body;

//         // console.log(userId);

//         if (!userId) {
//             return res.status(400).json({ count: 0 });
//         }

//         const count = await Cart.get({ userId });

//         console.log(count)
//         res.json({ count });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ count: 0 });
//     }
// });

app.post("/api/cart/delete", async (req, res) => {
    try {
        const { id } = req.body;

        await Cart.findByIdAndDelete(id);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ message: "Error deleting item" });
    }
});

app.post("/api/cart/update", async (req, res) => {
    try {
        const { id, type } = req.body;

        const item = await Cart.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (type === "inc") {
            item.quantity += 1;
        } else if (type === "dec") {
            item.quantity -= 1;

            // ❗ remove if quantity = 0
            if (item.quantity <= 0) {
                await Cart.findByIdAndDelete(id);
                return res.json({ removed: true });
            }
        }

        await item.save();

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating quantity" });
    }
});


const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },

    userId: String,

    items: [
        {
            productId: String,
            name: String,
            image: String,

            price: Number,
            quantity: Number,

            selectedVariant: {
                attributes: Object,
                sku: String,
                price: Number,
                image: String
            }
        }
    ],

    total: Number,

    address: {
        name: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },

    paymentMethod: {
        type: String,
        enum: ["card", "upi", "cod"],
        default: "cod"
    },

    status: {
        type: String,
        enum: [
            "Placed",
            "Processing",
            "Shipped",
            "Delivered"
        ],
        default: "Placed"
    }

}, { timestamps: true });


const Order = mongoose.model("Order", orderSchema, "orders");


const generateOrderId = async () => {
    const count = await Order.countDocuments();
    return "ORD" + String(count + 1).padStart(5, "0");
};

app.post("/api/order/checkout", async (req, res) => {
    try {
        const { userId, address, paymentMethod } = req.body;

        const cartItems = await Cart.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 🔥 product fetch
        const productIds = cartItems.map(i => i.productId);

        const products = await Product.find({
            _id: { $in: productIds }
        });

        // 🔥 merge cart + product
        const items = cartItems.map(c => {

            const product = products.find(
                p => p._id.toString() === c.productId
            );

            return {
                productId: c.productId,

                name: product?.name || "Unknown",

                image:
                    c.selectedVariant?.image ||
                    product?.image,

                price:
                    c.selectedVariant?.price ||
                    product?.salePrice ||
                    product?.price ||
                    0,

                quantity: c.quantity,

                selectedVariant:
                    c.selectedVariant || null
            };

        });

        // 🔥 total
        const total = items.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        // 🔥 generate order id
        const orderId = await generateOrderId();

        // 🔥 create order
        const order = await Order.create({
            orderId,
            userId,
            items,
            total,
            address,
            paymentMethod
        });

        // 🔥 clear cart
        await Cart.deleteMany({ userId });

        res.json({
            success: true,
            orderId: order.orderId
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Checkout failed" });
    }
});


const addressSchema = new mongoose.Schema({
    userId: String,
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
});

const Address = mongoose.model("Address", addressSchema, "addresses");


app.post("/api/address/add", async (req, res) => {
    try {
        const data = await Address.create(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error adding address" });
    }
});

app.post("/api/address/get", async (req, res) => {
    try {
        const { userId } = req.body;

        console.log(userId);

        const data = await Address.find({ userId }); // ✅ FIX

        res.json(data); // ✅ better than res.send

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching address" });
    }
});

app.put("/api/user/update", async (req, res) => {
    try {
        const { userId, name, email, password } = req.body;

        const updateData = { name, email };

        if (password) {
            updateData.password = password;
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

app.post("/api/order/user", async (req, res) => {
    const { userId } = req.body;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
});

app.post("/api/address/delete", async (req, res) => {
    try {
        const { id } = req.body;

        await Address.findByIdAndDelete(id);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// GET PRODUCTS (using req.body)
app.post("/api/getproducts", async (req, res) => {
    try {
        const { categoryId } = req.body;

        const products = await Product.find({ categoryId });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// GET CATEGORY
app.post("/api/getcategory", async (req, res) => {
    try {
        const { id } = req.body;

        const category = await Category.findById(id);

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: "Error fetching category" });
    }
});

app.get("/api/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email phone") // 🔥 user details
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

app.post("/api/admin/order/update", async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updated = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating order" });
    }
});


app.get("/api/order/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const productIds = order.items.map(
            item => item.productId
        );

        const products = await Product.find({
            _id: { $in: productIds }
        });

        const formattedProducts = order.items.map(item => {

            const product = products.find(
                p => p._id.toString() === item.productId
            );

            return {
                quantity: item.quantity,

                selectedVariant:
                    item.selectedVariant || null,

                product: {
                    _id: product?._id,
                    name:
                        item.name ||
                        product?.name,

                    image:
                        item.selectedVariant?.image ||
                        item.image ||
                        product?.image,

                    price:
                        item.price ||
                        product?.price
                }
            };
        });

        res.json({
            _id: order._id,
            orderId: order.orderId,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            paymentMethod: order.paymentMethod,
            address: order.address,
            products: formattedProducts
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to fetch order"
        });

    }
});



app.get("/api/admin/order/:id", async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const user = await User.findById(
      order.userId
    );

    res.json({
      ...order.toObject(),
      customer: user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
});


app.get(
  "/api/admin/order/:id",
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )
          .populate(
            "userId"
          );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found"
          });
      }

      res.json(order);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error"
      });

    }

  }
);



app.get("/api/admin/dashboard", async (req, res) => {
    try {
        const [
            products,
            orders,
            users,
            categories,
            reviews,
            carts,
            banners,
            sliders,
            ads,
            addresses
        ] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments(),
            Category.countDocuments(),
            Review.countDocuments(),
            Cart.countDocuments(),
            Banner.countDocuments(),
            Slider.countDocuments(),
            Ad.countDocuments(),
            Address.countDocuments()
        ]);

        // 💰 Revenue
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        const revenue = revenueData[0]?.total || 0;

        res.json({
            products,
            orders,
            users,
            categories,
            reviews,
            carts,
            banners,
            sliders,
            ads,
            addresses,
            revenue
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Dashboard error" });
    }
});


app.put(
    "/api/products/compare/:id",
    async (req, res) => {

        await Product.findByIdAndUpdate(
            req.params.id,
            {
                $inc: {
                    compareCount: 1
                }
            }
        );

        res.json({
            success: true
        });
    }
);









// 🧪 Test Route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// 🚀 Server Start
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});