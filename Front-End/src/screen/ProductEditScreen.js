/* eslint-disable object-curly-newline */
import { getProduct, updateProduct, uploadProductImage } from "../api";
import { hideLoading, parseRequestUrl, showLoading, showMessage } from "../utils";

const ProductEditScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById('edit-product-form').addEventListener('submit', async (event) => {
            event.preventDefault(); /* when user clicks submit button this will prevent the form for submitting back to the server more than once */
            showLoading();
            const data = await updateProduct({
                _id: request.id,
                name: document.getElementById('name').value,
                price: document.getElementById('price').value,
                image: document.getElementById('image').value,
                brand: document.getElementById('brand').value,
                countInStock: document.getElementById('countInStock').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
            });
            hideLoading();
            if (data.error) {
                showMessage(data.error);
            } else {
                document.location.hash = '/productlist';
            }
        });
        document.getElementById('image-file').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const formData = new FormData(); // helps us create the body that is passed into the AJAX request
            formData.append('image', file);
            showLoading();
            const data = await uploadProductImage(formData);
            hideLoading();
            if (data.error) {
                showMessage(data.error);
            } else {
                showMessage('Image Uploaded Successfully');
                document.getElementById('image').value = data.image;
            }
        });
    },
    render: async () => {
        const request = parseRequestUrl();
        const product = await getProduct(request.id);
        return `
            <div class='content'>
                <div>
                    <a href='/#/productlist'>Back to Product List</a>
                </div>
                <div class='form-container'>
                    <form id='edit-product-form'>
                        <ul class='form-items'>
                            <li>
                                <h1>Edit Product ${product._id.substring(0, 8)}</h1>
                            </li>
                            <li>
                                <label for='name'>Name</label>
                                <input type='text' id='name' name='name' value='${product.name}' />
                            </li>
                            <li>
                                <label for='price'>Price</label>
                                <input type='number' step="0.01" min=0 id='price' name='price' value='${product.price}' />
                            </li>
                            <li>
                                <label for='image'>Image (680 x 830)</label>
                                <input type='text' id='image' name='image' value='${product.image}' />
                                <input type='file' name='image-file' id='image-file'/>
                            </li>
                            <li>
                                <label for='brand'>Brand</label>
                                <input type='text' id='brand' name='brand' value='${product.brand}' />
                            </li>
                            <li>
                                <label for='countInStock'>Count in Stock</label>
                                <input type='number' id='countInStock' name='countInStock' value='${product.countInStock}' />
                            </li>
                            <li>
                                <label for='category'>Category</label>
                                <input type='text' id='category' name='category' value='${product.category}' />
                            </li>
                            <li>
                                <label for='description'>Description</label>
                                <input type='text' id='description' name='description' value='${product.description}' />
                            </li>
                            <li>
                                <button type='submit' class='primary'>Update</button>
                            </li>
                        </ul>
                    </form>
                </div> 
            </div>`;
    },
};

export default ProductEditScreen;
