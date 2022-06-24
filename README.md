<div align="center">
  <img alt="logo" src="public/git/pic/logo.png">
</div>

# Imageboard

Imageboard made during the Full-Stack Web Developer Bootcamp at [Spiced Academy](https://www.spiced-academy.com/en/program/full-stack-web-development/berlin) in Berlin. <br /><br />
An image oriented platform dedicated to the Italian metaphysical photographer Mimmo Jodice.

## Technologies

This project was created with:

-   Front-End: HTML, CSS, JS ([Vue.js](https://vuejs.org))
-   Back-End: [Node.js](https://nodejs.org/en/about/) / [Express](http://expressjs.com) (Csurf, Cookie Session, Bcrypt)
-   Data & Cloud: [PostgreSQL](https://www.postgresql.org), [Multer](https://github.com/expressjs/multer), [AWS S3](https://aws.amazon.com/s3/)

## Setup

First of all clone the repo on your own machine

```bash
git clone https://github.com/lmguerrini/imageboard-mimmo-jodice.git
```

Install all the dependencies required

```bash
npm install
```

Start the server

```bash
node . || npm start
```

Now you should be ready to dive into the Imageboard at http://localhost:8080

## Main features

-   Images uploading on the Cloud (AWS S3) and their deletion
-   Comments on images and their deletion
-   Mobile responsiveness
    <br />

## Preview

### Home

![](public/git/home.gif) &emsp;
![](public/git/pic/home.png)

### Upload picture

![](public/git/upload-picture.gif)

### View mode

![](public/git/view-mode.gif) &emsp;
![](public/git/pic/view-mode.png)

### Write/delete comment

![](public/git/write-delete-comment.gif) &emsp;
![](public/git/pic/comment-mode.png)

### Delete picture & related comments

![](public/git/delete-pic-comments.gif)

### Mobile home optimization

![](public/git/mobile/mobile-responsiveness.gif) &emsp;
![](public/git/mobile/mobile-home.png)

### Mobile view mode optimization

![](public/git/mobile/mobile-viewmode.gif)

### Mobile comments optimization

![](public/git/mobile/mobile-comments.gif)

---

[**Back to Imageboard**](#imageboard)
