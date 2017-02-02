/*
 this component has templates in .twig file
*/
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        function DemoSelect2() {
            $('select[id^="app_"]').select2(select2Opt);
        }

        function TestTable1() {

            $.ajax({
                url: "{{app.request_context.baseUrl}}/plugins/datatables/dataTables.sortingDateDE.js",
                dataType: "script",
                cache: true
            });
            $.ajax({
                url: "{{app.request_context.baseUrl}}/plugins/datatables/dataTables.sortingFormattedVersions.js",
                dataType: "script",
                cache: true
            });

            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                var status = json.info.status;
                if (typeof (json.data) == 'object') {
                    var id = json.info.id;
                    for (var i in json.data) {
                        var item = json.data[i];

                        var current = item.current;
                        if (item.installed) {
                            item.status = (current && status == '1' ? "{{ 'Active'|trans }}" : "{{ 'Installed'|trans }}");
                        } else {
                            item.status = "{{ 'Not installed'|trans }}";
                        }

                        date = json.data[i]['published'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['published'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        } else {
                            json.data[i]['published'] = '---';
                        }

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>";
                        if (item.current) {
                            json.data[i].operations += "\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-version-list-json' data-id='" + id + "' data-version='" + item.version + "'>\n\
                                                                    <span> {{ 'More details'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>";
                        }
                        if (!item.installed) {
                            json.data[i].operations +=      "\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-version-install' data-id='" + id + "' data-version='" + item.version + "'>\n\
                                                                    <span> " + "{{ 'Install'|trans }}" + " </span>\n\
                                                                </a>\n\
                                                            </li>";
                        } else {
                            json.data[i].operations +=      "\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-toggle-state' data-id='" + id + "' " + ( current ? " data-status='" + (status == '1' ? '0': '1') + "'" : " data-current_version='" + item.version + "' data-status='1'") + ">\n\
                                                                    <span> " + (status != '1' || !current ? "{{ 'Activate'|trans }}" : "{{ 'Deactivate'|trans }}") + " </span>\n\
                                                                </a>\n\
                                                            </li>";
                        }
                        json.data[i].operations +=          "\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' " + (!item.installed || current? 'disabled="disabled"' : '') + " href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-version-delete' data-id='" + id + "' data-version='" + item.version + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                    }
                }
                $('#datatable-1').closest('.form-group').find('.dataTables_processing').hide('');
            }).dataTable({
                "processing": true,
                "serverSide": false,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-version-list-json?id={% if attribute(app, 'app_info') is defined and app.app_info.info|length > 0 %}{{ app.app_info.info.id }}{% endif %}",
                    "data": function (d) {
                    }
                },
                "deferLoading": [{{ app.app_info.recordsFiltered }}, {{ app.app_info.recordsTotal }}],
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": false,
                "order": [[ 0, "desc" ]],
                "columnDefs": [
                    {className: "action-menu", "targets": [-1]},
                    {"searchable": false, "targets": [-1]},
                    {"sortable": false, "targets": [-1]},
                    { "type": 'formatted-version', targets: [0] },
                    { "type": 'de_date', targets: [1] }
                ]
            });
        }

        function yelp() {
            $(document).ready(function () {

                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = $(this);
                    JSshowModalBox();
                    ajaxPostSend(_this.attr('href'), _this.data(), false );

                    _this.closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', "#modalbox button[type='submit']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = new Object();
                    var form_fields = $("#modalbox").find('form').find(".own_fields:not(:disabled)");
                    form_fields.each(function () {
                        if ($(this).val()) {
                            if (this.type.toUpperCase() != 'CHECKBOX' || this.checked) {
                                sendData[this.name] = $(this).val();
                            }
                        }
                    });
                    var action = $("#modalbox").find('form').attr('action');
                    JSshowModalBox();
                    ajaxPostSend(action, sendData, false, false);
                    return false;
                });

                $(document).on('click', "#modalbox button[type='reset']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    JScloseModalBox();
                    return false;
                });

                $(document).on('click', '#app_status', function(){
                    if ($(this).prop('disabled') || $(this).prop('readonly')) {
                        JSErrorModalBox({msg: "{{ 'Perhaps the application is not installed. Before activate this application is necessary to install any version of the application.'|trans}}"});
                    }
                    {% if attribute(app, 'app_info') is defined and app.app_info.info|length > 0 %}
                    ajaxPostSend('{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-toggle-state', {status: $(this).is(':checked'), id: {{ app.app_info.info.id }} });
                    {% endif %}
                });

                $(document).on('click', '#app_autoupdate', function(){
                    {% if attribute(app, 'app_info') is defined and app.app_info.info|length > 0 %}
                    ajaxPostSend('{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/application-toggle-state', {autoupdate: $(this).is(':checked'), id: {{ app.app_info.info.id }} });
                    {% endif %}
                });

                $(document).on('click', "#modalbox, #modalbox a.close-link, #modalbox a.close-link *", function (e) {
                    if (e.currentTarget != e.target) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    if ($("#modalbox").data('complete') && $("#modalbox").data('complete') == 1) {
                        JScloseModalBox();
                    } else {
                        for (i = 0; i < 3; i++) {
                            $('#modalbox > div').fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                        }
                    }
                    return false;
                });

                LoadDataTablesScripts(TestTable1);
                LoadSelect2Script(DemoSelect2);
            });
        }

        var manageList = function (obj) {
            $('#datatable-1').DataTable().ajax.reload();
            JSSuccessModalBox(obj);
            if (typeof (obj.installed) != 'undefined' ) {
                if (obj.installed == '1') {
                    $("#app_status").removeAttr('disabled').removeAttr('readonly');
                    $("#app_autoupdate").removeAttr('app_autoupdate').removeAttr('app_autoupdate');
                }
            }
        };

        var manageListError = function (obj) {
            JSErrorModalBox(obj);
        };

        var createOptionForm = function(obj){
            $("#modalbox").hide();
            $("#modalbox").data('complete', 1);
            $('#modalbox').find('.modal-header-name span').text(obj.info.name);
            $('#modalbox').find('.devoops-modal-inner').html($("#modal_option_form_body").text());
            $('#modalbox').find('.devoops-modal-bottom').html($("#modal_form_buttons").text());
            if (obj.data.length == 1 && obj.data[0].options.length > 0) {
                fillModalForm(obj.data[0].options);
            } else {
                $('#modalbox .devoops-modal-bottom').find("button[type=submit]").hide();
                $('#modalbox .devoops-modal-bottom').find("button[type=reset]").removeClass('pull-left').addClass('pull-right').text("{{ 'Close'|trans }}");
            }
            $('#current_version').text(obj.data.length == 1 ? obj.data[0].version : '');
            $('#apps_id').val(obj.info.id);
            $('#description').text(obj.data.length == 1 ? obj.data[0].description : '');
            $('#modalbox').show();
        };

        var fillModalForm = function(option){
            if (!option) {
                return;
            }
            var container, field, type, tagName, currValue;
            var field_types = ["input", "select"];
            $.each(option, function(){
                type = field_types[this.valueList ? 1: 0];
                container = $($("#modal_form_"+type).text()).appendTo($('#modalbox form'));
                for(var fieldName in this){
                    field = container.find("[data-option-field='"+fieldName+"']");
                    tagName = field.get(0).tagName.toLowerCase();
                    currValue = this.value;
                    if (field_types.indexOf(tagName) == -1) {
                        field.text(this[fieldName]);
                    } else {
                        field.attr('name', "apps["+this.name+"]");
                        field.attr('id', "apps_"+this.name);
                        if (field_types.indexOf(tagName) == 0) {
                            field.val(currValue);
                        } else if (field_types.indexOf(tagName) == 1) {
                            $.each(this.valueList, function(){
                                field.append('<option value="'+this+'" '+(currValue == this?'selected="selected"':'')+' >'+this+'</option>');
                            });
                        }
                    }
                }
            });
            DemoSelect2();
        };

        var createOptionFormError = function(obj){
            JSErrorModalBox(obj);
        };

        var changeStatus = function(obj){
            if ( typeof(obj.field) != 'undefined' && obj.field == 'app_autoupdate') {
                JSSuccessModalBox(obj);
            } else {
                manageList(obj);
            }
            if ( typeof(obj.field) != 'undefined') {
                $('#' + obj.field).prop('checked', obj.installed ? true: false);
            }
        };

        var changeStatusError = function(obj){
            JSErrorModalBox(obj);
            if ( typeof(obj.field) != 'undefined') {
                $('#' + obj.field).prop('checked', obj.installed ? true: false);
            }
        };

        document.addEventListener("DOMContentLoaded", yelp, false);
