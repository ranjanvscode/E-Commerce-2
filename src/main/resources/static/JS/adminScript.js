         // Global variables
        let products = [];
        let editingProductId = null;

        // Dark mode functionality
        function initializeDarkMode() {
            const darkMode = localStorage.getItem('darkMode') === 'true';
            if (darkMode) {
                document.documentElement.classList.add('dark');
            }
        }

        function toggleDarkMode() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', isDark);
        }

        // Event listeners setup
        function setupEventListeners() {
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            document.getElementById('addProductBtn').addEventListener('click', openAddModal);
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('cancelBtn').addEventListener('click', closeModal);
            document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
            document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
            document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
            
            // Close modal when clicking outside
            document.getElementById('productModal').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
            
            document.getElementById('deleteModal').addEventListener('click', function(e) {
                if (e.target === this) closeDeleteModal();
            });
        }

        // Save products to localStorage
        function saveProducts() {
            localStorage.setItem('products', JSON.stringify(products));
        }

        // Render products
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            const emptyState = document.getElementById('emptyState');
            
            if (products.length === 0) {
                grid.classList.add('hidden');
                emptyState.classList.remove('hidden');
                return;
            }
            
            grid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            
            grid.innerHTML = products.map(product => `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
                    <img src="${product.imageId}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">${product.name}</h3>
                            <span class="text-lg font-bold text-green-600 dark:text-green-400">$${product.price}</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">${product.category}</span>
                            <div class="ml-auto flex items-center">
                                <span class="text-yellow-400">★</span>
                                <span class="text-sm text-gray-600 dark:text-gray-400 ml-1">${product.rating}</span>
                            </div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">${product.description}</p>
                        <div class="flex space-x-2">
                            <button onclick="editProduct('${product.id}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                Update
                            </button>
                            <button onclick="deleteProduct('${product.id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Modal functions
        function openAddModal() {
            editingProductId = null;
            document.getElementById('modalTitle').textContent = 'Add Product';
            document.getElementById('productForm').reset();
            document.getElementById('productModal').classList.remove('hidden');
        }

        function editProduct(id) {
            const product = products.find(p => String(p.id) === String(id));
            if (!product) return;
            
            editingProductId = id;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            document.getElementById('name').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('category').value = product.category;
            document.getElementById('description').value = product.description;
            document.getElementById('rating').value = product.rating;
            // document.getElementById('image').value = product.image;
            // document.getElementById('imagePreview').src = product.imageId;
            document.getElementById('productModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('productModal').classList.add('hidden');
            editingProductId = null;
        }

        // Form submission
        function handleFormSubmit(e) {
                e.preventDefault();

                const form = document.getElementById('productForm');
                const formData = new FormData();

                // Append form fields
                formData.append('name', document.getElementById('name').value);
                formData.append('price', document.getElementById('price').value);
                formData.append('category', document.getElementById('category').value);
                formData.append('description', document.getElementById('description').value);
                formData.append('rating', document.getElementById('rating').value);

                // Append file
                const imageFile = document.getElementById('image').files[0];
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                if (editingProductId) {
                    // Update existing product
                    // const index = products.findIndex(p => String(p.id) === String(editingProductId));
                    // products[index] = { ...products[index], ...formData };

                    fetch(`/products/updateProduct/${editingProductId}`, {
                        method: 'POST',
                        body: formData 
                    })
                    .then(response => {
                        if (response.ok) {
                            editingProductId=null;
                            showToast('Product updated successfully!', 'success');
                            form.reset();
                            closeModal();
                        } else {
                            showToast('Failed to update product!', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showToast('Something went wrong!', 'error');
                    });
                    
                } else {
                    fetch('/products/save', {
                        method: 'POST',
                        body: formData 
                    })
                    .then(response => {
                        if (response.ok) {
                            showToast('Product added successfully!', 'success');
                            form.reset();
                            closeModal();
                        } else {
                            showToast('Failed to add product!', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showToast('Something went wrong!', 'error');
                    });
                }
        }

        // Delete functions
        let productToDelete = null;

        function deleteProduct(id) {
            productToDelete = id;
            document.getElementById('deleteModal').classList.remove('hidden');
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').classList.add('hidden');
            productToDelete = null;
        }

        function confirmDelete() {
            console.log("Delete function",productToDelete);

            if (productToDelete) {
                fetch(`/products/delete/${productToDelete}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        // Remove from frontend list
                        products = products.filter(p => String(p.id) !== String(productToDelete));
                        saveProducts();
                        renderProducts();
                        showToast('Product deleted successfully!', 'success');
                    } else {
                        showToast('Failed to delete product!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('Something went wrong!', 'error');
                })
                .finally(() => {
                    closeDeleteModal();
                });
            } else {
                closeDeleteModal();
            }
        }


        // Toast notifications
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
            
            toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-up max-w-sm`;
            toast.innerHTML = `
                <div class="flex items-center justify-between">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            document.getElementById('toastContainer').appendChild(toast);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 3000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', ()=> {
            initializeDarkMode();
            fetch("/products/getAllProduct")
                .then(response => response.json())
                .then(productList => {
                products = [...productList];
                renderProducts();
            }).catch(error => console.error("Error fetching products:", error));
            setupEventListeners();
        });