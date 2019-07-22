
$(document).ready(() => {

    // Save Article click function
    $(".save-btn").on("click", function(event) {

        let id = $(this).data("id");

        // Send PUT request
        $.ajax({
            method: "PUT",
            url: "/saved/" + id,
            data: { saved: true }
        }).then(() => {
            location.reload();
        }).catch(err => {
            console.log(err);
        });
    });

    // Unsave Article click function
    $(".unsave-btn").on("click", function(event) {

        let id = $(this).data("id");

        // Send PUT request
        $.ajax({
            method: "PUT",
            url: "/unsaved/" + id,
            data: { saved: false }
        }).then(() => {
            location.reload();
        }).catch(err => {
            console.log(err);
        });
    });

    // Delete Comment click function
    $(".delete-comment-btn").on("click", function(event) {

        let id = $(this).data("id");

        // Send PUT request
        $.ajax({
            method: "DELETE",
            url: "/delete/" + id,
            data: { _id: id }
        }).then(() => {
            location.reload();
        }).catch(err => {
            console.log(err);
        });
    });
    
});
