/* ----------------- Vue(main-element) ----------------- */
(function () {
    // Vue instance
    new Vue({
        el: "#main", // => <div id="main">
        data: {
            title: "",
            description: "",
            username: "",
            image: null,
            imageId: location.hash.slice(1), // before #hash => null
            hiddenImages: true,
            showMorePic: true,
            images: []
        },
        mounted: function () {
            var self = this;
            self.$root.$on("deleteImage", (imageId) => {
                for (var i in self.images) {
                    if (self.images[i].id == imageId) {
                        self.images.splice(i, 1);
                    }
                }
            });
            axios
                .get("/images")
                .then(function ({ data }) {
                    if (window.innerWidth < 1580) {
                        // 2 images/row layout
                        self.images = data.reverse().slice(0, 2);
                    } else {
                        // 3 images/row layout
                        self.images = data.reverse().slice(0, 3);
                    }
                })
                .catch(function (error) {
                    console.log("error in catch newVue({mounted:axios/get}): ", error);
                });
            addEventListener("hashchange", function () {
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleFileChange: function (e) {
                // Set the data's "image" property to the newly uploaded file
                this.image = e.target.files[0];
            },
            handleupload: function (e) {
                // Prevent the default behavior (i.e navigating to a new page on submitting the form)
                e.preventDefault();

                // Create a FormData instance and append the relevant fields
                var formData = new FormData();
                formData.append("title", this.title); // entered
                formData.append("image", this.image); // file itself
                formData.append("username", this.username); // entered
                formData.append("description", this.description); // entered
                // Post the form data to the "/upload" route with axios
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function ({ data }) {
                        self.images.unshift(data);
                    })
                    .catch(function (error) {
                        console.log("error in catch newVue({methods})/handleupload/axios: ", error);
                    });
            },
            closeMe: function () {
                history.pushState({}, "", "/");
                this.imageId = null; // => close the modal
            },
            showMore: function () {
                var self = this;
                var lastImageId = this.images[this.images.length - 1].id;
                axios
                    .get("/show-more/" + lastImageId)
                    .then(function ({ data }) {
                        if (data.length < 3) {
                            self.showMorePic = false;
                        }
                        if (window.innerWidth < 1580) {
                            // 2 images/row layout
                            data.slice(0, 2).forEach((element) => {
                                if (!element.lowestId === !element.id) {
                                    self.images.push(element);
                                } else {
                                    self.hiddenImages = false;
                                }
                            });
                        } else {
                            // 3 images/row layout
                            data.slice(0, 3).forEach((element) => {
                                if (!element.lowestId === !element.id) {
                                    self.images.push(element);
                                } else {
                                    self.hiddenImages = false;
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log("error in catch newVue({methods})/showMore/axios: ", error);
                    });
            },
            backToTop: function () {
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }, 250);
            }
        }
    });
})();
