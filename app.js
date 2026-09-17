/* =========================================
   OLATEE - MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MOBILE MENU
       ========================================= */
const menuButton = document.querySelector(".menu-button");
    const nav = document.querySelector(".main-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.classList.toggle("open");
        });
    }


    /* =========================================
       CART
       ========================================= */

    let cart = JSON.parse(localStorage.getItem("olateeCart")) || [];


    function saveCart() {
        localStorage.setItem("olateeCart", JSON.stringify(cart));
        updateCartCount();
    }


    function updateCartCount() {
        const cartCounts = document.querySelectorAll(".cart-count");

        const totalItems = cart.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
    }


    function addToCart(product) {

        const existingProduct = cart.find(item =>
            item.name === product.name &&
            item.length === product.length &&
            item.color === product.color
        );

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        saveCart();

        alert("Product added to your cart.");
    }


    /* =========================================
       PRODUCT PAGE
       ========================================= */

    const addToCartButton = document.querySelector(".add-to-cart");

    if (addToCartButton) {

        addToCartButton.addEventListener("click", () => {

            const productName =
                document.querySelector(".product-information h1")?.textContent.trim()
                || "Luxury Pixie Curl";

            const priceText =
                document.querySelector(".product-price")?.textContent.trim()
                || "₦185,000";

            const price =
                Number(priceText.replace(/[₦,]/g, "")) || 185000;

            const selectedLength =
                document.querySelector(".length-button.selected")?.textContent.trim()
                || "14\"";

            const selectedColor =
                document.querySelector(".color-swatch.selected")?.dataset.color
                || "Natural Black";

            const quantityInput =
                document.querySelector(".quantity-input");

            const quantity =
                quantityInput
                    ? Math.max(1, Number(quantityInput.value) || 1)
                    : 1;

            addToCart({
                name: productName,
                price: price,
                length: selectedLength,
                color: selectedColor,
                quantity: quantity
            });
        });
    }


    /* =========================================
       LENGTH SELECTION
       ========================================= */

    const lengthButtons = document.querySelectorAll(".length-button");

    lengthButtons.forEach(button => {

        button.addEventListener("click", () => {

            lengthButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
        });

    });


    /* =========================================
       COLOR SELECTION
       ========================================= */

    const colorSwatches = document.querySelectorAll(".color-swatch");

    colorSwatches.forEach(swatch => {

        swatch.addEventListener("click", () => {

            colorSwatches.forEach(item => {
                item.classList.remove("selected");
            });

            swatch.classList.add("selected");
        });

    });


    /* =========================================
       PRODUCT QUANTITY
       ========================================= */

    const quantityInput = document.querySelector(".quantity-input");
    const quantityMinus = document.querySelector(".quantity-minus");
    const quantityPlus = document.querySelector(".quantity-plus");

    if (quantityMinus && quantityInput) {
        quantityMinus.addEventListener("click", () => {

            let quantity = Number(quantityInput.value) || 1;

            if (quantity > 1) {
                quantity--;
            }

            quantityInput.value = quantity;
        });
    }


    if (quantityPlus && quantityInput) {
        quantityPlus.addEventListener("click", () => {

            let quantity = Number(quantityInput.value) || 1;

            quantity++;

            quantityInput.value = quantity;
        });
    }


    /* =========================================
       CART PAGE
       ========================================= */

    const cartContainer = document.querySelector(".cart-items");

    if (cartContainer) {
        renderCart();
    }


    function renderCart() {

        const cartContainer = document.querySelector(".cart-items");
        const emptyCart = document.querySelector(".empty-cart");
        const cartLayout = document.querySelector(".cart-layout");

        if (!cartContainer) return;

        if (cart.length === 0) {

            cartContainer.innerHTML = "";

            if (cartLayout) {
                cartLayout.style.display = "none";
            }

            if (emptyCart) {
                emptyCart.style.display = "block";
            }

            updateCartTotals();

            return;
        }

        if (cartLayout) {
            cartLayout.style.display = "grid";
        }

        if (emptyCart) {
            emptyCart.style.display = "none";
        }

        cartContainer.innerHTML = "";

        cart.forEach((item, index) => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <div class="product-placeholder">
                        <span>OLATEE</span>
                    </div>
                </div>

                <div class="cart-item-info">
                    <span class="cart-item-category">HAIR</span>

                    <h3>${item.name}</h3>

                    <p>${item.length} / ${item.color}</p>

                    <strong>₦${item.price.toLocaleString()}</strong>
                </div>

                <div class="cart-item-actions">

                    <div class="quantity-control">

                        <button
                            class="cart-minus"
                            data-index="${index}"
                            type="button"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            value="${item.quantity}"
                            min="1"
                            class="cart-quantity"
                            data-index="${index}"
                        >

                        <button
                            class="cart-plus"
                            data-index="${index}"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                        type="button"
                    >
                        Remove
                    </button>

                </div>
            `;

            cartContainer.appendChild(cartItem);
        });


        /* CART PLUS */

        document.querySelectorAll(".cart-plus").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cart[index].quantity++;

                saveCart();
                renderCart();
            });

        });


        /* CART MINUS */

        document.querySelectorAll(".cart-minus").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                }

                saveCart();
                renderCart();
            });

        });


        /* CART INPUT */

        document.querySelectorAll(".cart-quantity").forEach(input => {

            input.addEventListener("change", () => {

                const index = Number(input.dataset.index);

                let quantity = Number(input.value) || 1;

                if (quantity < 1) {
                    quantity = 1;
                }

                cart[index].quantity = quantity;

                saveCart();
                renderCart();
            });

        });


        /* REMOVE ITEM */

        document.querySelectorAll(".remove-item").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cart.splice(index, 1);

                saveCart();
                renderCart();
            });

        });

        updateCartTotals();
    }


    /* =========================================
       CART TOTALS
       ========================================= */

    function updateCartTotals() {

        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const subtotalElements =
            document.querySelectorAll(".cart-subtotal");

        const totalElements =
            document.querySelectorAll(".cart-total");

        subtotalElements.forEach(element => {
            element.textContent = `₦${subtotal.toLocaleString()}`;
        });

        totalElements.forEach(element => {
            element.textContent = `₦${subtotal.toLocaleString()}`;
        });
    }


    /* =========================================
       CHECKOUT PAGE
       ========================================= */

    const checkoutItems = document.querySelector(".checkout-products");

    if (checkoutItems) {
        renderCheckout();
    }


    function renderCheckout() {

        const checkoutItems =
            document.querySelector(".checkout-products");

        if (!checkoutItems) return;

        checkoutItems.innerHTML = "";

        cart.forEach(item => {

            const product = document.createElement("div");

            product.className = "checkout-product";

            product.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <span>${item.length} / ${item.color} × ${item.quantity}</span>
                </div>

                <strong>
                    ₦${(item.price * item.quantity).toLocaleString()}
                </strong>
            `;

            checkoutItems.appendChild(product);
        });

        updateCheckoutTotal();
    }


    function updateCheckoutTotal() {

        const total = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const checkoutTotal =
            document.querySelector(".checkout-total");

        if (checkoutTotal) {
            checkoutTotal.textContent =
                `₦${total.toLocaleString()}`;
        }
    }


    /* =========================================
       BUY NOW
       ========================================= */

    const buyNowButton = document.querySelector(".buy-now");

    if (buyNowButton) {

        buyNowButton.addEventListener("click", () => {

            const addButton = document.querySelector(".add-to-cart");

            if (addButton) {
                addButton.click();
            }

            setTimeout(() => {
                window.location.href = "checkout.html";
            }, 300);

        });
    }


    /* =========================================
       INITIAL CART COUNT
       ========================================= */

    updateCartCount();

});
const quantityControl = document.querySelector(".quantity-control");

if (quantityControl) {
    const decreaseButton = quantityControl.querySelector("button:first-child");
    const increaseButton = quantityControl.querySelector("button:last-child");
    const quantityInput = quantityControl.querySelector("input");

    decreaseButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityInput.value) || 1;

        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
        }
    });

    increaseButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentQuantity + 1;
    });
}
const productThumbnails = document.querySelectorAll(".product-thumbnail");
const productPhoto = document.querySelector("#product-photo");

if (productThumbnails.length && productPhoto) {
    productThumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => {
            productThumbnails.forEach(item => {
                item.classList.remove("active");
            });

            thumbnail.classList.add("active");
            productPhoto.textContent = `IMAGE 0${index + 1}`;
        });
    });
}
const colorOptions = document.querySelectorAll('input[name="color"]');
const selectedColor = document.querySelector("#selected-color");

if (colorOptions.length && selectedColor) {
    colorOptions.forEach(option => {
        option.addEventListener("change", () => {
            const colorNames = {
                "natural-black": "Natural Black",
                "brown": "Brown",
                "burgundy": "Burgundy"
            };

            selectedColor.textContent = colorNames[option.value];
        });
    });
}
