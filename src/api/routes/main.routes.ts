import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import { LoginController } from "../controllers/login.controller";
import { UserController } from "../controllers/user.controller";
import { SellerController } from "../controllers/seller.controller";
import { AddressController } from "../controllers/address.controller";
import { ProductController } from "../controllers/product.controller";
import { BrandController } from "../controllers/brand.controller";
import upload from "../../middlewares/upload.middleware";
import { CartController } from "../controllers/cart.controller";
import { StoreController } from "../controllers/store.controller";
import { uploadCsvFile } from "../../middlewares/multer.middleware";
import { CustomerReelController} from "../controllers/customerReel.controller"
// import { guard } from "../../middlewares/jwt-gaurd.middleware";
import { securityCheck } from "../../middlewares/security.middleware";
import { ReviewController } from "../controllers/review.controller";
import { OrderController } from "../controllers/order.controller";
import { DownloadController } from "../controllers/download.contoller";
import { ProtectedController } from "../controllers/protected.controller";
import { CategoryController } from "../controllers/category.controller";
import { NotificationController } from "../controllers/notification.controller";
import { SearchController } from "../controllers/search.controller";
import { ChatController } from "../controllers/chat.controller";
import { ContactUsController } from "../controllers/contact.controller";
import { ArrivalController } from "../controllers/arrival.controller";
import { CouponController } from "../controllers/coupon.controller";
import { PaymentController } from "../controllers/payment.controller";
import { LoginAuthController } from "../controllers/loginAuth.controller";
import { PortfolioController } from "../controllers/PortfolioController";
import { VerificationController } from "../controllers/verification.controller";
import { StoreReviewController } from "../controllers/storeReview.controller";
import { OfferController } from "../controllers/offer.controller";

import uploads from "../../middlewares/multerConfig";

import { requireSignIn } from "../../middlewares/jwt-gaurd.middleware";
import { loginCheck } from "../../middlewares/logincheck.middleware";
import { FaqController } from "../controllers/faq.controller";
import { LiveDemoController } from "../controllers/livedemo.controller";
import { HeaderController } from "../controllers/header.controller";
import { SponsoredProductController } from "../controllers/sponsoredProduct.controller";
import { ClothingController } from "../controllers/clothing.controller";

/**
 * Registers the main routes for the application.
 * @returns {Router} - The router object with the registered routes.
 */
export class MainRoute {
  /**
   * Registers the routes for the API endpoints.
   * @returns {Router} - The router object with the registered routes.
   */

  static register() {
    // Create a new router
    const router = Router();

    //* API health
    router.route("/api/v1/health").get(HealthController.health);

    //*User API routes

    // User signup
    router.route("/api/v1/userSignUp").post(UserController.create);
    // User login and Logout
    router.route("/api/v1/login").post(LoginController.Login);
    router.route("/api/v1/logout").post(LoginController.logOutController);
    // check user login status
    router.route("/api/v1/checklogin").get(requireSignIn, LoginController.checkLogin);
    // update user  password
    router.route("/api/v1/updatePasword").put(LoginController.updatePassword);
    // upload user profile picture
    router.route("/api/v1/users/:userId/uploadProfilePic").post(upload.single("file"), UserController.uploadFile);

    router.route("/api/v1/user/:_id").get(requireSignIn, UserController.getOne);
    router.route("/api/v1/user/:_id").put(UserController.update);

    router.route("/api/v1/user/:_id/status").delete(UserController.delete);
    router.route("/api/v1/user/:_id").delete(UserController.revoke);

    // *Seller API routes for CRUD operations

    // Create a new seller account.
    router.route("/api/v1/sellerSignUp").post(SellerController.sellerSignUp);
    // Create a new seller profile.
    router.route("/api/v1/sellerAdd").post(SellerController.createSeller);
    // Retrieve a list of all sellers.
    router.route("/api/v1/sellers").post(SellerController.getAllSeller);
    // Get information about a specific seller using id.
    router.route("/api/v1/sellers/:_id").get(SellerController.getOneSeller);
    // Update seller information.
    router.route("/api/v1/sellers/:_id").put(SellerController.updateSeller);
    // Delete a seller's account.
    router.route("/api/v1/sellers/:_id/status").delete(SellerController.deleteSeller);
    // Revoke a seller's account.
    router.route("/api/v1/sellers/:_id").delete(SellerController.revokeSeller);
    // Upload a profile picture for a seller.
    router.route("/api/v1/sellers/:sellerId/uploadProfilePic").post(upload.single("file"), SellerController.uploadImage);

    // Upload a document for seller verification.
    router.route("/api/v1/:sellerId/uploadDocVerify").post(SellerController.uploadDocumentVerification);

    // *Address API routes for CRUD operations

    // Create a new address.
    router.route("/api/v1/addressCreation").post(AddressController.createAddress);
    // Get a list of all addresses.
    router.route("/api/v1/address").post(AddressController.getAllAddress);
    // Get a specific address by type and reference ID.
    router.route("/api/v1/address/:type/:refId").get(AddressController.getAddress);
    // Update an address by its ID.
    router.route("/api/v1/address/:_id").put(AddressController.updateAddress);
    // (Optional) Update an address by its ID using a different route.
    router.route("/api/v1/address/updateAddress/:_id").put(AddressController.updateAddress);
    // Delete an address by its ID.
    router.route("/api/v1/address/:_id/status").delete(AddressController.deleteAddress);
    // Revoke an address by its ID.
    router.route("/api/v1/address/:_id").delete(AddressController.revokeAddress);

    // *Review API routes for managing product reviews

    // Add a new review for a specific product by a user.
    router.route("/api/v1/reviews/:userId/products/:productId").post(loginCheck, ReviewController.addReview);
    // Get a specific review by its ID.
    router.route("/api/v1/reviews/:productId").get(ReviewController.getReview);
    // Update an existing review by its ID.
    router.route("/api/v1/reviews/:id").put(ReviewController.updateReview);
    // Delete a review by its ID.
    router.route("/api/v1/reviews/delete/:id").delete(ReviewController.deleteReview);
    // Revoke a review by its ID.
    router.route("/api/v1/reviews/revoke/:id").delete(ReviewController.revokeReview);
    // Delete a user's review for a specific product
    router.route("/api/v1/reviews/user/:userId/product/:productId").delete(ReviewController.deleteUserReview);
    // like a review by its ID for a user.
    router.route("/api/v1/reviews/:reviewId/like").put(loginCheck, ReviewController.likeReview);
    // dislike a review by its ID for a user.
    router.route("/api/v1/reviews/:reviewId/dislike").put(loginCheck, ReviewController.dislikeReview);

    //router.route("/api/v1/reviews/uploadImage/:reviewId").post(upload.single("file"), ReviewController.uploadImage);
    // Upload images for a review
    router.route("/api/v1/reviews/uploadImages/:reviewId").post(ReviewController.uploadImages);
    // 'files' is the field name for the array of files
    // How many images are uploaded
    router.route("/api/v1/reviews/:productId/countPictures").get(ReviewController.countPictures);

    //*Cart related Routes

    // Get a customer's shopping cart by customer ID.
    router.route("/api/v1/cart/:customerId").get(CartController.getCart);
    // Add an item to the shopping cart.
    router.route("/api/v1/cart/addItem").post(CartController.addItem);
    // Update the quantity of items in the shopping cart.
    router.route("/api/v1/updateCart/:customerId").put(CartController.updateCart);
    router.route("/api/v1/cart/updateCartAddress/:customerId").put(CartController.updateCartAddress);
    // Delete an item from the shopping cart(it can reduce count one by one of a product if it exists more than 1)
    router.route("/api/v1/cart/deleteItem/:productId").delete(loginCheck, CartController.deleteItem);
    // THis route completely removes the given product(even if it is more than 1 in count) from cart items
    router.route("/api/v1/cart/removeProduct/:productId").delete(loginCheck, CartController.removeProduct);

    //* Live Demo related routes

    // Get a customer's live demo by customer ID.
    router.route("/api/v1/liveDemo/:customerId").get(LiveDemoController.getLiveDemo);
    router.route("/api/v1/liveDemo/:customerId/:storeId").get(LiveDemoController.getLiveDemoByStore);
    // Add an item to the live demo.
    router.route("/api/v1/liveDemo/addItem").post(LiveDemoController.addItem);
    // Remove an item from the live demo.
    router.route("/api/v1/liveDemo/removeProduct/:productId").delete(loginCheck, LiveDemoController.removeProduct);

    // *Store related routes

    router.route("/api/v1/store/:id").get(StoreController.getStoreById);
    // Create a store for a specific seller.
    router.route("/api/v1/:sellerId/addStore").post(StoreController.create);
    // Get information about a specific store under a seller.
    router.route("/api/v1/:sellerId/store/:_id").get(StoreController.getOne);
    // Get a list of all stores under a seller.
    router.route("/api/v1/:sellerId/stores").post(StoreController.getAll);
    // Update a specific store under a seller.
    router.route("/api/v1/:sellerId/updateStore/:_id").put(StoreController.update);
    // Delete a specific store under a seller.
    router.route("/api/v1/:sellerId/deleteStore/:_id").delete(StoreController.delete);
    // Revoke a specific store (optional: specify a seller).
    router.route("/api/v1/deleteStore/:_id").delete(StoreController.revoke);
    // Upload an image for a specific store under a seller
    router.route("/api/v1/:sellerId/:storeId/addStoreImage").post(upload.single("file"), StoreController.uploadImage);
    // follow a store by it's ID
    router.route("/api/v1/:storeId/follow").post(loginCheck, StoreController.followStore);
    // unfollow a store by it's ID
    router.route("/api/v1/:storeId/unfollow").post(loginCheck, StoreController.unfollowStore);

    // Mark a seller as a popular merchant(updates followers count and adds to popular merchants list).
    router.route("/api/v1/:sellerId/markAsMerchantPopular").put(StoreController.getMarkedPopularMerchants);

    // Get a list of all popular merchants.
    router.route("/api/v1/merchants/popular/:categoryId").get(StoreController.getMarkedPopularMerchantsByCategory);

    // Get a list of all popular merchants.
    router.route("/api/v1/getAllMerchantPopular").get(StoreController.getMarkedPopularMerchants);
    // *Review Store API routes for managing store reviews

    // Add a new review for a specific store by a user.
    router.route("/api/v1/storeReviews/:userId/store/:storeId").post(StoreReviewController.addReview);
    // Get a specific reviews for store by its ID.
    router.route("/api/v1/storeReviews/:storeId").get(StoreReviewController.getReview);
    // Update an existing review for store  by its ID.
    router.route("/api/v1/storeReviews/update/:id").put(StoreReviewController.updateReview);
    // Delete a review for store  by its ID.
    router.route("/api/v1/storeReviews/delete/:id").delete(StoreReviewController.deleteReview);
    // Revoke a review for store  by its ID.
    router.route("/api/v1/storeReviews/revoke/:id").delete(StoreReviewController.revokeReview);

    //*Product API related routes

    // Create a new product for a specific seller and store.
    router.route("/api/v1/:sellerId/:storeId/addProduct").post(ProductController.create);
    // Get information about a specific product under a seller and store.
    router.route("/api/v1/:sellerId/:storeId/products/:_id").get(ProductController.getOne);
    // Get a list of all products under a seller and store.
    router.route("/api/v1/:sellerId/:storeId/products").post(ProductController.getAll);
    // Update a specific product under a seller and store.
    router.route("/api/v1/:sellerId/:storeId/updateProduct/:_id").put(ProductController.update);
    // Delete a specific product under a seller and store.
    router.route("/api/v1/:sellerId/:storeId/deleteProduct/:_id").delete(ProductController.delete);
    // Revoke a specific product under a seller and store.
    router.route("/api/v1/deleteProduct/:_id").delete(ProductController.revoke);
    // Upload an image for a specific product under a seller and store.
    router.route("/api/v1/:sellerId/:storeId/products/:productId/addProductImage").post(upload.single("file"), ProductController.uploadImage);

    // Bulk upload products for a seller and store.
    router.route("/api/v1/:sellerId/:storeId/products/bulkUpload").post(uploadCsvFile.single("file"), ProductController.bulkUpload);
    // Get the format for bulk product upload.
    router.route("/api/v1/products/bulkUploadFormat").get(ProductController.bulkUploadFormat);

    //TODO: keep or not the below routes?
    // Get products by their starting letters.
    router.route("/api/v1/productsByLetters").get(ProductController.getByLetters);
    // router.route("/api/v1/productsByFilters").get(ProductController.getByFilters);

    // Get products by their size S,M,L,XL,XXL
    router.route("/api/v1/products/size/:size").get(ProductController.getProductsBySize);

    // Available product size S,M,L,XL,XXL API routes
    router.route("/api/v1/products/available/:productId").get(ProductController.checkAvailableSize);

    // Get New Arrivals products by category and also return Count of new arrived products
    router.route("/api/v1/products/newArrivals/:categoryId").get(ProductController.getNewArrival);

    // Product filter API route
    router.route("/api/v1/products").get(ProductController.filterProducts);

    //*public product routes

    // Get information about a specific product by its ID.
    router.route("/api/v1/products/:_id").get(ProductController.getOne2);
    // Get a list of all products.
    router.route("/api/v1/products").post(ProductController.getAll2);
    // Get products categorized by a specific category (_id is the category id).
    router.route("/api/v1/categoryProducts/:_id").get(ProductController.categoryProduct);
    //Get whats new in the week products
    router.route("/api/v1/products/get-by-category/:categoryId").get(ProductController.getNewWeeklyProducts);
    // *public store routes

    // Get information about a specific store by its ID.
    router.route("/api/v1/stores/:_id").get(StoreController.getOne2);
    // Get a list of all stores.
    router.route("/api/v1/stores").post(StoreController.getAll2);

    //*Neary by Stores and products routes

    // Get nearby stores.
    router.route("/api/v1/getNearByStores").get(StoreController.getNearbyStores);
    router.route("/api/v1/getNearByStores/:id").get(StoreController.getNearbyStoresByCategory);
    // // Get nearby fashion stores products.
    // router.route("/api/v1/getNearFashion").get(StoreController.getNearbyFashion);
    // // Get nearby jewelry stores products.
    // router.route("/api/v1/getNearJewellery").get(StoreController.getNearbyJewellery);
    // // Get nearby electronics stores products.
    // router.route("/api/v1/getNearElectronics").get(StoreController.getNearbyElectronics);
    // // Get nearby furniture stores products.
    // router.route("/api/v1/getNearFurniture").get(StoreController.getNearbyFurniture);

    // *Store offer routes

    // Create an offer for a specific seller's store
    router.route("/api/v1/:sellerId/stores/:storeId/offers").post(StoreController.createOffer);
    // Update an offer for a specific seller's store.
    router.route("/api/v1/:sellerId/stores/:storeId/offers/:offerId").put(StoreController.updateOffer);

    //*Offer API routes for managing product offers/ discount

    // for offers get projects whose discount>0
    router.route("/api/v1/getAllOffers").get(ProductController.getAllOffers);
    // for offer deletion set discount=0
    router.route("/api/v1/deleteOffer/:productId").put(ProductController.deleteOffer);
    router.route("/api/v1/getStoreProduct/:storeId").post(ProductController.getProducts)
    router.route("/api/v1/getChildCategories/:storeId/:category").post(ProductController.getCatProducts)
    router.route("/api/v1/getReviews/:storeId").post(ProductController.getProductReviews)

    //*Category API routes

    // Create a new category
    router.route("/api/v1/categories/addCategory").post(CategoryController.create);
    // Get category information
    router.route("/api/v1/categories/:_id").get(CategoryController.getOne);
    // Get a list of all categories
    router.route("/api/v1/categories").post(CategoryController.getAll);
    // Update a category
    router.route("/api/v1/categories/update/:_id").put(CategoryController.update);
    // Delete a category
    router.route("/api/v1/categories/delete/:_id").delete(CategoryController.delete);
    // Upload an image for a category
    router.route("/api/v1/categories/:categoryId/uploadImage").put(upload.single("file"), CategoryController.uploadImage);

    //*Featured categories

    // Mark a category as featured
    router.route("/api/v1/createFeatured/:categoryId").post(CategoryController.markAsFeatured);
    //Unmark a category as featured
    router.route("/api/v1/deleteFeatured/:categoryId").put(CategoryController.unMarkAsFeatured);
    // Get all marked featured categories
    router.route("/api/v1/getFeatured").get(CategoryController.getAllMarkedFeaturedCategories);

    // Home categories API routes
    // Get categories for the home dashboard / navbar.
    router.route("/api/v1/homeCategories").get(CategoryController.dashboardCategories);
    
    // Get homepage categories to show on the home page.
    router.route("/api/v1/homePageCategories").get(CategoryController.homepageCategories);

    // BOY, GIRL, MEN, WOMEN Clothing API routes
    // Create a new clothing item.
    router.route("/api/v1/clothing/addClothing").post(ClothingController.addClothing);
    // Retrieve all clothing items.
    router.route("/api/v1/clothing/getAllClothing").get(ClothingController.getAllClothing);
    // Get clothing by filter
    router.route("/api/v1/clothing/getClothingByFilter").get(ClothingController.getClothingByFilter);

    //* ALL HEADER API ROUTES

    // Create subCategory
    router.route("/api/v1/subCategories/addSubCategory").post(CategoryController.createSubCategory);
    // Get subcategories by category ID in Header
    router.route("/api/v1/subcategories/:categoryId").get(CategoryController.getAllSubcategoriesByCategoryId);
    // Create Header API for subcategories
    router.route("/api/v1/createHeader").post(HeaderController.createHeader);
    // Get Header API for subcategories
    router.route("/api/v1/getHeaders/:subcategoryId").get(HeaderController.getHeaders);
    // Create Sponsonsered Product
    router.route("/api/v1/sponsoredProduct").post(SponsoredProductController.createSponsoredProduct);
    // Get Sponsonsered Product by subcategory
    router.route("/api/v1/sponsoredProduct/:subcategoryId").get(SponsoredProductController.getSponsoredProductsBySubcategory);
    router.route("/api/v1/sponsoredProducts").get(SponsoredProductController.getAllSponsoredProducts);

    //*Brand API routes

    // Create a new brand.
    router.route("/api/v1/brands/addBrand").post(BrandController.addBrand);
    // Get brand information by name.
    router.route("/api/v1/brands/:name").get(BrandController.getBrand);
    // Update a brands Data by its id
    router.route("/api/v1/brands/:id").put(BrandController.updateBrand);
    // Upload a brand's logo.
    router.route("/api/v1/brands/uploadLogo").post(BrandController.uploadImage);
    // Upload a brand's video.
    router.route("/api/v1/brands/uploadVideo").post(BrandController.uploadVideo);
    // Delete a brand by its ID.
    router.route("/api/v1/brands/deleteBrand/:_id").delete(BrandController.deleteBrand);

    // Mark a brand as popular by its ID.
    router.route("/api/v1/brands/markAsPopular/:brandId").put(BrandController.markBrandAsPopular);
    // Get a list of popular brands.
    router.route("/api/v1/getPopularBrand").get(BrandController.getAllMarkedPopularBrands);
    // Get a list of popular brands by category.
    router.route("/api/v1/getPopularBrand/:categoryId").get(BrandController.getPopularBrandsByCategory);
    // Add products to brand.
    router.route("/api/v1/brands/:brandId/addProducts").post(BrandController.addProductToBrand);
    // add offers to a brand
    router.route("/api/v1/brands/:brandId/addOffers").post(BrandController.addOfferToBrand);

    //*Order API routes

    // Create a new order for a specific user.
    router.route("/api/v1/:userId/addOrder").post(OrderController.create);
    // Get a list of orders for a specific user.
    router.route("/api/v1/:userId/myOrders").get(OrderController.getMyOrder);
    // Get a list of all orders.
    router.route("/api/v1/getAllOrders").get(OrderController.getAll);
    // Update a specific order by its ID.
    router.route("/api/v1/updateOrder/:_id").put(OrderController.update);
    router.route("/api/v1/updateSubOrder/:_id").put(OrderController.updateSubOrder);

    // Delete a specific order by its ID.
    router.route("/api/v1/deleteOrder/:_id").delete(OrderController.delete);
    // Single Order by _id
    router.route("/api/v1/order/:_id").get(OrderController.getOrder);
    router.route("/api/v1/suborder/:_id").get(OrderController.getSubOrder);

    // Protected route with authorization check
    router.route("/api/v1/protected-route").get(securityCheck, ProtectedController.protectedRoute);
    //send otp for a mobile number
    router.route("/api/v1/send-otp").post(LoginAuthController.sendOTP);
    //verify otp for a mobile number
    router.route("/api/v1/verify-otp").post(LoginAuthController.verifyOTP);

    //*Coupon API routes

    // Create a new coupon.
    router.route("/api/v1/coupons/createCoupon").post(CouponController.createCoupon);
    // Get a list of all coupons.
    router.route("/api/v1/coupons/getAll").get(CouponController.getCoupons);
    // verify domain
    router.route("/api/v1/verifyDomain/:couponType").post(CouponController.verifyDomain)


    // Get a specific coupon by its ID.
    router.route("/api/v1/coupons/getCouponById/:id").get(CouponController.getCouponById);
    // Update a specific coupon by its ID.
    router.route("/api/v1/coupons/updateCoupon/:id").put(CouponController.updateCoupon);
    // Delete a specific coupon by its ID.
    router.route("/api/v1/coupons/deleteCoupon/:id").delete(CouponController.deleteCoupon);
    // Apply a coupon to an order.
    router.route("/api/v1/coupons/applyCoupon").post(CouponController.applyCoupon);
    // Apply school ID coupon 
    router.route("/api/v1/uploadID/:couponType/:userId").post(upload.single("schoolId"),CouponController.uploadSchoolId);
    router.route("/api/v1/getSchoolId/:couponType/:userId").get(CouponController.getSchoolId)


    //*Offer API routes for managing product offers/ discounts

    // Create offer
    router.route("/api/v1/offer/createOffer").post(OfferController.createOffer);
    // Get all offers
    router.route("/api/v1/offer/getAllOffers").get(OfferController.getAllOffers);

    //*Notification API routes

    // Create a new notification.
    router.route("/api/v1/notifications/addNotification").post(NotificationController.createNotification);
    // Get a list of notifications for a specific user.
    router.route("/api/v1/notifications/getAll/:userId").get(NotificationController.getNotifications);
    // Mark a specific notification as read by its ID.
    router.route("/api/v1/notifications/markRead/:id").put(NotificationController.markNotificationAsRead);
    // Delete a specific notification by its ID.
    router.route("/api/v1/notifications/deleteNotification/:id").delete(NotificationController.deleteNotification);
    // Update a specific notification by its ID.
    router.route("/api/v1/notifications/updateNotification/:id").put(NotificationController.updateNotification);

    //*Search API routes

    //Search product
    router.route("/api/v1/search").get(SearchController.search);

    //*Chat API routes

    // Create a new chat.
    router.route("/api/v1/chat/addChat").post(ChatController.createChat);
    // Get a specific chat by its ID.
    router.route("/api/v1/chat/:id").get(ChatController.getChatById);
    // Update a specific chat by its ID.
    router.route("/api/v1/chat/:id").put(ChatController.updateChat);
    // Delete a specific chat by its ID.
    router.route("/api/v1/chat/:id").delete(ChatController.deleteChat);
    //*Contact Us API routes

    // Create a new contact us entry.
    router.route("/api/v1/contactUs/addContact").post(ContactUsController.createContactUs);
    // Get a list of all contact us entries.
    router.route("/api/v1/contactUs/getAll").get(ContactUsController.getContactUsEntries);
    // Get a specific contact us entry by its ID.
    router.route("/api/v1/contactUs/getById/:id").get(ContactUsController.getContactUsEntryById);
    // Update a specific contact us entry by its ID.
    router.route("/api/v1/contactUs/updateContact/:id").put(ContactUsController.updateContactUsEntry);
    // Delete a specific contact us entry by its ID.
    router.route("/api/v1/contactUs/deleteContact/:id").delete(ContactUsController.deleteContactUsEntry);

    /*                                        FAQs API routes                                                             */
    // Create a new FAQ
    router.route("/api/v1/faqs/addFaq").post(FaqController.createFaq);
    // Get all FAQs
    router.route("/api/v1/faqs/getAll").get(FaqController.getAllFaq);

    //?what is this API for?
    //Todo: change or remove it
    router.route("/api/v1/arrivals/getAll").get(ArrivalController.getAll);
    router.route("/api/v1/arrivals/getAllByCategory/:categoryId").get(ArrivalController.getAllByCategory);
    router.route("/api/v1/arrivals/getOne/:id").get(ArrivalController.getOne);

    // * Paymentgateway Phonepe

    //*Payment API routes

    // Create a new payment entry.
    router.route("/api/v1/payments/create").post(PaymentController.createPayment);
    // Get a list of all payment entries.
    router.route("/api/v1/payments/getAll").get(PaymentController.getPayments);
    // Get a specific payment entry by its ID.
    router.route("/api/v1/payments/getPaymentById/:id").get(PaymentController.getPaymentById);
    // Update a specific payment entry by its ID.
    router.route("/api/v1/payments/updatePayment/:id").put(PaymentController.updatePayment);
    // Delete a specific payment entry by its ID.
    router.route("/api/v1/payments/deletePayment/:id").delete(PaymentController.deletePayment);

    // Download/ Retrieve an image by its name.
    router.route("/api/v1/uploads/:name").get(DownloadController.downloadImage);

    //*User wishlist API routes

    // Add a product to a user's wishlist.
    router.route("/api/v1/addWishList/:userId/:productId").post(UserController.addWishList);
    // Delete a product from a user's wishlist.
    router.route("/api/v1/deleteWishList/:userId/:productId").delete(UserController.deleteWishList);

    // router.route("/api/v1/user/recommended/:id").get(OrderController.getRecommendedProducts);
    // *Submit a contact form in a portfolio.
    router.route("/api/v1/portfolio/contactform").post(PortfolioController.contactUs);

    //pdf verification
    // router.route("/api/v1/saveFormData").post(uploads.single('aadharUpload'),VerificationController.mainVerification); //for single upload
    router.route("/api/v1/saveFormData/:sellerId").post(uploads.any(), VerificationController.mainVerification);
    router.route("/api/v1/getFormData/:sellerId").get(VerificationController.getFile);

    router.route("/reels/upload/:id").post(uploads.single("reel"),CustomerReelController.uploadReel)
    router.route("/reels/getReels/:id").post(CustomerReelController.getAllReel)
    router.route("/reels/getAllReels").get(CustomerReelController.getAllReels)
    router.route("/reels/like/:id/:userId").post(CustomerReelController.likeReel)
    router.route("/reels/dislike/:id/:userId").post(CustomerReelController.dislikeReel)
    router.route("/reels/comment/:id/:userId").post(CustomerReelController.addComment)
    router.route("/reels/:id").delete(CustomerReelController.deleteReel)


    return router;
  }
}
