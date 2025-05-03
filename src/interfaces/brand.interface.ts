export interface IBrand extends Document {
    name?: string;
    description?: string;
    logo?: string;
    video?: string;
    isPopular?: Boolean;
    categories?: [string]
    products?: [string]
}