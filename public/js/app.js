
$(document).ready(() => {

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

    $(".comment-btn").on("click", function(event) {
        
        let id = $(this).data("id");
        let newComment = $("#comment").val().trim();

        $.ajax({
            method: "POST",
            url: "/api/comment/" + id,
            data: {
                _id: id,
                commentText: newComment
            }
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    });
});
