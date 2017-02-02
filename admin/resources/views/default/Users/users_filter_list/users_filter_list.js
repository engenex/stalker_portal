
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var favorites =json.data[i].favorites;
                        var login =json.data[i].login;

                        if ($("#s2_filter").length != 0 ) {
                            if ($("#s2_filter option[value='" + id + "']").length == 0) {
                                $("#s2_filter").append('<option value="' + id + '" data-filter-descriprion="' + json.data[i].filter_set + '">' + json.data[i].title + '</option>');
                            }
                        }

                        json.data[i].login = '<a href="#" class="no_context_menu">' + json.data[i].login + '</a>';
                        json.data[i].title = '<a href="{{ app.request_context.baseUrl }}/users/users-list?filter_set='+ id +'">' + json.data[i].title + '</a>';
                        json.data[i].for_all = (json.data[i].for_all ? "{{ 'For all'|trans }}": "{{ 'Only for'|trans }} " + login);
                        json.data[i].favorites = (favorites ? '<span class="txt txt-danger"><i class="fa fa-star"></i></span>': '');

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='add_events no_context_menu' href='#' data-filter_set='"+ id +"'>\n\
                                                                    <span>{{ 'Add event'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/users/users-list?filter_set="+ id +"'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-filter-favorite' data-id='"+ id +"' data-favorite='" + favorites + "'>\n\
                                                                    <span>" + (favorites? '{{ "Remove from favorites"|trans }}': '{{ 'Add to favorites'|trans }}') + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-filter' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/users-filter-list-json"
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
                    {"searchable": false, "targets": [-1, -2, -3, -4]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                $(document).on('click', "a.main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = $(this).data();
                    ajaxPostSend($(this).attr('href'), sendData, false, false, true);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', "#modalbox_ad button[type='submit']", function (e) {
                    $("#s2_filter").prop("disabled", false).removeAttr("disabled");
                });

                eventsMenuHandlers();

                $(document).on('click', '.add_events', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox_ad").show().find('input, select, textarea').removeAttr('disabled');
                    $("#s2_user_list_type option[value='by_filter']").attr('selected', 'selected');
                    $("#s2_user_list_type").closest(".form-group").hide();
                    $("#s2_filter option[value='"+$(this).data('filter_set')+"']").prop('selected', 'selected');
                    $("#s2_filter").change();
                    $("#s2_filter").select2({minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'});
                    checkFields('#s2_user_list_type', e);
                    checkFields('#s2_event', e);
                    $('#s2_event').change();
                    $("#s2_filter").prop("disabled", "disabled");
                    return false;
                });

                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
