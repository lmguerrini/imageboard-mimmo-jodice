/* ----------------- Vue(comment-component) ----------------- */
Vue.component("comment-component", {
    template: "#comment-template", // => <script id="comment-template">
    props: ["imageId"],
    data: function () {
        return {
            comment: "",
            username: "",
            comments: [],
            showComments: false
        };
    },
    mounted: getImageComments,
    watch: {
        imageId: getImageComments
    },
    methods: {
        addComment: function (e) {
            e.preventDefault();
            var self = this;
            var addComment = {
                comment: self.comment,
                username: self.username,
                imageId: self.imageId
            };
            axios
                .post("/add-comment", addComment)
                .then(function ({ data }) {
                    if (data.success === false) {
                        self.$root.$emit("addCommentError", data.success);
                    } else {
                        self.comments.unshift(data);
                        self.comment = "";
                        self.username = "";
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in catch Vue comment-component({methods-addComment:axios/post}): ",
                        error
                    );
                });
        },
        deleteComment: function (commentId) {
            var self = this;
            axios
                .post("/delete-comment/" + commentId)
                .then(function () {
                    for (var i in self.comments) {
                        if (self.comments[i].id == commentId) {
                            self.comments.splice(i, 1);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in catch Vue comment-component({methods-deleteComment:axios/post}): ",
                        error
                    );
                });
        },
        deleteImage: async function (imageId) {
            let windowConfirm;
            let { data } = await axios.get("/comments/" + imageId);
            if (data.length > 0) {
                windowConfirm = window.confirm(
                    "Do you really wanna delete this image and its related comments? \nWarning: there is no going back! Please be certain."
                );
            } else {
                windowConfirm = window.confirm(
                    "Do you really wanna delete this image? \nWarning: there is no going back! \nPlease be certain."
                );
            }
            if (windowConfirm) {
                var self = this;
                try {
                    await axios.get("/delete-image/" + imageId);
                    self.$root.$emit("deleteImage", imageId);
                } catch (error) {
                    console.log(
                        "error in catch Vue cooment-component({axios/get/delete-image/imageId}): ",
                        error
                    );
                    self.$emit("close"); // => @close
                }
            }
        },
        sendDataToSibling: function () {
            this.showComments = !this.showComments;
            this.$root.$emit("showComments", this.showComments);
        }
    }
});

function getImageComments() {
    var self = this;
    self.$root.$on("showCommentsFalseIfTrue", (showCommentsFromModalComponent) => {
        self.showComments = showCommentsFromModalComponent; // false when @click nextModal()
    });
    axios
        .get("/comments/" + this.imageId)
        .then(function ({ data }) {
            self.comments = data;
        })
        .catch(function (error) {
            console.log(
                "error in catch Vue comment-component({mounted:axios/get/comments/ + this.imageId}): ",
                error
            );
        });
}
