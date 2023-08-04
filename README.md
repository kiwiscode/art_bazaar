# E-Commerce Web Project (MERN Stack)

This is an e-commerce web project developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js). The project serves as a platform for users and artists to buy and sell art products.

## Features

### User Registration and Login:

- Users can sign up with their email address and other
- details and verify their accounts through email confirmation.
- Registered users can log in to the system.

### Art Products:

- Users can view art products, add them to their cart, and remove items from the cart.
- Users can filter products by categories and perform search queries.

### Artists:

- Artists can log in with their dedicated accounts and share their own art products.
- Artists can edit their profile pages and showcase their portfolios.

### Payment and Orders:

Users can complete payment transactions by reviewing their carts.
Completed orders are recorded in the user accounts.

## Installation

1. Clone the repository to your computer:
   git clone https://github.com/kiwiscode/E-Commerce-Web-Project-MERN-Stack
2. Navigate to the client and server folders and install the dependencies for each:

3. cd client
   <br>
   npm install

4. cd server
   <br>
   npm install

5. Set up the database connection:

6. Create a MongoDB account and add the database URL to the .env file. 4. Start the application:
7. cd client
   <br>
   npm run dev

8. cd server
   <br>
   node server.js

## Technologies Used

### Frontend:

- React.js
- CSS

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- Stripe API (for payment processing)
- Nodemailer (for email verification)

Other Tools:

- Axios (for data exchange)
- CSS (for theme and layout)
- JWT (for user authentication)

### Test Card Numbers

To test the Stripe API, you can use the following card numbers:

### Test Card 1:

Card Number: 4242 4242 4242 4242
Expiration Date: Any future date
CVC: Any three-digit number

### Test Card 2:

Card Number: 5555 5555 5555 4444
Expiration Date: Any future date
CVC: Any three-digit number

For more test card numbers and other test data, please refer to the [Stripe Test Card Documentation](https://stripe.com/docs/testing).
