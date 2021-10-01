import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';

import Jumbotron from '../../src/components/Jumbotron';
import { ADD_ORDER } from '../../src/utils/mutations';
import { idbPromise } from '../../src/utils/helpers';

const Success = () => {
    const [addOrder] = useMutation(ADD_ORDER);

    useEffect(() => {
        async function saveOrder() {
            // retrieve cart data
            const cart = await idbPromise('cart', 'get');
            // create an array of product ids
            const products = cart.map(item => item._id);
        
            if (products.length) {
                const { data } = await addOrder({ 
                    variables: { products } 
                });
                const productData = data.addOrder.products;

                // remove items from IndexedDB after checkout
                productData.forEach((item) => {
                    idbPromise('cart', 'delete', item);
                });
            }
        };

        setTimeout(() => {
            window.location.assign('/');
        }, 3000);

        saveOrder();
    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
                <h1> Success! </h1>
                <h2>
                    Thank you for your purchase!
                </h2>
                <h2>
                    You will now be redirected to the homepage
                </h2>
            </Jumbotron>      
        </div>
    );
};

export default Success;
