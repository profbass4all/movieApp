# Movie Reservation System

## Overview

This is a movie reservation system where users can create an account, login and reserve a seat for a movie. Users can check the list for all showtimes and cancel reservations where necessary. Admins can post movies and create showtimes.
This is a very basic movie reservation application.

## Functionalities

1. Users can create account
2. Users can Login
3. Users can edit profile
4. Users can reserve a seat for a movie
5. Users can get a list of all the movies available
6. Users can check the list of available seats that are not yet reserved
7. Users can get the list of all their reservations
8. Users can cancel a reservation
9. Users can get the list of all upcoming showtimes (excluding those that have pass)
10. Users can get the details of movies and their showtimes
11. Admin can post a movie
12. Admin can edit a movie post
13. Admin can create a showtime
14. Admin can get all reservations
15. Admin can update showtime
16. Admin can delete a movie
17. Admin can get the revenue report for each showtime

## Technologies
1. JWT for user authentication
2. redis for caching
3. Postgres
4. Sequelize
5. Node-cron
6. Nodejs
7. Expressjs

## Endpoints

This project provides the following api endpoints to carryout all the functionalities listed above

- **User's Routes**

![carbon](https://github.com/user-attachments/assets/8b0388ec-e391-4aa7-99da-07e9445f1ff4)

- **Movie's Routes**

![carbon (1)](https://github.com/user-attachments/assets/32724bf9-560e-430a-a92a-7a56d63d4f50)

- **Showtimes Routes**

![showtime](https://github.com/user-attachments/assets/3d171c6d-1376-41ab-9799-75af61a7f81e)

- **Reservations Routes**
  
![reservations](https://github.com/user-attachments/assets/3dda7ad8-2823-4208-a212-007cc0b89358)

## Getting Started

- **Clone the Repository**:
  
  ```
  git clone < repository- url >
  ```

- **Install the Dependencies**:

  ```
  npm install
  ```

- **Run the Application**

  ```
  npm run dev
  ```

- **Access the Api**: Use tools like Postman or Thunderclient to interact with the endpoints

## Conclusion

This Movie Reservation System provides a comprehensive solution for managing movie reservations, catering to both users and admins. With its robust authentication and management features, it aims to enhance the movie-going experience.
