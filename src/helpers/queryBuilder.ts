import { FilterQuery } from "mongoose";

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  tags?: string[];
  status?: string;
  minDiscount?: number;
  brand?: string;
  storeId?: string;
  sellerId?: string;
  clientId?: string;
  productId?: string;
  country?: string;
  state?: string;
  district?: string;
  parent?: string;
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}

export function buildQuery(filters: Filters): FilterQuery<any> {
  const { minPrice, maxPrice, categories, tags, status, minDiscount, brand, storeId, sellerId, clientId, productId, country, state, district, parent, latitude, longitude, maxDistance } =
    filters ?? {};

  const query: FilterQuery<any> = {};

  //products
  if (minPrice !== undefined && maxPrice !== undefined) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }
  // console.log("all: ", categories);
  if (categories && categories.length > 0) {
    query.categories = { $all: categories };
  }
  if (tags && tags.length > 0) {
    query.tags = { $all: tags };
  }
  if (minDiscount !== undefined) {
    query.discount = { $gte: minDiscount };
  }
  if (brand !== undefined) {
    query.brand = brand;
  }
  if (storeId !== undefined) {
    query.storeId = storeId;
  }
  if (sellerId !== undefined) {
    query.sellerId = sellerId;
  }

  if (status !== undefined) {
    query.status = status;
  }

  if (clientId !== undefined) {
    query.clientId = clientId;
  }

  if (productId !== undefined) {
    query.productId = productId;
  }

  if (country !== undefined) {
    query.country = country;
  }
  if (state !== undefined) {
    query.state = state;
  }
  if (district !== undefined) {
    query.district = district;
  }

  if (parent !== undefined) {
    query.parent = parent;
  }

  if (latitude !== undefined && longitude !== undefined && maxDistance !== undefined) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    };
  }

  return query;
}
