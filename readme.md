# 7EMPEST - Social Media App.

> 7empest-social is a social media platform. Users can follow others, create new posts, and search/ sort/ filter posts. They can filter posts by tags, category, and privacy (including public posts and posts by people he is following).

> All communication in the platform is in real-time. The authorization and authentication process is validated by the Refresh token and Access token which is implemented by following OAuth 2.0 guidelines. I’ve implemented the token whitelisting variant. This site also uses caching and cache invalidation for information related to followers, followings, posts, and user info.

## Features

- Token (access and refresh) based authentication and authorization implementation maintaining the OAuth 2.0 guidelines.
- Real-time communication for followers, followings, user’s posts, and also posts under specific categories, tags, and filters.
- Infinity scroll feature for user search results, followers, followings, and posts.
- Users can search for other users, follow them, and see their posts and other public information.
- Users can post content under specific categories, add relevant tags to the post, set privacy for the post, and add title, description, and images to the post.
- A user can view his profile information.

## Notable Technologies

### Front End

- Material-UI
- React
- Socket
- Redux Toolkit
- RTK Query
- Async Mutex
- React Image Gallery
- Formik
- Yup
- React Infinity Scroll Component

### Back End

- Express
- MongoDB
- Multer
- Helmet
- Morgan
- Express Async Handler
- Nodemailer
- JSON Web Token
- Cookie Parser
- Docker
