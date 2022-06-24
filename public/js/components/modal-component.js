/* ----------------- Vue(modal-component) ------------ */
Vue.component("modal-component", {
    template: "#modal-template", // =>  <script id="modal-template">
    props: ["imageId"],
    data: function () {
        return {
            modalImage: {
                url: "",
                title: "",
                description: "",
                username: "",
                created_at: "",
                showComments: ""
            },
            addCommentError: false
        };
    },
    mounted: getSelectedImage,
    watch: {
        imageId: getSelectedImage
    },
    methods: {
        closeModal: function () {
            this.$emit("close"); // => @close
        },
        closeError: function () {
            this.addCommentError = !this.addCommentError;
        },
        nextModal: function () {
            var self = this;
            if (self.showComments) {
                self.$root.$emit("showCommentsFalseIfTrue", false);
            }
            axios
                .get("/images")
                .then(function ({ data }) {
                    if (data.length != 0) {
                        data.find(function (el, i) {
                            if (i != 0) {
                                if (el.id == self.imageId) {
                                    location.hash = data[i - 1].id;
                                }
                            } else {
                                location.hash = data[data.length - 1].id;
                            }
                        });
                    } else {
                        history.pushState({}, "", "/");
                        self.$emit("close"); // => @close
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in catch Vue modal-component({mounted:axios/get/images}): ",
                        error
                    );
                });
        },
        prevModal: function () {
            var self = this;
            if (self.showComments) {
                self.$root.$emit("showCommentsFalseIfTrue", false);
            }
            axios
                .get("/images")
                .then(function ({ data }) {
                    if (data.length != 0) {
                        data.find(function (el, i) {
                            if (self.imageId == data[0].id) {
                                location.hash = data[1].id;
                            }
                            if (i != 0) {
                                if (el.id == self.imageId) {
                                    location.hash = data[i + 1].id;
                                }
                            } else {
                                location.hash = data[0].id;
                            }
                        });
                    } else {
                        history.pushState({}, "", "/");
                        self.$emit("close"); // => @close
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in catch Vue modal-component({mounted:axios/get/images}): ",
                        error
                    );
                });
        }
    }
});

function getSelectedImage() {
    var self = this;
    self.$root.$on("showComments", (showCommentsFromCC) => {
        self.showComments = showCommentsFromCC;
    });
    self.$root.$on("addCommentError", () => {
        self.addCommentError = !self.addCommentError;
    });
    self.$root.$on("deleteImage", () => {
        self.closeModal();
        window.location.reload();
    });
    axios
        .get("/selected-image/" + self.imageId)
        .then(function ({ data }) {
            if (data != 0) {
                self.modalImage = { ...data[0] };
            } else {
                history.pushState({}, "", "/");
                self.$emit("close"); // => @close
            }
        })
        .catch(function (error) {
            console.log(
                "error in catch Vue modal-component({mounted:axios/get/selected-image/ + imageId}): ",
                error
            );
            self.$emit("close"); // => @close
        });
}
