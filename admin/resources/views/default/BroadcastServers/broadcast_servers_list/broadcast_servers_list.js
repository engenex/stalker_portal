
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        var conf = {
            form: '#karaoke_form',
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            ignore: ['.ignore'],
            modules: 'jsconf',
            onSuccess: function () {
                var sendData = new Object();
                $("#modalbox_ad input.own_fields:not(:disabled), #modalbox_ad select.own_fields:not(:disabled)").each(function () {
                    sendData[this.name] = $(this).val();
                });

                ajaxPostSend($("#modalbox_ad form").attr('action'), sendData, false, false);
                return false;
            },
            onError: function () {
                return false;
            }
        };

        function DemoSelect2() {
            $('#s2_zone').select2(select2Opt);
        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var status = json.data[i].status;

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-server-status' data-id='" + id + "' data-status='" + status + "'>\n\
                                                                    <span>" + (status == 1 ? "{{ 'Switch off'|trans }}" : "{{ 'Switch on'|trans }}") +"</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/broadcast-servers-list-json' data-id='" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-server' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        json.data[i].status = '<span ' + ( status == 1 ? 'class="">{{ 'On'|trans }}': '>{{ 'Off'|trans }}') +'</span>';
                        json.data[i].stream_zone_name = json.data[i].stream_zone_name && json.data[i].stream_zone_name.length ? json.data[i].stream_zone_name : '{% if app['default_zone'] %}{{ 'Using default zone'|trans }} "{{ app['default_zone']['name'] }}"{% endif %}';
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/broadcast-servers-list-json"
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": true,
                "columnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -2]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                $.validate(conf);
                $(document).on('click', "a.main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = $(this).data();
                    ajaxPostSend($(this).attr('href'), sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });
                
                $("#form_reset").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).closest('form').get(0).reset();
                    $('#s2_zone option').removeAttr('selected');
                    $('#s2_zone option:first').prop('selected', 'selected');
                    /*$("#cmd_data").find("tr:visible").remove();*/
                    return false;
                });
                
                $("#modalbox_ad button[type='submit']").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if ($("#karaoke_form").isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });
                
                $(document).on('click', "#modalbox, #modalbox a.close-link, #modalbox a.close-link *", function(e){
                    if (e.currentTarget != e.target) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    JScloseModalBox();
                    $("#form_reset").trigger('click');
                    return false;
                });
                
                $("#add_server").on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $.validate();
                    $('#karaoke_form').get(0).reset();
                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Add server'|trans }}');
                    $("#modalbox_ad input").prop("disabled", false).removeAttr('disabled').val('');
                    $("#modalbox_ad input[type='hidden']").attr('disabled', 'disabled').val('');
                    $("#modalbox_ad select").prop("disabled", false).removeAttr('disabled').find('option').removeAttr('selected');
                    $('#s2_zone option:first').prop('selected', 'selected');
                    $("#modalbox_ad").show();

                    return false;
                });
                                
                LoadSelect2Script(DemoSelect2);
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        var setServerModal = function (data) {
            $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Edit'|trans }}');
            if (data.data.length == 1) {
                var row = data.data[0];
                for (var field_name in row) {
                    $("#modalbox_ad input[name='" + field_name + "']").val(row[field_name]);
                }
                $("#modalbox_ad select option").removeAttr('selected');
                $("#modalbox_ad select option").each(function () {
                    if ($(this).val().toString() == data.data[0]['stream_zone'].toString()) {
                        $(this).prop('selected', 'selected');
                    }
                });
            }
            DemoSelect2();
            $("#modalbox_ad input").removeAttr('disabled');
            $("#karaoke_form").isValid({}, conf, true);
            $("#modalbox_ad").show();
        };

        var setServerModalError = function(data){
            JSErrorModalBox(data);
        };
