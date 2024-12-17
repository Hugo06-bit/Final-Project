$(document).ready(function () {
    const checkLogin = () => {
        $.get('session_check.php', function (response) {
            const result = JSON.parse(response);
            if (result.loggedIn) {
                $('#loginSection').hide();
                $('#inventorySection').show();
                loadProducts();
            } else {
                $('#loginSection').show();
                $('#inventorySection').hide();
            }
        });
    };

    const loadProducts = () => {
        $.get('fetch_products.php', function (data) {
            const products = JSON.parse(data);
            let tableRows = '';
            products.forEach(product => {
                tableRows += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td>
                        <td>
                            <button class="delete-btn" data-id="${product.id}">Delete</button>
                        </td>
                    </tr>`;
            });
            $('#productTable').html(tableRows);
        });
    };

    checkLogin();

    $('#loginForm').submit(function (e) {
        e.preventDefault();
        const formData = $(this).serialize();
        $.post('login.php', formData, function (response) {
            const result = JSON.parse(response);
            if (result.success) {
                checkLogin();
            } else {
                $('#loginError').text(result.message);
            }
        });
    });

    $('#logoutButton').click(function () {
        $.post('logout.php', function () {
            checkLogin();
        });
    });

    $('#addProductForm').submit(function (e) {
        e.preventDefault();
        const formData = $(this).serialize();
        $.post('add_product.php', formData, function () {
            loadProducts();
        });
    });

    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        $.post('delete_product.php', { id }, function () {
            loadProducts();
        });
    });

    $('#searchBar').on('input', function () {
        const query = $(this).val();
        $.get('search_products.php', { query }, function (data) {
            const products = JSON.parse(data);
            let tableRows = '';
            products.forEach(product => {
                tableRows += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td>
                        <td>
                            <button class="delete-btn" data-id="${product.id}">Delete</button>
                        </td>
                    </tr>`;
            });
            $('#productTable').html(tableRows);
        });
    });
});
