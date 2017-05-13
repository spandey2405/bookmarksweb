/**
 * Created by sid on 30/4/17.
 */



// data = {
//     "post_title": "TITLE_OF_BOOKMARK",
//     "post_image": "IMAGE_URL",
//     "post_by": "ID_OF_PERSON",
//     "post_description": "DESCIPTION",
//     "privacy": "0 for public and 1 for private"
// }


function add_data(data){
    console.log(data);
    $.ajax({
        url: 'http://localhost:9200/bookmarks/post/',
        data: data,
        type: 'POST',
        success: function(resp) {
            console.log(resp);
        },
        async:false
    });
}