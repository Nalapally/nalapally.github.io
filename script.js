$(document).ready(function () {
    const fruits = [
        { name: "Watermelon", price: 30, image: "images/watermelon.png" },
        { name: "Grapes", price: 70, image: "images/grapes.png" }
    ];

    let cart = {};

    // Render fruits dynamically
    fruits.forEach((fruit, index) => {
        $("#fruit-list").append(`
            <div class="col-md-3">
                <div class="card">
                    <img src="${fruit.image}" class="card-img-top" alt="${fruit.name}">
                    <div class="card-body text-center">
                        <h5>${fruit.name}</h5>
                        <p>Price: ₹${fruit.price}</p>
                        <button class="btn btn-primary add-to-cart" data-index="${index}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `);
    });

    // Add to cart and show toast
$(".add-to-cart").click(function () {
    let index = $(this).data("index");
    let fruit = fruits[index];

    if (cart[fruit.name]) {
        cart[fruit.name].quantity += 1;
    } else {
        cart[fruit.name] = { price: fruit.price, quantity: 1 };
    }

    displayCartSummary();
    showToast(`${fruit.name} added to cart!`); // This invokes the toast function
});


    // Display cart summary
    function displayCartSummary() {
        let summary = "<ul>";
        let totalAmount = 0;

        for (let fruit in cart) {
            const itemTotal = cart[fruit].quantity * cart[fruit].price;
            totalAmount += itemTotal;
            summary += `
                <li>${fruit}: ${cart[fruit].quantity} x ₹${cart[fruit].price} = ₹${itemTotal}
                <button class="btn btn-sm btn-success increase-quantity" data-fruit="${fruit}">+</button>
                <button class="btn btn-sm btn-danger decrease-quantity" data-fruit="${fruit}">-</button>
                </li>`;
        }
        summary += `</ul><p><strong>Total Amount: ₹${totalAmount}</strong></p>`;
        $("#cart-summary").html(summary);

        // Update quantity buttons
        $(".increase-quantity").click(function () {
            const fruit = $(this).data("fruit");
            cart[fruit].quantity += 1;
            displayCartSummary();
        });

        $(".decrease-quantity").click(function () {
            const fruit = $(this).data("fruit");
            if (cart[fruit].quantity > 1) {
                cart[fruit].quantity -= 1;
            } else {
                delete cart[fruit];
            }
            displayCartSummary();
        });
    }

    // Toast notification
function showToast(message) {
    const toast = document.createElement("div"); // Create toast element
    toast.className = "toast"; // Add the 'toast' CSS class
    toast.textContent = message; // Set the message content

    document.body.appendChild(toast); // Append the toast to the body

    setTimeout(() => {
        toast.remove(); // Remove toast after 2 seconds
    }, 2000);
}


    // Order on WhatsApp
    $("#orderButton").click(function () {
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty! Please add some fruits.");
            return;
        }

        let message = "Order Summary:\n";
        let totalAmount = 0;

        for (let fruit in cart) {
            const itemTotal = cart[fruit].quantity * cart[fruit].price;
            totalAmount += itemTotal;
            message += `${fruit}: ${cart[fruit].quantity} x ₹${cart[fruit].price} = ₹${itemTotal}\n`;
        }

        message += `Total Amount: ₹${totalAmount}\n`;
        if (totalAmount >= 500) {
            message += "\n🎉 Congratulations! You're eligible for free delivery!";
        } else {
            message += `\nOrder above ₹500 to get free delivery.`;
        }
        message += "\nPlease share your location/address for delivery.";

        let whatsappLink = `https://wa.me/918143862672?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    });
});