import { SellerImporter} from "./helpers/sellersImporter";

const sellerImporter = new SellerImporter("./data/sellers.csv");

sellerImporter
  .importSellersFromCSV()
  .then(() => {
    console.log("Sellers import completed.");
  })
  .catch((error) => {
    console.error("Error importing sellers:", error);
  });
