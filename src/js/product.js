import { setLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let prodArray = getLocalStorage("so-cart");
  
  if (prodArray != null){
    prodArray.push(product);
  }else{
    prodArray = [product];
  };

  setLocalStorage("so-cart", prodArray);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
