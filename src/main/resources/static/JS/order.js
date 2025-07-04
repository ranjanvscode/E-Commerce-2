        let orders= [];
        let filteredOrders = [];

        // DOM elements
        const ordersListView = document.getElementById('ordersListView');
        const orderDetailView = document.getElementById('orderDetailView');
        const ordersGrid = document.getElementById('ordersGrid');
        const backButton = document.getElementById('backButton');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');
        const orderCount = document.getElementById('orderCount');

        // Status styling
        const statusStyles = {
            delivered: 'bg-green-100 text-green-800',
            shipped: 'bg-blue-100 text-blue-800',
            processing: 'bg-yellow-100 text-yellow-800', 
            pending: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        // Format date
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'INR'
            }).format(amount);
        }

        // Render orders grid
        function renderOrders() {

            // Sort orders by date descending (latest first)
            filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

            ordersGrid.innerHTML = '';
            orderCount.textContent = filteredOrders.length;

            filteredOrders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer';
                orderCard.onclick = () => showOrderDetail(order);

                orderCard.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">${order.orderId}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(order.orderDate)}</p>
                        </div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.shipping?.shippingStatus]}">
                            ${order.shipping.shippingStatus?.charAt(0).toUpperCase() + order.shipping.shippingStatus?.slice(1)}
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Items:</span>
                            <span class="text-gray-900 dark:text-white">${order.itemCount} item${order.itemCount > 1 ? 's' : ''}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Total:</span>
                            <span class="font-semibold text-gray-900 dark:text-white">${formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button class="text-primary hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium">
                            View Details →
                        </button>
                    </div>
                `;

                ordersGrid.appendChild(orderCard);
            });
        }

        // Show order detail
        function showOrderDetail(order) {
            // Hide orders list and show detail view
            ordersListView.classList.add('hidden');
            orderDetailView.classList.remove('hidden');

            // Populate order header
            document.getElementById('detailOrderNumber').textContent = order.orderId;
            document.getElementById('detailOrderDate').textContent = formatDate(order.orderDate);

            // Populate status
            const statusElement = document.getElementById('detailStatus');
            statusElement.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.shipping.shippingStatus]}`;
            statusElement.textContent = order.shipping.shippingStatus?.charAt(0).toUpperCase() + order.shipping.shippingStatus?.slice(1);

            // Show tracking info if available
            const trackingInfo = document.getElementById('trackingInfo');
            const trackingNumber = document.getElementById('trackingNumber');
            if (order.shipping?.trackingNumber) {
                trackingInfo.classList.remove('hidden');
                trackingNumber.textContent = order.shipping?.trackingNumber;
            } else {
                trackingInfo.classList.add('hidden');
            }

            // Populate order items
            const orderItems = document.getElementById('orderItems');
            orderItems.innerHTML = '';
            order.orderItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800';
                itemElement.innerHTML = `
                    <img src="${item.product.imageId}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white">${item.product.name}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Quantity: ${item.quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-gray-900 dark:text-white">${formatCurrency(item.price)}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">each</p>
                    </div>
                `;
                orderItems.appendChild(itemElement);
            });

            // Populate shipping address
            const shippingAddress = document.getElementById('shippingAddress');
            shippingAddress.innerHTML = `
                <p class="font-medium text-gray-900 dark:text-white">${order.shipping.name}</p>
                <p class="text-gray-600 dark:text-gray-400">${order.shipping.address}</p>
                <p class="text-gray-600 dark:text-gray-400">${order.shipping.city}, ${order.shipping.state} ${order.shipping.postalCode}</p>
            `;

            // Populate payment method
            const paymentMethodElem = document.getElementById('paymentMethod');
            if (order.paymentMethod.toLowerCase() === 'cod') {
                paymentMethodElem.textContent = 'COD';
                paymentMethodElem.className = 'inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white w-auto';
            } else if (order.paymentMethod.toLowerCase() === 'prepaid') {
                paymentMethodElem.textContent = 'Prepaid';
                paymentMethodElem.className = 'inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white w-auto';
            } else {
                paymentMethodElem.textContent = order.paymentMethod;
                paymentMethodElem.className = 'inline-block px-3 py-1 rounded-full text-sm font-medium w-auto';
            }        
            // Populate order summary
            document.getElementById('detailSubtotal').textContent = formatCurrency(order.subTotal);
            document.getElementById('detailShipping').textContent = formatCurrency(order.shipping.shippingCost);
            document.getElementById('detailTax').textContent = formatCurrency(order.shipping.tax);
            document.getElementById('detailTotal').textContent = formatCurrency(order.totalAmount);
        }

        // Filter orders
        function filterOrders() {
            const statusValue = statusFilter.value;
            const searchValue = searchInput.value.toLowerCase();

            filteredOrders = orders.filter(order => {
                const matchesStatus = statusValue === 'all' || order.shipping.shippingStatus === statusValue;
                const matchesSearch = order.orderId.toLowerCase().includes(searchValue) ||
                                    order.orderItems.some(item => item.product.name.toLowerCase().includes(searchValue));
                return matchesStatus && matchesSearch;
            });

            renderOrders();
        }

        // Event listeners
        backButton.addEventListener('click', () => {
            orderDetailView.classList.add('hidden');
            ordersListView.classList.remove('hidden');
        });

        statusFilter.addEventListener('change', filterOrders);
        searchInput.addEventListener('input', filterOrders);

        //Fetch all order and Start application
        document.addEventListener("DOMContentLoaded", () => {
            fetch("/user/getAllOrder")
                .then(response => response.json())
                .then(products => {
                    orders = [...products];
                    filteredOrders = [...orders];
                    
                    console.log(orders);
                    // Initial render
                    renderOrders();
                })
                .catch(error => console.error("Error fetching product:", error));
        });