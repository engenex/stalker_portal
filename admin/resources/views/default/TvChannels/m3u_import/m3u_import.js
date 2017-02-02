
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        var conf = {
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            ignore: ['.ignore'],
            modules: 'jsconf',
            onSuccess: function () {
                var sendData = { item_id: this.itemId };
                $(this.form).find('.own_field:not(.select2-container)').each(function(){
                    if (this.type && this.type.toLowerCase() == 'checkbox'){
                        sendData[$(this).attr('name')] = $(this).prop('checked') ? 'on': 'off';
                    } else {
                        sendData[$(this).attr('name')] = $(this).val();
                    }
                });
                ajaxPostSend("{{ app.controller_alias }}/save-m3u-item", sendData, false, false, true);
                return false;
            },
            onError: function () {
                return false;
            }
        };

        function initFileUploader(){
            $('#fileupload').fileupload({
                url: '{{ app.controller_alias }}/get-m3u-data',
                type: 'POST',
                autoUpload: true,
                multipart: true,
                acceptFileTypes: /(\.|\/)(m3u)$/i,
                maxFileSize: 1000000,
                maxNumberOfFiles: 1
            }).bind('fileuploaddone', function (e, data) {
                var response;
                if (data && data.jqXHR && data.jqXHR.status && data.jqXHR.status == 200 && data.jqXHR.responseJSON) {
                    response = data.jqXHR.responseJSON;
                } else {
                    JSErrorModalBox();
                    return false;
                }
                if (response.success) {
                    ajaxSuccess(response, false);
                }
                return false;
            }).bind('fileuploadfail', function (e, data) {
                if (data && data.jqXHR && data.jqXHR.status && data.jqXHR.status == 200 && data.jqXHR.responseJSON) {
                    JSErrorModalBox(JSON.parse(data.jqXHR.responseJSON));
                } else {
                    JSErrorModalBox();
                }
            });
            return true;
        }

        function yelp() {
            $(document).ready(function () {

                $.validate(conf);
                $("#content, #main").css("background-color", "#f2f2f2");

                if (typeof (loadFileUploadScripts) != 'function' || !loadFileUploadScripts(initFileUploader)){
                    JSErrorModalBox({msg: "{{ 'Cannot load File Upload plugin'|trans }}"})
                }

                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    ajaxPostSend($(this).attr('href'), $(this).data(), false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', '#clean_channels', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    cleanM3UData();
                    return false;
                });

                $(document).on('click', '[id^="channel_item_"] button[data-action="delete"]', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    removeM3UItem($(this).closest("div[id^='channel_item_']"));
                    return false;
                });

                $(document).on("click", "[id^='channel_item_'] button[type='submit']", function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    saveChannelItem(this);
                    return false;
                });

                $(document).on("click", "#save_channels", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("[id^='channel_item_'] button[type='submit']").trigger('click');
                    return false;
                });

            });
        }

        var loadM3UData = function(obj){
            if (obj.data && obj.data.channels) {//warning_message
                var auto_fill = obj.data.channels.length;
                if ( (obj.data.last_channel_number + obj.data.channels.length) >= 9999 ){
                    var text_message = "{{ 'The maximum number of registered channel'|trans }} - " + obj.data.last_channel_number + ". ";
                    if (obj.data.free_number_exists) {
                        var free_number = 9999 - obj.data.last_channel_number;
                        if ( free_number < auto_fill && free_number > 0) {
                            auto_fill = free_number;
                        } else if(free_number <= 0) {
                            auto_fill = 0
                        }

                        text_message += "{{ 'But in the channel list exist skipped numbers'|trans }}. ";
                        text_message += auto_fill + " {{ 'channel numbers filled in automatically'|trans }}. ";
                        text_message += "{{ 'Rest of numbers must be filled manually'|trans }}.";
                    } else {
                        text_message += "{{ 'No available numbers of channels'|trans }}. ";
                        text_message += "{{ 'To add more channels, you can delete the unwanted channels in the channel list'|trans }}. ";
                    }

                    $("#warning_message").text(text_message);
                    $("#warning_message").closest('.row').slideDown("300");
                }
                for( var i in obj.data.channels){
                    var item = $( $('#channel-template').html() );
                    item.attr('id', 'channel_item_' + i);
                    item.find('form').attr('id', 'channel_form_' + i);
                    item.find('select').attr('id', 'channel_s2_' + i);
                    i = parseInt(i, 10);
                    if (obj.data.free_number_exists && i < auto_fill) {
                        var num =  parseInt(obj.data.last_channel_number, 10) + i + 1;
                        item.find("input[name='number']").val(num);
                    }

                    item.find("input[name='name']").val(obj.data.channels[i].name);
                    item.find("input[name='cmd']").val(obj.data.channels[i].cmd);

                    $('#channels_container').append(item);
                }
                $('[id^="channel_s2_"]').select2(select2Opt);
                var n = $('#channels_container').children().length;
                var i = 0;
                while ( n-- ){
                    setTimeout(function(){
                        var cItem = $('#channels_container').children().filter(':not(:visible)').get(0);
                        $(cItem).slideDown(100);
                    }, ((i++) * 250));
                }
            }
        };

        var loadM3UDataError = function(obj){
            JSErrorModalBox(obj);
        };

        var cleanM3UData = function(){
            $('#channels_container').children().each(function(i){
                $(this).remove();
            });
            if ($('#channels_container').children().length == 0) {
                $("#warning_message").closest('.row').slideUp("100", function(){ $("#warning_message").text('');} );
            }
        };

        var removeM3UItem = function(obj){
            $(obj).slideUp(100, function(){
                $(this).remove();
                if ($('#channels_container').children().length == 0) {
                    $("#warning_message").closest('.row').slideUp("100", function(){ $("#warning_message").text('');} );
                }
            });
        };

        var saveChannelItem = function(obj){
            conf.form = '#' + $(obj).closest('form').attr('id');
            conf.itemId = $(obj).closest('[id^="channel_item_"]').attr('id');
            if ($(conf.form).isValid({}, conf, true)) {
                conf.onSuccess();
            } else {
                conf.onError();
            }
            return false;
        };

        var saveM3UItem = function(obj){
            JSSuccessModalBox(obj);
            removeM3UItem("#"+obj.item_id);
        };

        var saveM3UItemError = function(obj){
            JSErrorModalBox(obj);
            if (!$("#" + obj.item_id).children('div.box-content').hasClass('m3u_item_error')) {
                $("#" + obj.item_id).children('div.box-content').addClass('m3u_item_error')
            }
        };

        document.addEventListener("DOMContentLoaded", yelp, false);

/*
{# this template moved to .twig. It is left to demonstrate the structure.

    <script type="text/template" id="channel-template" >
        <div class="box" style="display: none;">
            <div class="box-content">
                <form>
                    <div class="row">
                        <div class="col-xs-1">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Channel number'|trans }}</span>
                                </span>
                                <div class=" col-xs-12">
                                    <input type="text" name="number" class="form-control own_field" data-validation="required">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Channel name'|trans }}</span>
                                </span>
                                <input type="text" class="form-control own_field" name="name" data-validation="required">
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Streaming links'|trans }}</span>
                                </span>
                                <input type="text" class="form-control own_field" name="cmd" data-validation="required">
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Genre'|trans }}</span>
                                </span>
                                <select class="populate placeholder own_field" name="tv_genre_id" data-validation="required">
                                    {% if app['allGenres'] %}
                                        {% for s_item in app.allGenres %}
                                            <option value="{{ s_item.id }}">{{ s_item.title }}</option>
                                        {% endfor %}
                                    {% endif %}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Basic channel'|trans }}</span>
                                </span>
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" value="1" name="base_ch" class="own_field">
                                        <i class="fa fa-square-o small"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <span class="help-inline col-xs-12 col-sm-12">
                                    <span class="small txt-default">{{ 'Age restriction'|trans }}</span>
                                </span>
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" value="1" name="censored" class="own_field">
                                        <i class="fa fa-square-o small"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group pull-left">
                                <button class="btn btn-success" type="submit"><i class="fa fa-check"></i></button>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-danger " type="button" data-action="delete"><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </script>

#}*/
