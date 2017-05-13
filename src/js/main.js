/**
 * Created by sid on 28/12/16.
 */
var domain = "http://130.211.246.58:8081/";
var add_info_domain = domain + 'v1/add/info/';
var add_audio_domain = domain + 'v1/add/audio/';
var step_1_payload;

jQuery(function($) {
    $('[data-rel=tooltip]').tooltip();

    $('.select2').css('width','200px').select2({allowClear:true})
        .on('change', function(){
            $(this).closest('form').validate().element($(this));
        });
    $('#fuelux-wizard-container')
        .ace_wizard({
            //step: 2 //optional argument. wizard will jump to step "2" at first
            //buttons: '.wizard-actions:eq(0)'
        })
        .on('actionclicked.fu.wizard' , function(e, info){
            console.log(info.step);
            if(info.step == 1) {
                var jsonobj = {
                    "company": $('#company').val(),
                    "discount": $('#discount').val(),
                    "coupontype": $('#coupontype').val(),
                    "category": $('#category').val(),
                    "name": $('#name').val()
                };
                $.ajax({
                    url: add_info_domain,
                    type: 'POST',
                    data:JSON.stringify(jsonobj),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Content-Type", "application/json");
                    },
                    success: function(data) {
                        console.log(data);
                        step_1_payload = data['payload'];
                        var image = data['payload']['qrlink'];
                        $('#qrcode').attr('src',image);
                        $('#couponcode').html(jsonobj['name'])
                    },

                    error: function() {

                    },
                    async:false
                });

            }
            if (info.step == 1 || info.step == 3) {
                $('#uploading').css('display','none');
                $('#uploadfile').css('display','block');
                $('#Finished').css('display','none');
            }
        })
        .on('finished.fu.wizard', function(e) {
            console.log("Finished");
        }).on('stepclick.fu.wizard', function(e){
        //e.preventDefault();//this will prevent clicking and selecting steps
    });


    $('#modal-wizard-container').ace_wizard();
    $('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

});

function submitForm() {
    console.log("submit event");
    var fd = new FormData(document.getElementById("fileinfo"));
    $('#uploading').css('display','block');
    $('#uploadfile').css('display','none');
    $('#Finished').css('display','none');
    fd.append("id",step_1_payload['id']);
    console.log(fd);
    $.ajax({
        url: add_audio_domain,
        type: "POST",
        data: fd,
        processData: false,  // tell jQuery not to process the data
        contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
        $('#uploading').css('display','none');
        $('#uploadfile').css('display','none');
        $('#Finished').css('display','block');
        $('#downloadbox').attr('href',"http://130.211.246.58/data_sound/" + data['payload']['final_data_link']);
    });
    return false;
}
