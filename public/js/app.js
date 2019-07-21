
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
});
