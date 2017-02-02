/*
 this component has templates in .twig file. And twig condition code.
*/
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        function DemoSelect2() {
            $.fn.select2.defaults.set('dropdownAutoWidth', 'false');
            $.fn.select2.defaults.set('width', '100%');
            $('#target_reseller').select2(select2Opt);
            $('#target_group').select2(select2Opt);
        }

        function closeModalBox(){
            $("#modalbox").hide();
            $('#modalbox').find('.modal-header-name span').empty();
            $('#modalbox').find('.devoops-modal-inner').empty();
            $('#modalbox').find('.devoops-modal-bottom').empty();
        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var name = json.data[i].name;
                        {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                        var reseller_name = json.data[i].reseller_name ? json.data[i].reseller_name : '{{ 'Empty'|trans }}';
                        var reseller_id = json.data[i].reseller_id ? json.data[i].reseller_id : '-';
                        {% endif %}

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>";
                        {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                        json.data[i].operations         += "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-admin-group-to-reseller' data-id='"+id+"' data-reseller_id='"+reseller_id+"'>\n\
                                                                    <span>{{ 'Change reseller for current group of admin'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>";
                        json.data[i].reseller_name = '<a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-admin-group-to-reseller" data-id="'+id+'" data-reseller_id="'+reseller_id+'">'+reseller_name+'</a>';
                        {% endif %}
                        {% if attribute(app,'userlogin') is defined and app.userlogin == 'admin' %}
                        json.data[i].operations         += "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-all-admin-to-group' data-group_id='" + id + "'>\n\
                                                                    <span>{{ 'Move all admins to another group'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>";
                        {% endif %}
                        json.data[i].operations         += "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/admins-groups-list-json' data-id='" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/admins-groups-permissions?id=" + id + "'>\n\
                                                                    <span>{{ 'Permissions'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-admins-group' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        json.data[i].name = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/admins-groups-permissions?id=' + id + '">' + name + '</a>';
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/admins-groups-list-json"
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
                    {"searchable": false, "targets": [-1, 2]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () { 
                $(document).on('click', "a.main_ajax:not([href*='move-admin-group-to-reseller']):not([href*='move-all-admin-to-group'])", function (e) {
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
                    return false;
                });

                var conf = {
                    form: '#karaoke_form',
                    lang : '{{ app.js_validator_language }}',
                    showHelpOnFocus : true,
                    validateHiddenInputs: true,
                    ignore: ['.ignore'],
                    modules: 'jsconf',
                    onSuccess: function () {
                        var sendData = new Object();
                        var lengthObj = 0;
                        var form_fields = $("#modalbox_ad input.own_fields:not(:disabled)");
                        form_fields.each(function () {
                            if ($(this).val()) {
                                sendData[this.name] = $(this).val();
                            }
                        });

                        ajaxPostSend($("#modalbox_ad form").attr('action'), sendData, false, false);
                        return false;

                    },
                    onError: function () {
                        return false;
                    }
                };
                $.validate(conf);

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

                $("#add_group").on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Add group'|trans }}');
                    $("#adm_name").next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    $("#modalbox_ad input").prop("disabled", false).removeAttr('disabled').val('');
                    $("#modalbox_ad input[type='hidden']").attr('disabled', 'disabled').val('');
                    $('#modalbox_ad button[type="submit"]').removeAttr("disabled");
                    $("#modalbox_ad").show();
                    return false;
                });
                
                $(document).on('change keyup', '#adm_name', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = $(this);
                    _this.next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    $('#modalbox_ad button[type="submit"]').removeAttr("disabled");
                    if (_this.val()) {
                        ajaxPostSend('{{app.request_context.baseUrl}}/{{app.controller_alias}}/check-admins-group-name', {name: _this.val()}, false, false);
                    }
                    return false;
                });

                {% if attribute(app, 'reseller') is defined and not app['reseller'] %}

                $(document).on('click', "#modalbox, #modalbox a.close-link, #modalbox a.close-link *", function(e){
                    if (e.currentTarget != e.target) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    closeModalBox();
                    return false;
                });

                $(document).on('click', "a[href*='move-admin-group-to-reseller']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 1);
                    $('#modalbox').find('.modal-header-name span').text("{{ 'Resellers'|trans }}");
                    var reseller_id = $(this).data('reseller_id');
                    $('#modalbox').find('.devoops-modal-inner').html($("#modal_move_reseller_form_body").html());
                    $('#modalbox').find('.devoops-modal-inner').find("input[name='id']").val($(this).data('id'));
                    $('#modalbox').find('.devoops-modal-inner').find("input[name='source_id']").val(reseller_id);
                    $('#target_reseller option').removeAttr('selected');
                    $('#target_reseller option[value="'+ reseller_id +'"]').attr('selected', 'selected');
                    $('#modalbox').find('.devoops-modal-bottom').html($("#modal_move_form_buttons").html());

                    $("#target_reseller").select2(select2Opt);

                    $("#modalbox").show();
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', "#modalbox button[type='submit']", function (e) {
                    var _this = $(this);

                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = new Object();
                    var form_fields = _this.closest("#modalbox").find('form').find(".own_fields:not(:disabled)");
                    form_fields.each(function () {
                        if ($(this).val()) {
                            sendData[this.name] = $(this).val();
                        }
                    });
                    var action = _this.closest("#modalbox").find('form').attr('action');
                    ajaxPostSend(action, sendData, false, false);
                    return false;

                });

                {% endif %}

                {% if attribute(app,'userlogin') is defined and app.userlogin == 'admin' %}
                $(document).on('click', "a[href*='move-all-admin-to-group']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 1);
                    $('#modalbox').find('.modal-header-name span').text("{{ 'Groups'|trans }}");
                    var group_id = $(this).data('group_id');
                    $('#modalbox').find('.devoops-modal-inner').html($("#modal_move_group_form_body").html());
                    $('#modalbox').find('.devoops-modal-inner').find("input[name='source_id']").val(group_id);
                    $('#target_group option').removeAttr('selected');
                    $('#target_group option[value="'+ group_id +'"]').attr('selected', 'selected');
                    $('#modalbox').find('.devoops-modal-bottom').html($("#modal_move_form_buttons").html());

                    $("#target_group").select2(select2Opt);

                    $("#modalbox").show();
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                {% endif %}

                LoadSelect2Script(DemoSelect2);
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
        
        var setAdminsGroupsModal = function (data) { 
            $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Edit group'|trans }}');
            if (data.data.length == 1) {
                var row = data.data[0];
                for (var field_name in row) {
                    $("#modalbox_ad input[name='" + field_name + "']").val(row[field_name]);
                }
            }
            $("#modalbox_ad input").removeAttr('disabled');
            $("#adm_name").next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
            $('#modalbox_ad button[type="submit"]').removeAttr("disabled");
            $("#modalbox_ad").show();
        };

        var manageAdminGroupsList = function (obj) {
            JSSuccessModalBox(obj);
            $("#modalbox_ad").click();
            $('#datatable-1').DataTable().ajax.reload();
        };

        var manageAdminGroupsListError = function (obj) {
            JSErrorModalBox(obj);
            $("#modalbox_ad").click();
        };
        
        
        {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
        
        var manageGroupsResellerList = function (obj) {
            JSSuccessModalBox(obj);
            $('#datatable-1').DataTable().ajax.reload();
        };

        var manageGroupsResellerListError = function (obj) {
            JSErrorModalBox(obj);
        };

        {% endif %}
