const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at`);
};

module.exports.storeUploadedImageDB = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
    VALUES ($1 , $2, $3, $4) RETURNING id`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getSelectedImageDetails = (imageId) => {
    const q = `SELECT * FROM images WHERE id = ($1)`;
    return db.query(q, [imageId]);
};

module.exports.getMoreImages = (lastImageId) => {
    const q = `SELECT url, title, id, (
     SELECT id FROM images
     ORDER BY id ASC
     LIMIT 1
     ) AS "lowestId" FROM images
     WHERE id < $1
     ORDER BY id DESC`;
    return db.query(q, [lastImageId]);
};

module.exports.getComments = (imageId) => {
    const q = `SELECT * FROM comments WHERE image_id = ($1) ORDER BY id DESC`;
    return db.query(q, [imageId]);
};

module.exports.insertNewComment = (comment, username, imageId) => {
    const q = `INSERT INTO comments (comment, username, image_id) VALUES ($1 , $2, $3) RETURNING id, created_at`;
    const params = [comment, username, imageId];
    return db.query(q, params);
};

module.exports.deleteComment = (commentId) => {
    const q = `DELETE FROM comments WHERE id = ($1)`;
    return db.query(q, [commentId]);
};

module.exports.deleteImage = (imageId) => {
    const q = `DELETE FROM images WHERE id = ($1) RETURNING url`;
    return db.query(q, [imageId]);
};
