import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
    return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${product.Image}"
        alt="${product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${product.Colors[0].ColorName}</p>
      <p class="product__description">
      ${product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div></section>`;
  }

export default class ProductDetails {
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init(){
        //gets details of current product from the data source
        this.product = await this.dataSource.findProductById(this.productId);

        //renders out the HTML with the product details
        this.renderProductDetails("main");

        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }

    addToCart() {
        let allProductsInCart = getLocalStorage("so-cart");

        if (Array.isArray(allProductsInCart)) {
          allProductsInCart.push(this.product);
        } else {
          allProductsInCart = [this.product];
        };

        setLocalStorage("so-cart", allProductsInCart);
      }

    renderProductDetails(selector){
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            productDetailsTemplate(this.product)
        );
    }
}