$(document).ready(function () {
    // Display update form with current product data
    $(document).on('click', '.updateButton', function () {
        var productId = $(this).data('id');
        
        // Get product details using AJAX
        $.ajax({
            url: 'get_product.php',
            method: 'GET',
            data: { id: productId },
            success: function (response) {
                var product = JSON.parse(response);
                
                // Populate the form fields with current product data
                $('#updateProductId').val(product.id);
                $('#updateProductName').val(product.name);
                $('#updateProductQuantity').val(product.quantity);
                $('#updateProductPrice').val(product.price);
                
                // Show the update form
                $('#updateProductForm').show();
            }
        });
    });

    // Handle update form submission
    $('#updateForm').submit(function (e) {
        e.preventDefault();
        
        var updatedProduct = {
            id: $('#updateProductId').val(),
            name: $('#updateProductName').val(),
            quantity: $('#updateProductQuantity').val(),
            price: $('#updateProductPrice').val()
        };

        // Submit the updated data via AJAX
        $.ajax({
            url: 'update_product.php',
            method: 'POST',
            data: updatedProduct,
            success: function (response) {
                if (response === 'success') {
                    // Hide the update form
                    $('#updateProductForm').hide();
                    alert('Product updated successfully!');
                    loadProducts(); // Reload the product table
                } else {
                    alert('Error updating product');
                }
            }
        });
    });

    // Hide update form if cancel button is clicked
    $('#cancelUpdateButton').click(function () {
        $('#updateProductForm').hide();
    });
    
    // Load products when the page loads
    loadProducts();

    // Function to load products
    function loadProducts() {
        $.ajax({
            url: 'fetch_products.php',
            method: 'GET',
            success: function (response) {
                var products = JSON.parse(response);
                var productTable = $('#productTable');
                productTable.empty();

                products.forEach(function (product) {
                    productTable.append(`
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                            <td>${product.price}</td>
                            <td>
                                <button class="updateButton" data-id="${product.id}">Update</button>
                                <button class="deleteButton" data-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }
});
