$(document).ready(function () {
    const fruits = [
        { name: "Watermelon", price: 30, image: "images/watermelon.png" },
        { name: "Grapes", price: 70, image: "images/grapes.png" }
    ];

    // Configuration object for image dimensions
    const imageOptions = {
        height: '150px',  // Change as needed
        width: 'auto'     // Change to a value like '150px' for fixed width
    };

    let cart = {};

    // Helper function to generate order id in yyyyMMddHHmmss format
    function generateOrderId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // Render fruits dynamically with inline image styles
    fruits.forEach((fruit, index) => {
        $("#fruit-list").append(`
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card my-2">
                    <img src="${fruit.image}" 
                         class="card-img-top" 
                         alt="${fruit.name}"
                         style="height: ${imageOptions.height}; width: ${imageOptions.width}; object-fit: contain;">
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
   showNotification(`${fruit.name} added to cart!`);
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


    // Inline notification function.
    function showNotification(message) {
        const notification = $("#notification");
        notification.text(message).fadeIn(300).delay(1500).fadeOut(300);
    }



   // When "Order on WhatsApp" is clicked, show the order modal if the cart is not empty.
    $("#orderButton").click(function () {
        if (Object.keys(cart).length === 0) {
            alert("Your cart is empty! Please add some fruits.");
            return;
        }

        // Show the Bootstrap modal for order date and slot selection.
        let orderModal = new bootstrap.Modal(document.getElementById('orderModal'), {
          keyboard: false
        });
        orderModal.show();
    });

    // When the user confirms their order in the modal.
    $("#confirmOrder").click(function () {
        const deliveryDate = $("#deliveryDate").val();
        if (!deliveryDate) {
            alert("Please select a delivery date.");
            return;
        }
        const selectedSlot = $("input[name='slot']:checked").val();

        // Generate order details including a unique order ID.
        const orderId = generateOrderId();
        let message = `Order ID: ${orderId}\nDelivery Date: ${deliveryDate}\nTime Slot: ${selectedSlot}\nOrder Summary:\n`;
        let totalAmount = 0;

        for (let fruit in cart) {
            const itemTotal = cart[fruit].quantity * cart[fruit].price;
            totalAmount += itemTotal;
            message += `${fruit}: ${cart[fruit].quantity} x ₹${cart[fruit].price} = ₹${itemTotal}\n`;
        }
        message += `\nTotal Amount: ₹${totalAmount}\n`;
        
        if (totalAmount >= 500) {
            message += "\n🎉 Congratulations! You're eligible for free delivery!";
        } else {
            message += "\nOrder above ₹500 to get free delivery.";
        }
        message += "\nPlease share your location/address for delivery.";

        // Open WhatsApp link with the order message.
        let whatsappLink = `https://wa.me/918143862672?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");

        // Hide the modal once the order is confirmed.
        let modalEl = document.getElementById("orderModal");
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    });
});